import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../ReviewManagement.module.scss";
import { getStatistics } from "../../../../api/ReviewManagementApi";


const cx = classNames.bind(styles);

export default function ReviewStatistics({ productId }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviewsWithImages: 0,
    reviewsWithoutReply: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, [productId]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getStatistics(productId);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={cx("loading")}>Đang tải...</div>;

  return (
    <div className={cx("statistics-card")}>

      <div className={cx("stat-content")}>
        {/* Average Rating */}
        <div className={cx("stat-item", "highlight")}>
          <div className={cx("stat-label")}>Sao trung bình</div>
          <div className={cx("stat-value")}>{stats.averageRating}</div>
          <div className={cx("stat-detail")}>
            {"⭐".repeat(Math.round(stats.averageRating || 0))}
          </div>
        </div>

        {/* Total Reviews */}
        <div className={cx("stat-item")}>
          <div className={cx("stat-label")}>Tổng đánh giá</div>
          <div className={cx("stat-value")}>{stats.totalReviews}</div>
          <div className={cx("stat-detail")}>lượt đánh giá</div>
        </div>

        {/* Reviews with Images */}
        <div className={cx("stat-item")}>
          <div className={cx("stat-label")}>Có hình ảnh</div>
          <div className={cx("stat-value")}>{stats.reviewsWithImages}</div>
          <div className={cx("stat-detail")}>
            {stats.totalReviews > 0
              ? `${Math.round((stats.reviewsWithImages / stats.totalReviews) * 100)}%`
              : "0%"}
          </div>
        </div>

        {/* Without Reply */}
        <div className={cx("stat-item")}>
          <div className={cx("stat-label")}>Chưa trả lời</div>
          <div className={cx("stat-value")}>{stats.reviewsWithoutReply}</div>
          <div className={cx("stat-detail")}>cần xử lý</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className={cx("rating-distribution")}>
        <h4>Phân bố đánh giá</h4>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingCount[rating] || 0;
          const percent =
            stats.totalReviews > 0
              ? (count / stats.totalReviews) * 100
              : 0;

          return (
            <div key={rating} className={cx("distribution-row")}>
              <span className={cx("rating-label")}>{rating}⭐</span>
              <div className={cx("progress-bar")}>
                <div
                  className={cx("progress-fill")}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className={cx("rating-count")}>
                {count} ({percent.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
