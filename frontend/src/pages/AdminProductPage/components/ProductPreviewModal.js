import classNames from "classnames/bind";
import styles from "./ProductPreviewModal.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";

import ProductGallery from "../../ProductDetail/components/ProductGallery";
import ProductInfo from "./EditProductForm/ProductInfo";
import ProductDescription from "../../ProductDetail/components/ProductDescription";
import ProductSpecifications from "../../ProductDetail/components/ProductSpecifications";

import EditProductInfo from "./EditProductForm/EditProductInfo";
import EditProductDescription from "./EditProductForm/EditProductDescription";
import EditProductSpec from "./EditProductForm/EditProductSpec";
import EditProductGallery from "./EditProductForm/EditProductGallery";

import { useProductForm } from "../../../hooks/useProductForm";

const cx = classNames.bind(styles);

export default function ProductPreviewModal({
  product,
  onCreate,
  onEdit,
  onClose,
  mode = "view",
}) {
  const {
    formData,
    setFormData,
    isEditMode,
    handleChange,
    toggleEdit,
    handleSubmit,
  } = useProductForm(product, mode, onCreate, onEdit);

  // cleanup preview images
  if (!formData) return null;

  return (
    <div className={cx("overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        
        {/* ===== HEADER ===== */}
        <div className={cx("header")}>
          <h3>
            {mode === "create"
              ? "Thêm sản phẩm"
              : isEditMode
              ? "Chỉnh sửa sản phẩm"
              : "Chi tiết sản phẩm"}
          </h3>

          <div className={cx("btnActions")}>
            {isEditMode ? (
              <>
                <button className={cx("btnEdit")} onClick={toggleEdit}>
                  <TiCancel />
                </button>
                <button className={cx("btnEdit")} onClick={handleSubmit}>
                  <FaSave />
                </button>
              </>
            ) : (
              <button className={cx("btnEdit")} onClick={toggleEdit}>
                <AiFillEdit />
              </button>
            )}

            <button className={cx("btnClose")} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className={cx("body")}>

          {/* ROW 1 */}
          <div className={cx("row")}>
            {isEditMode ? (
              <EditProductGallery
                images={formData.images}
                newImages={formData.newImages}
                deletedImageIds={formData.deletedImageIds}
                setFormData={setFormData}
              />
            ) : (
              <ProductGallery images={formData.images || []} />
            )}

            {isEditMode ? (
              <EditProductInfo data={formData} onChange={handleChange} />
            ) : (
              <ProductInfo product={formData} isAdminPreview />
            )}
          </div>

          {/* ROW 2 */}
          <div className={cx("row")}>
            {isEditMode ? (
              <EditProductDescription
                data={formData}
                onChange={handleChange}
              />
            ) : (
              <ProductDescription description={formData.description} />
            )}

            {isEditMode ? (
              <EditProductSpec
                specs={formData.specifications}
                setFormData={setFormData}
              />
            ) : (
              <ProductSpecifications specs={formData.specifications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}