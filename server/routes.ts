import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExamSessionSchema, answerSubmissionSchema, continueExamSchema, insertQuestionSchema, updateQuestionSchema, adminLoginSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create new exam session
  app.post("/api/exam/create", async (req, res) => {
    try {
      const sessionData = insertExamSessionSchema.parse(req.body);
      const { session, sessionKey } = await storage.createExamSession(sessionData);
      res.json({ session, sessionKey });
    } catch (error) {
      console.error("Error creating exam session:", error);
      
      // Handle Zod validation errors specifically
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        const firstIssue = zodError.issues?.[0];
        if (firstIssue) {
          const message = `${firstIssue.path.join('.')}: ${firstIssue.message}`;
          return res.status(400).json({ error: message });
        }
      }
      
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid session data" });
      }
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
      console.error("Error continuing exam:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
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

    // Get questions using the questionIds stored in the session
    const questionIds = Array.isArray(session.questionIds) ? session.questionIds : [];
    const examQuestions = await storage.getQuestionsByIds(questionIds as string[]);

    // If exam already started, return the existing session data
    if (session.startTime) {
      return res.json({
        session,
        questions: examQuestions,
        totalQuestions: examQuestions.length
      });
    }

    // Update session with start time
    const updatedSession = await storage.updateExamSession(sessionKey, {
      startTime: new Date()
    });

    res.json({ 
      session: updatedSession, 
      questions: examQuestions,
      totalQuestions: examQuestions.length
    });
  });

  // Submit answer
  app.post("/api/exam/:sessionKey/answer", async (req, res) => {
    try {
      const { sessionKey } = req.params;
      const { questionId, answer } = answerSubmissionSchema.parse({
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
      const answers = { ...session.answers as Record<string, number>, [questionId]: answer };
      const updatedSession = await storage.updateExamSession(sessionKey, {
        answers
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
    try {
      const { sessionKey } = req.params;
      const session = await storage.getExamSessionByKey(sessionKey);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (session.completed) {
        return res.status(400).json({ error: "Exam already completed" });
      }

    // Get questions using the questionIds stored in the session
    const questionIds = Array.isArray(session.questionIds) ? session.questionIds : [];
    const examQuestions = await storage.getQuestionsByIds(questionIds as string[]);
    
    // Create a map of question ID to question for easy lookup
    const questionMap = new Map(examQuestions.map(q => [q.id, q]));
    
    // Calculate score
    const answers = session.answers as Record<string, number>;
    let correctCount = 0;
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questionMap.get(questionId);
      if (question && question.correctAnswer === answer) {
        correctCount++;
      }
    });

    const totalQuestions = 50;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Determine passing threshold (90% for all exams per updated requirements)
    const passingThreshold = 90;
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
    } catch (error) {
      console.error("Error submitting exam:", error);
      res.status(500).json({ error: "Internal server error during exam submission" });
    }
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

    // Get the questions used in this exam using the stored questionIds
    const questionIds = Array.isArray(session.questionIds) ? session.questionIds : [];
    const allQuestions = await storage.getQuestionsByIds(questionIds as string[]);
    const examQuestions = allQuestions.slice(0, 50);

    // Calculate detailed results for each question
    const answers = session.answers as Record<string, number> || {};
    const questionResults = examQuestions.map((question, index) => {
      const questionNumber = index + 1;
      const userAnswer = answers[questionNumber.toString()];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        questionNumber,
        question: {
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer
        },
        userAnswer,
        isCorrect
      };
    });

    res.json({ 
      session,
      questionResults,
      totalQuestions: 50
    });
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      // In development mode, always use demo credentials for easy testing
      const isDevelopment = process.env.NODE_ENV === "development";
      const adminUsername = isDevelopment ? "admin" : (process.env.ADMIN_USERNAME || "admin");
      const adminPassword = isDevelopment ? "admin123" : (process.env.ADMIN_PASSWORD || "admin123");
      
      console.log("Admin login attempt:", { 
        username, 
        password: password.length + " characters",
        expectedUsername: adminUsername,
        expectedPassword: adminPassword.length + " characters",
        isDevelopment,
        nodeEnv: process.env.NODE_ENV
      });
      
      if (username === adminUsername && password === adminPassword) {
        console.log("Admin login successful");
        res.json({ success: true, token: "admin-token" });
      } else {
        console.log("Admin login failed - credential mismatch");
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Get all questions (admin only)
  app.get("/api/admin/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Get question by ID (admin only)
  app.get("/api/admin/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  // Create new question (admin only)
  app.post("/api/admin/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      
      // Handle Zod validation errors specifically
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        const firstIssue = zodError.issues?.[0];
        if (firstIssue) {
          const message = `${firstIssue.path.join('.')}: ${firstIssue.message}`;
          return res.status(400).json({ error: message });
        }
      }
      
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid question data" });
      }
    }
  });

  // Update question (admin only)
  app.put("/api/admin/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateQuestionSchema.parse(req.body);
      const question = await storage.updateQuestion(id, updates);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      
      // Handle Zod validation errors specifically
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        const firstIssue = zodError.issues?.[0];
        if (firstIssue) {
          const message = `${firstIssue.path.join('.')}: ${firstIssue.message}`;
          return res.status(400).json({ error: message });
        }
      }
      
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid update data" });
      }
    }
  });

  // Delete question (admin only)
  app.delete("/api/admin/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuestion(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete question" });
    }
  });

  // Manual cleanup endpoint (admin only)
  app.post("/api/admin/cleanup", async (req, res) => {
    try {
      const deletedCount = await storage.cleanupOldExamSessions();
      res.json({ 
        success: true, 
        deletedCount,
        message: `Removed ${deletedCount} uncompleted exam sessions older than 7 days`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to perform cleanup" });
    }
  });

  // Get all completed exam sessions for admin review
  app.get("/api/admin/completed-exams", async (req, res) => {
    try {
      const completedExams = await storage.getAllCompletedExamSessions();
      res.json(completedExams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch completed exams" });
    }
  });

  // Get detailed exam session for admin review
  app.get("/api/admin/exam-review/:sessionKey", async (req, res) => {
    try {
      const { sessionKey } = req.params;
      const examSession = await storage.getExamSessionForReview(sessionKey);
      
      if (!examSession) {
        return res.status(404).json({ error: "Completed exam session not found" });
      }

      // Get questions using the questionIds stored in the session
      const questionIds = Array.isArray(examSession.questionIds) ? examSession.questionIds : [];
      const questions = await storage.getQuestionsByIds(questionIds as string[]);
      
      res.json({
        examSession,
        questions,
        userAnswers: examSession.answers,
        flaggedQuestions: examSession.flaggedQuestions
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exam review data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
