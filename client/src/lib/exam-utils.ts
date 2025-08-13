export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateTimeElapsed = (startTime: string, endTime?: string): string => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const calculateRemainingTime = (startTime: string, totalTimeMinutes: number = 60): number => {
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  const elapsed = Math.floor((now - start) / 1000);
  const totalSeconds = totalTimeMinutes * 60;
  return Math.max(0, totalSeconds - elapsed);
};

export const getTimeWarningClass = (timeString: string): string => {
  const [minutes] = timeString.split(':').map(Number);
  if (minutes <= 5) return 'text-red-600';
  if (minutes <= 15) return 'text-amber-600';
  return 'text-aviation-blue';
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateScore = (
  answers: Record<number, number>,
  questions: any[],
  totalQuestions: number = 50
): { score: number; correctCount: number } => {
  let correctCount = 0;
  
  Object.entries(answers).forEach(([questionNum, answer]) => {
    const questionIndex = parseInt(questionNum) - 1;
    if (questionIndex < questions.length) {
      const question = questions[questionIndex];
      if (question.correctAnswer === answer) {
        correctCount++;
      }
    }
  });

  const score = Math.round((correctCount / totalQuestions) * 100);
  return { score, correctCount };
};
