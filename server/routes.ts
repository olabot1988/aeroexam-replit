import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExamSessionSchema, answerSubmissionSchema, continueExamSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create new exam session
  app.post("/api/exam/create", async (req, res) => {
    try {
      const sessionData = insertExamSessionSchema.parse(req.body);
      const { session, sessionKey } = await storage.createExamSession(sessionData);
      res.json({ session, sessionKey });
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Continue existing exam
  app.post("/api/exam/continue", async (req, res) => {
    try {
      const { lastName, password } = continueExamSchema.parse(req.body);
      const session = await storage.findExamSessionByCredentials(lastName, password);
      
      if (!session) {
        return res.status(404).json({ error: "No active exam found with those credentials" });
      }
      
      res.json({ session, sessionKey: session.sessionKey });
    } catch (error) {
      res.status(400).json({ error: "Invalid credentials" });
    }
  });

  // Get exam session
  app.get("/api/exam/:sessionKey", async (req, res) => {
    const { sessionKey } = req.params;
    const session = await storage.getExamSessionByKey(sessionKey);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json(session);
  });

  // Start exam (set start time and get questions)
  app.post("/api/exam/:sessionKey/start", async (req, res) => {
    const { sessionKey } = req.params;
    const session = await storage.getExamSessionByKey(sessionKey);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.startTime) {
      return res.status(400).json({ error: "Exam already started" });
    }

    // Determine difficulty level based on exam type and maintenance level
    let difficulty = session.maintenanceLevel;
    if (session.examType === "CDR Progression Written Exam") {
      // CDR exams test for next higher level
      const levels = ["ML0", "ML1", "ML2", "ML3", "ML4"];
      const currentIndex = levels.indexOf(session.maintenanceLevel);
      if (currentIndex < levels.length - 1) {
        difficulty = levels[currentIndex + 1];
      }
    } else if (session.examType === "Technical Inspector Exam") {
      difficulty = "ML3";
    }

    // Get questions for the appropriate difficulty
    const allQuestions = await storage.getQuestionsByDifficulty(difficulty);
    
    // Shuffle and select 50 questions
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    const examQuestions = shuffledQuestions.slice(0, 50);

    // Update session with start time
    const updatedSession = await storage.updateExamSession(sessionKey, {
      startTime: new Date()
    });

    res.json({ 
      session: updatedSession, 
      questions: examQuestions,
      totalQuestions: 50
    });
  });

  // Submit answer
  app.post("/api/exam/:sessionKey/answer", async (req, res) => {
    try {
      const { sessionKey } = req.params;
      const { questionNumber, answer } = answerSubmissionSchema.parse({
        sessionKey,
        ...req.body
      });

      const session = await storage.getExamSessionByKey(sessionKey);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.completed) {
        return res.status(400).json({ error: "Exam already completed" });
      }

      // Update answers
      const answers = { ...session.answers as Record<string, number>, [questionNumber]: answer };
      const updatedSession = await storage.updateExamSession(sessionKey, {
        answers,
        currentQuestion: Math.max(session.currentQuestion || 1, questionNumber)
      });

      res.json(updatedSession);
    } catch (error) {
      res.status(400).json({ error: "Invalid answer submission" });
    }
  });

  // Flag question for review
  app.post("/api/exam/:sessionKey/flag/:questionNumber", async (req, res) => {
    const { sessionKey, questionNumber } = req.params;
    const session = await storage.getExamSessionByKey(sessionKey);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const flaggedQuestions = [...(session.flaggedQuestions as number[] || [])];
    const qNum = parseInt(questionNumber);
    
    if (!flaggedQuestions.includes(qNum)) {
      flaggedQuestions.push(qNum);
    }

    const updatedSession = await storage.updateExamSession(sessionKey, {
      flaggedQuestions
    });

    res.json(updatedSession);
  });

  // Submit complete exam
  app.post("/api/exam/:sessionKey/submit", async (req, res) => {
    const { sessionKey } = req.params;
    const session = await storage.getExamSessionByKey(sessionKey);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.completed) {
      return res.status(400).json({ error: "Exam already completed" });
    }

    // Get questions to calculate score
    let difficulty = session.maintenanceLevel;
    if (session.examType === "CDR Progression Written Exam") {
      const levels = ["ML0", "ML1", "ML2", "ML3", "ML4"];
      const currentIndex = levels.indexOf(session.maintenanceLevel);
      if (currentIndex < levels.length - 1) {
        difficulty = levels[currentIndex + 1];
      }
    } else if (session.examType === "Technical Inspector Exam") {
      difficulty = "ML3";
    }

    const questions = await storage.getQuestionsByDifficulty(difficulty);
    const examQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 50);
    
    // Calculate score
    const answers = session.answers as Record<string, number>;
    let correctCount = 0;
    
    Object.entries(answers).forEach(([questionNum, answer]) => {
      const questionIndex = parseInt(questionNum) - 1;
      if (questionIndex < examQuestions.length) {
        const question = examQuestions[questionIndex];
        if (question.correctAnswer === answer) {
          correctCount++;
        }
      }
    });

    const totalQuestions = 50;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Determine passing threshold (90% for most exams, 70% for some based on requirements)
    const passingThreshold = session.examType === "Annual Exam" ? 90 : 70;
    const passed = score >= passingThreshold;

    // Calculate time taken
    const startTime = new Date(session.startTime!);
    const endTime = new Date();
    const timeTakenMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(timeTakenMs / 60000);
    const seconds = Math.floor((timeTakenMs % 60000) / 1000);
    const timeTaken = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Update session
    const updatedSession = await storage.updateExamSession(sessionKey, {
      completed: true,
      endTime,
      score
    });

    // Create exam result
    const result = await storage.createExamResult({
      sessionId: session.id,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      passed,
      timeTaken,
      completedAt: endTime
    });

    res.json({
      session: updatedSession,
      result,
      questions: examQuestions,
      answers
    });
  });

  // Get exam results
  app.get("/api/exam/:sessionKey/results", async (req, res) => {
    const { sessionKey } = req.params;
    const session = await storage.getExamSessionByKey(sessionKey);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (!session.completed) {
      return res.status(400).json({ error: "Exam not completed" });
    }

    res.json({ session });
  });

  const httpServer = createServer(app);
  return httpServer;
}
