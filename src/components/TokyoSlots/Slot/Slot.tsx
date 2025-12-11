'use client'
import Image from "next/image"
import styles from "./slot.module.scss"
import eyeImage from '../../../assets/images/eye.png';
 import slotBottom from '../../../assets/images/SlotBottom.png';
import { Spin } from "./SlotDesign/Spin/Spin";
import { useSlotStore } from "../../../store/useSlotStore";
import { useSpinController } from "@/src/hooks/useSpinContoller";

export const Slot = () => {
    const { isSpinning, reelStops, spinToken } = useSlotStore();
    const { handleStopAt } = useSpinController();
    
    return (
        <div className={styles.slot}>
            <div className={styles.slotContainer}>
                <div className={styles.slotContent}>
                    <div className={styles.slotContentHeader}>
                        <Image 
                          src={eyeImage} 
                          width={50} 
                          height={50} 
                          alt="eye" 
                          className={styles.slotContentEyeLeft} 
                        />
                        <div 
                          className={styles.slotContentCheek} 
                        />
                        <Image src="/icons/Arc.svg" 
                          width={25} 
                          height={13} 
                          alt="arc"
                        />
                        <Image src={eyeImage} 
                          width={50} 
                          height={50} 
                          alt="eye" 
                          className={styles.slotContentEyeRight} 
                        />
                        <div className={styles.slotContentCheek} />
                        <Image src="/icons/hand.svg" 
                          width={56} 
                          height={50} 
                          alt="arc"
                          className={styles.slotContentHandLeft}
                        />
                        <Image src="/icons/hand.svg" 
                          width={56} 
                          height={50} 
                          alt="arc"
                          className={styles.slotContentHandRight}
                        />
                        <Image 
                          src={slotBottom} 
                          width={370} 
                          height={33} 
                          alt="arc"
                          className={styles.slotContentBottom}
                        />
                    </div>

                    <div className={styles.slotContentSpins}>
                        <Spin spinToken={spinToken} stopIndex={reelStops[0]} onStop={(i) => handleStopAt(0, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[1]} onStop={(i) => handleStopAt(1, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[2]} onStop={(i) => handleStopAt(2, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[3]} onStop={(i) => handleStopAt(3, i)} />
                    </div>
                </div>
            </div>
            <div className={styles.slotHandler}>
                <div className={styles.slotHandlerBlockBig} />
                <div className={styles.slotHandlerBlockSmall} />
                    <div
                        className={`${styles.slotHandlerArmRound} ${isSpinning ? styles.slotHandlerArmRoundPressed : ""}`}
                        role="button"
                        aria-label="Press lever"
                    />
                    <div className={`${styles.slotHandlerArm} ${isSpinning ? styles.slotHandlerArmPressed : ""}`}/> 
            </div>
        </div>
    )
}
