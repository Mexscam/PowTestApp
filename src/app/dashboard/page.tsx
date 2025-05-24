import { PageWrapper } from "@/components/shared/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { PowTaskItem, type PoWTask } from "@/components/dashboard/PowTaskItem";
import { Cpu, Zap, Target, ListChecks, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would be fetched
const mockUserStats = {
  points: 12500,
  difficulty: 7,
  hashesResolved: 782391,
  activeMiners: 42, // Example additional stat
};

const mockPowTasks: PoWTask[] = [
  { id: 'task1', name: 'Alpha Block Verification', description: 'Verify transaction batch #A4F2 using SHA-256 variant.', reward: 100, difficultyTarget: '000xxx...', status: 'available' },
  { id: 'task2', name: 'Sigma Data Chain', description: 'Mine the next link in the Sigma data integrity chain. Requires Scrypt algorithm.', reward: 250, difficultyTarget: '0000xx...', status: 'in_progress' },
  { id: 'task3', name: 'Genesis Contract Audit', description: 'Perform computational audit on Genesis smart contract parameters. Ethash variant.', reward: 50, difficultyTarget: '00xxxx...', status: 'completed' },
  { id: 'task4', name: 'Quantum Resilience Test', description: 'Stress test network with quantum-resistant hash functions.', reward: 500, difficultyTarget: '00000x...', status: 'available' },
];

// Mock user data
const userName = "CypherUser";

export default function DashboardPage() {
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
          value={mockUserStats.points.toLocaleString()} 
          icon={Zap} 
          description="+20% this month"
          iconColorClass="text-yellow-400"
        />
        <StatCard 
          title="Current Difficulty" 
          value={mockUserStats.difficulty} 
          icon={Target} 
          description="Network Average: 6.5"
          iconColorClass="text-red-400"
        />
        <StatCard 
          title="Hashes Resolved" 
          value={mockUserStats.hashesResolved.toLocaleString()} 
          icon={Cpu} 
          description="Session Peak: 1.2M H/s"
          iconColorClass="text-blue-400"
        />
         <StatCard 
          title="Active Miners" 
          value={mockUserStats.activeMiners} 
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
        {mockPowTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPowTasks.map((task) => (
              <PowTaskItem key={task.id} task={task} />
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
