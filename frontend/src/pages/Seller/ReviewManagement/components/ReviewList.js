import { useState } from "react";
import classNames from "classnames/bind";
import styles from "../ReviewManagement.module.scss";

import {addReply, deleteReply} from "../../../../api/ReviewManagementApi";
import { notifySuccess, notifyError, notifyWarning } from "../../../../components/Nofitication";

const cx = classNames.bind(styles);

export default function ReviewList({
  reviews,
  loading,
  onReplyAdded,
  onRefresh,
}) {
  const [expandedReview, setExpandedReview] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleReplyClick = (reviewId) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId);
    setReplyContent("");
  };

  const handleSubmitReply = async (reviewId) => {
    if (!replyContent.trim()) {
      notifyWarning("Vui lòng nhập nội dung trả lời");
      return;
    }

    try {
      setSubmitting(true);
      await addReply(reviewId, replyContent);
      notifySuccess("Trả lời thành công");
      setReplyingTo(null);
      setReplyContent("");
      onRefresh?.();
    } catch (error) {
      console.error("Error submitting reply:", error);
      notifyError(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (
      !window.confirm("Bạn chắc chắn muốn xóa câu trả lời này không?")
    )
      return;

    try {
      await deleteReply(replyId);
      notifySuccess("Xóa thành công");
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting reply:", error);
      notifyError(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (loading) {
    return <div className={cx("loading-container")}>Đang tải danh sách...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className={cx("empty-state")}>
        <p>Không có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className={cx("review-list")}>
      {reviews.map((review) => (
        <div key={review.id} className={cx("review-card")}>
          {/* HEADER */}
          <div className={cx("review-header")}>
            <div className={cx("user-info")}>
              <img
                src= "https://tuanluupiano.com/wp-content/uploads/2026/01/avatar-facebook-mac-dinh-6.jpg"
                alt={review.email}
                className={cx("avatar")}
              />
              <div className={cx("user-details")}>
                <strong>{review.email}</strong>
                <div className={cx("product-info")}>
                  {review.productName}
                </div>
              </div>
            </div>

            <div className={cx("review-rating")}>
              <span className={cx("stars")}>
                {"⭐".repeat(review.rating)}
              </span>
              <span className={cx("rating-text")}>{review.rating}/5</span>
            </div>
          </div>

          {/* CONTENT */}
          <div className={cx("review-content")}>
            <p className={cx("comment")}>{review.comment}</p>

            {/* IMAGES */}
            {review.images && review.images.length > 0 && (
              <div className={cx("review-images")}>
                {review.images.map((img, index) => (
                  <div
                    key={index}
                    className={cx("image-thumb")}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Review ${index}`} />
                    <span className={cx("expand-icon")}>🔍</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* METADATA */}
          <div className={cx("review-meta")}>
            <span className={cx("date")}>
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </span>

            {review.hasImages && (
              <span className={cx("badge", "has-images")}>
                📷 Có ảnh
              </span>
            )}

            {review.hasReply ? (
              <span className={cx("badge", "has-reply")}>
                ✓ Đã trả lời
              </span>
            ) : (
              <span className={cx("badge", "no-reply")}>
                ⚠ Chưa trả lời
              </span>
            )}
          </div>

          {/* REPLY SECTION */}
          {review.hasReply && review.replyContent && (
            <div className={cx("reply-section")}>
              <div className={cx("reply-header")}>
                <span className={cx("seller-badge")}>Người bán</span>
                <span className={cx("reply-date")}>
                  {new Date(
                    review.replyCreatedAt
                  ).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className={cx("reply-content")}>
                {review.replyContent}
              </p>
              <button
                className={cx("delete-reply-btn")}
                onClick={() => handleDeleteReply(review.id)}
              >
                Xóa trả lời
              </button>
            </div>
          )}

          {/* REPLY INPUT */}
          {!review.hasReply && (
            <div className={cx("reply-input-section")}>
              {replyingTo === review.id ? (
                <div className={cx("reply-form")}>
                  <textarea
                    placeholder="Nhập nội dung trả lời..."
                    value={replyContent}
                    onChange={(e) =>
                      setReplyContent(e.target.value)
                    }
                    className={cx("reply-textarea")}
                  />
                  <div className={cx("reply-buttons")}>
                    <button
                      className={cx("submit-reply-btn")}
                      onClick={() =>
                        handleSubmitReply(review.id)
                      }
                      disabled={submitting}
                    >
                      {submitting
                        ? "Đang gửi..."
                        : "Gửi trả lời"}
                    </button>
                    <button
                      className={cx("cancel-reply-btn")}
                      onClick={() =>
                        handleReplyClick(review.id)
                      }
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={cx("reply-btn")}
                  onClick={() =>
                    handleReplyClick(review.id)
                  }
                >
                  💬 Trả lời
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* IMAGE MODAL */}
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
            <img src={selectedImage} alt="Review" />
          </div>
        </div>
      )}
    </div>
  );
}
