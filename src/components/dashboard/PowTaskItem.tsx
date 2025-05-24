import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, AlertTriangle, Hammer } from "lucide-react";

export interface PoWTask {
  id: string;
  name: string;
  description: string;
  reward: number;
  difficultyTarget: string;
  status: 'available' | 'in_progress' | 'completed';
}

interface PowTaskItemProps {
  task: PoWTask;
}

export function PowTaskItem({ task }: PowTaskItemProps) {
  const getStatusBadgeVariant = () => {
    switch (task.status) {
      case 'available': return 'outline';
      case 'in_progress': return 'secondary';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'available': return <Zap className="h-4 w-4 mr-1 text-yellow-400" />;
      case 'in_progress': return <Hammer className="h-4 w-4 mr-1 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 mr-1 text-green-400" />;
      default: return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <Card className="frosted-glass hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-primary text-glow-primary">{task.name}</CardTitle>
          <Badge variant={getStatusBadgeVariant()} className="capitalize flex items-center">
            {getStatusIcon()}
            {task.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground font-mono text-xs pt-1">Target: {task.difficultyTarget}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 mb-3">{task.description}</p>
        <p className="text-sm font-semibold text-accent text-glow-accent">Reward: {task.reward} Points</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-glow-primary shadow-[0_0_8px_theme(colors.primary)]" 
          disabled={task.status !== 'available'}
        >
          <Hammer className="mr-2 h-4 w-4" /> Start Mining
        </Button>
      </CardFooter>
    </Card>
  );
}
