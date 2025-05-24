import type React from 'react';
import { AppLogo } from './AppLogo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="mb-8">
        <AppLogo />
      </div>
      <Card className="w-full max-w-md frosted-glass shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary text-glow-primary">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
      <footer className="mt-8">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crypton Nexus</p>
      </footer>
    </div>
  );
}
