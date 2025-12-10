import Image from 'next/image'
import styles from './inputSlots.module.scss'

type Props = {
    bet: string;
    handleChange: (amount: string) => void;
}

export const InputSlots:React.FC<Props> = ({bet, handleChange}) => {
    return (
        <div className={styles.inputSlotsContainer}>
            <Image 
                src="/icons/BalanceCurrency.svg"
                width={24}
                height={24}
                alt="Currency icon"
            />
            <input 
              type="number" 
              className={styles.inputSlots} 
              placeholder='0.00'
              value={bet} 
              onChange={(e) => handleChange(e.target.value)}
               
            />
        </div>
    )
}