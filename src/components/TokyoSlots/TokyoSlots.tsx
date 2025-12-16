'use client'
import styles from "./tokyoSlots.module.scss";
import Image from "next/image";
import { PrimaryButton } from "../UIkit/PrimaryButton/PrimaryButton";
import { InputSlots } from "../UIkit/InputSlots/InputSlots";
import { Slot } from "./Slot/Slot";
import { useSlotStore } from "@/src/store/useSlotStore";
import { BetResultModal } from "./BetResultModal/BetResultModal";
import { SpinButton } from "../UIkit/SpinButton/SpinButton";
import { gameResultTypes } from "@/types/enums";

export const TokyoSlots = () => {
  const { 
    handleChangeBet, 
    handleIncrementBet, 
    handleDecrementBet, 
    handleStartSpin, 
    gameResult 
  } = useSlotStore();
  const currentBet = useSlotStore(state => state.currentBet);
  const isSpinning = useSlotStore(state => state.isSpinning);
  const jackpot = useSlotStore(state => state.jackpot);
  
  const isDisabled = Number(currentBet) <= 0;
  
  return (
    <section className={styles.tokyoSlots}>
        <div className={styles.tokyoSlotsContainer}>
      <Slot />
        {gameResult === gameResultTypes.win || gameResult === gameResultTypes.lose ? <BetResultModal /> : null}
          <p className={styles.tokyoSlotsTitle}>PLACE A BID</p>
          <div className={styles.tokyoSlotsActions}>
            <PrimaryButton content={"-"} onClick={handleDecrementBet} disabled={isDisabled} visuallyDisabled={isSpinning} /> 
            <InputSlots bet={currentBet} handleChange={handleChangeBet} disabled={isSpinning} />
            <PrimaryButton content={"+"} onClick={handleIncrementBet} visuallyDisabled={isSpinning} />
          </div>
          
          <SpinButton 
            onClick={handleStartSpin} 
            disabled={isSpinning}
          />       
        </div>
    </section>
  );
}
