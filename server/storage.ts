import { type User, type InsertUser, type ExamSession, type InsertExamSession, type Question, type InsertQuestion, type UpdateQuestion, type ExamResult, type ContinueExam } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, examSessions, questions, examResults } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createExamSession(session: InsertExamSession): Promise<{ session: ExamSession; sessionKey: string }>;
  getExamSessionByKey(sessionKey: string): Promise<ExamSession | undefined>;
  updateExamSession(sessionKey: string, updates: Partial<ExamSession>): Promise<ExamSession | undefined>;
  findExamSessionByCredentials(lastName: string, password: string): Promise<ExamSession | undefined>;
  cleanupOldExamSessions(): Promise<number>;
  
  getQuestionsByDifficulty(difficulty: string): Promise<Question[]>;
  getAllQuestions(): Promise<Question[]>;
  getQuestionById(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, updates: UpdateQuestion): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
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
    this.initializeML1Questions();
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

  async cleanupOldExamSessions(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let deletedCount = 0;
    const sessionsToDelete: string[] = [];
    
    for (const [key, session] of this.examSessions.entries()) {
      // Only delete uncompleted sessions older than 7 days
      if (!session.completed && session.createdAt && new Date(session.createdAt) < sevenDaysAgo) {
        sessionsToDelete.push(key);
      }
    }
    
    sessionsToDelete.forEach(key => {
      this.examSessions.delete(key);
      deletedCount++;
    });
    
    return deletedCount;
  }

  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => {
      // Support both old single difficulty and new difficulties array
      if (q.difficulties && Array.isArray(q.difficulties)) {
        return q.difficulties.includes(difficulty);
      }
      // Fallback to old difficulty field for backward compatibility
      return q.difficulty === difficulty;
    }).sort((a, b) => {
      // Sort by category first, then by question text for consistent ordering
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.text.localeCompare(b.text);
    });
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => {
      // Sort by difficulty first, then by category
      if (a.difficulty !== b.difficulty) {
        const difficulties = ["ML0", "ML1", "ML2", "ML3", "ML4"];
        return difficulties.indexOf(a.difficulty) - difficulties.indexOf(b.difficulty);
      }
      return a.category.localeCompare(b.category);
    });
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const q: Question = { ...question, id };
    this.questions.set(id, q);
    return q;
  }

  async updateQuestion(id: string, updates: UpdateQuestion): Promise<Question | undefined> {
    const existing = this.questions.get(id);
    if (!existing) return undefined;
    
    const updated: Question = { ...existing, ...updates };
    this.questions.set(id, updated);
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    return this.questions.delete(id);
  }

  async createExamResult(result: Omit<ExamResult, 'id'>): Promise<ExamResult> {
    const id = randomUUID();
    const examResult: ExamResult = { ...result, id };
    this.examResults.set(id, examResult);
    return examResult;
  }
  private initializeML1Questions() {
    const ml1Questions: InsertQuestion[] = [
      {
        text: "What is the standard operating pressure for most aircraft hydraulic systems?",
        options: ["1000 PSI", "2000 PSI", "3000 PSI", "4000 PSI"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Hydraulic Systems"
      },
      {
        text: "Which component is responsible for converting mechanical energy to electrical energy in aircraft?",
        options: ["Starter", "Generator", "Battery", "Inverter"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "What is the primary function of aircraft fuel pumps?",
        options: ["Filter fuel", "Heat fuel", "Pressurize fuel", "Cool fuel"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Fuel Systems"
      },
      {
        text: "In aircraft engines, what does the term 'TBO' stand for?",
        options: ["Time Between Overhauls", "Total Brake Operation", "Turbine Blade Operation", "Throttle Body Opening"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "Which type of brake system is most commonly used on modern commercial aircraft?",
        options: ["Drum brakes", "Disc brakes", "Band brakes", "Magnetic brakes"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Landing Gear"
      },
      {
        text: "What is the purpose of engine oil in aircraft systems?",
        options: ["Fuel mixing only", "Lubrication and cooling", "Electrical conduction", "Pressure regulation"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "Which material is commonly used for aircraft control cables?",
        options: ["Aluminum", "Steel", "Titanium", "Carbon fiber"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "What is the standard voltage for most aircraft electrical systems?",
        options: ["12V DC", "24V DC", "28V DC", "115V AC"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "In pneumatic systems, what provides pressurized air?",
        options: ["Engine bleed air", "External compressor only", "Manual pump", "Hydraulic pump"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Pneumatic Systems"
      },
      {
        text: "What is the primary purpose of aircraft wing flaps?",
        options: ["Increase speed", "Reduce drag", "Increase lift at low speeds", "Improve fuel efficiency"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "Which instrument indicates engine RPM?",
        options: ["Altimeter", "Tachometer", "Airspeed indicator", "Attitude indicator"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Engine Instruments"
      },
      {
        text: "What type of fire extinguishing agent is commonly used in aircraft engine compartments?",
        options: ["Water", "Foam", "Halon", "CO2"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Fire Protection"
      },
      {
        text: "Which component protects electrical circuits from overcurrent?",
        options: ["Relay", "Switch", "Circuit breaker", "Transformer"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "What is the function of aircraft pitot tubes?",
        options: ["Measure fuel flow", "Measure airspeed", "Measure temperature", "Measure altitude"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Pitot-Static Systems"
      },
      {
        text: "In turbine engines, what is the hot section?",
        options: ["Compressor area", "Combustion and turbine area", "Fan area", "Exhaust area only"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "Which system provides cabin pressurization in commercial aircraft?",
        options: ["Hydraulic system", "Electrical system", "Pneumatic system", "Fuel system"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Environmental Systems"
      },
      {
        text: "What is the primary function of aircraft rudder?",
        options: ["Control pitch", "Control roll", "Control yaw", "Control thrust"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "Which type of bearing is commonly used in aircraft engines?",
        options: ["Ball bearings only", "Roller bearings only", "Both ball and roller bearings", "Magnetic bearings"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "What does the term 'MEL' stand for in aviation maintenance?",
        options: ["Maintenance Equipment List", "Minimum Equipment List", "Maximum Engine Load", "Manual Entry Log"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Regulations"
      },
      {
        text: "Which component converts DC power to AC power in aircraft systems?",
        options: ["Rectifier", "Inverter", "Transformer", "Generator"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "What is the purpose of aircraft trim tabs?",
        options: ["Increase speed", "Reduce control forces", "Improve visibility", "Enhance communication"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "In aircraft fuel systems, what prevents fuel tank explosions?",
        options: ["Fuel pumps", "Inerting systems", "Fuel filters", "Pressure regulators"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Fuel Systems"
      },
      {
        text: "Which instrument measures aircraft altitude?",
        options: ["Airspeed indicator", "Altimeter", "Attitude indicator", "Heading indicator"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Flight Instruments"
      },
      {
        text: "What type of maintenance requires aircraft to be removed from service?",
        options: ["Line maintenance", "Heavy maintenance", "Routine maintenance", "Preventive maintenance"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Maintenance Types"
      },
      {
        text: "Which component regulates hydraulic system pressure?",
        options: ["Accumulator", "Filter", "Pressure regulator", "Reservoir"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Hydraulic Systems"
      },
      {
        text: "What is the primary purpose of aircraft anti-ice systems?",
        options: ["Improve fuel efficiency", "Prevent ice formation", "Reduce noise", "Enhance visibility"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Ice Protection"
      },
      {
        text: "In gas turbine engines, what accelerates combustion gases?",
        options: ["Compressor", "Combustor", "Turbine", "Nozzle"],
        correctAnswer: 3,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "Which system provides power for aircraft operation on ground?",
        options: ["APU", "Main engines only", "Battery only", "External power only"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Auxiliary Power"
      },
      {
        text: "What is the function of aircraft spoilers?",
        options: ["Increase lift", "Reduce lift and increase drag", "Improve fuel flow", "Enhance communication"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "Which material is commonly used for aircraft fuel lines?",
        options: ["Plastic", "Aluminum", "Steel", "Copper"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Fuel Systems"
      },
      {
        text: "What does 'AD' stand for in aviation maintenance?",
        options: ["Aircraft Directive", "Airworthiness Directive", "Aviation Document", "Assembly Drawing"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Regulations"
      },
      {
        text: "Which component stores electrical energy in aircraft systems?",
        options: ["Generator", "Battery", "Inverter", "Transformer"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "What is the primary function of aircraft elevator?",
        options: ["Control yaw", "Control roll", "Control pitch", "Control thrust"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "In hydraulic systems, what prevents contamination?",
        options: ["Pumps", "Filters", "Accumulators", "Reservoirs"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Hydraulic Systems"
      },
      {
        text: "Which system controls aircraft cabin temperature?",
        options: ["Fuel system", "Electrical system", "Environmental control system", "Hydraulic system"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Environmental Systems"
      },
      {
        text: "What is the purpose of engine thrust reversers?",
        options: ["Increase thrust", "Redirect thrust for braking", "Improve fuel efficiency", "Reduce noise"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Engine Systems"
      },
      {
        text: "Which instrument indicates aircraft heading?",
        options: ["Compass", "Altimeter", "Airspeed indicator", "Attitude indicator"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Flight Instruments"
      },
      {
        text: "What type of inspection is performed between flights?",
        options: ["A-check", "B-check", "C-check", "Pre-flight inspection"],
        correctAnswer: 3,
        difficulty: "ML1",
        category: "Inspection Types"
      },
      {
        text: "Which component controls fuel flow to the engine?",
        options: ["Fuel pump", "Fuel filter", "Fuel control unit", "Fuel tank"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Fuel Systems"
      },
      {
        text: "What is the primary purpose of aircraft navigation lights?",
        options: ["Illuminate runway", "Indicate aircraft position and direction", "Improve fuel efficiency", "Enhance communication"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Lighting Systems"
      },
      {
        text: "In pneumatic systems, what controls air pressure?",
        options: ["Pressure regulator", "Air filter", "Compressor", "Bleed valve"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Pneumatic Systems"
      },
      {
        text: "Which component provides backup power in case of generator failure?",
        options: ["APU", "Battery", "External power", "Emergency generator"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Electrical Systems"
      },
      {
        text: "What is the function of aircraft ailerons?",
        options: ["Control pitch", "Control yaw", "Control roll", "Control thrust"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "Which system prevents wheel lockup during landing?",
        options: ["Hydraulic system", "Anti-skid system", "Pneumatic system", "Electrical system"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Landing Gear"
      },
      {
        text: "What is the primary purpose of aircraft fuel pumps?",
        options: ["Cool fuel", "Filter fuel", "Transfer and pressurize fuel", "Heat fuel"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Fuel Systems"
      },
      {
        text: "Which document contains aircraft maintenance procedures?",
        options: ["Flight manual", "Maintenance manual", "Operations manual", "Emergency manual"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Documentation"
      },
      {
        text: "What type of valve controls hydraulic flow direction?",
        options: ["Check valve", "Relief valve", "Selector valve", "Shutoff valve"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Hydraulic Systems"
      },
      {
        text: "Which component measures engine exhaust gas temperature?",
        options: ["Thermocouple", "Pressure sensor", "Flow meter", "Tachometer"],
        correctAnswer: 0,
        difficulty: "ML1",
        category: "Engine Instruments"
      },
      {
        text: "What is the primary function of aircraft wing slats?",
        options: ["Reduce drag", "Improve airflow at high angles of attack", "Increase speed", "Enhance fuel efficiency"],
        correctAnswer: 1,
        difficulty: "ML1",
        category: "Flight Controls"
      },
      {
        text: "Which system provides emergency lighting in aircraft?",
        options: ["Main electrical system", "Battery system", "Emergency lighting system", "APU system"],
        correctAnswer: 2,
        difficulty: "ML1",
        category: "Emergency Systems"
      }
    ];

    // Add all ML1 questions to storage
    ml1Questions.forEach(question => {
      const id = randomUUID();
      const q: Question = { ...question, id };
      this.questions.set(id, q);
    });
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createExamSession(session: InsertExamSession): Promise<{ session: ExamSession; sessionKey: string }> {
    const sessionKey = randomUUID();
    const [createdSession] = await db
      .insert(examSessions)
      .values({
        ...session,
        sessionKey,
      })
      .returning();
    return { session: createdSession, sessionKey };
  }

  async getExamSessionByKey(sessionKey: string): Promise<ExamSession | undefined> {
    const [session] = await db.select().from(examSessions).where(eq(examSessions.sessionKey, sessionKey));
    return session || undefined;
  }

  async updateExamSession(sessionKey: string, updates: Partial<ExamSession>): Promise<ExamSession | undefined> {
    const [updated] = await db
      .update(examSessions)
      .set(updates)
      .where(eq(examSessions.sessionKey, sessionKey))
      .returning();
    return updated || undefined;
  }

  async findExamSessionByCredentials(lastName: string, password: string): Promise<ExamSession | undefined> {
    const [session] = await db
      .select()
      .from(examSessions)
      .where(and(eq(examSessions.lastName, lastName), eq(examSessions.password, password)));
    return session || undefined;
  }

  async cleanupOldExamSessions(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const result = await db
      .delete(examSessions)
      .where(and(
        eq(examSessions.completed, false),
        lt(examSessions.createdAt, sevenDaysAgo)
      ));
    
    return result.rowCount || 0;
  }

  async getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
    const results = await db.select().from(questions);
    // Filter questions that include the specified difficulty level
    return results.filter(q => {
      const difficulties = Array.isArray(q.difficulties) ? q.difficulties : [];
      return difficulties.includes(difficulty);
    }).sort((a, b) => {
      // Sort by category first, then by question text for consistent ordering
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.text.localeCompare(b.text);
    });
  }

  async getAllQuestions(): Promise<Question[]> {
    const results = await db.select().from(questions);
    return results;
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [created] = await db
      .insert(questions)
      .values(question)
      .returning();
    return created;
  }

  async updateQuestion(id: string, updates: UpdateQuestion): Promise<Question | undefined> {
    const [updated] = await db
      .update(questions)
      .set(updates)
      .where(eq(questions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createExamResult(result: Omit<ExamResult, 'id'>): Promise<ExamResult> {
    const [created] = await db
      .insert(examResults)
      .values(result)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
