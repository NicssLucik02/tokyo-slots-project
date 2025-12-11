'use client'
import Image from "next/image";
import styles from "./footer.module.scss";
import { useSlotStore } from "@/src/store/useSlotStore";

export const Footer = () => {
    const { balance } = useSlotStore();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                
                <div className={styles.footerBackgroundCloud} />

                <div className={styles.footerBalance}>
                    <p className={styles.footerBalanceText}>Balance</p>
                    <div className={styles.footerBalanceAmount}>
                        <Image 
                          src="/icons/BalanceCurrency.svg" 
                          width={24} 
                          height={24}
                          alt="Balance currency icon"
                        />
                        <p>{balance}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
