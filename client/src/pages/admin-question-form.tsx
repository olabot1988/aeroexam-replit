import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertQuestionSchema.extend({
  text: z.string().min(10, "Question text must be at least 10 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required").max(4, "Maximum 4 options allowed"),
  correctAnswer: z.number().min(0).max(3),
  category: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminQuestionForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // Check admin auth
  const adminToken = localStorage.getItem("admin-token");
  if (!adminToken) {
    setLocation("/admin-login");
    return null;
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      options: ["", ""],
      correctAnswer: 0,
      difficulty: "ML0" as const,
      category: "",
    },
  });

  const { fields, append, remove } = useFieldArray<FormData, "options", "id">({
    control: form.control,
    name: "options",
  });

  // Load existing question if editing
  const { data: existingQuestion, isLoading } = useQuery({
    queryKey: ["/api/admin/questions", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest("GET", `/api/admin/questions/${id}`);
      return response.json();
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingQuestion) {
      form.reset({
        text: existingQuestion.text,
        options: existingQuestion.options,
        correctAnswer: existingQuestion.correctAnswer,
        difficulty: existingQuestion.difficulty,
        category: existingQuestion.category,
      });
    }
  }, [existingQuestion, form]);

  const createQuestionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = isEditing ? `/api/admin/questions/${id}` : "/api/admin/questions";
      const method = isEditing ? "PUT" : "POST";
      console.log(`Making ${method} request to ${url} with data:`, data);
      const response = await apiRequest(method, url, data);
      const result = await response.json();
      console.log(`${method} response:`, result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Question Updated" : "Question Created",
        description: `The question has been successfully ${isEditing ? "updated" : "created"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setLocation("/admin/questions");
    },
    onError: (error) => {
      // Clean up error message to remove any special characters or JSON formatting
      let cleanMessage = error.message;
      try {
        // Try to extract just the error text if it's formatted strangely
        if (cleanMessage.includes('{') && cleanMessage.includes('}')) {
          const match = cleanMessage.match(/"error":\s*"([^"]+)"/);
          if (match) {
            cleanMessage = match[1];
          }
        }
        // Remove any status codes from the beginning
        cleanMessage = cleanMessage.replace(/^\d+:\s*/, '');
      } catch {
        // If parsing fails, use a fallback message
        cleanMessage = isEditing ? "Failed to update question. Please check your information and try again." : "Failed to create question. Please check your information and try again.";
      }
      
      console.error("Question mutation error:", error);
      toast({
        title: isEditing ? "Update Failed" : "Creation Failed",
        description: cleanMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Is editing:", isEditing);
    console.log("Question ID:", id);
    
    // Filter out empty options
    const filteredOptions = data.options.filter(option => option.trim() !== "");
    
    if (filteredOptions.length < 2) {
      toast({
        title: "Validation Error",
        description: "At least 2 answer options are required",
        variant: "destructive",
      });
      return;
    }
    
    if (data.correctAnswer >= filteredOptions.length) {
      toast({
        title: "Validation Error", 
        description: "Please select a valid correct answer",
        variant: "destructive",
      });
      return;
    }
    
    const submissionData = {
      ...data,
      options: filteredOptions,
      correctAnswer: Math.min(data.correctAnswer, filteredOptions.length - 1)
    };
    
    console.log("Submitting cleaned data:", submissionData);
    
    try {
      await createQuestionMutation.mutateAsync(submissionData);
    } catch (error) {
      console.error("Mutation failed:", error);
      // The error will be handled by the mutation's onError callback
    }
  };

  const addOption = () => {
    if (fields.length < 4) {
      append("");
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
      // Adjust correct answer if it was pointing to a removed option
      const currentCorrect = form.getValues("correctAnswer");
      if (currentCorrect >= index && currentCorrect > 0) {
        form.setValue("correctAnswer", Math.max(0, currentCorrect - 1));
      }
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aviation-blue mx-auto mb-4"></div>
          <p className="text-professional-gray">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <CardContent className="p-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-professional-gray-dark mb-2">
              {isEditing ? "Edit Question" : "Create New Question"}
            </h2>
            <p className="text-professional-gray">
              {isEditing ? "Update the exam question details below" : "Add a new question to the exam database"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-professional-gray-dark">
                      Question Text <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the question text..."
                        rows={3}
                        {...field}
                        className="focus:ring-aviation-blue focus:border-aviation-blue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-professional-gray-dark">
                        Difficulty Level <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-aviation-blue focus:border-aviation-blue">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ML0">ML0 - Basic Maintenance</SelectItem>
                          <SelectItem value="ML1">ML1 - Line Maintenance</SelectItem>
                          <SelectItem value="ML2">ML2 - Heavy Maintenance</SelectItem>
                          <SelectItem value="ML3">ML3 - Specialized Systems</SelectItem>
                          <SelectItem value="ML4">ML4 - Advanced Systems</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-professional-gray-dark">
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Engine Systems, Electrical, Safety"
                          {...field}
                          className="focus:ring-aviation-blue focus:border-aviation-blue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-professional-gray-dark font-semibold">
                    Answer Options <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={fields.length >= 4}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>

                {fields.map((field, index) => {
                  const letter = String.fromCharCode(65 + index);
                  return (
                    <div key={field.id} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          {...form.register("correctAnswer", { valueAsNumber: true })}
                          value={index}
                          className="text-aviation-blue focus:ring-aviation-blue"
                        />
                        <span className="font-medium text-professional-gray-dark">
                          {letter}.
                        </span>
                      </div>
                      <div className="flex-1">
                        <Input
                          {...form.register(`options.${index}`)}
                          placeholder={`Option ${letter}`}
                          className="focus:ring-aviation-blue focus:border-aviation-blue"
                        />
                      </div>
                      {fields.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
                <p className="text-sm text-professional-gray">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setLocation("/admin/questions")}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-aviation-blue hover:bg-aviation-blue-dark"
                  disabled={createQuestionMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createQuestionMutation.isPending 
                    ? (isEditing ? "Updating..." : "Creating...") 
                    : (isEditing ? "Update Question" : "Create Question")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}