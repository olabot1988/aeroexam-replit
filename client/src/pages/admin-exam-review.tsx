import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ArrowLeft, CheckCircle, XCircle, Clock, User, Calendar, Flag, Download } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ExamSession, Question } from "@shared/schema";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

interface ExamReviewData {
  examSession: ExamSession;
  questions: Question[];
  userAnswers: Record<string, number>;
  flaggedQuestions: Record<string, boolean>;
}

export default function AdminExamReview() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/exam-review/:sessionKey");
  const sessionKey = params?.sessionKey;

  // Check admin auth
  const adminToken = localStorage.getItem("admin-token");
  if (!adminToken) {
    setLocation("/admin-login");
    return null;
  }

  if (!match || !sessionKey) {
    setLocation("/admin/completed-exams");
    return null;
  }

  const { data: reviewData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/exam-review", sessionKey],
    queryFn: async (): Promise<ExamReviewData> => {
      const response = await apiRequest("GET", `/api/admin/exam-review/${sessionKey}`);
      return response.json();
    },
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getAnswerStatus = (question: Question, userAnswer: number | undefined) => {
    if (userAnswer === undefined) {
      return { status: "unanswered", icon: XCircle, color: "text-gray-500" };
    }
    
    const isCorrect = userAnswer === question.correctAnswer;
    return {
      status: isCorrect ? "correct" : "incorrect",
      icon: isCorrect ? CheckCircle : XCircle,
      color: isCorrect ? "text-green-600" : "text-red-600"
    };
  };

  const generatePDF = () => {
    if (!reviewData) return;

    const { examSession, questions, userAnswers } = reviewData;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPosition + requiredSpace > 270) {
        doc.addPage();
        yPosition = 20;
      }
    };

    const wrapText = (text: string, maxWidth: number): string[] => {
      return doc.splitTextToSize(text, maxWidth);
    };

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Aviation Maintenance Examination Results", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${format(new Date(), "MMM d, yyyy HH:mm")}`, margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Examinee Information", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${examSession.firstName} ${examSession.lastName}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Maintenance Level: ${examSession.maintenanceLevel}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Exam Type: ${examSession.examType}`, margin, yPosition);
    yPosition += 6;
    
    const examDur = examSession.startTime && examSession.endTime
      ? Math.floor((new Date(examSession.endTime).getTime() - new Date(examSession.startTime).getTime()) / 1000)
      : null;
    doc.text(`Duration: ${examDur ? formatDuration(examDur) : "N/A"}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Completed: ${examSession.endTime ? format(new Date(examSession.endTime), "MMM d, yyyy HH:mm") : "N/A"}`, margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Results Summary", margin, yPosition);
    yPosition += 8;

    const PASSING = 90;
    const didPass = (examSession.score || 0) >= PASSING;
    const correct = questions.filter(q => {
      const answer = normalizedAnswers[q.id];
      return answer !== undefined && answer === q.correctAnswer;
    }).length;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Final Score: ${examSession.score}%`, margin, yPosition);
    yPosition += 6;
    doc.text(`Status: ${didPass ? "PASSED" : "FAILED"}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Questions Correct: ${correct} / ${questions.length}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Required Score: ${PASSING}%`, margin, yPosition);
    yPosition += 15;

    doc.setDrawColor(200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Question Details", margin, yPosition);
    yPosition += 10;

    questions.forEach((question, index) => {
      const userAnswer = normalizedAnswers[question.id];
      const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;

      addNewPageIfNeeded(60);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const statusText = userAnswer === undefined ? "[No Answer]" : isCorrect ? "[Correct]" : "[Incorrect]";
      doc.text(`Question ${index + 1} ${statusText}`, margin, yPosition);
      yPosition += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const questionLines = wrapText(question.text, contentWidth);
      questionLines.forEach(line => {
        addNewPageIfNeeded(6);
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 3;

      if (Array.isArray(question.options)) {
        question.options.forEach((option: string, optIndex: number) => {
          addNewPageIfNeeded(8);
          const letter = String.fromCharCode(65 + optIndex);
          const isUserAns = userAnswer === optIndex;
          const isCorrectAns = optIndex === question.correctAnswer;
          
          let marker = "";
          if (isCorrectAns && isUserAns) marker = " [Your Answer - Correct]";
          else if (isCorrectAns) marker = " [Correct Answer]";
          else if (isUserAns) marker = " [Your Answer - Incorrect]";

          const optionText = `${letter}. ${option}${marker}`;
          const optionLines = wrapText(optionText, contentWidth - 5);
          optionLines.forEach(line => {
            addNewPageIfNeeded(5);
            doc.text(line, margin + 5, yPosition);
            yPosition += 5;
          });
        });
      }
      yPosition += 8;
    });

    const fileName = `Exam_Results_${examSession.lastName}_${examSession.firstName}_${format(new Date(), "yyyyMMdd")}.pdf`;
    doc.save(fileName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading exam review...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="space-y-6">
        <Card className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <CardContent className="p-0 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-professional-gray-dark mb-2">Exam Not Found</h3>
            <p className="text-professional-gray mb-4">The requested exam review could not be found.</p>
            <Button onClick={() => setLocation("/admin/completed-exams")} data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Completed Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { examSession, questions, userAnswers, flaggedQuestions } = reviewData;
  const PASSING_SCORE = 90;
  const passed = (examSession.score || 0) >= PASSING_SCORE;
  
  // Handle backward compatibility: old format uses question numbers, new format uses question IDs
  const isOldFormat = Object.keys(userAnswers || {}).some(key => !isNaN(Number(key)));
  const normalizedAnswers: Record<string, number> = {};
  
  if (isOldFormat) {
    // Convert old format (question number to answer) to new format (question ID to answer)
    Object.entries(userAnswers || {}).forEach(([questionNum, answer]) => {
      const questionIndex = parseInt(questionNum) - 1;
      if (questionIndex < questions.length) {
        normalizedAnswers[questions[questionIndex].id] = answer;
      }
    });
  } else {
    // Already in new format
    Object.assign(normalizedAnswers, userAnswers || {});
  }

  // Calculate exam duration
  const examDuration = examSession.startTime && examSession.endTime
    ? Math.floor((new Date(examSession.endTime).getTime() - new Date(examSession.startTime).getTime()) / 1000)
    : null;

  // Calculate question statistics
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(normalizedAnswers).length;
  const correctAnswers = questions.filter(q => {
    const userAnswer = normalizedAnswers[q.id];
    return userAnswer !== undefined && userAnswer === q.correctAnswer;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/admin/completed-exams")}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Completed Exams
            </Button>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={generatePDF}
                data-testid="button-download-pdf"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Badge variant={passed ? "default" : "destructive"} className={`text-lg px-4 py-2 ${passed ? "bg-green-500" : ""}`}>
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <User className="text-aviation-blue text-2xl" />
            <div>
              <h1 className="text-2xl font-bold text-professional-gray-dark">
                {examSession.firstName} {examSession.lastName}
              </h1>
              <p className="text-professional-gray">
                {examSession.maintenanceLevel} - {examSession.examType}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-professional-gray">Final Score</p>
              <p className="font-medium text-lg" data-testid="text-final-score">
                {examSession.score}% (Required: {PASSING_SCORE}%)
              </p>
            </div>
            <div>
              <p className="text-professional-gray">Questions</p>
              <p className="font-medium text-lg">
                {correctAnswers}/{totalQuestions} correct ({answeredQuestions} answered)
              </p>
            </div>
            <div>
              <p className="text-professional-gray">Duration</p>
              <p className="font-medium">
                <Clock className="inline mr-1 h-4 w-4" />
                {examDuration ? formatDuration(examDuration) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-professional-gray">Completed</p>
              <p className="font-medium">
                <Calendar className="inline mr-1 h-4 w-4" />
                {examSession.endTime ? format(new Date(examSession.endTime), "MMM d, yyyy HH:mm") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-professional-gray-dark flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-aviation-blue" />
          Question-by-Question Review
        </h2>

        {questions.map((question, index) => {
          const userAnswer = normalizedAnswers[question.id];
          const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
          const isFlagged = flaggedQuestions?.[question.id] || false;
          const answerStatus = getAnswerStatus(question, userAnswer);

          return (
            <Card key={question.id} className="bg-white rounded-xl shadow-lg border border-gray-200" data-testid={`card-question-${index + 1}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    Question {index + 1}
                    {isFlagged && (
                      <div title="Flagged by student">
                        <Flag className="ml-2 h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{question.category}</Badge>
                    <answerStatus.icon className={`h-5 w-5 ${answerStatus.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-professional-gray-dark font-medium">{question.text}</p>
                  
                  <div className="space-y-2">
                    {Array.isArray(question.options) && question.options.map((option: string, optionIndex: number) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = optionIndex === question.correctAnswer;
                      
                      let className = "p-3 rounded-lg border ";
                      
                      if (isCorrectAnswer) {
                        className += "border-green-500 bg-green-50 text-green-800";
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        className += "border-red-500 bg-red-50 text-red-800";
                      } else {
                        className += "border-gray-200 bg-gray-50 text-gray-700";
                      }

                      return (
                        <div key={optionIndex} className={className} data-testid={`option-${index + 1}-${optionIndex}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                            <div className="flex items-center space-x-1">
                              {isUserAnswer && (
                                <Badge variant="outline" className="text-xs">
                                  User Answer
                                </Badge>
                              )}
                              {isCorrectAnswer && (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  Correct Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }) || []}
                  </div>

                  {userAnswer === undefined && (
                    <div className="p-3 rounded-lg border border-gray-300 bg-gray-100">
                      <p className="text-gray-600 italic">Question was not answered</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}