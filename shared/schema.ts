import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const examSessions = pgTable("exam_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  maintenanceLevel: text("maintenance_level").notNull(),
  examType: text("exam_type").notNull(),
  password: text("password").notNull(),
  sessionKey: text("session_key").notNull().unique(),
  currentQuestion: integer("current_question").default(1),
  answers: jsonb("answers").default({}),
  flaggedQuestions: jsonb("flagged_questions").default([]),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  completed: boolean("completed").default(false),
  score: integer("score"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  difficulty: text("difficulty").notNull(), // ML0, ML1, ML2, ML3, ML4
  category: text("category").notNull(),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => examSessions.id).notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  passed: boolean("passed").notNull(),
  timeTaken: text("time_taken").notNull(),
  completedAt: timestamp("completed_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExamSessionSchema = createInsertSchema(examSessions, {
  maintenanceLevel: z.enum(["ML0", "ML1", "ML2", "ML3", "ML4"]),
  examType: z.enum(["Annual Exam", "Technical Inspector Exam", "CDR Progression Written Exam"]),
  password: z.string().min(6).max(15),
}).pick({
  firstName: true,
  lastName: true,
  maintenanceLevel: true,
  examType: true,
  password: true,
});

export const insertQuestionSchema = createInsertSchema(questions, {
  options: z.array(z.string()).min(2).max(4),
  correctAnswer: z.number().min(0).max(3),
  difficulty: z.enum(["ML0", "ML1", "ML2", "ML3", "ML4"]),
}).pick({
  text: true,
  options: true,
  correctAnswer: true,
  difficulty: true,
  category: true,
});

export const updateQuestionSchema = insertQuestionSchema.partial();

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const answerSubmissionSchema = z.object({
  sessionKey: z.string(),
  questionNumber: z.number(),
  answer: z.number(),
});

export const continueExamSchema = z.object({
  lastName: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertExamSession = z.infer<typeof insertExamSessionSchema>;
export type ExamSession = typeof examSessions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type ExamResult = typeof examResults.$inferSelect;
export type AnswerSubmission = z.infer<typeof answerSubmissionSchema>;
export type ContinueExam = z.infer<typeof continueExamSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
