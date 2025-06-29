// src/utils/processingSimulator.ts
export const simulateProcessingStep = async (
  stepName: string,
  duration: number,
  onProgress: (progress: number) => void
): Promise<void> => {
  const interval = duration / 100;
  
  for (let i = 0; i <= 100; i++) {
    onProgress(i);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
};