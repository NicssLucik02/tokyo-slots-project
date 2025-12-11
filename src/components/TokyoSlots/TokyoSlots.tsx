'use client'
import styles from "./tokyoSlots.module.scss";
import { PrimaryButton } from "../UIkit/PrimaryButton/PrimaryButton";
import { InputSlots } from "../UIkit/InputSlots/InputSlots";
import { Slot } from "./Slot/Slot";
import { useSlotStore } from "@/src/store/useSlotStore";
import { BetResultModal } from "./BetResultModal/BetResultModal";
import { SpinButton } from "../UIkit/SpinButton/SpinButton";

export const TokyoSlots = () => {
  const {
    handleChangeBet, 
    currentBet, 
    handleIncrementBet, 
    handleDecrementBet, 
    handleStartSpin, 
    gameResult,
    isSpinning,
  } = useSlotStore();
  
  const isDisabled = Number(currentBet) <= 0;
  
  return (
    <section className={styles.tokyoSlots}>
        <div className={styles.tokyoSlotsContainer}>
      <Slot />
        {gameResult === 'win' || gameResult === 'lose' ? <BetResultModal /> : null}
          <p className={styles.tokyoSlotsTitle}>PLACE A BID</p>
          <div className={styles.tokyoSlotsActions}>
            <PrimaryButton content={"-"} action={handleDecrementBet} disabled={isDisabled} /> 
            <InputSlots bet={currentBet} handleChange={handleChangeBet} />
            <PrimaryButton content={"+"} action={handleIncrementBet} />
          </div>
          
          <SpinButton 
            action={handleStartSpin} 
            disabled={isSpinning}
          />       
        </div>
        
    </section>
  );
}
