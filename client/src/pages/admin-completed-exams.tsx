import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, LogOut, Eye, Search, Calendar, Clock, User } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ExamSession } from "@shared/schema";
import { format } from "date-fns";

export default function AdminCompletedExams() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  
  const PASSING_SCORE = 90;

  // Check admin auth
  const adminToken = localStorage.getItem("admin-token");
  if (!adminToken) {
    setLocation("/admin-login");
    return null;
  }

  const { data: completedExams = [], isLoading } = useQuery({
    queryKey: ["/api/admin/completed-exams"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/completed-exams");
      return response.json();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setLocation("/");
  };

  const handleViewExam = (sessionKey: string) => {
    setLocation(`/admin/exam-review/${sessionKey}`);
  };

  // Filter exams
  const filteredExams = completedExams.filter((exam: ExamSession) => {
    const matchesSearch = 
      exam.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.sessionKey?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === "all" || exam.maintenanceLevel === filterLevel;
    const matchesType = filterType === "all" || exam.examType === filterType;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const getStatusBadge = (score: number) => {
    const passed = score >= PASSING_SCORE;
    return (
      <Badge variant={passed ? "default" : "destructive"} className={passed ? "bg-green-500" : ""}>
        {passed ? "PASSED" : "FAILED"}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading completed exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="text-aviation-blue text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-professional-gray-dark">Completed Exams</h1>
                <p className="text-professional-gray">Review completed aviation maintenance examinations</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setLocation("/admin/questions")}
                variant="outline"
                className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white"
                data-testid="button-questions"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Questions
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or session..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger data-testid="select-level">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="ML0">ML0</SelectItem>
                <SelectItem value="ML1">ML1</SelectItem>
                <SelectItem value="ML2">ML2</SelectItem>
                <SelectItem value="ML3">ML3</SelectItem>
                <SelectItem value="ML4">ML4</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="select-type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Annual Exam">Annual Exam</SelectItem>
                <SelectItem value="Technical Inspector Exam">Technical Inspector Exam</SelectItem>
                <SelectItem value="CDR Progression Written Exam">CDR Progression Written Exam</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-professional-gray flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Total: {filteredExams.length} exams
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Results List */}
      <div className="grid gap-4">
        {filteredExams.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <CardContent className="p-0 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-professional-gray-dark mb-2">No Completed Exams</h3>
              <p className="text-professional-gray">No completed examinations match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredExams.map((exam: ExamSession) => (
            <Card key={exam.sessionKey} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow" data-testid={`card-exam-${exam.sessionKey}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="text-aviation-blue" />
                    <div>
                      <CardTitle className="text-lg">
                        {exam.firstName} {exam.lastName}
                      </CardTitle>
                      <p className="text-sm text-professional-gray">
                        Session: {exam.sessionKey?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(exam.score || 0)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewExam(exam.sessionKey!)}
                      data-testid={`button-view-${exam.sessionKey}`}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-professional-gray">Exam Details</p>
                    <p className="font-medium">{exam.maintenanceLevel} - {exam.examType}</p>
                  </div>
                  <div>
                    <p className="text-professional-gray">Score</p>
                    <p className="font-medium" data-testid={`text-score-${exam.sessionKey}`}>
                      {exam.score}% (Required: {PASSING_SCORE}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-professional-gray">Duration</p>
                    <p className="font-medium">
                      <Clock className="inline mr-1 h-4 w-4" />
                      {(() => {
                        if (exam.startTime && exam.endTime) {
                          const seconds = Math.floor((new Date(exam.endTime).getTime() - new Date(exam.startTime).getTime()) / 1000);
                          return formatDuration(seconds);
                        }
                        return "N/A";
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-professional-gray">Completed</p>
                    <p className="font-medium">
                      <Calendar className="inline mr-1 h-4 w-4" />
                      {exam.endTime ? format(new Date(exam.endTime), "MMM d, yyyy HH:mm") : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}