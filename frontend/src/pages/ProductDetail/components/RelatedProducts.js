import classNames from "classnames/bind";
import styles from "..//ProductDetail.module.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

export default function RelatedProducts({ related = [] }) {
  const navigate = useNavigate();

  const handleProduct = (slug) => {
    if (!slug) return;
    navigate(`/product/${slug}`);
    window.scrollTo(0, 0);
  };
  console.log(related.thumbnail);
  

  return (
    <div className={cx("related")}>
      <h2>Related Products</h2>
      <div className={cx("list")}>
        {related.map((p) => (
          <div
            key={p.id}
            className={cx("card")}
            onClick={() => handleProduct(p.slug)}
          >
            {/* IMAGE */}
            <div className={cx("image-wrap")}>
              <img src={p.thumbnail} />

              {p.discountPercent && (
                <span className={cx("badge")}>-{p.discountPercent}%</span>
              )}
            </div>

            {/* NAME */}
            <h4 className={cx("name-product")}>{p.name}</h4>

            {/* PRICE */}
            <div className={cx("price-box-product")}>
              <span className={cx("price-sale")}>
                {p.discountPrice?.toLocaleString() || p.price.toLocaleString()}đ
              </span>

              {p.discountPrice && (
                <span className={cx("price-original")}>
                  {p.price.toLocaleString()}đ
                </span>
              )}
            </div>

            {/* RATING */}
            <div className={cx("rating")}>
              ⭐ {p.ratingAvg}
              <span>({p.ratingCount})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
