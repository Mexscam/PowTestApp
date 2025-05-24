
'use server';

import type { PoWTask, MiningResult, MiningHistory } from '@/lib/types';

// Mock database for mining history (in a real app, use a proper DB)
const MOCK_MINING_HISTORY: MiningHistory[] = [];

export async function submitPowResult(
  taskId: string,
  userId: string, // Assume userId is available (e.g., from session)
  result: MiningResult,
  task: PoWTask // Pass the original task for validation
): Promise<{ success: boolean; message: string; historyEntry?: MiningHistory, pointsAwarded?: number }> {
  console.log('[Server Action] submitPowResult called with:', { taskId, userId, result, task });

  // **IMPORTANT SECURITY STEP: Server-side validation**
  // 1. Verify the task exists and is available/assigned to this user.
  // 2. Re-calculate the hash on the server using task.dataToHash and result.solutionNonce.
  //    `const expectedHash = SHA256(`${task.dataToHash}${result.solutionNonce}`).toString();`
  // 3. Check if `expectedHash` matches `result.finalHash`.
  // 4. Check if `expectedHash` meets the `task.difficulty` criteria (e.g., startsWith '0'.repeat(task.difficulty)).
  // This prevents users from submitting fake results.

  // For this simulation, we'll assume the client is honest.
  const isValid = result.finalHash.startsWith('0'.repeat(task.difficulty)); // Simplified validation

  if (isValid) {
    const pointsAwarded = task.reward;
    const historyEntry: MiningHistory = {
      id: `hist-${Date.now()}`,
      userId,
      taskId,
      result: 'success',
      hashFound: result.finalHash,
      nonceUsed: result.solutionNonce,
      timeTakenSeconds: result.timeTaken,
      pointsEarned: pointsAwarded,
      timestamp: new Date(),
    };
    MOCK_MINING_HISTORY.push(historyEntry);

    // In a real app:
    // 1. Update PoWTask status to 'completed', store solutionNonce, completedBy, etc.
    // 2. Update User points and level.
    // 3. Save MiningHistory entry to the database.
    // All these operations should ideally be in a database transaction.

    console.log('[Server Action] PoW Result VALIDATED and accepted for task:', taskId, 'Points awarded:', pointsAwarded);
    return { success: true, message: `Task ${task.name} completed! ${pointsAwarded} points awarded.`, historyEntry, pointsAwarded };
  } else {
    console.log('[Server Action] PoW Result INVALID for task:', taskId);
    const historyEntry: MiningHistory = {
      id: `hist-${Date.now()}`,
      userId,
      taskId,
      result: 'failure',
      timeTakenSeconds: result.timeTaken,
      pointsEarned: 0,
      timestamp: new Date(),
    };
    MOCK_MINING_HISTORY.push(historyEntry);
    return { success: false, message: 'Submitted hash is invalid or does not meet difficulty.' };
  }
}
