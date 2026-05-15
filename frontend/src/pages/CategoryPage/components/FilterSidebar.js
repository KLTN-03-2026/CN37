import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";
import { useState } from "react";


const cx = classNames.bind(styles);

const MIN_PRICE = 0;
const MAX_PRICE = 60000000;
const HARD_MAX = 60000000;
const SAFE_MAX = 59999999;


function FilterSidebar({ products = [], allProducts = [], onFilterChange }) {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const formatPrice = (value) => {
    if (!value && value !== 0) return "";
    return Number(value).toLocaleString("vi-VN");
  };
  const [minInput, setMinInput] = useState(formatPrice(MIN_PRICE));
  const [maxInput, setMaxInput] = useState(formatPrice(MAX_PRICE));
  const [sort, setSort] = useState("discount");

  const brands = Array.from(new Set(allProducts.map((p) => p.brand)));

  const clampPrice = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const updateFilter = (newState) => {
    onFilterChange?.({
      brands: newState.brands ?? selectedBrands,
      priceRange: newState.priceRange ?? priceRange,
      sort: newState.sort ?? sort,
    });
  };

  // ===== Brand =====
  const toggleBrand = (brand) => {
    let updated;

    if (selectedBrands.includes(brand)) {
      updated = selectedBrands.filter((b) => b !== brand);
    } else {
      updated = [...selectedBrands, brand];
    }

    setSelectedBrands(updated);
    updateFilter({ brands: updated });
  };

  // ===== Sort =====
  const handleSort = (e) => {
    setSort(e.target.value);
    updateFilter({ sort: e.target.value });
  };

  // ===== Reset =====
  const resetFilters = () => {
    const reset = {
      brands: [],
      priceRange: [MIN_PRICE, MAX_PRICE],
      sort: "discount",
    };

    setSelectedBrands([]);
    setPriceRange(reset.priceRange);
    setSort(reset.sort);
    setMinInput(MIN_PRICE);
    setMaxInput(MAX_PRICE.toLocaleString())

    updateFilter(reset);
  };

  return (
    <div className={cx("filter")}>
      <h3 className={cx("title")}>Bộ lọc sản phẩm</h3>

      {/* SORT */}
      <div className={cx("section")}>
        <p className={cx("label")}>Sắp xếp</p>
        <select className={cx("select")} value={sort} onChange={handleSort}>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
          <option value="discount">Giảm giá nhiều nhất</option>
        </select>
      </div>

      {/* PRICE */}
      <div className={cx("section")}>
        <p className={cx("label")}>Khoảng giá</p>

        <div className={cx("priceInputs")}>
          <input
            value={minInput}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              if (raw === "") {
                setMinInput("");
                return;
              }

              let value = Number(raw);

              value = clampPrice(value, MIN_PRICE, priceRange[1] - 500000);

              const newRange = [value, priceRange[1]];

              setPriceRange(newRange);
              setMinInput(formatPrice(value));

              updateFilter({
                priceRange: newRange,
              });
            }}
          />

          <span className={cx("dash")}>đến</span>

          <input
            className={cx("priceInput")}
            value={maxInput}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              if (raw === "") {
                setMaxInput("");
                return;
              }

              let value = Number(raw);

              // 🔥 CHẶN VƯỢT 60TR
              value = clampPrice(value, priceRange[0] + 500000, SAFE_MAX);

              const newRange = [priceRange[0], value];

              setPriceRange(newRange);
              setMaxInput(formatPrice(value));

              updateFilter({
                priceRange: newRange,
              });
            }}
          />
        </div>
      </div>

      {/* BRAND */}
      <div className={cx("section")}>
        <p className={cx("label")}>Thương hiệu</p>

        <div className={cx("brandList")}>
          {brands.map((brand) => (
            <label key={brand} className={cx("brandItem")}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RESET */}
      <button className={cx("resetBtn")} onClick={resetFilters}>
        Đặt lại bộ lọc
      </button>
    </div>
  );
}

export default FilterSidebar;
