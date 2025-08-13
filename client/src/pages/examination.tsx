import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import ExamHeader from "@/components/exam-header";
import QuestionCard from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Save } from "lucide-react";
import type { Question } from "@shared/schema";

export default function Examination() {
  const { sessionKey } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(28800); // 8 hours in seconds
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  // Get session data
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/exam", sessionKey],
    enabled: !!sessionKey,
  });

  // Start exam and get questions
  const startExamMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/start`);
      return response.json();
    },
    onSuccess: (data) => {
      setQuestions(data.questions);
      if (data.session.startTime) {
        // Calculate remaining time if exam was already started
        const startTime = new Date(data.session.startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, 28800 - elapsed);
        setTimeLeft(remaining);
      }
      
      // Restore previous state if continuing
      if (data.session.answers) {
        setAnswers(data.session.answers);
      }
      if (data.session.flaggedQuestions) {
        setFlaggedQuestions(data.session.flaggedQuestions);
      }
      if (data.session.currentQuestion) {
        setCurrentQuestion(data.session.currentQuestion);
      }
    },
    onError: (error) => {
      toast({
        title: "Error Starting Exam",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit answer
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionNumber, answer }: { questionNumber: number; answer: number }) => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/answer`, {
        questionNumber,
        answer,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exam", sessionKey] });
    },
  });

  // Flag question
  const flagQuestionMutation = useMutation({
    mutationFn: async (questionNumber: number) => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/flag/${questionNumber}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exam", sessionKey] });
    },
  });

  // Submit complete exam
  const submitExamMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/submit`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exam Submitted",
        description: "Your exam has been successfully submitted.",
      });
      setLocation(`/results/${sessionKey}`);
    },
    onError: (error) => {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      toast({
        title: "Time Expired",
        description: "Your exam time has expired. Submitting automatically.",
        variant: "destructive",
      });
      submitExamMutation.mutate();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitExamMutation]);

  // Start exam when component mounts
  useEffect(() => {
    if (session && !session.startTime) {
      startExamMutation.mutate();
    } else if (session && session.startTime) {
      // Already started, just load the data
      startExamMutation.mutate();
    }
  }, [session]);

  // Load selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion] ?? null);
  }, [currentQuestion, answers]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    submitAnswerMutation.mutate({ questionNumber: currentQuestion, answer });
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < 50) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitExamMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFlag = () => {
    if (!flaggedQuestions.includes(currentQuestion)) {
      const newFlagged = [...flaggedQuestions, currentQuestion];
      setFlaggedQuestions(newFlagged);
      flagQuestionMutation.mutate(currentQuestion);
      toast({
        title: "Question Flagged",
        description: "Question has been flagged for review.",
      });
    }
  };

  const handleLeaveExam = () => {
    toast({
      title: "Progress Saved",
      description: "Use your last name and password to continue later.",
    });
    setLocation("/");
  };

  const handleQuitExam = () => {
    setLocation("/");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionLoading || startExamMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading examination...</p>
        </div>
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Unable to load examination</p>
        <Button onClick={() => setLocation("/")} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];

  return (
    <div className="space-y-6">
      <ExamHeader
        session={session}
        currentQuestion={currentQuestion}
        totalQuestions={50}
        timeLeft={formatTime(timeLeft)}
        progress={(currentQuestion / 50) * 100}
      />

      {currentQuestionData && (
        <QuestionCard
          question={currentQuestionData}
          questionNumber={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onFlag={handleFlag}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoBack={currentQuestion > 1}
          isLastQuestion={currentQuestion === 50}
          isSubmitting={submitExamMutation.isPending}
        />
      )}

      {/* Flagged Questions Summary */}
      {flaggedQuestions.length > 0 && (
        <Card className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <CardContent className="p-0">
            <div className="flex items-start space-x-3">
              <div className="text-amber-600 text-xl mt-1">🚩</div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Flagged Questions</h3>
                <p className="text-amber-700 text-sm">
                  You have flagged questions: {flaggedQuestions.join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exam Controls */}
      <Card className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex justify-between items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-professional-gray">
                  <Save className="mr-2 h-4 w-4" />
                  Leave Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave Examination?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave the exam? Your progress will be saved and you can continue later using your last name and password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveExam}>
                    Leave Exam
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Quit Test
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Quit Test?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to quit the test? This will NOT save your progress and you will need to start over.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleQuitExam} className="bg-red-600 hover:bg-red-700">
                    Quit Test
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
