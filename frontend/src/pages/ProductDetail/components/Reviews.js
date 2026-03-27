import { useState } from "react";
import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function Reviews({ reviews = [] }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [filter, setFilter] = useState("all");

  // ===== CALCULATE =====
  const total = reviews.length;

  const avg =
    total === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  const countByStar = (star) => reviews.filter((r) => r.rating === star).length;

  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.rating === filter);

  return (
    <div className={cx("reviews")}>
      <h2>Đánh giá & bình luận</h2>

      {/* ===== SUMMARY ===== */}
      <div className={cx("summary")}>
        <div className={cx("avg")}>
          <h1>{avg}</h1>
          <p>{total} lượt đánh giá</p>
          <div className={cx("stars")}>⭐⭐⭐⭐⭐</div>
        </div>

        <div className={cx("bars")}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = countByStar(star);
            const percent = total ? (count / total) * 100 : 0;

            return (
              <div key={star} className={cx("bar-row")}>
                <span>{star}⭐</span>
                <div className={cx("bar")}>
                  <div
                    className={cx("fill")}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className={cx("filters")}>
        <button
          className={cx({ active: filter === "all" })}
          onClick={() => setFilter("all")}
        >
          Tất cả ({total})
        </button>

        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={cx({ active: filter === star })}
            onClick={() => setFilter(star)}
          >
            {star}⭐ ({countByStar(star)})
          </button>
        ))}
      </div>

      {/* ===== INPUT ===== */}
      <div className={cx("review-input")}>
        {/* 60% textarea */}
        <textarea
          placeholder="Nhập nội dung bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* 10% rating + upload */}
        <div className={cx("tools")}>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>⭐ 5</option>
            <option value={4}>⭐ 4</option>
            <option value={3}>⭐ 3</option>
            <option value={2}>⭐ 2</option>
            <option value={1}>⭐ 1</option>
          </select>
          <input type="file" hidden id="upload" />
          <button className={cx("upload-btn")} onClick={() => document.getElementById("upload").click()}>+ Hình ảnh</button>
        </div>

        {/* 30% submit */}
        <button className={cx("submit-btn")}>Gửi bình luận</button>
      </div>

      {/* ===== LIST ===== */}
      <div className={cx("review-list")}>
        {filteredReviews.map((r) => (
          <div key={r.id} className={cx("review-item")}>
            <div className={cx("review-header")}>
              <strong>{r.user}</strong>
              <span>⭐ {r.rating}</span>
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
