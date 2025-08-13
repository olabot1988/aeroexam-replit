import { Switch, Route, useLocation } from "wouter";
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
import { Plane } from "lucide-react";

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Plane className="text-aviation-blue text-2xl" />
            <h1 className="text-xl font-semibold text-professional-gray-dark">Aviation Maintenance Examination</h1>
          </div>
          <div className="text-sm text-professional-gray-light">
            FAA Regulatory Compliance Platform
          </div>
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
        <div className="font-inter bg-gray-50 min-h-screen">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
