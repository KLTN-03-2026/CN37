import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./CategoryChart.module.scss";
import { getRevenuByCategory } from "../../../api/StatisticsApi";

const COLORS = ["#59c241", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const CategoryChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await getRevenuByCategory();
      if (response.data.success) {
        const chartData = response.data.data.map((item) => ({
          name: item.categoryName,
          value: item.revenue,
          percentage: item.percentageOfTotal,
        }));
        setData(chartData);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load category data");
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
      <h2>Revenue by Category</h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className={styles.categoryName}>{item.name}</span>
            <span className={styles.value}>{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
