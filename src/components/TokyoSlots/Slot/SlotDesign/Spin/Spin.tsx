"use client";
import Image from "next/image";
import styles from './spin.module.scss'
import { useSlotStore } from "@/src/store/useSlotStore";
import { useSpinAnimation } from "@/src/utils/spinAnimation";

type Props = {
  slotIcon?: React.ReactNode;
  spinToken?: number;
  stopIndex?: number;
  onStop?: (index: number) => void;
}

export const Spin:React.FC<Props> = ({ slotIcon, spinToken = 0, stopIndex, onStop }) => {
  const { isSpinning } = useSlotStore();
  const { reelItems, position } = useSpinAnimation({ spinToken, stopIndex, onStop });

  return (
    <div className={styles.spin}>
      <div className={styles.spinContainer}>
        <div className={styles.spinViewport}>
          <div
            className={styles.spinTrack}
            style={{ transform: `translateY(-${position}px)` }}
          >
            {reelItems.map((src, i) => (
              <div key={i} className={styles.spinItem}>
                <Image src={src} width={40} height={40} className={styles.spinItemImage} alt="slot symbol" />
              </div>
            ))}
          </div>
          {!isSpinning && slotIcon && (
            <div className={styles.spinOverlay}>{slotIcon}</div>
          )}
        </div>
      </div>
    </div>
  )
}
