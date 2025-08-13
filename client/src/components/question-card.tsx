import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  onFlag,
  onPrevious,
  onNext,
  canGoBack,
  isLastQuestion,
  isSubmitting
}: QuestionCardProps) {
  const options = question.options as string[];

  return (
    <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <CardContent className="space-y-6 p-0">
        <div className="flex items-start space-x-4">
          <div className="bg-aviation-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {questionNumber}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-professional-gray-dark mb-4">
              {question.text}
            </h3>
            
            {/* Answer Choices */}
            <div className="space-y-3">
              {options.map((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedAnswer === index;
                
                return (
                  <label 
                    key={index}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors border ${
                      isSelected 
                        ? 'bg-blue-50 border-aviation-blue' 
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-aviation-blue'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="answer" 
                      value={index}
                      checked={isSelected}
                      onChange={() => onAnswerSelect(index)}
                      className="mr-4 text-aviation-blue focus:ring-aviation-blue"
                    />
                    <span className="text-professional-gray-dark">
                      <span className="font-medium mr-2">{letter}.</span>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button 
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoBack}
            className="font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={onFlag}
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-200"
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag for Review
            </Button>
            
            <Button 
              onClick={onNext}
              disabled={isSubmitting}
              className="bg-aviation-blue hover:bg-aviation-blue-dark font-semibold"
            >
              {isSubmitting ? 'Submitting...' : (isLastQuestion ? 'Submit Exam' : 'Next')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
