import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);

function FilterSidebar({ products = [], onFilterChange }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  // loại bỏ trùng lặp, trả về mảng string
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    onFilterChange?.({ brand, price: selectedPrice });
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    onFilterChange?.({ brand: selectedBrand, price });
  };

  return (
    <div className={cx("filter")}>
      <h3>Bộ lọc</h3>

      {/* Filter Brand */}
      <div>
        <p>Thương hiệu</p>
        {brands.map((c) => (
          <button
            key={c}
            value={c}
            onClick={() => handleBrandChange(c)}
            className={cx("tab-item", { active: selectedBrand === c })}
          >
            {c}
          </button>
        ))}
      </div>
      {/* Filter Price */}
      <div>
        <p>Giá</p>
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPrice === "under5"}
            onChange={() => handlePriceChange("under5")}
          />
          Dưới 5 triệu
        </label>
        <label>
          <input
            type="radio"
            name="price"
            checked={selectedPrice === "5to10"}
            onChange={() => handlePriceChange("5to10")}
          />
          5 - 10 triệu
        </label>
      </div>
    </div>
  );
}

export default FilterSidebar;
