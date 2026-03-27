import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);
const ONE_HOUR = 60 * 60;

export default function ProductInfo({ product }) {
  const {
    name,
    brand,
    price,
    discountPrice,
    ratingAvg,
    ratingCount,
    discountPercent,
    saleMoney,
  } = product;
  const [timeLeft, setTimeLeft] = useState(ONE_HOUR);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    return { hours, minutes, seconds };
  };

  const time = formatTime(timeLeft);

  return (
    <div className={cx("info")}>
      <p className={cx("name")}>{name}</p>
      <div className={cx("rating-brand")}>
        <div className={cx("rating")}>
          <span>{`⭐ ${ratingAvg} (${ratingCount} reviews)`}</span>
        </div>
        <p className={cx("brand")}>{brand}</p>
      </div>

      <img src="https://cdn2.fptshop.com.vn/unsafe/1080x0/filters:format(webp):quality(75)/507x85_phu_kien_1_cd87d1e516.png"></img>

      <div className={cx("price-box")}>
        <div className={cx("price-main")}>
          <span className={cx("current-price")}>
            {discountPrice.toLocaleString()}đ
          </span>

          <div className={cx("old-price-row")}>
            <span className={cx("old-price")}>{price.toLocaleString()}đ</span>
            <span className={cx("discount-percent")}>- {discountPercent}%</span>
          </div>

          <div className={cx("reward")}>🎁 +89 Điểm thưởng</div>
        </div>

        <p className={cx("promo-label")}>Chọn 1 trong các khuyến mãi sau:</p>

        {/* Flash sale */}
        <div className={cx("flash-sale")}>
          <div className={cx("flash-header")}>
            ⏰ GIỜ VÀNG GIÁ SỐC 🔥
            <span className={cx("sold")}>Đã bán 1/10 suất</span>
          </div>

          <div className={cx("flash-body")}>
            <div>
              <p>Giảm ngay</p>
              <strong>{saleMoney.toLocaleString()}đ ⚡</strong>
            </div>

            <div className={cx("countdown")}>
              <span>{time.hours}</span>:<span>{time.minutes}</span>:
              <span>{time.seconds}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("actions")}>
        <button className={cx("buy-btn")}>Mua ngay</button>
        <button className={cx("cart-btn")}>🛒</button>
      </div>
    </div>
  );
}
