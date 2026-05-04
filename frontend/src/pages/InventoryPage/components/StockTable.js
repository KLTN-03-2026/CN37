import styles from "./StockTable.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function getStatus(qty) {
  if (qty === 0) return "out";
  if (qty < 5) return "low";
  return "ok";
}

function StockTable({ data, onAction, selected, setSelected }) {
  return (
    <div className={cx("tableWrapper")}>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected(data); // chọn tất cả
                  } else {
                    setSelected([]);
                  }
                }}
              />
            </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selected.some((p) => p.id === item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected([...selected, item]);
                      } else {
                        setSelected(selected.filter((p) => p.id !== item.id));
                      }
                    }}
                  />
                </td>
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
