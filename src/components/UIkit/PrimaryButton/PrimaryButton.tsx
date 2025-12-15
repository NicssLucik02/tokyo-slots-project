import classNames from "classnames";
import styles from "./primaryButton.module.scss";

type Props = {
    content: string;
    onClick: () => void;
    disabled?: boolean;
    visuallyDisabled?: boolean;
}

export const PrimaryButton:React.FC<Props> = ({ content, onClick, disabled, visuallyDisabled }) => {
    return (
        <button 
          className={classNames(styles.primaryButton, { [styles.disabled!]: !!disabled || !!visuallyDisabled })} 
          onClick={onClick} 
          disabled={disabled}
          aria-disabled={visuallyDisabled && !disabled ? true : undefined}
        >
            <p 
              className={styles.primaryButtonContent}>
                {content}
            </p>
        </button>
    );
}
