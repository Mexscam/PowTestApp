"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Send } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Mock login function
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login attempt:", values);
    // Simulate API call
    toast({
      title: "Login Simulated",
      description: "Redirecting to dashboard...",
      variant: "default",
    });
    // In a real app, you'd handle authentication here
    // For now, just redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="user@nexus.io" 
                  {...field} 
                  className="bg-input/50 border-border/70 focus:bg-input focus:border-primary"
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
              <FormLabel className="text-foreground/80">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-input/50 border-border/70 focus:bg-input focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground text-glow-primary shadow-[0_0_10px_theme(colors.primary)]">
          <LogIn className="mr-2 h-5 w-5" /> Secure Login
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="font-medium text-accent hover:text-accent/80 text-glow-accent">
            Register here
          </Link>
        </div>
      </form>
    </Form>
  );
}
