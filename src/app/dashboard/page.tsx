
import { PageWrapper } from "@/components/shared/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { PowTaskItem } from "@/components/dashboard/PowTaskItem";
import type { PoWTask } from "@/lib/types"; // Updated import
import { Cpu, Zap, Target, ListChecks, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would be fetched from a database
const mockUserStats = {
  id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", // Valid UUID for CypherUser
  username: "CypherUser",
  points: 12500,
  level: 7, // Added from User type
  difficultyContribution: 7, // Renamed for clarity, represents user's typical mining difficulty
  hashesResolvedAllTime: 782391, // More descriptive
  activeMinersInShard: 42, 
};

const mockPowTasks: PoWTask[] = [
  { 
    id: 'task1', 
    name: 'Alpha Block Verification', 
    description: 'Verify transaction batch #A4F2 using SHA-256 variant.', 
    reward: 100, 
    difficulty: 3, // Numerical difficulty
    targetHashPrefix: '000xxx...', 
    dataToHash: 'alpha_block_A4F2_data_payload', // Example data
    status: 'available',
    createdAt: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  { 
    id: 'task2', 
    name: 'Sigma Data Chain', 
    description: 'Mine the next link in the Sigma data integrity chain. Requires Scrypt algorithm (simulated as SHA-256).', 
    reward: 250, 
    difficulty: 4, // Numerical difficulty
    targetHashPrefix: '0000xx...',
    dataToHash: 'sigma_chain_link_integrity_check_v3',
    status: 'in_progress', // Could be assigned to current user
    assignedTo: mockUserStats.id,
    createdAt: new Date(Date.now() - 3600000 * 1) // 1 hour ago
  },
  { 
    id: 'task3', 
    name: 'Genesis Contract Audit', 
    description: 'Perform computational audit on Genesis smart contract parameters. Ethash variant (simulated as SHA-256).', 
    reward: 50, 
    difficulty: 2, // Numerical difficulty
    targetHashPrefix: '00xxxx...',
    dataToHash: 'genesis_contract_audit_params_secure_hash',
    status: 'completed',
    completedBy: mockUserStats.id,
    solutionNonce: "12345",
    timeToSolve: 120, // seconds
    createdAt: new Date(Date.now() - 3600000 * 5) // 5 hours ago
  },
  { 
    id: 'task4', 
    name: 'Quantum Resilience Test', 
    description: 'Stress test network with quantum-resistant hash functions (simulated as SHA-256).', 
    reward: 500, 
    difficulty: 5, // Numerical difficulty. Note: 5 can be very slow for JS SHA256.
    targetHashPrefix: '00000x...',
    dataToHash: 'quantum_test_data_high_entropy_stream',
    status: 'available',
    createdAt: new Date(Date.now() - 3600000 * 0.5) // 30 mins ago
  },
];


export default function DashboardPage() {
  // In a real app, userName would come from session/auth context
  const userName = mockUserStats.username;

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
          description={`Level ${mockUserStats.level}`}
          iconColorClass="text-yellow-400"
        />
        <StatCard 
          title="Typical Difficulty" 
          value={mockUserStats.difficultyContribution} 
          icon={Target} 
          description="Network Avg: 6.5" // This would be dynamic
          iconColorClass="text-red-400"
        />
        <StatCard 
          title="Hashes Resolved (All Time)" 
          value={mockUserStats.hashesResolvedAllTime.toLocaleString()} 
          icon={Cpu} 
          description="Session Peak: 1.2M H/s" // This would be dynamic
          iconColorClass="text-blue-400"
        />
         <StatCard 
          title="Active Miners (Shard)" 
          value={mockUserStats.activeMinersInShard} 
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
        {mockPowTasks.filter(task => task.status === 'available' || (task.status === 'in_progress' && task.assignedTo === mockUserStats.id)).length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPowTasks
              .filter(task => task.status === 'available' || (task.status === 'in_progress' && task.assignedTo === mockUserStats.id))
              .map((task) => (
              // Pass the current user ID for context, though it's mocked here
              <PowTaskItem key={task.id} task={task} currentUserId={mockUserStats.id} />
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
