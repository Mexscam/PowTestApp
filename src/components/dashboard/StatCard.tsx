import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconColorClass?: string;
}

export function StatCard({ title, value, icon: Icon, description, className, iconColorClass = "text-accent" }: StatCardProps) {
  return (
    <Card className={`frosted-glass shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary text-glow-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
