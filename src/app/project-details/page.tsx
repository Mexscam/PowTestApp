
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import { LogIn, UserPlus, Cpu, MessageSquare, Trophy, Info, Sparkles, Users, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectDetailsPage() {
  return (
    <PageWrapper className="flex flex-col items-center text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      <div className="my-8">
        <AppLogo className="text-4xl" iconSize={40}/>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        About <span className="text-primary text-glow-primary">Crypton Nexus</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl">
        Crypton Nexus is an immersive platform where technology meets engagement. Discover a digital frontier designed for enthusiasts of decentralized computation, collaborative interaction, and competitive spirit, all wrapped in a futuristic hacker aesthetic.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
        <Card className="frosted-glass text-left">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <Cpu className="w-7 h-7 text-accent mr-3" />
              Proof-of-Work Mining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Engage your computational power by solving Proof-of-Work tasks directly in your browser. Earn points for each successfully validated block, contributing to the network and showcasing your mining prowess. The difficulty adjusts, offering a dynamic challenge.
            </p>
          </CardContent>
        </Card>

        <Card className="frosted-glass text-left">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <MessageSquare className="w-7 h-7 text-accent mr-3" />
              Global Nexus Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with fellow Nexus operatives in the real-time global chat. Share insights, discuss strategies, or simply network with other members of the community. Your identity is your username, contributing to the vibrant digital ecosystem.
            </p>
          </CardContent>
        </Card>

        <Card className="frosted-glass text-left">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <Trophy className="w-7 h-7 text-accent mr-3" />
              Leaderboard & Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Climb the ranks and etch your name on the Crypton Nexus Leaderboard. Your accumulated points and level reflect your dedication and skill. Compete for the top spot and gain recognition within the community.
            </p>
          </CardContent>
        </Card>
        
        <Card className="frosted-glass text-left md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <Sparkles className="w-7 h-7 text-accent mr-3" />
              Earn & Level Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Every task completed and every milestone achieved contributes to your points and overall level. Showcase your progress and unlock new potentials as you delve deeper into the Nexus.
            </p>
          </CardContent>
        </Card>

        <Card className="frosted-glass text-left md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <Users className="w-7 h-7 text-accent mr-3" />
              Community Focused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crypton Nexus is built around its users. From collaborative chat to competitive rankings, the platform encourages interaction and a shared sense of purpose in the digital frontier.
            </p>
          </CardContent>
        </Card>

        <Card className="frosted-glass text-left md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-glow-accent">
              <Palette className="w-7 h-7 text-accent mr-3" />
              Futuristic Aesthetic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Immerse yourself in a visually distinct environment inspired by hacker culture and cyberpunk themes. Neon glows, dark interfaces, and digital motifs create a unique atmosphere for your PoW journey.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Ready to join the Nexus? Create an account or log in to begin your adventure.
      </p>

      <div className="flex gap-4">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-glow-primary shadow-[0_0_15px_theme(colors.primary)]">
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" /> Login
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-glow-accent shadow-[0_0_15px_theme(colors.accent)]">
          <Link href="/register">
            <UserPlus className="mr-2 h-5 w-5" /> Register
          </Link>
        </Button>
      </div>
      <footer className="mt-auto pt-12">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crypton Nexus. All rights reserved.</p>
      </footer>
    </PageWrapper>
  );
}
