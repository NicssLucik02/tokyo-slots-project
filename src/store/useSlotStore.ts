import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SlotStore {
  balance: number;
  currentBet: string;
  spinBet: number;
  spinToken: number;
  reelStops: number[];
  isSpinning: boolean;
  lastWin: number | null;
  gameResult: 'idle' | 'win' | 'lose' | null;
  jackpot: number;
  

  handleChangeBet: (amount: string) => void;
  applyWin: (winAmount: number) => void;
  startSpin: (outcome?: number[]) => void;
  finishSpin: (winAmount: number) => void;
  computeWinFromReels: (reels: number[]) => number;
  handleChangeSpinStatus: (state: boolean) => void;
  handleIncrementBet: () => void;
  handleDecrementBet: () => void;
  handleStartSpin: () => void;
  handleCloseBetResult: () => void;
}

export const useSlotStore = create<SlotStore>()(
  persist(
    (set, get) => ({
      balance: 1000,
      currentBet: '',
      spinBet: 0,
      spinToken: 0,
      reelStops: [0, 0, 0, 0],
      isSpinning: false,
      lastWin: null,
      gameResult: 'idle',
      jackpot: 0,

      handleChangeBet: (amount: string) => set({ currentBet: amount }),

      applyWin: (winAmount: number) => {
        set({
          balance: get().balance + winAmount,
          lastWin: winAmount,
        });
      },
      
    startSpin: (outcome?: number[]) => {
      const reelsCount = 4;
      const symbolsCount = 6;
      const stops = outcome && outcome.length === reelsCount
        ? outcome.map(n => Math.abs(n) % symbolsCount)
        : Array.from({ length: reelsCount }, () => Math.floor(Math.random() * symbolsCount));

        set({
          spinToken: Date.now(),
          reelStops: stops,
        });
      },

      finishSpin: (winAmount: number) => {
        
        if (winAmount > 0) {
          get().applyWin(winAmount);
        } else {
          set({ lastWin: 0 });
        }
        set({
          gameResult: winAmount > 0 ? 'win' : 'lose',
          isSpinning: false,
          spinBet: 0,
        });
      },

      computeWinFromReels: (reels: number[]) => {
        const bet = get().spinBet || Number(get().currentBet);
        if (!Array.isArray(reels) || reels.length !== 4 || bet <= 0) return 0;

        const sevenIndex = 0;
        const allEqual = reels.every(r => r === reels[0]);

        if (allEqual && reels[0] === sevenIndex) return bet * 100;
        if (reels[0] === sevenIndex && reels[1] === sevenIndex && reels[2] === sevenIndex) return bet * 20;

        const freq: Record<number, number> = {};
        for (const r of reels) freq[r] = (freq[r] ?? 0) + 1;

        const maxCount = Math.max(...Object.values(freq));
        if (maxCount >= 3) return bet * 5;
        if (maxCount >= 2) return bet * 1.5;

        return 0;
      },

      handleStartSpin: () => {
       const bet = Number(get().currentBet);
       if (!bet || bet > get().balance || get().isSpinning || bet <= 0) return;

        set({
          isSpinning: true,
          reelStops: [],
          balance: get().balance - bet,
          spinBet: bet,
          lastWin: null,
          gameResult: 'idle',
        });

        get().startSpin();
      },

      handleIncrementBet: () => set({ currentBet: (Number(get().currentBet) + 50).toString() }),

      handleDecrementBet: () => {
        const currentBet = Number(get().currentBet);
        const nextBet = Math.max(0, currentBet - 50);
        set({ currentBet: nextBet.toString() });
      },

      handleChangeSpinStatus: (state: boolean) => set({ isSpinning: state }),
      
      handleCloseBetResult: () => set({ gameResult: 'idle', lastWin: null }),
    }),

    {
      name: 'slot-store',
      partialize: (state) => ({
        balance: state.balance,
        jackpot: state.jackpot,
      }),
    }
  )
);
