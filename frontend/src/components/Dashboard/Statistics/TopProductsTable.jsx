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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTopProducts();
  }, [type]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);

      const response =
        type === "selling"
          ? await getTopSellingProducts(10)
          : await getTopProfitProducts(10);

      if (response.success) {
        setData(response.data || []);
        setError(null);
      } else {
        setError("Không lấy được dữ liệu");
      }
    } catch (err) {
      setError("Không thể tải dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const renderRows = (products) =>
    products.map((item, index) => (
      <tr key={index}>
        <td className={styles.rank}>#{index + 1}</td>
        <td className={styles.productName}>{item.productName}</td>
        <td className={styles.quantity}>{item.quantity?.toLocaleString()}</td>
        <td className={styles.price}>{formatCurrency(item.value)}</td>
      </tr>
    ));

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div>
            <h2>
              {type === "selling"
                ? "Top sản phẩm bán chạy"
                : "Top sản phẩm lợi nhuận cao"}
            </h2>
            <p>Hiển thị 5 sản phẩm nổi bật nhất</p>
          </div>

          {data.length > 5 && (
            <button
              className={styles.viewAllBtn}
              onClick={() => setShowModal(true)}
            >
              Xem tất cả
            </button>
          )}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng bán</th>
              <th>{type === "selling" ? "Doanh thu" : "Lợi nhuận"}</th>
            </tr>
          </thead>

          <tbody>{renderRows(data.slice(0, 5))}</tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>
                {type === "selling"
                  ? "Tất cả sản phẩm bán chạy"
                  : "Tất cả sản phẩm lợi nhuận cao"}
              </h3>

              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Số lượng bán</th>
                    <th>{type === "selling" ? "Doanh thu" : "Lợi nhuận"}</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className={styles.rank}>{index + 1}</td>

                      <td
                        className={`${styles.productName} ${styles.modalProductName}`}
                      >
                        {item.productName}
                      </td>
                      <td
                        className={`${styles.productName} ${styles.modalProductName}`}
                      >
                        {item.category}
                      </td>

                      <td className={styles.quantity}>
                        {item.quantity?.toLocaleString()}
                      </td>

                      <td className={styles.price}>
                        {formatCurrency(item.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopProductsTable;
