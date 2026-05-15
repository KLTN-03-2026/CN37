import { useState, useEffect } from "react";
import styles from "./ImportExportModal.module.scss";
import classNames from "classnames/bind";
import { createImport, createExport } from "../../../api/InventoryApi";
import { getSuppliers } from "../../../api/SupplierApi";
import { getUserList } from "../../../api/UserApi";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../../components/Nofitication";
import { MdDelete } from "react-icons/md";

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
    })),
  );

  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    // Validate partner
    if (!selectedPartner) {
      newErrors.partner =
        type === "IMPORT"
          ? "Vui lòng chọn nhà cung cấp"
          : "Vui lòng chọn khách hàng";
    }

    // Validate items
    if (items.length === 0) {
      newErrors.items = "Danh sách sản phẩm không được để trống";
    }

    items.forEach((item, index) => {
      const rowErrors = {};

      if (
        item.quantity === "" ||
        item.quantity === null ||
        isNaN(item.quantity)
      ) {
        rowErrors.quantity = "Số lượng không hợp lệ";
      } else if (Number(item.quantity) <= 0) {
        rowErrors.quantity = "Số lượng phải lớn hơn 0";
      }

      if (item.price === "" || item.price === null || isNaN(item.price)) {
        rowErrors.price = "Đơn giá không hợp lệ";
      } else if (Number(item.price) < 0) {
        rowErrors.price = "Đơn giá không được âm";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      notifyWarning("Vui lòng kiểm tra lại thông tin nhập");
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
            Price: Number(i.price),
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

      notifySuccess("Lưu phiếu thành công!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      notifyError(
        "Lỗi: " + (err.response?.data?.message || "Không thể lưu phiếu"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("modalHeader")}>
          <h2>{type === "IMPORT" ? "Phiếu Nhập Kho" : "Phiếu Xuất Kho"}</h2>
          <button className={cx("closeBtn")} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={cx("modalContent")}>
          {/* Partner Selection */}
          <div className={cx("partnerSection")}>
            <label>{type === "IMPORT" ? "Nhà cung cấp" : "Khách hàng"} *</label>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className={cx("partnerSelect", {
                error: errors.partner,
              })}
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
            {errors.partner && (
              <span className={cx("errorText")}>{errors.partner}</span>
            )}
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
                        readOnly
                        className={cx("readonlyInput")}
                        placeholder="Tên sản phẩm"
                      />

                      {errors[index]?.name && (
                        <span className={cx("errorText")}>
                          {errors[index].name}
                        </span>
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.code}
                        readOnly
                        className={cx("readonlyInput")}
                        placeholder="Mã"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.unit}
                        readOnly
                        className={cx("readonlyInput")}
                        placeholder="ĐVT"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "quantity",
                            Math.max(1, Number(e.target.value)),
                          )
                        }
                        className={cx("numberInput", {
                          inputError: errors[index]?.quantity,
                        })}
                      />

                      {errors[index]?.quantity && (
                        <span className={cx("errorText")}>
                          {errors[index].quantity}
                        </span>
                      )}
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
                        className={cx("numberInput", {
                          inputError: errors[index]?.price,
                        })}
                      />

                      {errors[index]?.price && (
                        <span className={cx("errorText")}>
                          {errors[index].price}
                        </span>
                      )}
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
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
              {loading ? "Đang lưu..." : "Lưu phiếu"}
            </button>
            <button className={cx("cancelBtn")} onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportExportModal;
