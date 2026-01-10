import { gameResultTypes } from "./enums";

export interface SlotStore {
  balance: number;
  currentBet: string;
  spinBet: number;
  spinToken: number;
  reelStops: number[];
  isSpinning: boolean;
  lastWin: number | null;
  gameResult: gameResultTypes;
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
