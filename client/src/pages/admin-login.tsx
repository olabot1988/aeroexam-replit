import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type FormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store admin token (in production, use proper auth)
      localStorage.setItem("admin-token", data.token);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel.",
      });
      setLocation("/admin/questions");
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-md mx-auto">
        <CardContent className="p-0">
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-aviation-blue rounded-full flex items-center justify-center mb-4">
              <Shield className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-professional-gray-dark mb-2">
              Admin Access
            </h2>
            <p className="text-professional-gray">
              Sign in to manage exam questions
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-professional-gray-dark">
                      Username <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter username" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-professional-gray-dark">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter password" 
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
                  className="flex-1 bg-aviation-blue hover:bg-aviation-blue-dark"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
  );
}