'use client'
import Image from "next/image"
import styles from "./slot.module.scss"
import eyeImage from '../../../assets/images/eye.png';
 import slotBottom from '../../../assets/images/SlotBottom.png';
import { Spin } from "./SlotDesign/Spin/Spin";
import { useSlotStore } from "@/src/store/useSlotStore";
import { useEffect, useRef, useState } from "react";

export const Slot = () => {
    const { isSpinning, reelStops, spinToken, computeWinFromReels, finishSpin } = useSlotStore();
    const [allowStops, setAllowStops] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);
    const [stopped, setStopped] = useState<(number | null)[]>([null, null, null, null]);
    const seqTimeoutRef = useRef<number | null>(null);
    const seqDelayMs = 350;
    const startDelayMs = 600;
    const currentSpinRef = useRef<number | null>(null);

    useEffect(() => {
        if (!spinToken) return;
        currentSpinRef.current = spinToken;
        if (seqTimeoutRef.current) {
            clearTimeout(seqTimeoutRef.current);
            seqTimeoutRef.current = null;
        }
        const tokenAtStart = spinToken;
        window.setTimeout(() => {
            if (currentSpinRef.current !== tokenAtStart) return;
            setStopped([null, null, null, null]);
            setAllowStops([false, false, false, false]);
            seqTimeoutRef.current = window.setTimeout(() => {
                if (currentSpinRef.current !== tokenAtStart) return;
                setAllowStops([true, false, false, false]);
                seqTimeoutRef.current = null;
            }, startDelayMs);
        }, 0);
    }, [spinToken]);

    const handleStoppedAt = (reelIdx: number, symbolIndex: number) => {
        setStopped(prev => {
            const next = [...prev];
            next[reelIdx] = symbolIndex;
            return next;
        });
        if (reelIdx < 3) {
            if (seqTimeoutRef.current) {
                clearTimeout(seqTimeoutRef.current);
                seqTimeoutRef.current = null;
            }
            const tokenAtSchedule = currentSpinRef.current;
            seqTimeoutRef.current = window.setTimeout(() => {
                if (currentSpinRef.current !== tokenAtSchedule) return;
                setAllowStops(() => {
                    const next: [boolean, boolean, boolean, boolean] = [false, false, false, false];
                    next[reelIdx + 1] = true;
                    return next;
                });
                seqTimeoutRef.current = null;
            }, seqDelayMs);
        }
    };

    useEffect(() => {
        if (stopped.every(v => v !== null)) {
            if (seqTimeoutRef.current) {
                clearTimeout(seqTimeoutRef.current);
                seqTimeoutRef.current = null;
            }
            const winAmount = computeWinFromReels(stopped as number[]);
            window.setTimeout(() => finishSpin(winAmount), 0);
        }
    }, [stopped, computeWinFromReels, finishSpin]);
    
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
                        <Spin spinToken={spinToken} stopIndex={reelStops[0]} allowStop={allowStops[0]} onStop={(i) => handleStoppedAt(0, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[1]} allowStop={allowStops[1]} onStop={(i) => handleStoppedAt(1, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[2]} allowStop={allowStops[2]} onStop={(i) => handleStoppedAt(2, i)} />
                        <Spin spinToken={spinToken} stopIndex={reelStops[3]} allowStop={allowStops[3]} onStop={(i) => handleStoppedAt(3, i)} />
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
