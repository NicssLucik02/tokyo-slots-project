import styles from "./coinsLayout.module.scss"
import Image from "next/image"

export const CoinsLayout = () => {
    return (
        <div className={styles.coinsLayout}>
          <Image src="/icons/CherrySlot.svg" width={80} height={80} className={styles.cherrySlot} alt="cherry slot" />
          <Image src="/icons/Crown.svg" width={70} height={70} className={styles.crown} alt="crown" />
          <Image src="/icons/CoinHappy.svg" width={40} height={40} className={styles.coinHappySmall} alt="coin happy" />
          <Image src="/icons/CoinHappy.svg" width={120} height={120} className={styles.coinHappyBig} alt="coin happy" />
          <Image src="/icons/EthereumSlot.svg" width={40} height={40} className={styles.ethereumSlot} alt="ethereum slot" />
          <Image src="/icons/DiamondSlot.svg" width={46} height={37} className={styles.diamondSlot} alt="diamond slot" />
          <Image src="/icons/SevenSlot.svg" width={40} height={40} className={styles.sevenSlot} alt="seven slot" />
          <Image src="/icons/SevenSlot.svg" width={50} height={50} className={styles.sevenSlotSecond} alt="seven slot" />
          <Image src="/icons/EthereumSlot.svg" width={80} height={80} className={styles.ethereumSlotBig} alt="ethereum slot" />
          <Image src="/icons/LemonSlot.svg" width={70} height={70} className={styles.lemonSlot} alt="lemon slot" />
          <Image src="/icons/LemonSlot.svg" width={120} height={120} className={styles.lemonSlotBig} alt="lemon slot" />
        </div>
    )
}
