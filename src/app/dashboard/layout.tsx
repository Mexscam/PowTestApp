import { Header } from "@/components/shared/Header";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/60">
        Crypton Nexus &copy; {new Date().getFullYear()} - Secure Mining Operations
      </footer>
    </div>
  );
}
