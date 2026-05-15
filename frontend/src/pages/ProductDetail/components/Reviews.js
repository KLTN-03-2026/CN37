import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";

import { createReview, getReview } from "../../../api/ReviewApi";

const cx = classNames.bind(styles);

export default function Reviews({ productId }) {
  const [reviewData, setReviewData] = useState({
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
    images: [],
  });

  const [comment, setComment] = useState("");

  const [rating, setRating] = useState(5);

  const [filter, setFilter] = useState("all");

  const [images, setImages] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  // ================= FETCH REVIEW =================

  const fetchReviews = async () => {
    try {
      const res = await getReview(productId);

      setReviewData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // ================= CALCULATE =================

  const total = reviewData.totalReviews;

  const avg = reviewData.averageRating;

  const countByStar = (star) =>
    reviewData.reviews.filter((r) => r.rating === star).length;

  const filteredReviews =
    filter === "all"
      ? reviewData.reviews
      : reviewData.reviews.filter((r) => r.rating === filter);

  // ================= IMAGE =================

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const preview = files.map((file) => URL.createObjectURL(file));

    setPreviewImages(preview);
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productId", productId);

      formData.append("rating", rating);

      formData.append("comment", comment);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createReview(formData);

      // reset
      setComment("");
      setRating(5);
      setImages([]);
      setPreviewImages([]);

      // reload
      fetchReviews();

      alert("Đánh giá thành công");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("reviews")}>
      <h2>Đánh giá & bình luận</h2>

      {/* ===== SUMMARY ===== */}

      <div className={cx("summary")}>
        <div className={cx("avg")}>
          <h1>{avg}</h1>

          <p>{total} lượt đánh giá</p>

          <div className={cx("stars")}>{"⭐".repeat(Math.round(avg || 0))}</div>
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
                    style={{
                      width: `${percent}%`,
                    }}
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
          className={cx({
            active: filter === "all",
          })}
          onClick={() => setFilter("all")}
        >
          Tất cả ({total})
        </button>

        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={cx({
              active: filter === star,
            })}
            onClick={() => setFilter(star)}
          >
            {star}⭐ ({countByStar(star)})
          </button>
        ))}
      </div>

      {/* ===== INPUT ===== */}
      {/* <div className={cx("review-input")}>

        <textarea
          placeholder="Nhập nội dung bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

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

          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            id="upload"
            onChange={handleSelectImages}
          />

          <button
            className={cx("upload-btn")}
            onClick={() => document.getElementById("upload").click()}
          >
            + Hình ảnh
          </button>
        </div>

        {previewImages.length > 0 && (
          <div className={cx("preview-list")}>
            {previewImages.map((img, index) => (
              <img key={index} src={img} alt="" />
            ))}
          </div>
        )}
        <button
          className={cx("submit-btn")}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </div> */}

      {/* ===== LIST ===== */}

      <div className={cx("review-list")}>
        {filteredReviews.map((r) => (
          <div key={r.id} className={cx("review-item")}>
            <div className={cx("review-header")}>
              <div>
                <strong>{r.email}</strong>
                <div className={cx("verified")}>✓ Đã mua hàng</div>
              </div>

              <span>⭐ {r.rating}</span>
            </div>

            <p>{r.comment}</p>

            {/* REVIEW IMAGES */}

            {r.images?.length > 0 && (
              <div className={cx("review-images")}>
                {r.images.map((img, index) => (
                  <div
                    key={index}
                    className={cx("image-wrapper")}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Review ${index}`}
                      onError={(e) => {
                        console.error(`Failed to load image: ${img}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {r.hasReply && r.replyContent && (
              <div className={cx("reply-section")}>
                <div className={cx("reply-header")}>
                  <span className={cx("seller-badge")}>Người bán</span>
                  <span className={cx("reply-date")}>
                    {new Date(r.replyCreatedAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </div>
                <p className={cx("reply-content")}>{r.replyContent}</p>
              </div>
            )}

            <span className={cx("date")}>
              {new Date(r.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        ))}
      </div>

      {/* ===== IMAGE MODAL ===== */}
      {selectedImage && (
        <div
          className={cx("image-modal")}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className={cx("modal-content")}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cx("modal-close")}
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img src={selectedImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
}
