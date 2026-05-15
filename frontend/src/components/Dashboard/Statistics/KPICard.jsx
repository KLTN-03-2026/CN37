import React from "react";
import styles from "./KPICard.module.scss";

const KPICard = ({ title, value, unit, changePercentage, trend, color }) => {
  const formatValue = (val) => {
    if (unit === "VND") {
      return `${(val / 1000000).toFixed(2)}M`;
    }
    if (unit === "%") {
      return `${val.toFixed(2)}%`;
    }
    return val.toLocaleString();
  };

  const getTrendIcon = () => {
    if (trend === "UP") return "▲";
    if (trend === "DOWN") return "▼";
    return "→";
  };

  return (
    <div className={`${styles.kpiCard} ${styles[color]}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.mainValue}>
          <span className={styles.value}>{formatValue(value)}</span>
          <span className={styles.unit}>{unit}</span>
        </div>
        <div className={`${styles.change} ${styles[trend.toLowerCase()]}`}>
          <span className={styles.icon}>{getTrendIcon()}</span>
          <span className={styles.percentage}>{Math.abs(changePercentage).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
