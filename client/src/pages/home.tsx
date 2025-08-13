import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, Clock, Percent, HelpCircle, Info } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="text-center space-y-8">
      <Card className="bg-white rounded-xl shadow-lg p-12 border border-gray-200">
        <CardContent className="space-y-6 p-0">
          {/* Hero Section */}
          <div className="mx-auto w-24 h-24 bg-aviation-blue rounded-full flex items-center justify-center">
            <ClipboardCheck className="text-white text-3xl" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-professional-gray-dark">
              Annual Maintenance Examination
            </h2>
            <p className="text-lg text-professional-gray max-w-2xl mx-auto leading-relaxed">
              Complete your required annual aviation maintenance examination. 
              This digital platform ensures regulatory compliance while providing 
              a streamlined testing experience.
            </p>
          </div>

          {/* Key Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <Clock className="text-aviation-blue text-xl mb-2 mx-auto" />
              <h3 className="font-semibold text-professional-gray-dark">Time Limit</h3>
              <p className="text-sm text-professional-gray">60 minutes maximum</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <Percent className="text-green-600 text-xl mb-2 mx-auto" />
              <h3 className="font-semibold text-professional-gray-dark">Passing Score</h3>
              <p className="text-sm text-professional-gray">70% or higher</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <HelpCircle className="text-amber-600 text-xl mb-2 mx-auto" />
              <h3 className="font-semibold text-professional-gray-dark">Questions</h3>
              <p className="text-sm text-professional-gray">50 randomized items</p>
            </div>
          </div>

          {/* Begin Test Button */}
          <div className="pt-6">
            <Button 
              onClick={() => setLocation("/admin")}
              className="bg-aviation-blue hover:bg-aviation-blue-dark text-white font-semibold py-4 px-12 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              size="lg"
            >
              <ClipboardCheck className="mr-3" />
              Begin Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card className="bg-gray-100 rounded-lg p-6 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex items-start space-x-3">
            <Info className="text-aviation-blue text-xl mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-professional-gray-dark mb-2">Regulatory Compliance Notice</h3>
              <p className="text-sm text-professional-gray leading-relaxed">
                This examination is conducted in accordance with FAA regulations. 
                All responses are recorded for compliance purposes. Ensure you have 
                adequate time and a distraction-free environment before beginning.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
