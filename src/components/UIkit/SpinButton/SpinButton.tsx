import Image from 'next/image';
import styles from './spinButton.module.scss'
import spinButtonBase from "../../../assets/images/SpinButtonParts/SpinButtonBase.png"
import spinButtonBaseBorders from "../../../assets/images/SpinButtonParts/SpinButtonBaseBorders.png"
import spinButtonBaseTop from "../../../assets/images/SpinButtonParts/SpinButtonBaseTop.png"
import spinButtonTop from "../../../assets/images/SpinButtonParts/SpinButtonTop.png"
import spinButtonTopClick from "../../../assets/images/SpinButtonParts/SpinButtonTopClick.png"
import spinButtonText from "../../../assets/images/SpinButtonParts/SpinButtonText.png"

type Props = {
    onClick: () => void;
    disabled?: boolean;
}

export const SpinButton:React.FC <Props> = ({ onClick, disabled }) => {
    return (
        <button className={styles.spinButtonContainer} onClick={onClick} disabled={disabled} aria-disabled={disabled}>  
            <Image src={spinButtonBase} className={styles.spinButtonBase} alt="spinButtonBase" />
            <Image src={spinButtonBaseBorders} className={styles.spinButtonBaseBorders} alt="spinButtonBaseBorders" />
            <Image src={spinButtonBaseTop} className={styles.spinButtonBaseTop} alt="spinButtonBaseTop" />
            <div
              className={styles.spinButtonMovingPart}
            >
              <Image src={spinButtonTop} className={styles.spinButtonTop} alt="spinButtonTop" />
              <Image src={spinButtonTopClick} className={styles.spinButtonTopClick} alt="spinButtonTopClick" />
              <Image src={spinButtonText} className={styles.spinButtonTopText} alt="spinButtonText" />
            </div>
        </button>
    )
}
