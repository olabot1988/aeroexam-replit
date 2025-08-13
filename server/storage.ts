import { type User, type InsertUser, type ExamSession, type InsertExamSession, type Question, type InsertQuestion, type ExamResult, type ContinueExam } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createExamSession(session: InsertExamSession): Promise<{ session: ExamSession; sessionKey: string }>;
  getExamSessionByKey(sessionKey: string): Promise<ExamSession | undefined>;
  updateExamSession(sessionKey: string, updates: Partial<ExamSession>): Promise<ExamSession | undefined>;
  findExamSessionByCredentials(lastName: string, password: string): Promise<ExamSession | undefined>;
  
  getQuestionsByDifficulty(difficulty: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  createExamResult(result: Omit<ExamResult, 'id'>): Promise<ExamResult>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private examSessions: Map<string, ExamSession>;
  private questions: Map<string, Question>;
  private examResults: Map<string, ExamResult>;

  constructor() {
    this.users = new Map();
    this.examSessions = new Map();
    this.questions = new Map();
    this.examResults = new Map();
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const sampleQuestions: InsertQuestion[] = [
      // ML0 Questions
      {
        text: "What is the primary purpose of aircraft maintenance?",
        options: ["To ensure flight safety", "To reduce operating costs", "To improve fuel efficiency", "To enhance passenger comfort"],
        correctAnswer: 0,
        difficulty: "ML0",
        category: "General Maintenance"
      },
      {
        text: "Which tool is essential for measuring precise torque values?",
        options: ["Wrench", "Torque wrench", "Pliers", "Screwdriver"],
        correctAnswer: 1,
        difficulty: "ML0",
        category: "Tools and Equipment"
      },
      {
        text: "Is it safe to work on aircraft electrical systems without proper grounding?",
        options: ["True", "False"],
        correctAnswer: 1,
        difficulty: "ML0",
        category: "Safety"
      },
      
      // ML1 Questions
      {
        text: "What is the maximum allowable tolerance for bolt torque in critical applications?",
        options: ["±5%", "±10%", "±15%", "±20%"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Mechanical Systems"
      },
      {
        text: "Which component converts AC power to DC power in aircraft electrical systems?",
        options: ["Inverter", "Rectifier", "Transformer", "Generator"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "Engine oil temperature exceeding normal limits indicates potential system failure.",
        options: ["True", "False"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Engine Systems"
      },

      // ML2 Questions  
      {
        text: "What is the purpose of a hydraulic accumulator in aircraft systems?",
        options: ["Store hydraulic fluid under pressure", "Filter hydraulic fluid", "Cool hydraulic fluid", "Pump hydraulic fluid"],
        correctAnswer: 0,
        difficulty: "ML2",
        category: "Hydraulic Systems"
      },
      {
        text: "Which inspection method is most effective for detecting internal cracks in metal components?",
        options: ["Visual inspection", "Magnetic particle inspection", "Ultrasonic testing", "Dye penetrant testing"],
        correctAnswer: 2,
        difficulty: "ML2",
        category: "Non-Destructive Testing"
      },
      {
        text: "Composite materials require different repair techniques than traditional aluminum structures.",
        options: ["True", "False"],
        correctAnswer: 0,
        difficulty: "ML2",
        category: "Structural Repair"
      },

      // ML3 Questions
      {
        text: "In fly-by-wire systems, what provides flight envelope protection?",
        options: ["Pilot input limiters", "Flight control computers", "Mechanical backup systems", "Hydraulic actuators"],
        correctAnswer: 1,
        difficulty: "ML3",
        category: "Avionics Systems"
      },
      {
        text: "What is the primary advantage of FADEC systems in turbine engines?",
        options: ["Reduced weight", "Improved fuel efficiency and engine protection", "Lower maintenance costs", "Simplified pilot procedures"],
        correctAnswer: 1,
        difficulty: "ML3",
        category: "Engine Control Systems"
      },
      {
        text: "Glass cockpit displays can completely replace all traditional analog instruments.",
        options: ["True", "False"],
        correctAnswer: 1,
        difficulty: "ML3",
        category: "Cockpit Systems"
      },

      // ML4 Questions
      {
        text: "Which protocol is commonly used for high-speed data communication in modern avionics?",
        options: ["ARINC 429", "MIL-STD-1553", "Ethernet", "CAN Bus"],
        correctAnswer: 2,
        difficulty: "ML4",
        category: "Advanced Avionics"
      },
      {
        text: "What is the primary benefit of synthetic vision systems in advanced cockpits?",
        options: ["Reduced pilot workload", "Enhanced situational awareness in low visibility", "Improved fuel efficiency", "Simplified navigation procedures"],
        correctAnswer: 1,
        difficulty: "ML4",
        category: "Advanced Display Systems"
      },
      {
        text: "Predictive maintenance systems using AI can eliminate the need for scheduled inspections.",
        options: ["True", "False"],
        correctAnswer: 1,
        difficulty: "ML4",
        category: "Advanced Maintenance Technologies"
      }
    ];

    sampleQuestions.forEach(q => {
      this.createQuestion(q);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createExamSession(session: InsertExamSession): Promise<{ session: ExamSession; sessionKey: string }> {
    const id = randomUUID();
    const sessionKey = randomUUID();
    const examSession: ExamSession = {
      ...session,
      id,
      sessionKey,
      currentQuestion: 1,
      answers: {},
      flaggedQuestions: [],
      startTime: null,
      endTime: null,
      completed: false,
      score: null,
      createdAt: new Date(),
    };
    this.examSessions.set(sessionKey, examSession);
    return { session: examSession, sessionKey };
  }

  async getExamSessionByKey(sessionKey: string): Promise<ExamSession | undefined> {
    return this.examSessions.get(sessionKey);
  }

  async updateExamSession(sessionKey: string, updates: Partial<ExamSession>): Promise<ExamSession | undefined> {
    const session = this.examSessions.get(sessionKey);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.examSessions.set(sessionKey, updatedSession);
    return updatedSession;
  }

  async findExamSessionByCredentials(lastName: string, password: string): Promise<ExamSession | undefined> {
    return Array.from(this.examSessions.values()).find(
      session => session.lastName.toLowerCase() === lastName.toLowerCase() && 
                 session.password === password && 
                 !session.completed
    );
  }

  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.difficulty === difficulty);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const q: Question = { ...question, id };
    this.questions.set(id, q);
    return q;
  }

  async createExamResult(result: Omit<ExamResult, 'id'>): Promise<ExamResult> {
    const id = randomUUID();
    const examResult: ExamResult = { ...result, id };
    this.examResults.set(id, examResult);
    return examResult;
  }
}

export const storage = new MemStorage();
