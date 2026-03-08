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
  isSubmitting,
}: QuestionCardProps) {
  const options = question.options as string[];

  return (
    <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-lg">
      <CardContent className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
            {questionNumber}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-4 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
              {question.text}
            </h3>

            <div className="space-y-3">
              {options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === index;

                return (
                  <label
                    key={index}
                    className={`flex cursor-pointer items-start rounded-xl border p-3 transition-colors sm:items-center sm:p-4 ${
                      isSelected
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={isSelected}
                      onChange={() => onAnswerSelect(index)}
                      className="mt-1 mr-3 text-sky-600 focus:ring-sky-500 sm:mt-0 sm:mr-4"
                    />
                    <span className="text-sm leading-relaxed text-slate-800 sm:text-base">
                      <span className="mr-2 font-semibold">{letter}.</span>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={onFlag}
              className="w-full border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 sm:w-auto"
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag for Review
            </Button>
          </div>

          <Button
            onClick={onNext}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 font-semibold hover:from-sky-700 hover:to-indigo-700"
          >
            {isSubmitting ? "Submitting..." : isLastQuestion ? "Submit Exam" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
