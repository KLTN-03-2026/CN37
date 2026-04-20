import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminProductPage.module.scss";

import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";
import ProductPreviewModal from "./components/ProductPreviewModal";
import { notifyError, notifySuccess } from "../../components/Nofitication";
import ConfirmDialog from "../../components/ConfirmDialog";

import {
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
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slug, setSlug] = useState(false);
  const [disabledProduct, setDisabledProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleView = async (id) => {
    try {
      const { data } = await getAdminProductId(id);
      setSelectedProduct(data.product);
      setSlug(id);
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
        filter.status,
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

  const handleEdit = async (id, form) => {
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

  const handleAskToggleOn = async (id) => {
    setIsDisabled(false);
    setDisabledProduct(id);
    setShowConfirm(true);
  };
  const handleAskToggleOff = async (id) => {
    setIsDisabled(true);
    setDisabledProduct(id);
    setShowConfirm(true);
  };

  // ===== ACTION =====
  const handleToggle = async (id) => {
    await toggleProduct(id);
    fetchProducts();
    setShowConfirm(false);
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
      <h2 className={cx("title")}>Quản lý sản phẩm</h2>

      <ProductFilter
        filter={filter}
        setFilter={setFilter}
        onAdd={() => {
          setShowCreateModal(true);
        }}
      />

      <ProductTable
        data={products}
        loading={loading}
        onEdit={(p) => {
          setSelected(p);
          setOpenModal(true);
        }}
        onView={handleView}
        onToggleOn={handleAskToggleOn}
        onToggleOff={handleAskToggleOff}
      />

      {showModal && (
        <ProductPreviewModal
          product={selectedProduct}
          onEdit={handleEdit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showCreateModal && (
        <ProductPreviewModal
          mode="create"
          onCreate={async (form) => {
            const res = await createProduct(form);
            if (res.status === 200) {
              notifySuccess("Thêm sản phẩm thành công");
              setShowCreateModal(false);
              fetchProducts();
            }
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <ConfirmDialog
        open={showConfirm}
        title={isDisabled ? "Vô hiệu hóa sản phẩm" : "Kích hoạt sản phẩm"}
        message={
          isDisabled
            ? "Bạn có chắc muốn vô hiệu hóa sản phẩm này?"
            : "Bạn có chắc muốn kích hoạt sản phẩm này?"
        }
        confirmText={isDisabled ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
        onConfirm={() => handleToggle(disabledProduct)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default AdminProductPage;
