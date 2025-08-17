import { db } from "./db";
import { questions } from "@shared/schema";
import { type InsertQuestion } from "@shared/schema";

const sampleQuestions: InsertQuestion[] = [
  // Basic questions for ML0 only
  {
    text: "What is the primary purpose of aircraft maintenance?",
    options: ["To ensure flight safety", "To reduce operating costs", "To improve fuel efficiency", "To enhance passenger comfort"],
    correctAnswer: 0,
    difficulties: ["ML0"],
    category: "General Maintenance"
  },
  {
    text: "Which tool is essential for measuring precise torque values?",
    options: ["Wrench", "Torque wrench", "Pliers", "Screwdriver"],
    correctAnswer: 1,
    difficulties: ["ML0"],
    category: "Tools and Equipment"
  },
  
  // Multi-level questions applicable to multiple difficulties
  {
    text: "What does FOD stand for in aviation maintenance?",
    options: ["Flight Operations Directive", "Foreign Object Damage", "Fuel Overhead Distribution", "Fasten On Deck"],
    correctAnswer: 1,
    difficulties: ["ML0", "ML1", "ML2"],
    category: "Safety"
  },
  {
    text: "What is the maximum allowable tolerance for bolt torque in critical applications?",
    options: ["±5%", "±10%", "±15%", "±20%"],
    correctAnswer: 0,
    difficulties: ["ML1", "ML2"],
    category: "Mechanical Systems"
  },
  {
    text: "Which component converts AC power to DC power in aircraft electrical systems?",
    options: ["Transformer", "Rectifier", "Inverter", "Generator"],
    correctAnswer: 1,
    difficulties: ["ML1", "ML2", "ML3"],
    category: "Electrical Systems"
  },
  {
    text: "What is the typical operating pressure range for aircraft hydraulic systems?",
    options: ["500-1000 PSI", "1500-2000 PSI", "3000-5000 PSI", "6000-8000 PSI"],
    correctAnswer: 2,
    difficulties: ["ML2", "ML3", "ML4"],
    category: "Hydraulic Systems"
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample questions...");
    
    // Check if questions already exist
    const existingQuestions = await db.select().from(questions).limit(1);
    if (existingQuestions.length > 0) {
      console.log("Database already has questions, skipping seed.");
      return;
    }

    // Insert sample questions
    await db.insert(questions).values(sampleQuestions);
    console.log(`Successfully seeded ${sampleQuestions.length} questions.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}