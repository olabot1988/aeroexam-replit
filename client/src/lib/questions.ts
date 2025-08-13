import type { Question } from "@shared/schema";

export const sampleQuestions: Question[] = [
  // This would typically be populated from the backend
  // The actual questions are stored in the server's MemStorage
];

export const getDifficultyLabel = (difficulty: string): string => {
  const labels = {
    'ML0': 'Basic Maintenance',
    'ML1': 'Line Maintenance',
    'ML2': 'Heavy Maintenance',
    'ML3': 'Specialized Systems',
    'ML4': 'Advanced Systems'
  };
  return labels[difficulty as keyof typeof labels] || difficulty;
};

export const getExamDifficulty = (maintenanceLevel: string, examType: string): string => {
  if (examType === "CDR Progression Written Exam") {
    // CDR exams test for next higher level
    const levels = ["ML0", "ML1", "ML2", "ML3", "ML4"];
    const currentIndex = levels.indexOf(maintenanceLevel);
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    return maintenanceLevel;
  } else if (examType === "Technical Inspector Exam") {
    return "ML3";
  }
  return maintenanceLevel;
};

export const getPassingScore = (examType: string): number => {
  return examType === "Annual Exam" ? 90 : 70;
};
