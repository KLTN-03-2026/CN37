import classNames from "classnames/bind";
import styles from "./ProductPreviewModal.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import ProductGallery from "../../ProductDetail/components/ProductGallery";
import ProductInfo from "../../ProductDetail/components/ProductInfo";
import ProductDescription from "../../ProductDetail/components/ProductDescription";
import ProductSpecifications from "../../ProductDetail/components/ProductSpecifications";
import { useEffect, useState } from "react";
import EditProductInfo from "./EditProductForm/EditProductInfo";
import EditProductDescription from "./EditProductForm/EditProductDescription";
import EditProductSpec from "./EditProductForm/EditProductSpec";
import EditProductGallery from "./EditProductForm/EditProductGallery";

const cx = classNames.bind(styles);

export default function ProductPreviewModal({ product, onEdit, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        newImages: [],
        deletedImageIds: [],
      });
    }
  }, [product]);

  useEffect(() => {
    return () => {
      formData?.newImages?.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [formData?.newImages]);

  if (!product || !formData) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = () => {
    if (isEditMode) {
      // reset lại dữ liệu gốc
      setFormData({
        ...product,
        newImages: [],
        deletedImageIds: [],
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveClick = async () => {
    const form = new FormData();

    form.append("Id", formData.id);
    form.append("Name", formData.name);
    form.append("Slug", formData.slug);
    form.append("CategoryId", formData.categoryId);
    form.append("Brand", formData.brand || "");
    form.append("Description", formData.description || "");
    form.append("Price", formData.price);
    form.append("DiscountPrice", formData.discountPrice || 0);
    form.append("IsActive", formData.isActive);

    // specs
    formData.specifications?.forEach((s, i) => {
      form.append(`Specifications[${i}].SpecName`, s.specName);
      form.append(`Specifications[${i}].SpecValue`, s.specValue);
    });

    // ảnh mới
    formData.newImages?.forEach((img) => {
      form.append("NewImages", img.file);
    });

    // ảnh xóa
    formData.deletedImageIds?.forEach((id) => {
      form.append("DeletedImageIds", id);
    });

    onEdit(formData.id, form);
    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log(formData);
    

    setIsEditMode(false);
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
                images={formData.images}
                newImages={formData.newImages}
                deletedImageIds={formData.deletedImageIds}
                setFormData={setFormData}
              />
            ) : (
              <ProductGallery images={product.images} />
            )}

            {isEditMode ? (
              <EditProductInfo data={formData} onChange={handleChange} />
            ) : (
              <ProductInfo product={product} isAdminPreview />
            )}
          </div>

          {/* ROW 2 */}
          <div className={cx("row")}>
            {isEditMode ? (
              <EditProductDescription data={formData} onChange={handleChange} />
            ) : (
              <ProductDescription description={product.description} />
            )}
            {isEditMode ? (
              <EditProductSpec
                specs={formData.specifications}
                setFormData={setFormData}
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
