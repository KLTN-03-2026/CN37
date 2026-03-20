import classNames from "classnames/bind";
import styles from "../CateBanner.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useState, useRef } from "react";

import banner1 from "../../../../assets/banner/samsung_banner.webp";
import banner2 from "../../../../assets/banner/banner2.webp";
import banner3 from "../../../../assets/banner/banner3.webp";
import banner4 from "../../../../assets/banner/banner4.webp";

import "swiper/css";
import "swiper/css/navigation";

const cx = classNames.bind(styles);

const banners = [
  { id: 1, title: "GALAXY S26 ULTRA", image: banner1 },
  { id: 2, title: "POCO X8 PRO MAX", image: banner2 },
  { id: 3, title: "SONY WF-1000XM6", image: banner3 },
  { id: 4, title: "LENOVO YOGA", image: banner4 },
];

function MainBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <div className={cx("wrapper")}>
      {/* Tabs */}
      <div className={cx("tabs")}>
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={i === activeIndex ? cx("active") : ""}
            onClick={() => swiperRef.current?.slideToLoop(i)} // ✅ click chuyển slide
          >
            {b.title}
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className={cx("bannerContainer")}>
        <Swiper
          modules={[Autoplay, Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)} // ✅ lấy instance
          autoplay={{ delay: 3000 }}
          loop
          navigation={{
            nextEl: ".nextBtn",
            prevEl: ".prevBtn",
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {banners.map((b) => (
            <SwiperSlide key={b.id}>
              <img src={b.image} className={cx("bannerImg")} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng */}
        <div className={cx("prevBtn")}>‹</div>
        <div className={cx("nextBtn")}>›</div>
      </div>
    </div>
  );
}

export default MainBanner;