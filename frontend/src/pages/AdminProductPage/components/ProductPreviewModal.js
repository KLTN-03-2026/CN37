import classNames from "classnames/bind";
import styles from "./ProductPreviewModal.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import ProductGallery from "../../ProductDetail/components/ProductGallery";
import ProductInfo from "../../ProductDetail/components/ProductInfo";
import ProductDescription from "../../ProductDetail/components/ProductDescription";
import ProductSpecifications from "../../ProductDetail/components/ProductSpecifications";
import { useState } from "react";
import EditProductInfo from "./EditProductForm/EditProductInfo";
import EditProductDescription from "./EditProductForm/EditProductDescription";
import EditProductSpec from "./EditProductForm/EditProductSpec";
import EditProductGallery from "./EditProductForm/EditProductGallery";

const cx = classNames.bind(styles);

export default function ProductPreviewModal({ product, onEdit, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false);
  if (!product) return null;

  const handleEditClick = () => {
    setIsEditMode(!isEditMode); // Pass the product ID to the parent component
  };
  const handleSaveClick = () => {
    onEdit(product.id);
  };

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={cx("header")}>
          <h3>Chi tiết sản phẩm</h3>
          <div className={cx("btnActions")}>
            {isEditMode ? (
              <div className={cx("btnActions")}>
                <button className={cx("btnEdit")} onClick={handleEditClick}>
                  <TiCancel />
                </button>
                <button className={cx("btnEdit")} onClick={handleSaveClick}>
                  <FaSave />
                </button>
              </div>
            ) : (
              <button className={cx("btnEdit")} onClick={handleEditClick}>
                <AiFillEdit />
              </button>
            )}
            <button className={cx("btnClose")} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className={cx("body")}>
          {/* ROW 1 */}
          <div className={cx("row")}>
            {isEditMode ? (
              <EditProductGallery
                images={product.images}
                newImages={product.newImages}
                deletedImageIds={product.deletedImageIds}
                // setFormData={setFormData}
              />
            ) : (
              <ProductGallery images={product.images} />
            )}

            {isEditMode ? (
              <EditProductInfo data={product} onChange={handleEditClick} />
            ) : (
              <ProductInfo product={product} isAdminPreview />
            )}
          </div>

          {/* ROW 2 */}
          <div className={cx("row")}>
            {isEditMode ? (
              <EditProductDescription
                data={product}
                onChange={handleEditClick}
              />
            ) : (
              <ProductDescription description={product.description} />
            )}
            {isEditMode ? (
              <EditProductSpec
                specs={product.specifications}
                // setFormData={setFormData}
              />
            ) : (
              <ProductSpecifications specs={product.specifications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
