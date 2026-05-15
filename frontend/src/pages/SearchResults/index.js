import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";
import { searchProducts } from "../../api/ProductApi";
import styles from "./SearchResults.module.scss";
import classNames from "classnames/bind";
import ProductGrid from "../../pages/CategoryPage/components/ProductGrid";

const cx = classNames.bind(styles);

function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(keyword);

        // Sort results based on selection
        let sorted = [...data];
        switch (sortBy) {
          case "price-asc":
            sorted.sort(
              (a, b) =>
                (a.discountPrice || a.price) - (b.discountPrice || b.price),
            );
            break;
          case "price-desc":
            sorted.sort(
              (a, b) =>
                (b.discountPrice || b.price) - (a.discountPrice || a.price),
            );
            break;
          case "newest":
            sorted.sort((a, b) => b.id - a.id);
            break;
          case "relevance":
          default:
            // Already sorted by API
            break;
        }

        setResults(sorted);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword, sortBy]);

  return (
    <div className={cx("searchResults")}>
      <div className={cx("container")}>
        {/* Header */}
        <div className={cx("header")}>
          <div className={cx("titleSection")}>
            <FaSearch className={cx("icon")} />
            <h1 className={cx("title")}>
              Kết quả tìm kiếm: "<span>{keyword}</span>"
            </h1>
          </div>
          <p className={cx("count")}>
            Tìm được <strong>{results.length}</strong> sản phẩm
          </p>
        </div>

        {/* Sort */}
        {results.length > 0 && (
          <div className={cx("sortBar")}>
            <div className={cx("sortGroup")}>
              <FaSortAmountDown />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={cx("sortSelect")}
              >
                <option value="relevance">Liên quan nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className={cx("loading")}>
            <div className={cx("spinner")}></div>
            <p>Đang tìm kiếm...</p>
          </div>
        ) : results.length > 0 ? (
            <ProductGrid products={results} />
        ) : (
          <div className={cx("empty")}>
            <div className={cx("emptyIcon")}>📦</div>
            <h2>Không tìm thấy sản phẩm nào</h2>
            <p>Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
