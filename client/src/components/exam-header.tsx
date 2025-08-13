import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ExamSession } from "@shared/schema";

interface ExamHeaderProps {
  session: ExamSession | null;
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: string;
  progress: number;
}

export default function ExamHeader({ 
  session, 
  currentQuestion, 
  totalQuestions, 
  timeLeft, 
  progress 
}: ExamHeaderProps) {
  const getTimeColor = (timeString: string) => {
    const [minutes] = timeString.split(':').map(Number);
    if (minutes <= 5) return 'text-red-600';
    if (minutes <= 15) return 'text-amber-600';
    return 'text-aviation-blue';
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-professional-gray-dark">Aviation Maintenance Examination</h2>
            <p className="text-professional-gray">
              Participant: {session?.firstName || 'Loading...'} {session?.lastName || ''} ({session?.maintenanceLevel || ''})
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getTimeColor(timeLeft)}`}>
              {timeLeft}
            </div>
            <div className="text-sm text-professional-gray">Time Remaining</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-professional-gray-light mb-2">
            <span>Question {currentQuestion} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
