import { FaSearch, FaHistory, FaFileImport, FaFileExport } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import styles from "../InventoryPage.module.scss";
import SearchFilter from "../../../components/SearchFilter";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  categories = [],
  onSearch,
  onOpenHistoryAll,
  onOpenImport,
  onOpenExport,
}) {
  const handleReset = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    onSearch?.(); // reload lại data
  };

  const handleSearch = () => {
    onSearch?.();
  };

  return (
    <div className={cx("filterBar")}>
      <SearchFilter
        value={search}
        onChange={setSearch}
        onSearch={handleSearch}
        placeholder="tìm kiếm sản phẩm..."
      />

      {/* 📂 Category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 📦 Status */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Tất cả trạng thái</option>
        <option value="ok">Còn hàng</option>
        <option value="low">Sắp hết</option>
        <option value="out">Hết hàng</option>
      </select>

      {/* Buttons */}
      <button className={cx("btnFilter", "search")} onClick={handleSearch}>
        <FaSearch />
      </button>

      <button className={cx("btnFilter", "reset")} onClick={handleReset}>
        <GrPowerReset />
      </button>
      <button className={cx("btnFilter", "import")} onClick={onOpenImport}>
        <FaFileImport /> Nhập kho
      </button>

      <button className={cx("btnFilter", "export")} onClick={onOpenExport}>
        <FaFileExport /> Xuất kho
      </button>

      <button className={cx("btnFilter", "reset")} onClick={onOpenHistoryAll}>
        <FaHistory />
      </button>
    </div>
  );
}

export default FilterBar;
