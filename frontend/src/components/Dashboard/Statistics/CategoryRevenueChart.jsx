import React from "react";
import classNames from "classnames/bind";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./CategoryRevenueChart.module.scss";

const cx = classNames.bind(styles);

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

const CategoryRevenueChart = ({ data = [], isLoading = false }) => {
  const categoryStats = data.map((item) => ({
    name: item.categoryName || item.name,
    value: item.revenue || item.value || 0,
  }));

  const total = categoryStats.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  if (isLoading) {
    return (
      <div className={cx("card")}>
        <div className={cx("skeletonTitle")}></div>
        <div className={cx("skeletonChart")}></div>
      </div>
    );
  }

  return (
    <div className={cx("card")}>
      <div className={cx("header")}>
        <h2>Cơ cấu doanh thu theo danh mục</h2>
      </div>

      <div className={cx("content")}>
        <div className={cx("chartBox")}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
              >
                {categoryStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;

                    const percent =
                      total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

                    return (
                      <div className={cx("tooltip")}>
                        <p className={cx("tooltipName")}>{item.name}</p>

                        <p>{formatCurrency(item.value)}</p>

                        <strong>{percent}%</strong>
                      </div>
                    );
                  }

                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={cx("legend")}>
          {categoryStats.map((item, index) => {
            const percent =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

            return (
              <div key={item.name} className={cx("legendItem")}>
                <span
                  className={cx("dot")}
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></span>

                <span className={cx("name")}>{item.name}</span>

                <span className={cx("percent")}>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryRevenueChart;
