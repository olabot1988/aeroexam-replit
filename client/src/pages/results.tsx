import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Home, RotateCcw, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Results() {
  const { sessionKey } = useParams();
  const [, setLocation] = useLocation();

  const { data: sessionData, isLoading, error } = useQuery({
    queryKey: ["/api/exam", sessionKey, "results"],
    enabled: !!sessionKey,
  });

  console.log("Results page - sessionKey:", sessionKey);
  console.log("Results page - sessionData:", sessionData);
  console.log("Results page - error:", error);

  // Extract session from the response
  const session = sessionData?.session;

  const handlePrint = () => {
    window.print();
  };

  const handleNewExam = () => {
    setLocation("/admin");
  };

  const handleReturnHome = () => {
    setLocation("/");
  };

  const getMaintenanceLevelDescription = (level: string) => {
    const descriptions = {
      'ML0': 'Basic Maintenance',
      'ML1': 'Line Maintenance',
      'ML2': 'Heavy Maintenance',
      'ML3': 'Specialized Systems',
      'ML4': 'Advanced Systems'
    };
    return descriptions[level as keyof typeof descriptions] || 'Unknown Level';
  };

  const getPassingThreshold = (examType: string) => {
    return 90;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.completed) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Results not available</p>
        <Button onClick={() => setLocation("/")} variant="outline">
          Return Home
        </Button>
      </div>
    );
  }

  const passingThreshold = getPassingThreshold(session.examType);
  const passed = (session.score || 0) >= passingThreshold;
  const totalQuestions = 50;
  const correctAnswers = Math.round((totalQuestions * (session.score || 0)) / 100);

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
        <CardContent className="space-y-6 p-0">
          {/* Results Header */}
          <div className="space-y-4">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {passed ? (
                <Check className="text-white text-3xl" />
              ) : (
                <X className="text-white text-3xl" />
              )}
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-professional-gray-dark mb-2">
                {passed ? 'Examination Passed' : 'Examination Failed'}
              </h2>
              <p className="text-lg text-professional-gray">
                {passed 
                  ? 'Congratulations! You have successfully passed the examination.'
                  : `You did not achieve the required passing score of ${passingThreshold}%.`
                }
              </p>
            </div>
          </div>

          {/* Score Display */}
          <div className="bg-gray-50 rounded-xl p-8 space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {session.score}%
              </div>
              <div className="text-xl text-professional-gray">Final Score</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-professional-gray-dark">{correctAnswers}</div>
                <div className="text-sm text-professional-gray">Correct Answers</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-professional-gray-dark">{totalQuestions}</div>
                <div className="text-sm text-professional-gray">Total Questions</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-professional-gray-dark">
                  {session.endTime && session.startTime 
                    ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-professional-gray">Minutes Taken</div>
              </div>
            </div>
          </div>

          {/* Participant Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-professional-gray-dark mb-4">Examination Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-sm text-professional-gray">Participant:</span>
                <div className="font-semibold">{session.firstName} {session.lastName}</div>
              </div>
              <div>
                <span className="text-sm text-professional-gray">Maintenance Level:</span>
                <div className="font-semibold">{session.maintenanceLevel} - {getMaintenanceLevelDescription(session.maintenanceLevel)}</div>
              </div>
              <div>
                <span className="text-sm text-professional-gray">Exam Type:</span>
                <div className="font-semibold">{session.examType}</div>
              </div>
              <div>
                <span className="text-sm text-professional-gray">Date Completed:</span>
                <div className="font-semibold">
                  {session.endTime 
                    ? new Date(session.endTime).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'N/A'
                  }
                </div>
              </div>
              <div>
                <span className="text-sm text-professional-gray">Passing Threshold:</span>
                <div className="font-semibold">{passingThreshold}%</div>
              </div>
              <div>
                <span className="text-sm text-professional-gray">Result:</span>
                <div className={`font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'PASS' : 'FAIL'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              variant="outline"
              onClick={handlePrint}
              className="flex-1 max-w-xs"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Results
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleReturnHome}
              className="flex-1 max-w-xs"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
            
            <Button 
              onClick={handleNewExam}
              className="flex-1 max-w-xs bg-aviation-blue hover:bg-aviation-blue-dark"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Examination
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Footer */}
      <Card className="bg-gray-100 rounded-lg p-6 border border-gray-200">
        <CardContent className="p-0 text-center">
          <p className="text-sm text-professional-gray">
            This examination record has been automatically saved for regulatory compliance. 
            Results are valid for one year from the completion date.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
