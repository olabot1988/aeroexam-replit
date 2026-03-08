import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ExamSession } from "@shared/schema";

interface ExamHeaderProps {
  session: ExamSession | null;
  currentQuestion: number;
  totalQuestions: number;
  elapsedTime: string;
  progress: number;
}

export default function ExamHeader({
  session,
  currentQuestion,
  totalQuestions,
  elapsedTime,
  progress,
}: ExamHeaderProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 bg-white/95 shadow-lg">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">
              Aviation Maintenance Examination
            </h2>
            <p className="mt-1 break-words text-sm text-slate-600 sm:text-base">
              Participant: {session?.firstName || "Loading..."} {session?.lastName || ""} (
              {session?.maintenanceLevel || ""})
            </p>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-left sm:min-w-[140px] sm:text-right">
            <div className="text-xl font-bold tracking-tight text-sky-700 sm:text-2xl">{elapsedTime}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Time Elapsed</div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <span>
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
