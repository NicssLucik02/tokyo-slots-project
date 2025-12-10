import styles from "./bigCasinoButton.module.scss";

type Props = {
  content: string;
  action?: () => void;
  variant?: "red" | "gold";
};

export const BigCasinoButton: React.FC<Props> = ({ content, action, variant = "red" }) => {
  const className = `${styles.bigCasinoButton} ${variant === "gold" ? styles["bigCasinoButton--gold"] : ""}`;
  return (
    <button className={className} onClick={action}>
      <p className={styles.bigCasinoButtonContent}>{content}</p>
    </button>
  );
};

