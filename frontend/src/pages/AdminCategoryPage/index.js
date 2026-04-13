import { useEffect, useState } from "react";
import styles from "./AdminCategoryPage.module.scss";
import classNames from "classnames/bind";

import CategoryTable from "./components/CategoryTable";
import CategoryModal from "./components/CategoryModal";
import {
  getAdminCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/CategoryApi";
import { notifyError, notifySuccess } from "../../components/Nofitication";
import ConfirmDialog from "../../components/ConfirmDialog";

const cx = classNames.bind(styles);

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchChildren, setSearchChildren] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [createType, setCreateType] = useState("parent");

  const parentCategories = categories.filter(
    (c) => !c.parentId && c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const childCategories = categories.filter(
    (c) =>
      c.parentId === selectedParent?.id &&
      c.name.toLowerCase().includes(searchChildren.toLowerCase()),
  );

  // ===== FETCH =====
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategory({ search });
      setCategories(res);
    } catch (err) {
      console.error("Lỗi load danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchChildren("");
  }, [selectedParent]);

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleAskDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleEdit = (category) => {
    setEditing(category); // Lưu địa chỉ đang sửa
    setOpenModal(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateCategory(editing.id, data);
        notifySuccess("Cập nhật thành công");
      } else {
        await createCategory(data);
        notifySuccess("Thêm thành công");
      }
      setEditing(null);
      await fetch();
      setOpenModal(false);    
    } catch (err) {
      notifyError(editing ? "Cập nhật thất bại" : "Tạo danh mục thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      notifySuccess("Xóa thành công");
      setShowConfirm(false);
      fetch();
    } catch (err) {
      notifyError("Xóa thất bại");
    }
  };

  // ===== UI =====
  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>Quản lý danh mục</h1>

      <div className={cx("container")}>
        {/* FORM */}
        <div className={cx("left")}>
          {loading ? (
            <div className={cx("loading")}>Đang tải dữ liệu...</div>
          ) : (
            <CategoryTable
              data={parentCategories}
              title="Danh mục cha"
              search={search}
              setSearch={setSearch}
              onSelect={setSelectedParent}
              selectedId={selectedParent?.id}
              onSearch={fetch}
              onAdd={() => {
                setCreateType("parent");
                handleCreate();
              }}
              onEdit={handleEdit}
              onDelete={handleAskDelete}
            />
          )}
        </div>

        {/* TABLE */}
        <div className={cx("right")}>
          {loading ? (
            <div className={cx("loading")}>Đang tải dữ liệu...</div>
          ) : (
            <CategoryTable
              data={childCategories}
              title={`Danh mục ${selectedParent ? `${selectedParent.name}` : ""}`}
              search={searchChildren}
              setSearch={setSearchChildren}
              onSearch={fetch}
              onAdd={() => {
                if (!selectedParent) {
                  alert("Vui lòng chọn danh mục cha trước");
                  return;
                }
                setCreateType("child");
                handleCreate();
              }}
              onEdit={handleEdit}
              onDelete={handleAskDelete}
            />
          )}
        </div>
      </div>
      <CategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editing={editing}
        parentId={
          editing
            ? editing.parentId
            : createType === "parent"
              ? null
              : selectedParent?.id
        }
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={showConfirm}
        title="Xóa danh mục"
        message="Bạn có chắc muốn xóa danh mục này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default AdminCategoryPage;
