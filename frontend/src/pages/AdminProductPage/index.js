import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminProductPage.module.scss";

import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import ProductPreviewModal from "./components/ProductPreviewModal";
import { notifyError, notifySuccess } from "../../components/Nofitication";

import {
  getProduct,
  getAdminProduct,
  createProduct,
  updateProduct,
  toggleProduct,
  getAdminProductId,
} from "../../api/ProductApi";

const cx = classNames.bind(styles);

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    parentCategoryId: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slug, setSlug] = useState(false);
  const [product, setProduct] = useState(null);

  const handleView = async (slug) => {
    try {
      const { data } = await getProduct(slug);
      setSelectedProduct(data.product);
      setSlug(slug);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== FETCH =====
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProduct(
        filter.search,
        filter.parentCategoryId,
        filter.categoryId,
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const handelEdit = async (id, form) => {
    console.log(slug);
    const res = await updateProduct(id, form);
    if (res.status === 200) {
      setShowModal(false);
      notifySuccess("Cập nhật sản phẩm thành công");
      await fetchProducts();
      const res = await getAdminProductId(id);
      setSelectedProduct(res.data.product);
      setShowModal(true);
    }
  };

  // ===== ACTION =====
  const handleToggle = async (id) => {
    await toggleProduct(id);
    fetchProducts();
  };

  const handleSubmit = async (data) => {
    if (selected) {
      await updateProduct({ ...data, id: selected.id });
    } else {
      await createProduct(data);
    }
    setOpenModal(false);
    fetchProducts();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Quản lý sản phẩm</h2>

        <ProductFilter
          filter={filter}
          setFilter={setFilter}
          onAdd={() => {
            setSelected(null);
            setOpenModal(true);
          }}
        />
      </div>

      <ProductTable
        data={products}
        loading={loading}
        onEdit={(p) => {
          setSelected(p);
          setOpenModal(true);
        }}
        onView={handleView}
        onToggle={handleToggle}
      />

      {openModal && (
        <ProductModal
          product={selected}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
        />
      )}
      {showModal && (
        <ProductPreviewModal
          product={selectedProduct}
          onEdit={handelEdit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default AdminProductPage;
