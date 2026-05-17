import React from "react";
import DatePicker from "react-datepicker";

import {
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Filter,
  Calendar,
} from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./RevenueFilterBar.module.scss";

const RevenueFilterBar = ({
  type,
  setType,
  branch,
  setBranch,
  dateRange,
  setDateRange,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <Filter size={20} />
          <h2>Bộ lọc báo cáo</h2>
        </div>

        <div className={styles.filterActions}>
          <button
            className={styles.outlineBtn}
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? styles.spin : ""}
            />
            Làm mới
          </button>

          <button className={styles.primaryBtn}>
            <FileSpreadsheet size={16} />
            Xuất Excel
          </button>

          <button className={styles.pdfBtn}>
            <FileText size={16} />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className={styles.filterGrid}>
        {/* Kiểu thống kê */}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="daily">Theo ngày</option>
          <option value="monthly">Theo tháng</option>
          <option value="quarterly">Theo quý</option>
          <option value="yearly">Theo năm</option>
        </select>

        {/* Chi nhánh */}
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="all">Tất cả chi nhánh</option>
          <option value="hanoi">Chi nhánh Hà Nội</option>
          <option value="hcm">Chi nhánh TP.HCM</option>
          <option value="danang">Chi nhánh Đà Nẵng</option>
          <option value="online">Online</option>
        </select>

        {/* Chọn khoảng ngày */}
        <div className={styles.datePickerWrapper}>
          <Calendar size={16} />

          <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
            placeholderText="Chọn khoảng ngày"
            dateFormat="dd/MM/yyyy"
            className={styles.datePicker}
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueFilterBar;