import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Home, Play } from "lucide-react";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function ExamIntro() {
  const { sessionKey } = useParams();
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/exam", sessionKey],
    enabled: !!sessionKey,
  });

  const getExamDescription = (examType: string) => {
    switch (examType) {
      case "Annual Exam":
        return "annual exam";
      case "Technical Inspector Exam":
        return "technical inspector exam";
      case "CDR Progression Written Exam":
        return "CDR progression written exam";
      default:
        return "examination";
    }
  };

  const getPassingScore = (examType: string) => {
    return "90%";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Session not found</p>
        <Button onClick={() => setLocation("/")} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <CardContent className="p-0">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-professional-gray-light mb-2">
              <span>Step 2 of 3</span>
              <span>Exam Introduction</span>
            </div>
            <Progress value={66} className="w-full" />
          </div>

          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-aviation-blue rounded-full flex items-center justify-center">
              <Play className="text-white text-3xl" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-professional-gray-dark">
                Ready to Begin
              </h2>
              <p className="text-lg text-professional-gray max-w-2xl mx-auto leading-relaxed">
                You are about to take a 50-question {getExamDescription(session.examType)}. 
                The minimum passing score is {getPassingScore(session.examType)}.
              </p>
            </div>

            {/* Participant Information */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 max-w-md mx-auto">
              <h3 className="font-semibold text-professional-gray-dark mb-4">Participant Details</h3>
              <div className="space-y-2 text-left">
                <div>
                  <span className="text-sm text-professional-gray">Name:</span>
                  <div className="font-semibold">{session.firstName} {session.lastName}</div>
                </div>
                <div>
                  <span className="text-sm text-professional-gray">Maintenance Level:</span>
                  <div className="font-semibold">{session.maintenanceLevel}</div>
                </div>
                <div>
                  <span className="text-sm text-professional-gray">Exam Type:</span>
                  <div className="font-semibold">{session.examType}</div>
                </div>
              </div>
            </div>

            {/* Exam Instructions */}
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-4">Important Instructions</h3>
              <ul className="text-amber-700 text-sm space-y-2 text-left max-w-2xl mx-auto">
                <li>• There is no time limit for the examination</li>
                <li>• You can flag questions for review if needed</li>
                <li>• Your progress is automatically saved</li>
                <li>• Use the "Leave Exam" button if you need to continue later</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Work in a quiet, distraction-free environment</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                variant="outline"
                onClick={() => setLocation("/admin")}
                className="flex-1 max-w-xs"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setLocation("/")}
                className="flex-1 max-w-xs"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
              
              <Button 
                onClick={() => setLocation(`/examination/${sessionKey}`)}
                className="flex-1 max-w-xs bg-aviation-blue hover:bg-aviation-blue-dark"
              >
                Begin Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
