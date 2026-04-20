import { useEffect, useState } from "react";
import styles from "./EditProductInfo.module.scss";
import classNames from "classnames/bind";
import { getAdminCategory } from "../../../../api/CategoryApi";

const cx = classNames.bind(styles);

export default function EditProductInfo({ data, onChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [search, setSearch] = useState("");

  const parentCategories = categories.filter((c) => !c.parentId);

  const childCategories = categories.filter(
    (c) => c.parentId == selectedParent,
  );

  const fetch = async () => {
    const resCategory = await getAdminCategory({ search });
    setCategories(resCategory);
  };


  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedParent(data.parentcategoryId);
      setSelectedChild(data.categoryId);
    }
  }, [data]);


  return (
    <div className={cx("wrapper")}>
      <div className={cx("category-box")}>
        <div className={cx("category-row")}>
          {/* Parent */}
          <select
            value={selectedParent || ""}
            onChange={(e) => {
              setSelectedParent(e.target.value);
              setSelectedChild("");
              onChange("parentcategoryId", e.target.value);
            }}
          >
            <option value="">-- Danh mục cha --</option>
            {parentCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Child */}
          <select
            value={selectedChild || ""}
            onChange={(e) => {
              setSelectedChild(e.target.value);
              onChange("categoryId", e.target.value);
            }}
          >
            <option value="">-- Danh mục con --</option>
            {childCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={cx("formGroup")}>
        <p>Tên sản phẩm:</p>
        <input
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        <p>Thương hiệu:</p>
        <input
          value={data.brand}
          onChange={(e) => onChange("brand", e.target.value)}
        />
      </div>

      <div className={cx("grid")}>
        <div className={cx("formGroup")}>
          <p>Giá tiền gốc:</p>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </div>

        <div className={cx("formGroup")}>
          <p>Giá tiền sau giảm giá:</p>
          <input
            type="number"
            value={data.discountPrice}
            onChange={(e) => onChange("discountPrice", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
