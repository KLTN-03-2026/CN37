import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./SupplierPage.module.scss";

import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../api/SupplierApi";

import SupplierTable from "./components/SupplierTable";
import SupplierSearch from "./components/SupplierSearch";
import SupplierAction from "./components/SupplierAction";
import SupplierPreviewModal from "./components/SupplierPreviewModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { notifyError, notifySuccess } from "../../components/Nofitication";

const cx = classNames.bind(styles);

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewSupplier, setPreviewSupplier] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 });
  const [confirmState, setConfirmState] = useState({
    open: false,
    supplierId: null,
  });
  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "",
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers({
        ...filters,
        ...searchParams,
      });
      setSuppliers(res.data?.items || []);
    } catch (err) {
      console.error("Fetch suppliers error:", err);
      notifyError("Lỗi tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [filters, searchParams]);

  const handleView = async (id) => {
    try {
      const { data } = await getSupplierById(id);
      setPreviewSupplier(data);
      setIsPreviewOpen(true);
    } catch (err) {
      notifyError("Lỗi tải thông tin nhà cung cấp");
    }
  };

  const handleEdit = async (id, form) => {
    try {
      await updateSupplier(id, form);
      notifySuccess("Cập nhật nhà cung cấp thành công");
      setIsPreviewOpen(false);
      fetchSuppliers();
    } catch (err) {
      notifyError("Lỗi cập nhật nhà cung cấp");
    }
  };

  const handleDelete = (id) => {
    setConfirmState({
      open: true,
      supplierId: id,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteSupplier(confirmState.supplierId);
      notifySuccess("Xóa nhà cung cấp thành công");
      setConfirmState({ open: false, supplierId: null });
      fetchSuppliers();
    } catch (err) {
      notifyError("Lỗi xóa nhà cung cấp");
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    setFilters({ page: 1, pageSize: 10 });
  };

  const handlePageChange = (page, pageSize) => {
    setFilters({ page, pageSize });
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <h2 className={cx("title")}>Quản lý nhà cung cấp</h2>
      </div>

      <SupplierSearch onSearch={handleSearch} onAdd={() => setIsOpen(true)} />

      <SupplierTable
        suppliers={suppliers}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        onRefresh={fetchSuppliers}
      />

      {isOpen && (
        <SupplierAction
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            fetchSuppliers();
          }}
        />
      )}

      {isPreviewOpen && (
        <SupplierPreviewModal
          supplier={previewSupplier}
          onClose={() => setIsPreviewOpen(false)}
          onEdit={handleEdit}
          onRefresh={fetchSuppliers}
        />
      )}

      {confirmState.open && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmState({ open: false, supplierId: null })}
        />
      )}
    </div>
  );
};

export default SupplierPage;
