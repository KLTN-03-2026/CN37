import styles from "../InventoryPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function getStatus(qty) {
  if (qty === 0) return "out";
  if (qty < 5) return "low";
  return "ok";
}

function StockTable({ data, onAction }) {
  return (
    <div className={cx("tableWrapper")}>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const status = getStatus(item.quantity || 0);

            return (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity || 0}</td>
                <td>
                  <span className={cx("status", status)}>
                    {status === "ok" && "Còn hàng"}
                    {status === "low" && "Sắp hết"}
                    {status === "out" && "Hết hàng"}
                  </span>
                </td>
                <td>
                  <button
                    className={cx("btn", "import")}
                    onClick={() => onAction(item, "import")}
                  >
                    Nhập
                  </button>
                  <button
                    className={cx("btn", "export")}
                    onClick={() => onAction(item, "export")}
                  >
                    Xuất
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable;
