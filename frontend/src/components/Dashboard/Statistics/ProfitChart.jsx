import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./ProfitChart.module.scss";
import { getProfitStatistics } from "../../../api/StatisticsApi";

const ProfitChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("monthly");

  useEffect(() => {
    fetchProfitData();
  }, [type]);

  const fetchProfitData = async () => {
    try {
      setLoading(true);
      const response = await getProfitStatistics(type);
      if (response.data.success) {
        setData(response.data.data.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load profit data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h2>Profit Analysis</h2>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.typeSelector}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tickFormatter={formatCurrency}
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
          <Bar
            dataKey="totalProfit"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="Profit"
          />
          <Bar
            dataKey="totalRevenue"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            name="Revenue"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;
