import classNames from "classnames/bind";
import styles from "./ProductPreviewModal.module.scss";
import ProductGallery from "../../ProductDetail/components/ProductGallery";
import ProductInfo from "../../ProductDetail/components/ProductInfo";
import ProductDescription from "../../ProductDetail/components/ProductDescription";
import ProductSpecifications from "../../ProductDetail/components/ProductSpecifications";
import { useState } from "react";

const cx = classNames.bind(styles);

export default function ProductPreviewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={cx("header")}>
          <h3>Chi tiết sản phẩm</h3>
          <button className={cx("btnClose")} onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className={cx("body")}>
          {/* ROW 1 */}
          <div className={cx("row")}>
            <ProductGallery images={product.images} />

            {/* ⚠️ dùng bản info rút gọn */}
            <ProductInfo product={product} isAdminPreview />
          </div>

          {/* ROW 2 */}
          <div className={cx("row")}>
            <ProductDescription description={product.description} />
            <ProductSpecifications specs={product.specifications} />
          </div>
        </div>
      </div>
    </div>
  );
}
