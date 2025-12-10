import { useCallback } from 'react';
import { useSlotStore } from '../store/useSlotStore';

const SYMBOLS_COUNT = 6;

export const useSlotLogic = () => {
  const {
    balance,
    currentBet,
    isSpinning,
    startSpin
  } = useSlotStore();

  const handleStartSpin = useCallback((forcedOutcome?: number[]) => {
    const betValue = Number(currentBet);

    if (!betValue || betValue <= 0) return false;
    if (betValue > balance) return false;
    if (isSpinning) return false;

    const stops = forcedOutcome
      ? forcedOutcome.map(n => Math.abs(n) % SYMBOLS_COUNT)
      : Array.from({ length: 4 }, () => Math.floor(Math.random() * SYMBOLS_COUNT));

    startSpin(stops);

    return true;
  }, [currentBet, balance, isSpinning, startSpin]);

  return {
    handleStartSpin,
  };
};