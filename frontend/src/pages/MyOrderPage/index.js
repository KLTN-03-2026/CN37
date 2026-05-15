import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./MyOrderPage.module.scss";
import { getOrders, cancelOrder, getCountByStatus } from "../../api/OrderApi";
import ConfirmDialog from "../../components/ConfirmDialog";
import { notifyError, notifySuccess } from "../../components/Nofitication";

import OrderTabs from "./components/OrderTabs";
import OrderSearch from "./components/OrderSearch";
import OrderList from "./components/OrderList";
import EmptyState from "./components/EmptyState";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/ReviewApi";

const cx = classNames.bind(styles);

export default function MyOrderPage() {
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [countByStatus, setCountByStatus] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [images, setImages] = useState([]);

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    const res = await getOrders({ status, keyword });
    setOrders(res.data);
  };

  const fetchCounts = async () => {
    const res = await getCountByStatus();

    const map = {};
    res.data.forEach((item) => {
      map[item.status] = item.count;
    });

    setCountByStatus(map);
  };

  const handleOpenReview = (productId, orderId) => {
    setSelectedProduct(productId);
    setSelectedOrder(orderId);
    setShowReviewModal(true);
  };

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files);

    // lưu file thật
    setImages((prev) => [...prev, ...files]);

    // tạo preview
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("comment", comment);
      formData.append("rating", rating);
      formData.append("productId", selectedProduct);
      formData.append("orderId", selectedOrder);

      images.forEach((image) => {
        formData.append("images", image);
      });

      await createReview(formData);

      notifySuccess("Đánh giá thành công");

      setShowReviewModal(false);

      setComment("");
      setRating(5);
      setImages([]);
      setPreviewImages([]);
      fetchOrders();
    } catch (error) {
      notifyError("Gửi đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await cancelOrder(orderId);
      fetchOrders();
      notifySuccess("Hủy đơn hàng thành công");
    } catch (error) {
      const message = error.response?.data?.message || "Hủy đơn hàng thất bại";
      notifyError(message);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleEditAddress = (orderId) => {
    console.log(orderId);
  };

  const handleAskCancel = (orderId) => {
    setDeleteId(orderId);
    setShowConfirm(true);
  };

  useEffect(() => {
    fetchOrders();
    fetchCounts();
  }, [status, keyword]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("topBar")}>
        <h2 className={cx("title")}>Đơn hàng của tôi</h2>
        <OrderSearch onSearch={setKeyword} />
      </div>

      <div className={cx("content")}>
        <OrderTabs onChange={setStatus} counts={countByStatus} />

        <div className={cx("list")}>
          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <OrderList
              orders={orders}
              onCancel={handleAskCancel}
              onEditAddress={handleEditAddress}
              refresh={fetchOrders}
              onReview={(productId, orderId) => handleOpenReview(productId, orderId)}
            />
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Hủy đơn hàng"
        message="Bạn có chắc muốn hủy đơn hàng này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={() => handleCancelOrder(deleteId)}
        onCancel={() => setShowConfirm(false)}
      />
      {showReviewModal && (
        <div className={cx("review-modal-overlay")}>
          <div className={cx("review-modal")}>
            <div className={cx("review-header")}>
              <h3>Đánh giá sản phẩm</h3>

              <button onClick={() => setShowReviewModal(false)}>✕</button>
            </div>

            <div className={cx("review-input")}>
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
                    <div key={index} className={cx("preview-item")}>
                      <img src={img} alt="" />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
