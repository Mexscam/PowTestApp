
'use client';

import SHA256 from 'crypto-js/sha256';
import type { PoWTask, MiningProgress, MiningResult } from './types';

const HASH_REPORT_INTERVAL = 100; // Report progress every N hashes
const YIELD_INTERVAL = 250; // Yield to event loop every N hashes to prevent freezing (reduced from 500 for "lighter" feel)

export async function startMiningSimulation(
  task: PoWTask,
  onProgress: (progress: MiningProgress) => void,
  onCompletion: (result: MiningResult) => void,
  onFailure: (error: Error) => void
): Promise<() => void> {
  let nonce = 0;
  let attempts = 0;
  const startTime = Date.now();
  const targetPrefix = '0'.repeat(task.difficulty);
  const baseDataToHash = task.dataToHash || `${task.id}_${task.name}`; // Use provided data or construct
  let isCancelled = false;
  let lastReportTime = startTime;
  let hashesSinceLastReport = 0;

  onProgress({
    hashesPerSecond: 0,
    lastHashChecked: '',
    attempts: 0,
    elapsedTime: 0,
    statusMessage: `Starting to mine for task: ${task.name} (Difficulty: ${task.difficulty})`,
  });

  async function mine() {
    if (isCancelled) {
      onFailure(new Error('Mining operation cancelled.'));
      return;
    }

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (isCancelled) {
          onFailure(new Error('Mining operation cancelled during loop.'));
          return;
        }

        attempts++;
        nonce++; // In a real scenario, nonce might start randomly or be managed differently
        hashesSinceLastReport++;

        const currentTryString = `${baseDataToHash}${nonce}`;
        const hash = SHA256(currentTryString).toString();

        if (attempts % YIELD_INTERVAL === 0) {
          // Yield to event loop to prevent UI freezing
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        const currentTime = Date.now();
        if (hashesSinceLastReport >= HASH_REPORT_INTERVAL || currentTime - lastReportTime > 1000 ) { // Report at least once per second or per interval
          const elapsedTimeTotal = (currentTime - startTime) / 1000;
          const hashesPerSecondTotal = elapsedTimeTotal > 0 ? Math.round(attempts / elapsedTimeTotal) : 0;
          
          const intervalTime = (currentTime - lastReportTime) / 1000;
          const hashesPerSecondInterval = intervalTime > 0 ? Math.round(hashesSinceLastReport / intervalTime) : hashesPerSecondTotal;

          onProgress({
            hashesPerSecond: hashesPerSecondInterval,
            lastHashChecked: hash,
            attempts,
            elapsedTime: parseFloat(elapsedTimeTotal.toFixed(2)),
            statusMessage: `Mining... Attempt: ${attempts}, H/s: ${hashesPerSecondInterval}`,
          });
          lastReportTime = currentTime;
          hashesSinceLastReport = 0;
        }

        if (hash.startsWith(targetPrefix)) {
          const timeTaken = (Date.now() - startTime) / 1000;
          onCompletion({
            solutionNonce: nonce.toString(),
            finalHash: hash,
            attempts,
            timeTaken: parseFloat(timeTaken.toFixed(2)),
          });
          return;
        }
      }
    } catch (error) {
      console.error("Mining error:", error);
      onFailure(error instanceof Error ? error : new Error('Unknown mining error'));
    }
  }

  mine(); // Start the asynchronous mining process

  // Return a cancellation function
  return () => {
    isCancelled = true;
    console.log('Mining cancellation requested.');
  };
}
