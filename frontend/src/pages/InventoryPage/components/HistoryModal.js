import { useEffect, useState } from "react";
import { getAllInventoryLogs } from "../../../api/InventoryApi";
import InvoiceDetailModal from "./InvoiceDetailModal";
import styles from "./HistoryModal.module.scss";
import classNames from "classnames/bind";
import { FaFileExport, FaFileImport, FaPrint } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";

const cx = classNames.bind(styles);

function HistoryAllModal({ onClose }) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getAllInventoryLogs();

      const grouped = {};

      res.data?.forEach((item) => {
        const key = item.referenceId || "NO_REF";

        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            number: key,
            type: item.changeType,
            createdAt: item.createAt || new Date(),
            createdBy: item.createdBy || "Admin",
            partnerName: item.partnerName || "N/A",
            items: [],
            note: item.note || "",
          };
        }

        // push item vào group
        grouped[key].items.push({
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          quantity: item.quantityChanged,
          price: item.price || 0,
          unit: item.unit || "Cái",
        });
      });

      // convert object → array
      const transformedData = Object.values(grouped);

      setInvoices(transformedData);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices =
    filterType === "ALL"
      ? invoices
      : invoices.filter((inv) => inv.type === filterType);

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <>
      <div className={cx("modalOverlay")} onClick={onClose}>
        <div className={cx("modalLarge")} onClick={(e) => e.stopPropagation()}>
          <div className={cx("modalHeader")}>
            <h2>📋 Lịch sử phiếu nhập/xuất kho</h2>
            <button className={cx("closeBtn")} onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={cx("filterBar")}>
            <button
              className={cx("filterBtn", filterType === "ALL" && "active")}
              onClick={() => setFilterType("ALL")}
            >
              Tất cả ({invoices.length})
            </button>
            <button
              className={cx("filterBtn", filterType === "IMPORT" && "active")}
              onClick={() => setFilterType("IMPORT")}
            >
              <FaFileImport /> Nhập kho ({invoices.filter((i) => i.type === "IMPORT").length})
            </button>
            <button
              className={cx("filterBtn", filterType === "EXPORT" && "active")}
              onClick={() => setFilterType("EXPORT")}
            >
              <FaFileExport /> Xuất kho ({invoices.filter((i) => i.type === "EXPORT").length})
            </button>
          </div>

          {loading ? (
            <div className={cx("loadingMessage")}>Đang tải...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className={cx("emptyMessage")}>Không có phiếu nào</div>
          ) : (
            <div className={cx("tableWrapper")}>
              <table className={cx("table")}>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Số phiếu</th>
                    <th style={{ width: "15%" }}>Ngày tạo</th>
                    <th style={{ width: "10%" }}>Loại</th>
                    <th style={{ width: "20%" }}>Nhà cung cấp / Khách hàng</th>
                    <th style={{ width: "15%" }}>Người tạo</th>
                    <th style={{ width: "30%" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className={cx("invoiceNumber")}>
                        <strong>#{invoice.number}</strong>
                      </td>
                      <td>
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td>
                        <span
                          className={cx(
                            "badge",
                            invoice.type === "IMPORT" ? "import" : "export",
                          )}
                        >
                          {invoice.type === "IMPORT" ? "Nhập kho" : "Xuất kho"}
                        </span>
                      </td>
                      <td>{invoice.partnerName}</td>
                      <td>{invoice.createdBy}</td>
                      <td>
                        <div className={cx("actionButtons")}>
                          <button
                            className={cx("viewBtn")}
                            onClick={() => handleViewDetail(invoice)}
                            title="Xem chi tiết"
                          >
                           <BiDetail />
                          </button>
                          <button
                            className={cx("printBtn")}
                            title="In phiếu"
                            onClick={() => {
                              handleViewDetail(invoice);
                              setTimeout(() => window.print(), 100);
                            }}
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={cx("modalFooter")}>
            <button className={cx("closeMainBtn")} onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}

export default HistoryAllModal;
