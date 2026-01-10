import { GAME_CONSTANTS } from '@/src/constants/gameConstants';
import { calculateWin } from '@/src/utils/calculateWin';
import { SlotStore } from '@/types/types';
import { StateCreator } from 'zustand';
import { gameResultTypes } from '@/types/enums';

type SlotActions = Pick<
  SlotStore,
  | 'handleChangeBet'
  | 'applyWin'
  | 'startSpin'
  | 'finishSpin'
  | 'computeWinFromReels'
  | 'handleStartSpin'
  | 'handleIncrementBet'
  | 'handleDecrementBet'
  | 'handleChangeSpinStatus'
  | 'handleCloseBetResult'
>;

export const slotActions: StateCreator<SlotStore, [], [], SlotActions> = (set, get) => ({
  handleChangeBet: (amount: string) => {
    const n = Number(amount);
    if (!Number.isFinite(n)) {
      set({ currentBet: '' });
      return;
    }
    const next = Math.max(1, n);
    set({ currentBet: String(next) });
  },

  applyWin: (winAmount: number) => {
    set({
      balance: get().balance + winAmount,
      lastWin: winAmount,
    });
  },

  startSpin: (outcome?: number[]) => {
    const { REELS_COUNT, SYMBOLS_COUNT } = GAME_CONSTANTS;

    const stops =
      outcome && outcome.length === REELS_COUNT
        ? outcome.map((n) => Math.abs(n) % SYMBOLS_COUNT)
        : Array.from({ length: REELS_COUNT }, () => Math.floor(Math.random() * SYMBOLS_COUNT));

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
      gameResult: winAmount > 0 ? gameResultTypes.win : gameResultTypes.lose,
      isSpinning: false,
      spinBet: 0,
    });
  },

  computeWinFromReels: (reels: number[]) => {
    const bet = get().spinBet || Number(get().currentBet);
    const win = calculateWin(reels, bet);
    const seven = 0;
    if (reels[0] === seven && reels[1] === seven && reels[2] === seven) {
      set({ jackpot: get().jackpot + win });
    }
    return win;
  },

  handleStartSpin: () => {
    const bet = Number(get().currentBet);
    const { balance, isSpinning } = get();

    if (!bet || bet > balance || isSpinning || bet <= 0) return;

    set({
      isSpinning: true,
      reelStops: [],
      balance: balance - bet,
      spinBet: bet,
      lastWin: null,
      gameResult: gameResultTypes.idle,
    });

    get().startSpin();
  },

  handleIncrementBet: () =>
    set((state) => {
      const current = Number(state.currentBet) || 0;
      const next = Math.min(get().balance, current + GAME_CONSTANTS.BET_STEP);
      return { currentBet: String(next) };
    }),

  handleDecrementBet: () =>
    set((state) => {
      const current = Number(state.currentBet) || 0;
      const next = Math.max(0, current - GAME_CONSTANTS.BET_STEP);
      return { currentBet: String(next) };
    }),

  handleChangeSpinStatus: (state: boolean) => set({ isSpinning: state }),

  handleCloseBetResult: () => set({ gameResult: gameResultTypes.idle, lastWin: null }),
});
