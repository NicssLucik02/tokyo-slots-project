import { SlotStore } from "@/types/types";
import { gameResultTypes } from "@/types/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { slotActions } from "./slotStore/actions";

export const useSlotStore = create<SlotStore>()(
  persist(
    (set, get, store) => ({
      balance: 1000,
      currentBet: '',
      spinBet: 0,
      spinToken: 0,
      reelStops: [0, 0, 0, 0],
      isSpinning: false,
      lastWin: null,
      gameResult: gameResultTypes.idle,
      jackpot: 0,

      ...slotActions(set, get, store),
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
