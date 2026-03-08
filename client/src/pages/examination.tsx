import { useState, useEffect, useRef, useCallback } from "react";
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [examInitialized, setExamInitialized] = useState(false);
  const [savedTimeUsed, setSavedTimeUsed] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());

  // Get session data
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/exam", sessionKey],
    enabled: !!sessionKey,
  });

  // Calculate current time used (saved + time since this session started)
  const getCurrentTimeUsed = useCallback(() => {
    const sessionElapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    return savedTimeUsed + sessionElapsed;
  }, [savedTimeUsed]);

  // Save time mutation
  const saveTimeMutation = useMutation({
    mutationFn: async (timeUsed: number) => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/save-time`, { timeUsed });
      return response.json();
    },
    onSuccess: (data) => {
      // Update savedTimeUsed with server's confirmed value and reset session start
      if (data.timeUsed !== undefined) {
        setSavedTimeUsed(data.timeUsed);
        sessionStartRef.current = Date.now();
      }
    },
  });

  // Save time to server
  const saveTimeToServer = useCallback(() => {
    if (sessionKey && examInitialized) {
      const currentTimeUsed = getCurrentTimeUsed();
      saveTimeMutation.mutate(currentTimeUsed);
    }
  }, [sessionKey, examInitialized, getCurrentTimeUsed, saveTimeMutation]);

  // Start exam and get questions
  const startExamMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/start`);
      return response.json();
    },
    onSuccess: (data) => {
      setQuestions(data.questions);
      setExamInitialized(true);
      
      // Use timeUsed from server to track elapsed time
      const timeUsed = data.timeUsed || 0;
      setSavedTimeUsed(timeUsed);
      sessionStartRef.current = Date.now();
      setElapsedTime(timeUsed);
      
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
      // Only show error for genuine failures, not "already started" cases
      if (!error.message.includes("already started")) {
        toast({
          title: "Error Starting Exam",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Submit answer
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: number }) => {
      const response = await apiRequest("POST", `/api/exam/${sessionKey}/answer`, {
        questionId,
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
      // Clean up error message to remove any special characters or JSON formatting
      let cleanMessage = error.message;
      try {
        // Try to extract just the error text if it's formatted strangely
        if (cleanMessage.includes('{') && cleanMessage.includes('}')) {
          const match = cleanMessage.match(/"error":\s*"([^"]+)"/);
          if (match) {
            cleanMessage = match[1];
          }
        }
        // Remove any status codes from the beginning
        cleanMessage = cleanMessage.replace(/^\d+:\s*/, '');
      } catch {
        // If parsing fails, use original message
        cleanMessage = "Unable to submit exam. Please try again.";
      }
      
      toast({
        title: "Submission Error",
        description: cleanMessage,
        variant: "destructive",
      });
    },
  });

  // Timer effect - counts up to show elapsed time (no time limit)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save time every 30 seconds
  useEffect(() => {
    if (!examInitialized) return;

    const autoSaveInterval = setInterval(() => {
      saveTimeToServer();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [examInitialized, saveTimeToServer]);

  // Save time on page unload/visibility change (pause/resume support)
  useEffect(() => {
    if (!examInitialized) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliability during page unload
      const timeUsed = getCurrentTimeUsed();
      navigator.sendBeacon(
        `/api/exam/${sessionKey}/save-time`,
        JSON.stringify({ timeUsed })
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveTimeToServer();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examInitialized, sessionKey, getCurrentTimeUsed, saveTimeToServer]);

  // Start exam when component mounts
  useEffect(() => {
    if (session && !examInitialized && !startExamMutation.isPending) {
      startExamMutation.mutate();
    }
  }, [session, examInitialized, startExamMutation.isPending]);

  // Load selected answer when question changes
  useEffect(() => {
    const currentQuestionData = questions[currentQuestion - 1];
    if (currentQuestionData) {
      setSelectedAnswer(answers[currentQuestionData.id] ?? null);
    }
  }, [currentQuestion, answers, questions]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const currentQuestionData = questions[currentQuestion - 1];
    if (!currentQuestionData) return;
    
    const newAnswers = { ...answers, [currentQuestionData.id]: answer };
    setAnswers(newAnswers);
    submitAnswerMutation.mutate({ questionId: currentQuestionData.id, answer });
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
    // Save time before leaving
    saveTimeToServer();
    toast({
      title: "Progress Saved",
      description: "Your time has been paused. Use your last name and password to continue later.",
    });
    setLocation("/");
  };

  const handleQuitExam = () => {
    // Submit the exam to mark it as completed
    submitExamMutation.mutate();
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
        elapsedTime={formatTime(elapsedTime)}
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
      <Card className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-professional-gray sm:w-auto">
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
                <Button variant="destructive" className="w-full sm:w-auto">
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
