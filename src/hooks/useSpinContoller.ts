import { useState } from "react";
import { useSlotStore } from "@/src/store/useSlotStore";

export const useSpinController = () => {
  const [stops, setStops] = useState<(number | null)[]>([null, null, null, null]);
  const { computeWinFromReels, finishSpin } = useSlotStore();

  const handleStopAt = (reel: number, symbolIndex: number) => {
    setStops(prev => {
      const next = [...prev];
      next[reel] = symbolIndex;

      if (next.every(v => v !== null)) {
        const winAmount = computeWinFromReels(next as number[]);

        setTimeout(() => {
          finishSpin(winAmount);
          setStops([null, null, null, null]);
        }, 100);
      }

      return next;
    });
  };

  const reset = () => setStops([null, null, null, null]);

  return { handleStopAt, reset };
};

