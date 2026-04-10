import { useEffect, useState } from "react";
import { getAllInventoryLogs } from "../../../api/InventoryApi";
import styles from "./HistoryModal.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function HistoryAllModal({ onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAllInventoryLogs();
        setLogs(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className={cx("modalOverlay")}>
      <div className={cx("modalLarge")}>
        <h3>Lịch sử nhập/xuất kho</h3>

        {/* 👇 THÊM WRAPPER NÀY */}
        <div className={cx("table-wrapper")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Loại</th>
                <th>Số lượng</th>
                <th>Tồn trước</th>
                <th>Tồn sau</th>
                <th>Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{log.productName}</td>
                  <td
                    className={cx(
                      log.changeType === "IMPORT" ? "import" : "export",
                    )}
                  >
                    {log.changeType}
                  </td>
                  <td>{log.quantityChanged}</td>
                  <td>{log.quantityBefore}</td>
                  <td>{log.quantityAfter}</td>
                  <td>{new Date(log.createAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className={cx("btnClose")} onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default HistoryAllModal;
