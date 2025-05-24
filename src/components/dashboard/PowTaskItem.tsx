
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, AlertTriangle, Hammer, Loader2, Play, StopCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // For visual progress
import { useToast } from "@/hooks/use-toast";
import type { PoWTask, MiningProgress, MiningResult as ClientMiningResult } from "@/lib/types";
import { startMiningSimulation } from "@/lib/pow-miner";
import { submitPowResult } from '@/app/actions/mining';

interface PowTaskItemProps {
  task: PoWTask;
  currentUserId: string; // To simulate operations for a specific user
}

export function PowTaskItem({ task, currentUserId }: PowTaskItemProps) {
  const { toast } = useToast();
  const [isMining, setIsMining] = useState(false);
  const [currentTaskStatus, setCurrentTaskStatus] = useState(task.status);
  const [miningProgress, setMiningProgress] = useState<MiningProgress | null>(null);
  const [stopMiningFunc, setStopMiningFunc] = useState<(() => void) | null>(null);

  useEffect(() => {
    setCurrentTaskStatus(task.status);
    if (task.status !== 'in_progress') {
      setIsMining(false); // Reset mining state if task status changes externally
      setMiningProgress(null);
    }
  }, [task.status]);

  const getStatusBadgeVariant = () => {
    switch (currentTaskStatus) {
      case 'available': return 'outline';
      case 'in_progress': return 'secondary';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = () => {
    if (isMining) return <Loader2 className="h-4 w-4 mr-1 text-blue-400 animate-spin" />;
    switch (currentTaskStatus) {
      case 'available': return <Zap className="h-4 w-4 mr-1 text-yellow-400" />;
      case 'in_progress': return <Hammer className="h-4 w-4 mr-1 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 mr-1 text-green-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };

  const handleStartMining = async () => {
    if (isMining || currentTaskStatus !== 'available') return;

    setIsMining(true);
    setCurrentTaskStatus('in_progress'); // Optimistically update status
    setMiningProgress({
      attempts: 0, elapsedTime: 0, hashesPerSecond: 0, lastHashChecked: "Starting...",
      statusMessage: "Initializing miner..."
    });
    
    toast({
      title: `Mining Started: ${task.name}`,
      description: `Difficulty: ${task.difficulty}. Look for hash starting with ${'0'.repeat(task.difficulty)}...`,
    });

    const cancelFunc = await startMiningSimulation(
      task,
      (progress) => {
        setMiningProgress(progress);
      },
      async (clientResult: ClientMiningResult) => { // Solution found by client
        setIsMining(false);
        setMiningProgress(prev => prev ? {...prev, statusMessage: `Solution found! Hash: ${clientResult.finalHash.substring(0,10)}... Verifying...`} : null);
        
        const serverResponse = await submitPowResult(task.id, currentUserId, clientResult, task);

        if (serverResponse.success) {
          setCurrentTaskStatus('completed');
          toast({
            title: "Mining Success!",
            description: `${serverResponse.message} Hash: ${clientResult.finalHash.substring(0,10)}...`,
            variant: "default",
          });
          // TODO: Update user points globally if possible
        } else {
          setCurrentTaskStatus('failed'); // Or back to 'available' if retryable
          toast({
            title: "Verification Failed",
            description: serverResponse.message || "The submitted hash was not valid.",
            variant: "destructive",
          });
        }
        if (stopMiningFunc) stopMiningFunc(); // Ensure any ongoing process is stopped
        setStopMiningFunc(null);
      },
      (error: Error) => { // Mining failed or cancelled on client
        setIsMining(false);
        // Only revert to 'available' if it wasn't a cancellation of an already 'in_progress' task.
        // If it was cancelled, it should remain 'in_progress' or be explicitly handled.
        if (currentTaskStatus === 'in_progress' && !error.message.includes("cancelled")) {
           setCurrentTaskStatus('failed'); 
        } else if (currentTaskStatus !== 'completed' && currentTaskStatus !== 'failed') {
           setCurrentTaskStatus('available');
        }
        toast({
          title: "Mining Stopped",
          description: error.message || "An error occurred during mining.",
          variant: "destructive",
        });
        setMiningProgress(null);
        if (stopMiningFunc) stopMiningFunc();
        setStopMiningFunc(null);
      }
    );
    setStopMiningFunc(() => cancelFunc); // Store the cancellation function
  };

  const handleStopMining = () => {
    if (stopMiningFunc) {
      stopMiningFunc(); // This will trigger the onFailure callback in startMiningSimulation with a cancellation error
      // UI updates (setIsMining(false), setMiningProgress(null), etc.) will be handled by the onFailure callback.
      toast({
        title: "Mining Cancelled",
        description: `Mining for task ${task.name} was stopped by user.`,
      });
    }
  };
  
  // Max attempts for progress bar (somewhat arbitrary, for visualization)
  // A very high number, actual completion depends on difficulty & luck
  const MAX_VISUAL_ATTEMPTS = task.difficulty <= 3 ? 500000 : 
                              task.difficulty <= 4 ? 2000000 : 5000000;


  return (
    <Card className="frosted-glass hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-primary text-glow-primary">{task.name}</CardTitle>
          <Badge variant={getStatusBadgeVariant()} className="capitalize flex items-center min-w-[100px] justify-center">
            {getStatusIcon()}
            {isMining ? "Mining..." : currentTaskStatus.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground font-mono text-xs pt-1">
          Target: {task.targetHashPrefix || '0'.repeat(task.difficulty) + '...'} | Difficulty: {task.difficulty}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80 mb-3">{task.description}</p>
        {isMining && miningProgress && (
          <div className="space-y-2 text-xs font-mono mt-2 p-3 bg-background/30 rounded-md">
            <p>H/s: <span className="text-primary">{miningProgress.hashesPerSecond}</span></p>
            <p>Attempts: <span className="text-primary">{miningProgress.attempts.toLocaleString()}</span></p>
            <p>Time: <span className="text-primary">{miningProgress.elapsedTime}s</span></p>
            <p>Last Hash: <span className="text-primary truncate block">{miningProgress.lastHashChecked.substring(0,32)}...</span></p>
            <Progress value={(miningProgress.attempts / MAX_VISUAL_ATTEMPTS) * 100} className="h-2 mt-1" />
            <p className="text-accent text-glow-accent mt-1">{miningProgress.statusMessage}</p>
          </div>
        )}
         <p className="text-sm font-semibold text-accent text-glow-accent mt-3">Reward: {task.reward} Points</p>
      </CardContent>
      <CardFooter>
        {!isMining && (
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-glow-primary shadow-[0_0_8px_theme(colors.primary)]" 
            disabled={currentTaskStatus !== 'available'}
            onClick={handleStartMining}
          >
            <Play className="mr-2 h-4 w-4" /> Start Mining
          </Button>
        )}
        {isMining && (
           <Button 
            variant="destructive"
            className="w-full" 
            onClick={handleStopMining}
          >
            <StopCircle className="mr-2 h-4 w-4" /> Stop Mining
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
