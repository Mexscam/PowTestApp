
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLogo } from "./AppLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, UserCircle, Settings, ShieldCheck, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  // Mock user data - in a real app, this would come from auth context/state
  const isAuthenticated = true; // Assume user is logged in for dashboard header
  const userName = "CypherUser"; // This should ideally come from user session
  const userEmail = "cypher@nexus.io"; // This should ideally come from user session

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Simulate logout and redirect
    // In a real app, you would clear session/token here
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <AppLogo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-foreground/80 hover:text-primary hover:bg-primary/10 px-2 sm:px-3">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-1 sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-foreground/80 hover:text-primary hover:bg-primary/10 px-2 sm:px-3">
            <Link href="/dashboard/ranking">
              <Trophy className="mr-1 sm:mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Ranking</span>
            </Link>
          </Button>
          {/* Add more nav links here if needed */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary">
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${userName.substring(0,1)}`} alt={userName} data-ai-hint="abstract avatar" />
                    <AvatarFallback className="bg-primary text-primary-foreground">{userName.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 frosted-glass" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-glow-primary">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4 text-accent" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4 text-accent" />
                  <span>Settings</span>
                </DropdownMenuItem>
                 <DropdownMenuItem>
                  <ShieldCheck className="mr-2 h-4 w-4 text-accent" />
                  <span>Security Log</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:!text-red-400 hover:!bg-red-500/20 focus:!bg-red-500/20 focus:!text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-glow-primary">
                <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
