import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { GrPowerReset } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import styles from "./ProductFilter.module.scss";
import { getAdminCategory } from "../../../api/CategoryApi";

const cx = classNames.bind(styles);

function ProductFilter({ filter, setFilter, onAdd }) {
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [search, setSearch] = useState("");

  const parentCategories = categories.filter(
    (c) => !c.parentId,
  );

  const childCategories = categories.filter(
    (c) =>
      c.parentId == selectedParent,
  );

  const fetch = async () => {
    const resCategory = await getAdminCategory({search});
    setCategories(resCategory);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleParentCategory = (e) => {
    setFilter({
      ...filter,
      parentCategoryId: e.target.value,
      categoryId: "",
    });
    setSelectedParent(e.target.value)
  };

  return (
    <div className={cx("filter")}>
      <input
        className={cx("input")}
        placeholder="Tìm sản phẩm..."
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
      />

      <select
        className={cx("select")}
        value={filter.parentCategoryId}
        onChange={handleParentCategory}
      >
        <option value="">Danh mục cha</option>
        {parentCategories.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className={cx("select")}
        value={filter.categoryId}
        onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
      >
        <option value="">Danh mục con</option>
        {childCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        className={cx("btn", "reset")}
        onClick={() =>
          setFilter({
            search: "",
            parentCategoryId: "",
            categoryId: "",
          })
          
        }
      >
        <GrPowerReset />
      </button>

      <button className={cx("btn", "add")} onClick={onAdd}>
        <IoMdAdd />
      </button>
    </div>
  );
}

export default ProductFilter;
