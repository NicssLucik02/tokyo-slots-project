'use client'
import Image from 'next/image';
import styles from './betResult.module.scss';
import betResultWin from '../../../assets/images/BetResultWin.png';
import { useSlotStore } from '@/src/store/useSlotStore';
import { gameResultTypes } from '@/types/enums';

export const BetResultModal: React.FC = () => {
    const { gameResult, lastWin, currentBet, handleCloseBetResult } = useSlotStore();
    
    return (
        <div className={gameResult === gameResultTypes.win ? styles.betResultOverlay : styles.betResultOverlayLose} onClick={handleCloseBetResult}>
        <div className={styles.betResult}>
            <div className={gameResult === gameResultTypes.win ? styles.betResultContainer : styles.betResultContainerLose} />
            <p className={gameResult === gameResultTypes.win ? styles.betResultTitle : styles.betResultTitleLose}>
                {gameResult === gameResultTypes.win ? 'You win!!!' : 'You Lose'}
            </p>
            
            <p className={styles.betResultAmount}>
                <Image src="/icons/BalanceCurrency.svg" width={24} height={24} alt="currency" />
                {gameResult === gameResultTypes.win ? '+' : '-'}
                {gameResult === gameResultTypes.win ? lastWin : currentBet}
            </p>

            {gameResult === gameResultTypes.win &&(
              <Image 
                src={betResultWin}
                width={41}
                height={47}
                className={styles.betResultWinImage}
                alt="bet result image"
              />
            )}  
        </div>
        </div>
    )
}
