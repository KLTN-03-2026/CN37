import classNames from "classnames/bind";
import styles from "./EditProductGallery.module.scss";

const cx = classNames.bind(styles);

export default function EditProductGallery({
  images = [],
  newImages = [],
  deletedImageIds = [],
  setFormData,
}) {
  // thêm ảnh
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);

    const previewFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...previewFiles],
    }));
  };

  // xóa ảnh
  const handleRemoveImage = (img, isNew = false) => {
    if (isNew) {
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((i) => i !== img),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((i) => i.id !== img.id),
        deletedImageIds: [...prev.deletedImageIds, img.id],
      }));
    }
  };

  return (
    <div className={cx("gallery")}>
      {/* ẢNH CŨ */}
      {images.map((img) => (
        <div key={img.id} className={cx("imgItem")}>
          <img src={img.imageUrl} alt="" />
          <span
            className={cx("remove")}
            onClick={() => handleRemoveImage(img)}
          >
            ✕
          </span>
        </div>
      ))}

      {/* ẢNH MỚI */}
      {newImages.map((img, index) => (
        <div key={index} className={cx("imgItem")}>
          <img src={img.preview} alt="" />
          <span
            className={cx("remove")}
            onClick={() => handleRemoveImage(img, true)}
          >
            ✕
          </span>
        </div>
      ))}

      {/* UPLOAD */}
      <label className={cx("uploadBox")}>
        ➕
        <input type="file" multiple hidden onChange={handleAddImages} />
      </label>
    </div>
  );
}