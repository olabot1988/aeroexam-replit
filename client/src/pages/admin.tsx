import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExamSessionSchema, continueExamSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = insertExamSessionSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  maintenanceLevel: z.enum(["ML0", "ML1", "ML2", "ML3", "ML4"], {
    required_error: "Please select a maintenance level",
  }),
  examType: z.enum(["Annual Exam", "Technical Inspector Exam", "CDR Progression Written Exam"], {
    required_error: "Please select an exam type",
  }),
  password: z.string().min(6, "Password must be 6-15 characters").max(15, "Password must be 6-15 characters"),
});

const continueFormSchema = continueExamSchema.extend({
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;
type ContinueFormData = z.infer<typeof continueFormSchema>;

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      maintenanceLevel: undefined,
      examType: undefined,
      password: "",
    },
  });

  const continueForm = useForm<ContinueFormData>({
    resolver: zodResolver(continueFormSchema),
    defaultValues: {
      lastName: "",
      password: "",
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/exam/create", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Your exam session has been created.",
      });
      setLocation(`/exam-intro/${data.sessionKey}`);
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
        cleanMessage = "Registration failed. Please check your information and try again.";
      }
      
      toast({
        title: "Registration Failed",
        description: cleanMessage,
        variant: "destructive",
      });
    },
  });

  const continueExamMutation = useMutation({
    mutationFn: async (data: ContinueFormData) => {
      const response = await apiRequest("POST", "/api/exam/continue", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Session Restored",
        description: "Your previous exam session has been restored.",
      });
      setLocation(`/examination/${data.sessionKey}`);
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
        cleanMessage = "No active exam found with those credentials.";
      }
      
      toast({
        title: "Session Not Found",
        description: cleanMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createExamMutation.mutate(data);
  };

  const onContinueSubmit = (data: ContinueFormData) => {
    continueExamMutation.mutate(data);
  };

  const getMaintenanceLevelDescription = (level: string) => {
    const descriptions = {
      'ML0': 'Basic Maintenance',
      'ML1': 'Line Maintenance',
      'ML2': 'Heavy Maintenance',
      'ML3': 'Specialized Systems',
      'ML4': 'Advanced Systems'
    };
    return descriptions[level as keyof typeof descriptions] || '';
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white/90 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-professional-gray-light mb-2">
              <span>Step 1 of 3</span>
              <span>Registration</span>
            </div>
            <Progress value={33} className="w-full" />
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
              Candidate Registration
            </h2>
            <p className="text-slate-600">
              Enter your details to start or resume your maintenance exam session
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-lg mx-auto">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
              <TabsTrigger value="new">New Exam</TabsTrigger>
              <TabsTrigger value="continue">Continue Exam</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new" className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-professional-gray-dark">
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter first name" 
                              {...field}
                              className="focus:ring-aviation-blue focus:border-aviation-blue"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-professional-gray-dark">
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter last name" 
                              {...field}
                              className="focus:ring-aviation-blue focus:border-aviation-blue"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="maintenanceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-professional-gray-dark">
                          Maintenance Level <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-aviation-blue focus:border-aviation-blue">
                              <SelectValue placeholder="Select maintenance level" />
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
                    name="examType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-professional-gray-dark">
                          Exam Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-aviation-blue focus:border-aviation-blue">
                              <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Annual Exam">Annual Exam</SelectItem>
                            <SelectItem value="Technical Inspector Exam">Technical Inspector Exam</SelectItem>
                            <SelectItem value="CDR Progression Written Exam">CDR Progression Written Exam</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-professional-gray-dark">
                          Password (6-15 characters) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter password for later access" 
                            {...field}
                            className="focus:ring-aviation-blue focus:border-aviation-blue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700"
                      disabled={createExamMutation.isPending}
                    >
                      {createExamMutation.isPending ? "Creating..." : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="continue" className="space-y-6">
              <Form {...continueForm}>
                <form onSubmit={continueForm.handleSubmit(onContinueSubmit)} className="space-y-6">
                  <FormField
                    control={continueForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-professional-gray-dark">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your last name" 
                            {...field}
                            className="focus:ring-aviation-blue focus:border-aviation-blue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={continueForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-professional-gray-dark">
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter your exam password" 
                            {...field}
                            className="focus:ring-aviation-blue focus:border-aviation-blue"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 pt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700"
                      disabled={continueExamMutation.isPending}
                    >
                      {continueExamMutation.isPending ? "Loading..." : "Continue Exam"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
