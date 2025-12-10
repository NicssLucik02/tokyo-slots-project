import styles from "./primaryButton.module.scss";

type Props = {
    content: string;
    action: () => void;
}

export const PrimaryButton:React.FC<Props> = ({ content, action }) => {
    return (
        <button className={styles.primaryButton} onClick={action}>
            <p className={styles.primaryButtonContent}>{content}</p>
        </button>
    );
}