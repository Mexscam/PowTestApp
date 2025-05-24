
import { PageWrapper } from "@/components/shared/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { PowTaskItem } from "@/components/dashboard/PowTaskItem";
import type { PoWTask, User } from "@/lib/types";
import { Cpu, Zap, Target, ListChecks, Activity, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getUserStats, type UserStats } from "@/app/actions/users"; // Import UserStats type and getUserStats action

// Mocked Current User ID - in a real app, this would come from auth context
const MOCKED_CURRENT_USER_ID = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"; // CypherUser's UUID

const mockPowTasks: PoWTask[] = [
  { 
    id: 'task1', 
    name: 'Alpha Block Verification', 
    description: 'Verify transaction batch #A4F2 using SHA-256 variant.', 
    reward: 100, 
    difficulty: 3,
    targetHashPrefix: '000xxx...', 
    dataToHash: 'alpha_block_A4F2_data_payload',
    status: 'available',
    createdAt: new Date(Date.now() - 3600000 * 2) 
  },
  { 
    id: 'task2', 
    name: 'Sigma Data Chain', 
    description: 'Mine the next link in the Sigma data integrity chain.', 
    reward: 250, 
    difficulty: 4,
    targetHashPrefix: '0000xx...',
    dataToHash: 'sigma_chain_link_integrity_check_v3',
    status: 'available',
    createdAt: new Date(Date.now() - 3600000 * 1) 
  },
   { 
    id: 'task4', 
    name: 'Quantum Resilience Test', 
    description: 'Stress test network with quantum-resistant hash functions.', 
    reward: 500, 
    difficulty: 5, 
    targetHashPrefix: '00000x...',
    dataToHash: 'quantum_test_data_high_entropy_stream',
    status: 'available',
    createdAt: new Date(Date.now() - 3600000 * 0.5)
  },
];


export default async function DashboardPage() {
  const userStats: UserStats | null = await getUserStats(MOCKED_CURRENT_USER_ID);

  if (!userStats) {
    return (
      <PageWrapper className="space-y-8 flex flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold text-destructive">Error Fetching User Data</h1>
        <p className="text-muted-foreground">Could not load dashboard. Please try again later.</p>
      </PageWrapper>
    );
  }

  const userName = userStats.username;

  return (
    <PageWrapper className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-primary text-glow-primary">{userName}</span>!
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          NODE_STATUS: <span className="text-green-400">ONLINE</span> | SYNC: <span className="text-green-400">100%</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Points" 
          value={userStats.points.toLocaleString()} 
          icon={Zap} 
          description={`Level ${userStats.level}`}
          iconColorClass="text-yellow-400"
        />
        <StatCard 
          title="Typical Difficulty" 
          value={userStats.difficultyContribution || 5} // Default if undefined
          icon={Target} 
          description="User Avg." 
          iconColorClass="text-red-400"
        />
        <StatCard 
          title="Hashes Resolved (Est.)" 
          value={userStats.hashesResolvedAllTime?.toLocaleString() || 'N/A'} 
          icon={Cpu} 
          description="Session Peak: 1.2M H/s" 
          iconColorClass="text-blue-400"
        />
         <StatCard 
          title="Active Miners (Shard)" 
          value={userStats.activeMinersInShard || 0} 
          icon={Activity} 
          description="On this shard"
          iconColorClass="text-green-400"
        />
      </div>

      <Separator className="my-8 bg-border/50" />

      <div>
        <div className="flex items-center mb-6">
          <ListChecks className="h-7 w-7 text-accent mr-3" />
          <h2 className="text-2xl font-semibold text-glow-accent">Available Proof-of-Work Tasks</h2>
        </div>
        {mockPowTasks.filter(task => task.status === 'available' || (task.status === 'in_progress' && task.assignedTo === userStats.id)).length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPowTasks
              .filter(task => task.status === 'available' || (task.status === 'in_progress' && task.assignedTo === userStats.id))
              .map((task) => (
              <PowTaskItem key={task.id} task={task} currentUserId={userStats.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 frosted-glass rounded-lg">
            <Cpu className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Tasks Available</h3>
            <p className="text-muted-foreground">Check back later for new mining opportunities.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
