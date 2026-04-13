import { useEffect, useState } from "react";
import styles from "./AdminCategoryPage.module.scss";
import classNames from "classnames/bind";

import CategoryTable from "./components/CategoryTable";
import CategoryForm from "./components/CategoryForm";
import {
  getAdminCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/CategoryApi";

const cx = classNames.bind(styles);

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchChildren, setSearchChildren] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

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
    setSearchChildren("")
  }, [selectedParent]);

  useEffect(() => {
    fetch();
  }, []);

  // ===== CRUD =====
  const handleCreate = async (data) => {
    try {
      await createCategory(data);
      fetch();
    } catch (err) {
      alert("Tạo danh mục thất bại");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateCategory(id, data);
      fetch();
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    try {
      await deleteCategory(id);
      fetch();
    } catch (err) {
      alert("Xóa thất bại");
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
              onEdit={setEditing}
              onDelete={handleDelete}
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
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategoryPage;
