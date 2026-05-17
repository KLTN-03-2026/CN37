import React, { useEffect, useState, useRef } from "react";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Wallet,
  PiggyBank,
} from "lucide-react";
import styles from "./RevenueSummaryCards.module.scss";


// ĐẶT Ở ĐÂY
const CountUpValue = ({
  value,
  isCurrency,
  formatCurrency,
  formatNumber,
  trigger,
}) => {
  const [displayValue, setDisplayValue] = useState(Number(value) || 0);

  const previousValueRef = useRef(Number(value) || 0);

  useEffect(() => {
    const end = Number(value) || 0;

    const start =
      previousValueRef.current === end
        ? 0
        : previousValueRef.current;

    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.round(
        start + (end - start) * easedProgress
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValueRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value, trigger]);

  if (isCurrency) return formatCurrency(displayValue);

  if (formatNumber) return formatNumber(displayValue);

  return displayValue.toLocaleString("vi-VN");
};



const RevenueSummaryCards = ({
  summary,
  formatCurrency,
  formatNumber,
  filterType,
}) => {
  const cards = [
    {
      title: "Tổng doanh thu",
      value: summary.totalRevenue,
      change: summary.revenueChange ?? 0,
      icon: <DollarSign size={22} />,
      isCurrency: true,
    },
    {
      title: "Tổng giá vốn FIFO",
      value: summary.totalCost,
      change: summary.costChange ?? 0,
      icon: <Wallet size={22} />,
      isCurrency: true,
    },
    {
      title: "Tổng lợi nhuận",
      value: summary.totalProfit,
      change: summary.profitChange ?? 0,
      icon: <PiggyBank size={22} />,
      isCurrency: true,
    },
    {
      title: "Tổng đơn hàng",
      value: summary.totalOrders,
      change: summary.ordersChange ?? 0,
      icon: <ShoppingCart size={22} />,
      isCurrency: false,
    },
  ];

  return (
    <div className={styles.summaryCards}>
      {cards.map((card, index) => {
        const isPositive = card.change >= 0;

        return (
          <div className={styles.summaryCard} key={index}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>
                {card.icon}
              </div>

              <div
                className={`${styles.cardChange} ${
                  isPositive
                    ? styles.positive
                    : styles.negative
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}

                <span>{Math.abs(card.change)}%</span>
              </div>
            </div>

            <p>{card.title}</p>

            <h3>
              <CountUpValue
                value={card.value || 0}
                isCurrency={card.isCurrency}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
                trigger={filterType}
              />
            </h3>

            <span className={styles.compareText}>
              So với kỳ trước
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RevenueSummaryCards;