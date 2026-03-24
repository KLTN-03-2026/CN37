import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";

const cx = classNames.bind(styles);

function BannerSlider({ category }) {
  if (!category) return null;

  const bannerMap = {
    "dien-thoai": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_664c316a1f.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_c397b8ff8b.png"
    ],
    "laptop": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_9d9274aaa9.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_8ba5e09313.png"
    ],
    "may-tinh-bang": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_86a0117ffc.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_80_96c498d093.png"
    ],
    "phu-kien": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_1795aad492.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_1d6175595a.png"
    ],
    "tu-lanh": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_1_bf3364d962.png"
    ],
    "do-gia-dung": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_4d5b86f1bd.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_ef2e2b4bf1.png"
    ],
    "am-thanh": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_91668c239b.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_ce23c156b3.png"

    ],
    "dong-ho": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_21626eafa7.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_1_30caa8c72d.png"
    ],
    "camera": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_aa134f0f74.png"
    ],
    "tivi": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_046e4876fe.png"
    ],
    "linh-kien-pc": [
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_msi_0f56c11f0f.png",
      "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2026_03_14_FPT_Deal_Soc_Cuoi_Thang_H1_042ccad19a.png"
    ]
  };

  const banners = bannerMap[category?.slug] || ["https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H1_1440x242_c397b8ff8b.png"];

  return (
    <div className={cx("banner")}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className={cx("banner-item")}>
              <img src={img} alt="banner" />
              {/* <div className={cx("overlay")}>
                <h2>{category.name}</h2>
                <p>Ưu đãi cực sốc hôm nay 🔥</p>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default BannerSlider;
