import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./RevenueLineChart.module.scss";

const RevenueLineChart = ({
  data,
  type,
  formatCurrency,
  formatChartCurrency,
}) => {
  const [activeTab, setActiveTab] = useState("revenue");

  const getQuarter = (date) => {
    return Math.floor(date.getMonth() / 3) + 1;
  };

  const normalizeKey = (item) => {
    const raw = String(item.label || item.date || item.time || "").trim();
    const now = new Date();

    if (type === "daily") {
      // dạng: 2026-05-17 hoặc 2026/05/17
      let match = raw.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
      if (match) {
        return `${Number(match[1])}-${Number(match[2])}-${Number(match[3])}`;
      }

      // dạng: 17/05 hoặc 17-05
      match = raw.match(/(\d{1,2})[/-](\d{1,2})/);
      if (match) {
        return `${now.getFullYear()}-${Number(match[2])}-${Number(match[1])}`;
      }

      // dạng: Ngày 17
      match = raw.match(/ngày\s*(\d{1,2})/i);
      if (match) {
        return `${now.getFullYear()}-${now.getMonth() + 1}-${Number(match[1])}`;
      }

      // dạng chỉ có số: 17
      match = raw.match(/^(\d{1,2})$/);
      if (match) {
        return `${now.getFullYear()}-${now.getMonth() + 1}-${Number(match[1])}`;
      }
    }

    if (type === "monthly") {
      // dạng: 2026-05 hoặc 2026/05
      let match = raw.match(/(\d{4})[/-](\d{1,2})/);
      if (match) return Number(match[2]);

      // dạng: 05/2026
      match = raw.match(/(\d{1,2})[/-](\d{4})/);
      if (match) return Number(match[1]);

      // dạng: Tháng 5
      match = raw.match(/tháng\s*(\d{1,2})/i);
      if (match) return Number(match[1]);

      // dạng chỉ có số: 5
      match = raw.match(/^(\d{1,2})$/);
      if (match) return Number(match[1]);
    }

    if (type === "quarterly") {
      const match = raw.match(/(\d{1})/);
      if (match) return Number(match[1]);
    }

    if (type === "yearly") {
      const match = raw.match(/\d{4}/);
      if (match) return Number(match[0]);
    }

    return raw;
  };

  const generateFullChartData = () => {
    const now = new Date();
    const dataMap = new Map();

    data.forEach((item) => {
      dataMap.set(normalizeKey(item), {
        revenue: item.revenue || 0,
        expense: item.cost || 0,
        profit: item.profit || 0,
        orders: item.exportCount || 0,
      });
    });

    console.log(
      "Chart keys:",
      data.map((item) => ({
        label: item.label,
        key: normalizeKey(item),
        revenue: item.revenue,
      })),
    );

    const result = [];

    if (type === "daily") {
      const year = now.getFullYear();
      const month = now.getMonth();
      const today = now.getDate();

      for (let day = 1; day <= today; day++) {
        const key = `${year}-${month + 1}-${day}`;

        result.push({
          date: `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}`,
          revenue: dataMap.get(key)?.revenue || 0,
          expense: dataMap.get(key)?.expense || 0,
          profit: dataMap.get(key)?.profit || 0,
          orders: dataMap.get(key)?.orders || 0,
        });
      }
    }

    if (type === "monthly") {
      const currentMonth = now.getMonth() + 1;

      for (let month = 1; month <= currentMonth; month++) {
        result.push({
          date: `Tháng ${month}`,
          revenue: dataMap.get(month)?.revenue || 0,
          expense: dataMap.get(month)?.expense || 0,
          profit: dataMap.get(month)?.profit || 0,
          orders: dataMap.get(month)?.orders || 0,
        });
      }
    }

    if (type === "quarterly") {
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

      for (let quarter = 1; quarter <= currentQuarter; quarter++) {
        result.push({
          date: `Quý ${quarter}`,
          revenue: dataMap.get(quarter)?.revenue || 0,
          expense: dataMap.get(quarter)?.expense || 0,
          profit: dataMap.get(quarter)?.profit || 0,
          orders: dataMap.get(quarter)?.orders || 0,
        });
      }
    }

    if (type === "yearly") {
      const currentYear = now.getFullYear();

      for (let year = currentYear - 10; year <= currentYear; year++) {
        result.push({
          date: `${year}`,
          revenue: dataMap.get(year)?.revenue || 0,
          expense: dataMap.get(year)?.expense || 0,
          profit: dataMap.get(year)?.profit || 0,
          orders: dataMap.get(year)?.orders || 0,
        });
      }
    }

    return result;
  };

  const chartData = generateFullChartData();
  const chartConfig = {
    revenue: {
      key: "revenue",
      label: "Doanh thu",
      color: "#59c241",
      isCurrency: true,
    },
    expense: {
      key: "expense",
      label: "Chi phí",
      color: "#f97316",
      isCurrency: true,
    },
    profit: {
      key: "profit",
      label: "Lợi nhuận",
      color: "#3b82f6",
      isCurrency: true,
    },
    orders: {
      key: "orders",
      label: "Đơn hàng",
      color: "#8b5cf6",
      isCurrency: false,
    },
  };

  const currentChart = chartConfig[activeTab];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>

        <p className={styles.tooltipValue}>
          {payload[0].name}:{" "}
          {currentChart.isCurrency
            ? formatCurrency(payload[0].value)
            : payload[0].value.toLocaleString("vi-VN")}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>Biểu đồ thống kê chi tiết</h3>
      </div>

      <div className={styles.tabsList}>
        <button
          className={activeTab === "revenue" ? styles.activeTab : ""}
          onClick={() => setActiveTab("revenue")}
        >
          Doanh thu
        </button>

        <button
          className={activeTab === "expense" ? styles.activeTab : ""}
          onClick={() => setActiveTab("expense")}
        >
          Chi phí
        </button>

        <button
          className={activeTab === "profit" ? styles.activeTab : ""}
          onClick={() => setActiveTab("profit")}
        >
          Lợi nhuận
        </button>

        <button
          className={activeTab === "orders" ? styles.activeTab : ""}
          onClick={() => setActiveTab("orders")}
        >
          Đơn hàng
        </button>
      </div>

      <div className={styles.chartContent}>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />

            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={
                currentChart.isCurrency ? formatChartCurrency : undefined
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey={currentChart.key}
              name={currentChart.label}
              fill={currentChart.color}
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueLineChart;
