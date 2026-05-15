import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReviewManagement.module.scss";

import ReviewStatistics from "./components/ReviewStatistics";
import ReviewList from "./components/ReviewList";
import { notifyError } from "../../../components/Nofitication";
import { getAllReview } from "../../../api/ReviewManagementApi";

const cx = classNames.bind(styles);

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [productId, setProductId] = useState(null);
  const [rating, setRating] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, hasImages, withoutImages, noReply

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        pageSize,
        productId: productId || undefined,
        rating: rating || undefined,
      };

      // Apply filter type
      if (filterType === "hasImages") {
        params.hasImages = true;
      } else if (filterType === "withoutImages") {
        params.hasImages = false;
      } else if (filterType === "noReply") {
        params.noReply = true;
      }

      const response = await getAllReview(params);
      const data = response.data?.data || response.data || [];

      setReviews(data);
      setHasMore(data.length === pageSize);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      notifyError("Có lỗi xảy ra khi tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [rating, filterType, productId]);

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
    setPage(1);
  };

  const handleRatingFilter = (newRating) => {
    setRating(newRating === rating ? null : newRating);
    setPage(1);
  };

  return (
    <div className={cx("review-management")}>
      <div className={cx("container")}>
        <div className={cx("topBar")}>
          <h2 className={cx("title")}>Quản lý đánh giá</h2>
        </div>

        {/* STATISTICS */}
        <ReviewStatistics productId={productId} />

        {/* FILTERS & SEARCH */}
        <div className={cx("filters-section")}>
          <div className={cx("filter-group")}>
            <label>Lọc theo sao:</label>
            <div className={cx("star-filters")}>
              <button
                className={cx("filter-btn", {
                  active: rating === null,
                })}
                onClick={() => handleRatingFilter(null)}
              >
                Tất cả
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  className={cx("filter-btn", {
                    active: rating === star,
                  })}
                  onClick={() => handleRatingFilter(star)}
                >
                  {star}⭐
                </button>
              ))}
            </div>
          </div>

          <div className={cx("filter-group")}>
            <label>Loại đánh giá:</label>
            <div className={cx("type-filters")}>
              <button
                className={cx("filter-btn", {
                  active: filterType === "all",
                })}
                onClick={() => handleFilterChange("all")}
              >
                Tất cả
              </button>
              <button
                className={cx("filter-btn", {
                  active: filterType === "hasImages",
                })}
                onClick={() => handleFilterChange("hasImages")}
              >
                📷 Có ảnh
              </button>
              <button
                className={cx("filter-btn", {
                  active: filterType === "withoutImages",
                })}
                onClick={() => handleFilterChange("withoutImages")}
              >
                📝 Chỉ text
              </button>
              <button
                className={cx("filter-btn", {
                  active: filterType === "noReply",
                })}
                onClick={() => handleFilterChange("noReply")}
              >
                ⚠ Chưa trả lời
              </button>
            </div>
          </div>
        </div>

        {/* REVIEW LIST */}
        <ReviewList
          reviews={reviews}
          loading={loading}
          onRefresh={() => fetchReviews(page)}
        />

        {/* PAGINATION */}
        <div className={cx("pagination")}>
          <button
            className={cx("prev-btn")}
            onClick={() => fetchReviews(page - 1)}
            disabled={page === 1}
          >
            ← Trang trước
          </button>

          <span className={cx("page-info")}>Trang {page}</span>

          <button
            className={cx("next-btn")}
            onClick={() => fetchReviews(page + 1)}
            disabled={!hasMore}
          >
            Trang sau →
          </button>
        </div>
      </div>
    </div>
  );
}
