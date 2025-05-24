import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { AppLogo } from "@/components/shared/AppLogo";
import Link from "next/link";
import { LogIn, UserPlus, Cpu } from "lucide-react";

export default function HomePage() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      <AppLogo className="mb-8 text-5xl" iconSize={48}/>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to <span className="text-primary text-glow-primary">Crypton Nexus</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
        Dive into the future of decentralized computation. Engage in Proof-of-Work tasks, earn rewards, and climb the ranks in the digital frontier.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 w-full max-w-3xl">
        <div className="frosted-glass p-6 rounded-lg text-left">
          <Cpu className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-glow-accent">Engage & Earn</h3>
          <p className="text-sm text-muted-foreground">Solve complex PoW tasks and accumulate points.</p>
        </div>
        <div className="frosted-glass p-6 rounded-lg text-left">
          <UserPlus className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-glow-accent">Join the Network</h3>
          <p className="text-sm text-muted-foreground">Create your account and become part of the Nexus.</p>
        </div>
        <div className="frosted-glass p-6 rounded-lg text-left">
          <LogIn className="w-10 h-10 text-accent mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-glow-accent">Track Your Progress</h3>
          <p className="text-sm text-muted-foreground">Monitor your stats on your personal dashboard.</p>
        </div>
      </div>

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
