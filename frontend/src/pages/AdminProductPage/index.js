import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminProductPage.module.scss";

import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import ProductPreviewModal from "./components/ProductPreviewModal";
import ConfirmDialog from "../../components/ConfirmDialog";

import { notifySuccess } from "../../components/Nofitication";

import {
  getAdminProduct,
  createProduct,
  updateProduct,
  toggleProduct,
  getAdminProductId,
} from "../../api/ProductApi";

const cx = classNames.bind(styles);

function AdminProductPage() {
  // ===== STATE =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    parentCategoryId: "",
    categoryId: "",
    status: "",
  });

  const [previewProduct, setPreviewProduct] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    productId: null,
    isDisableAction: false,
  });

  // ===== FETCH =====
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProduct(
        filter.search,
        filter.parentCategoryId,
        filter.categoryId,
        filter.status
      );
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  // ===== VIEW =====
  const handleView = async (id) => {
    const { data } = await getAdminProductId(id);
    setPreviewProduct(data.product);
    setIsPreviewOpen(true);
  };

  // ===== CREATE =====
  const handleCreate = async (form) => {
    const res = await createProduct(form);
    if (res.status === 200) {
      notifySuccess("Thêm sản phẩm thành công");
      setIsCreateOpen(false);
      fetchProducts();
    }
  };

  // ===== EDIT =====
  const handleEdit = async (id, form) => {
    setIsPreviewOpen(false);
    const res = await updateProduct(id, form);
    if (res.status === 200) {
      notifySuccess("Cập nhật thành công");

      // reload list
      await fetchProducts();

      // reload preview
      const { data } = await getAdminProductId(id);
      setPreviewProduct(data.product);
      setIsPreviewOpen(true);
    }
  };

  // ===== TOGGLE =====
  const openConfirm = (id, isDisable) => {
    setConfirmState({
      open: true,
      productId: id,
      isDisableAction: isDisable,
    });
  };

  const handleToggle = async () => {
    await toggleProduct(confirmState.productId);
    fetchProducts();

    setConfirmState({
      open: false,
      productId: null,
      isDisableAction: false,
    });
  };

  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>Quản lý sản phẩm</h2>

      <ProductFilter
        filter={filter}
        setFilter={setFilter}
        onAdd={() => setIsCreateOpen(true)}
      />

      <ProductTable
        data={products}
        loading={loading}
        onView={handleView}
        onToggleOn={(id) => openConfirm(id, false)}
        onToggleOff={(id) => openConfirm(id, true)}
      />

      {/* PREVIEW */}
      {isPreviewOpen && (
        <ProductPreviewModal
          product={previewProduct}
          onEdit={handleEdit}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* CREATE */}
      {isCreateOpen && (
        <ProductPreviewModal
          mode="create"
          onCreate={handleCreate}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {/* CONFIRM */}
      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.isDisableAction
            ? "Vô hiệu hóa sản phẩm"
            : "Kích hoạt sản phẩm"
        }
        message={
          confirmState.isDisableAction
            ? "Bạn có chắc muốn vô hiệu hóa sản phẩm này?"
            : "Bạn có chắc muốn kích hoạt sản phẩm này?"
        }
        confirmText={
          confirmState.isDisableAction ? "Vô hiệu hóa" : "Kích hoạt"
        }
        cancelText="Hủy"
        onConfirm={handleToggle}
        onCancel={() =>
          setConfirmState({ open: false, productId: null })
        }
      />
    </div>
  );
}

export default AdminProductPage;