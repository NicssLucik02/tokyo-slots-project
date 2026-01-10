'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from './cloudReveal.module.scss'
import cloudLeft from '../../assets/images/CloudLeft.png'
import cloudRight from '../../assets/images/CloudRight.png'

export default function CloudReveal() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.cloudReveal}>
      <motion.img
        src={cloudLeft.src}
        alt="cloud-left"
        className={styles.cloudLeft}
        initial={{ x: 0 }}
        animate={{ x: loaded ? "-100%" : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      <motion.img
        src={cloudRight.src}
        alt="cloud-right"
        className={styles.cloudRight}
        initial={{ x: 0 }}
        animate={{ x: loaded ? "100%" : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

    </div>
  );
}
