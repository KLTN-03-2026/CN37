import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./RevenueChart.module.scss";
import { getBusinessStatistics } from "../../../api/StatisticsApi";

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("daily");

  useEffect(() => {
    fetchStatisticsData();
  }, [type]);

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);

      const response = await getBusinessStatistics(type);

      if (response.success) {
        const result = response.data;

        setData(result?.data || []);

        setSummary({
          totalRevenue: result?.totalRevenue || 0,
          totalCost: result?.totalCost || 0,
          totalProfit: result?.totalProfit || 0,
        });

        setError(null);
      } else {
        setError(response.message || "Failed to load business statistics");
      }
    } catch (err) {
      setError("Failed to load statistics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const formatChartCurrency = (value) => {
    return `${((value || 0) / 1000000).toFixed(1)}M`;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h2>Thống kê kinh doanh FIFO</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.typeSelector}
        >
          <option value="daily">Theo ngày</option>
          <option value="monthly">Theo tháng</option>
          <option value="quarterly">Theo quý</option>
          <option value="yearly">Theo năm</option>
        </select>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <p>Tổng doanh thu</p>
          <h3>{formatCurrency(summary.totalRevenue)}</h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Tổng giá vốn FIFO</p>
          <h3>{formatCurrency(summary.totalCost)}</h3>
        </div>

        <div className={styles.summaryCard}>
          <p>Tổng lợi nhuận</p>
          <h3>{formatCurrency(summary.totalProfit)}</h3>
        </div>
      </div>

      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="label"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />

            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              tickFormatter={formatChartCurrency}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => formatCurrency(value)}
            />

            <Legend />

            <Line
              name="Doanh thu"
              type="monotone"
              dataKey="revenue"
              stroke="#59c241"
              strokeWidth={2}
              dot={{ fill: "#59c241", r: 5 }}
              activeDot={{ r: 7 }}
            />

            <Line
              name="Giá vốn FIFO"
              type="monotone"
              dataKey="cost"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", r: 5 }}
              activeDot={{ r: 7 }}
            />

            <Line
              name="Lợi nhuận"
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;