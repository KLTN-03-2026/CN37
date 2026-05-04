import { useState } from "react";
import styles from "./ImportExportModal.module.scss";
import classNames from "classnames/bind";
import { createImport, createExport } from "../../../api/InventoryApi";

const cx = classNames.bind(styles);

function ImportExportModal({ type, products = [], onClose, onSuccess }) {
  const [items, setItems] = useState(
    products.map((p) => ({
      productId: p.id,
      name: p.name,
      quantity: 1,
      price: 0,
    })),
  );

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      if (type === "IMPORT") {
        await createImport({
          supplierId: 1, // TODO: sau này cho chọn
          note: "Nhập kho",
          items: items.map((i) => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity),
            costPrice: Number(i.price), // 👈 đổi tên
          })),
        });
      } else {
        await createExport({
          exportType: "SALE",
          note: "Xuất kho",
          items: items.map((i) => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity),
            price: Number(i.price),
          })),
        });
      }

      alert("Thành công!");

      onSuccess?.(); // 👉 clear selectedProducts ở cha
      onClose(); // 👉 đóng modal
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }
  };

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div
        className={cx("modal")}
        onClick={(e) => e.stopPropagation()} // 👈 chặn click lan ra ngoài
      >
        <h3>{type === "IMPORT" ? "Nhập kho" : "Xuất kho"}</h3>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>

                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", +e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleChange(index, "price", +e.target.value)
                    }
                  />
                </td>

                <td>{item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={cx("total")}>
          Tổng tiền: <b>{total.toLocaleString()}</b>
        </div>

        <div className={cx("actions")}>
          <button onClick={handleSubmit}>Lưu phiếu</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default ImportExportModal;
