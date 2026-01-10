import styles from "./header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerCloud}/>
      <div className={styles.headerLogo}>
        <p className={styles.headerLogoText}>Tokyo Slots</p>
      </div>
    </header>
  );
}