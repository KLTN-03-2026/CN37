import React from "react";
import classNames from "classnames/bind";
import styles from "./SupplierTable.module.scss";
import { FaEye, FaTrash } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

const cx = classNames.bind(styles);

const SupplierTable = ({ suppliers, loading, onView, onDelete, onRefresh }) => {
  if (loading) return <p className={cx("loadingMessage")}>Đang tải...</p>;

  return (
    <div className={cx("tableWrapper")}>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã</th>
            <th>Tên nhà cung cấp</th>
            <th>Người liên hệ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.code}</td>
              <td>{s.name}</td>
              <td>{s.contactPerson || "-"}</td>
              <td>{s.phone || "-"}</td>
              <td>{s.email || "-"}</td>
              <td>
                <span
                  className={cx("status", {
                    active: s.status === "ACTIVE",
                    inactive: s.status === "INACTIVE",
                  })}
                >
                  {s.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td>
                <div className={cx("actions")}>
                  <button
                    title="Xem chi tiết"
                    className={cx("actionBtn", "view")}
                    onClick={() => onView(s.id)}
                  >
                    <BiDetail />
                  </button>
                  <button
                    title="Xóa"
                    className={cx("actionBtn", "delete")}
                    onClick={() => onDelete(s.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {suppliers.length === 0 && !loading && (
        <div className={cx("empty")}>Không có dữ liệu</div>
      )}
    </div>
  );
};

export default SupplierTable;
