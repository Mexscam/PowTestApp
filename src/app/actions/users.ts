
'use server';

import { getDbConnection } from '@/lib/db';
import type { User } from '@/lib/types';

export interface RankedUser {
  rank: number;
  id: string;
  username: string;
  points: number;
  level: number;
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
