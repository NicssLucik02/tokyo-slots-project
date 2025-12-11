import classNames from "classnames";
import styles from "./primaryButton.module.scss";

type Props = {
    content: string;
    action: () => void;
    disabled?: boolean;
}

export const PrimaryButton:React.FC<Props> = ({ content, action, disabled }) => {
    return (
        <button className={classNames(styles.primaryButton, { [styles.disabled!]: !!disabled })} onClick={action} disabled={disabled}>
            <p className={styles.primaryButtonContent}>{content}</p>
        </button>
    );
}
