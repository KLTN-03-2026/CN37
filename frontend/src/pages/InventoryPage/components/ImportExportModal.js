import { useState, useEffect } from "react";
import styles from "./ImportExportModal.module.scss";
import classNames from "classnames/bind";
import { createImport, createExport } from "../../../api/InventoryApi";
import { getSuppliers } from "../../../api/SupplierApi";
import { getUserList } from "../../../api/UserApi";

const cx = classNames.bind(styles);

function ImportExportModal({ type, products = [], onClose, onSuccess }) {
  const [items, setItems] = useState(
    products.map((p) => ({
      productId: p.id,
      name: p.name,
      code: p.code || p.sku || `PRD${String(p.id).padStart(4, "0")}`,
      unit: p.unit || "Cái",
      quantity: 1,
      price: p.price || 0,
    }))
  );

  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "IMPORT") {
          const res = await getSuppliers();
          setSuppliers(res.data?.items || []);
        } else {
          const res = await getUserList({ pageSize: 1000 });
          setCustomers(res.data?.items || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [type]);

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: null,
        name: "",
        code: "",
        unit: "Cái",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedPartner) {
      alert(`Vui lòng chọn ${type === "IMPORT" ? "nhà cung cấp" : "khách hàng"}`);
      return;
    }

    if (items.length === 0 || items.some((i) => !i.productId || i.quantity <= 0)) {
      alert("Vui lòng kiểm tra lại danh sách sản phẩm");
      return;
    }

    setLoading(true);
    try {
      if (type === "IMPORT") {
        await createImport({
          supplierId: parseInt(selectedPartner),
          note: note || "Phiếu nhập kho",
          items: items.map((i) => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity),
            costPrice: Number(i.price),
          })),
        });
      } else {
        await createExport({
          customerId: parseInt(selectedPartner),
          supplierId: 0,
          exportType: "SALE",
          note: note || "Phiếu xuất kho",
          items: items.map((i) => ({
            productId: Number(i.productId),
            quantity: Number(i.quantity),
            price: Number(i.price),
          })),
        });
      }

      alert("Lưu phiếu thành công!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + (err.response?.data?.message || "Không thể lưu phiếu"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div
        className={cx("modal")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx("modalHeader")}>
          <h2>{type === "IMPORT" ? "📥 Phiếu Nhập Kho" : "📤 Phiếu Xuất Kho"}</h2>
          <button className={cx("closeBtn")} onClick={onClose}>✕</button>
        </div>

        <div className={cx("modalContent")}>
          {/* Partner Selection */}
          <div className={cx("partnerSection")}>
            <label>
              {type === "IMPORT" ? "Nhà cung cấp" : "Khách hàng"} *
            </label>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className={cx("partnerSelect")}
            >
              <option value="">-- Chọn --</option>
              {type === "IMPORT"
                ? suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))
                : customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName || c.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Note */}
          <div className={cx("noteSection")}>
            <label>Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú (tùy chọn)"
              className={cx("noteInput")}
            />
          </div>

          {/* Table */}
          <div className={cx("tableWrapper")}>
            <table className={cx("table")}>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "25%" }}>Sản phẩm</th>
                  <th style={{ width: "12%" }}>Mã</th>
                  <th style={{ width: "10%" }}>ĐVT</th>
                  <th style={{ width: "12%" }}>Số lượng</th>
                  <th style={{ width: "15%" }}>Đơn giá</th>
                  <th style={{ width: "15%" }}>Thành tiền</th>
                  <th style={{ width: "6%" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                        placeholder="Tên sản phẩm"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) =>
                          handleChange(index, "code", e.target.value)
                        }
                        placeholder="Mã"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) =>
                          handleChange(index, "unit", e.target.value)
                        }
                        placeholder="ĐVT"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(index, "quantity", +e.target.value)
                        }
                        className={cx("numberInput")}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          handleChange(index, "price", +e.target.value)
                        }
                        className={cx("numberInput")}
                      />
                    </td>
                    <td className={cx("total")}>
                      {(item.quantity * item.price).toLocaleString("vi-VN")} ₫
                    </td>
                    <td>
                      <button
                        className={cx("deleteBtn")}
                        onClick={() => handleRemoveItem(index)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Item Button */}
          <button className={cx("addItemBtn")} onClick={handleAddItem}>
            + Thêm sản phẩm
          </button>

          {/* Total */}
          <div className={cx("totalSection")}>
            <span>Tổng tiền:</span>
            <strong>{total.toLocaleString("vi-VN")} ₫</strong>
          </div>

          {/* Actions */}
          <div className={cx("actions")}>
            <button
              className={cx("submitBtn")}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "💾 Lưu phiếu"}
            </button>
            <button className={cx("cancelBtn")} onClick={onClose}>
              ✕ Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportExportModal;
