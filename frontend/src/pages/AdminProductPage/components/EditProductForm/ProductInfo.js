import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProductInfo.module.scss";
import { getAdminCategory } from "../../../../api/CategoryApi";

const cx = classNames.bind(styles);

function ProductInfo({ product }) {
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
    if (product) {
      setSelectedParent(product.parentcategoryId);
      setSelectedChild(product.categoryId);
    }
  }, [product]);

  return (
    <div className={cx("info")}>
      <p className={cx("name")}>{product.name}</p>

      {/* ===== CATEGORY ===== */}
      <div className={cx("category-box")}>
        <div className={cx("category-row")}>
          {/* Parent */}
          <select
            value={selectedParent || ""}
            disabled={true}
            onChange={(e) => {
              setSelectedParent(e.target.value);
              setSelectedChild(null);
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
            disabled={true}
            onChange={(e) => setSelectedChild(e.target.value)}
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

      <div className={cx("rating-brand")}>
        <div className={cx("rating")}>
          <span>{`⭐ ${product.ratingAvg} (${product.ratingCount} reviews)`}</span>
        </div>
        <p className={cx("brand")}>{product.brand}</p>
      </div>

      <div className={cx("price-box")}>
        <div className={cx("price-main")}>
          <span className={cx("current-price")}>
            {(product.discountPrice || 0).toLocaleString()}đ
          </span>

          <div className={cx("old-price-row")}>
            <span className={cx("old-price")}>
              {(product.price || 0).toLocaleString()}đ
            </span>
            <span className={cx("discount-percent")}>
              - {product.discountPercent}%
            </span>
          </div>
        </div>
      </div>

      <div className={cx("actions")}></div>
    </div>
  );
}

export default ProductInfo;
