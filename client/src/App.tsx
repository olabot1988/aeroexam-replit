import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import ExamIntro from "@/pages/exam-intro";
import Examination from "@/pages/examination";
import Results from "@/pages/results";
import AdminLogin from "@/pages/admin-login";
import AdminQuestions from "@/pages/admin-questions";
import AdminQuestionForm from "@/pages/admin-question-form";
import AdminCompletedExams from "@/pages/admin-completed-exams";
import AdminExamReview from "@/pages/admin-exam-review";
import { Plane, ShieldCheck } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md">
            <Plane className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              AeroExam
            </h1>
            <p className="text-xs text-slate-500">Aviation Maintenance Assessment</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Army Regulatory Compliance
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin/questions" component={AdminQuestions} />
      <Route path="/admin/questions/new" component={AdminQuestionForm} />
      <Route path="/admin/questions/:id/edit" component={AdminQuestionForm} />
      <Route path="/admin/completed-exams" component={AdminCompletedExams} />
      <Route path="/admin/exam-review/:sessionKey" component={AdminExamReview} />
      <Route path="/exam-intro/:sessionKey" component={ExamIntro} />
      <Route path="/examination/:sessionKey" component={Examination} />
      <Route path="/results/:sessionKey" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 font-inter">
          <Header />
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
