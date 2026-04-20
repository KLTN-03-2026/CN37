import classNames from "classnames/bind";
import styles from "./ProductPreviewModal.module.scss";
import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import { notifyError } from "../../../components/Nofitication";
import ProductGallery from "../../ProductDetail/components/ProductGallery";
// import ProductInfo from "../../ProductDetail/components/ProductInfo";
import ProductInfo from "./EditProductForm/ProductInfo";
import ProductDescription from "../../ProductDetail/components/ProductDescription";
import ProductSpecifications from "../../ProductDetail/components/ProductSpecifications";
import { useEffect, useState } from "react";
import EditProductInfo from "./EditProductForm/EditProductInfo";
import EditProductDescription from "./EditProductForm/EditProductDescription";
import EditProductSpec from "./EditProductForm/EditProductSpec";
import EditProductGallery from "./EditProductForm/EditProductGallery";

const cx = classNames.bind(styles);

export default function ProductPreviewModal({
  product,
  onCreate,
  onEdit,
  onClose,
  mode = "view",
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const defaultProduct = {
    id: "",
    name: "",
    slug: "",
    parentcategoryId: "",
    categoryId: "",
    brand: "",
    description: "",
    price: 0,
    discountPrice: 0,
    isActive: true,
    images: [],
    specifications: [],
    newImages: [],
    deletedImageIds: [],
  };

  useEffect(() => {
    if (mode === "create") {
      setFormData(defaultProduct);
      setIsEditMode(true);
    } else if (product) {
      setFormData({
        ...product,
        newImages: [],
        deletedImageIds: [],
      });
    }
  }, [product, mode]);

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

  const validate = () => {
    if (formData.parentcategoryId === "") {
      notifyError("Vui lòng chọn danh mục cha");
      return false;
    }

    if (formData.categoryId === "") {
      notifyError("Vui lòng chọn danh mục con");
      return false;
    }

    if (!formData.name?.trim()) {
      notifyError("Vui lòng nhập tên sản phẩm");
      return false;
    }

    if (!formData.price) {
      notifyError("Vui lòng nhập giá");
      return false;
    }

    if (formData.discountPrice === null || formData.discountPrice === "") {
      notifyError("Vui lòng nhập giá giảm");
      return false;
    }

    if (formData.discountPrice > formData.price) {
      notifyError("Giá giảm phải nhỏ hơn hoặc bằng giá gốc");
      return false;
    }

    if (formData.price <= 0) {
      notifyError("Giá phải lớn hơn 0");
      return false;
    }

    if (formData.discountPrice < 0) {
      notifyError("Giá giảm không được âm");
      return false;
    }

    if (!formData.description?.trim()) {
      notifyError("Vui lòng nhập mô tả sản phẩm");
      return false;
    }

    if (formData.newImages.length === 0 && formData.images.length === 0) {
      notifyError("Vui lòng thêm ít nhất 1 ảnh");
      return false;
    }

    if (!formData.specifications?.length) {
      notifyError("Vui lòng thêm ít nhất 1 thông số kỹ thuật");
      return false;
    }

    if (formData.specifications.some((s) => !s.specName || !s.specValue)) {
      notifyError("Vui lòng điền đầy đủ thông số kỹ thuật");
      return false;
    }

    return true;
  };

  const handleSaveClick = async () => {
    if (!validate()) return;
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
    form.append("ParentCategoryId", formData.parentcategoryId);
    form.append("CategoryId", formData.categoryId);

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
