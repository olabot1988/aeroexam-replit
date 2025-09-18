import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Home, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Results() {
  const { sessionKey } = useParams();
  const [, setLocation] = useLocation();

  const { data: resultsData, isLoading, error } = useQuery({
    queryKey: ["/api/exam", sessionKey, "results"],
    enabled: !!sessionKey,
  });

  // Extract session from the response
  const session = resultsData?.session;


  const handleNewExam = () => {
    setLocation("/admin");
  };

  const handleReturnHome = () => {
    setLocation("/");
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
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {session.score}%
              </div>
              <div className="text-xl text-professional-gray">Final Score</div>
            </div>
          </div>


          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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


    </div>
  );
}
