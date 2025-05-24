"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Mock registration function
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Registration attempt:", values);
    // Simulate API call
    toast({
      title: "Registration Simulated",
      description: "Account created successfully! Redirecting to login...",
      variant: "default",
    });
    // In a real app, you'd handle registration here
    // For now, just redirect to login
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/80">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="cypher_punk" 
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
        <Button type="submit" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground text-glow-accent shadow-[0_0_10px_theme(colors.accent)]">
          <UserPlus className="mr-2 h-5 w-5" /> Create Account
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-medium text-primary hover:text-primary/80 text-glow-primary">
            Login here
          </Link>
        </div>
      </form>
    </Form>
  );
}
