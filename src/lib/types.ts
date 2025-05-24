
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // In a real app, this would be stored securely
  points: number;
  level: number; // e.g., based on points
  createdAt: Date;
  updatedAt: Date;
}

export interface PoWTask {
  id: string;
  name: string;
  description: string;
  reward: number;
  difficulty: number; // Number of leading zeros required
  targetHashPrefix?: string; // Descriptive, e.g., "000xxx..."
  dataToHash: string; // The base data string to which nonce will be appended
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  assignedTo?: string | null; // User ID if assigned
  completedBy?: string | null; // User ID if completed
  solutionNonce?: string | null;
  timeToSolve?: number | null; // in seconds
}

export interface MiningHistory {
  id: string;
  userId: string;
  taskId: string;
  result: 'success' | 'failure' | 'timeout';
  hashFound?: string;
  nonceUsed?: string;
  timeTakenSeconds: number;
  pointsEarned: number;
  timestamp: Date;
}

// For client-side mining simulation
export interface MiningProgress {
  hashesPerSecond: number;
  lastHashChecked: string;
  attempts: number;
  elapsedTime: number; // in seconds
  statusMessage: string;
}

export interface MiningResult {
  solutionNonce: string;
  finalHash: string;
  attempts: number;
  timeTaken: number; // in seconds
}
