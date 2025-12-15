export const calculateWin = (reels: number[], bet: number): number => {
  if (!Array.isArray(reels) || reels.length !== 4 || bet <= 0) {
    return 0;
  }

  const SEVEN_INDEX = 0;

  const allEqual = reels.every((r) => r === reels[0]);
  if (allEqual && reels[0] === SEVEN_INDEX) {
    return bet * 100;
  }

  if (
    reels[0] === SEVEN_INDEX &&
    reels[1] === SEVEN_INDEX &&
    reels[2] === SEVEN_INDEX
  ) {
    return bet * 20;
  }

  const freq: Record<number, number> = {};
  for (const r of reels) {
    freq[r] = (freq[r] ?? 0) + 1;
  }

  const maxCount = Math.max(...Object.values(freq));

  if (maxCount >= 3) return bet * 5;
  if (maxCount >= 2) return bet * 1.5;

  return 0;
};