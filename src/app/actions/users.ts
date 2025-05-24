
'use server';

import { getDbConnection, mapDbUserToSafeUser } from '@/lib/db';
import type { User } from '@/lib/types';

export interface RankedUser {
  rank: number;
  id: string;
  username: string;
  points: number;
  level: number;
}

export interface UserStats extends Omit<User, 'passwordHash' | 'email' | 'createdAt' | 'updatedAt'> {
  // Add any other specific stats you want to display beyond basic User fields
  // For now, it's mostly a subset of the User type
  difficultyContribution?: number; // Example, if you track this per user
  hashesResolvedAllTime?: number; // Example
  activeMinersInShard?: number; // Example, likely a global or shard-specific stat
}

export async function getRankedUsers(): Promise<RankedUser[]> {
  try {
    const db = await getDbConnection();
    // Fetch necessary fields, order by points DESC, then level DESC, then username ASC for tie-breaking
    const usersFromDb = await db.all<Pick<User, 'id' | 'username' | 'points' | 'level' >[]>(
      'SELECT id, username, points, level FROM users ORDER BY points DESC, level DESC, username ASC'
    );

    if (!usersFromDb) {
      return [];
    }

    return usersFromDb.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('[Server Action] Error fetching ranked users:', error);
    return []; // Return empty array on error
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!userId) {
    console.warn('[Server Action] getUserStats called without userId');
    return null;
  }
  try {
    const db = await getDbConnection();
    const userRow = await db.get<User>(
      'SELECT id, username, points, level FROM users WHERE id = ?',
      userId
    );

    if (!userRow) {
      console.log(`[Server Action] getUserStats: User not found for ID ${userId}`);
      return null;
    }

    // Map to UserStats, you can add more complex logic or derived stats here
    const userStats: UserStats = {
      id: userRow.id,
      username: userRow.username,
      points: userRow.points,
      level: userRow.level,
      // These are illustrative; you'd fetch/calculate these if they were real stats
      difficultyContribution: 7, // Mocked for now
      hashesResolvedAllTime: userRow.points * 62, // Mock calculation based on points
      activeMinersInShard: 42, // Mocked for now
    };
    return userStats;

  } catch (error) {
    console.error(`[Server Action] Error fetching user stats for ID ${userId}:`, error);
    return null;
  }
}
