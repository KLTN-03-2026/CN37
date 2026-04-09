import { useEffect, useState } from "react";
import styles from "./InventoryPage.module.scss";
import classNames from "classnames/bind";
import StockTable from "./components/StockTable";
import StockModal from "./components/StockModal";
import FilterBar from "./components/FilterBar";
import { getProductInventory } from "../../api/InventoryApi";
import { getCategories } from "../../api/CategoryApi";

const cx = classNames.bind(styles);

function InventoryPage() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // import / export
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    const res = await getProductInventory({ search, category, status });
    setData(res);
  };

  const handleAction = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const filteredData = data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Quản lý kho</h2>

        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          categories={categories}
          onSearch={fetchData} // 👈 QUAN TRỌNG
        />
      </div>

      <StockTable data={filteredData} onAction={handleAction} />

      {modalType && (
        <StockModal
          product={selectedProduct}
          type={modalType}
          onClose={() => setModalType(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default InventoryPage;
