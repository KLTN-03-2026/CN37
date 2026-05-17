import React, { useState, useEffect } from "react";
import styles from "./TopProductsTable.module.scss";
import {
  getTopProfitProducts,
  getTopSellingProducts,
} from "../../../api/StatisticsApi";

const TopProductsTable = ({ type = "selling" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopProducts();
  }, [type]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);

      let response;

      if (type === "selling") {
        response = await getTopSellingProducts(10);
      } else {
        response = await getTopProfitProducts(10);
      }

      console.log("Top products response:", response);

      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setError("Không lấy được dữ liệu");
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.tableContainer}>
      <h2>
        {type === "selling"
          ? "Top 10 Selling Products"
          : "Top 10 Profit Products"}
      </h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>{type === "selling" ? "Revenue" : "Profit"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.rank}>#{index + 1}</td>
              <td className={styles.productName}>{item.productName}</td>
              <td className={styles.category}>{item.category}</td>
              <td className={styles.quantity}>
                {item.quantity.toLocaleString()}
              </td>
              <td className={styles.value}>{formatCurrency(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
