import { useState } from "react";
import styles from "../InventoryPage.module.scss";
import classNames from "classnames/bind";
import { importInventory, exportInventory } from "../../../api/InventoryApi";
import { notifyError, notifySuccess } from "../../../components/Nofitication";

const cx = classNames.bind(styles);

function StockModal({ product, type, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    if (type === "import") {
      try {
        const res = await importInventory(product.id, Number(quantity));
        notifySuccess("Nhập kho thành công");
      } catch (error) {
        const errMsg = error.response?.data || "Có lỗi xảy ra khi nhập kho";
        notifyError(errMsg);
      }
    } else {
      try {
        const res = await exportInventory(product.id, Number(quantity));
        notifySuccess("Xuất kho thành công");
      } catch (error) {
        const errMsg = error.response?.data?.message || "Có lỗi xảy ra khi xuất kho";
        notifyError(errMsg);
      }
    }
    onSuccess();
    onClose();
  };

  return (
    <div className={cx("modalOverlay")}>
      <div className={cx("modal")}>
        <h3>
          {type === "import" ? "Nhập kho" : "Xuất kho"} - {product.name}
        </h3>

        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className={cx("actions")}>
          <button onClick={onClose}>Hủy</button>
          <button className={cx("confirm")} onClick={handleSubmit}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockModal;
