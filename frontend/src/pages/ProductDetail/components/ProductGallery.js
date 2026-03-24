import { useState } from "react";
import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";

const cx = classNames.bind(styles);

export default function ProductGallery({ images = [] }) {
  const mainImage = images.find(img => img.is_main) || images[0];
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className={cx("gallery")}>
      <div className={cx("main-image")}>
        <img src={selectedImage?.image_url} alt="product" />
      </div>
      <div className={cx("thumbnails")}>
        {images.map(img => (
          <img
            key={img.id}
            src={img.image_url}
            alt="thumbnail"
            className={cx({ selected: img.id === selectedImage.id })}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}