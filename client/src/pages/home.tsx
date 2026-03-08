import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck, Clock3, Percent, HelpCircle, Info, Settings, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white/90 shadow-xl backdrop-blur">
        <CardContent className="p-0">
          <div className="relative border-b border-slate-100 bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 px-6 py-12 text-white sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="relative space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <ClipboardCheck className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Annual Maintenance Exam</h2>
                <p className="mx-auto max-w-2xl text-sm text-sky-100 sm:text-base">
                  Fast, clean, and compliant testing flow for aviation maintenance readiness.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-10">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoTile
                icon={<Clock3 className="h-5 w-5 text-sky-600" />}
                title="Flexible Timing"
                detail="No exam time limit"
                tone="bg-sky-50 border-sky-100"
              />
              <InfoTile
                icon={<Percent className="h-5 w-5 text-emerald-600" />}
                title="Pass Threshold"
                detail="90% or higher"
                tone="bg-emerald-50 border-emerald-100"
              />
              <InfoTile
                icon={<HelpCircle className="h-5 w-5 text-amber-600" />}
                title="Question Set"
                detail="50 randomized items"
                tone="bg-amber-50 border-amber-100"
              />
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => setLocation("/admin")}
                className="w-full max-w-sm rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-6 text-base font-semibold shadow-lg transition hover:from-sky-700 hover:to-indigo-700 sm:w-auto sm:px-12"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start Exam Flow
              </Button>

              <Button
                variant="outline"
                onClick={() => setLocation("/admin-login")}
                className="w-full max-w-sm rounded-xl border-slate-300 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 sm:w-auto"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-sky-600" />
            <div>
              <h3 className="mb-1 font-semibold text-slate-900">Compliance Notice</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                This exam is conducted in accordance with TC 3-04.71. Responses are logged for audit and
                certification tracking. Complete the exam in a quiet environment with a stable internet connection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type InfoTileProps = {
  icon: ReactNode;
  title: string;
  detail: string;
  tone: string;
};

function InfoTile({ icon, title, detail, tone }: InfoTileProps) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="mb-2 inline-flex rounded-lg bg-white p-2 shadow-sm">{icon}</div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{detail}</p>
    </div>
  );
}
