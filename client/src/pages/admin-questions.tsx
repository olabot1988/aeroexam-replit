import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, LogOut, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Question } from "@shared/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdminQuestions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Check admin auth
  const adminToken = localStorage.getItem("admin-token");
  if (!adminToken) {
    setLocation("/admin-login");
    return null;
  }

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["/api/admin/questions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/questions");
      return response.json();
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/questions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Question Deleted",
        description: "The question has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    setLocation("/");
  };

  const handleDelete = (id: string) => {
    deleteQuestionMutation.mutate(id);
  };

  // Filter questions
  const filteredQuestions = questions.filter((q: Question) => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === "all" || q.category === filterCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(questions.map((q: Question) => q.category)));

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'ML0': 'bg-green-100 text-green-800',
      'ML1': 'bg-blue-100 text-blue-800',
      'ML2': 'bg-yellow-100 text-yellow-800',
      'ML3': 'bg-orange-100 text-orange-800',
      'ML4': 'bg-red-100 text-red-800',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading questions...</p>
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
              <BookOpen className="text-aviation-blue text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-professional-gray-dark">Question Management</h1>
                <p className="text-professional-gray">Manage aviation maintenance exam questions</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setLocation("/admin/questions/new")}
                className="bg-aviation-blue hover:bg-aviation-blue-dark"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="ML0">ML0 - Basic</SelectItem>
                <SelectItem value="ML1">ML1 - Line</SelectItem>
                <SelectItem value="ML2">ML2 - Heavy</SelectItem>
                <SelectItem value="ML3">ML3 - Specialized</SelectItem>
                <SelectItem value="ML4">ML4 - Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-professional-gray flex items-center">
              Total: {filteredQuestions.length} questions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <CardContent className="p-0 text-center">
              <BookOpen className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-semibold text-professional-gray-dark mb-2">No Questions Found</h3>
              <p className="text-professional-gray mb-4">
                {searchTerm || filterDifficulty !== "all" || filterCategory !== "all"
                  ? "Try adjusting your filters to see more questions."
                  : "Get started by adding your first question."}
              </p>
              <Button 
                onClick={() => setLocation("/admin/questions/new")}
                className="bg-aviation-blue hover:bg-aviation-blue-dark"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question: Question) => (
            <Card key={question.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {question.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-professional-gray-dark mb-3">
                      {question.text}
                    </h3>
                    <div className="space-y-2">
                      {(question.options as string[]).map((option, index) => {
                        const letter = String.fromCharCode(65 + index);
                        const isCorrect = question.correctAnswer === index;
                        return (
                          <div 
                            key={index}
                            className={`p-2 rounded border ${
                              isCorrect 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="font-medium mr-2">{letter}.</span>
                            {option}
                            {isCorrect && <span className="ml-2 text-green-600 font-semibold">(Correct)</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/admin/questions/${question.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(question.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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