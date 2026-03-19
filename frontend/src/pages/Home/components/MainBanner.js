import classNames from "classnames/bind";
import styles from "../Home.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import banner1 from "../../../assets/banner/banner1.png";
import banner2 from "../../../assets/banner/banner2.webp";
import banner3 from "../../../assets/banner/banner3.webp";

import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";

const cx = classNames.bind(styles);

const banners = [
  { id: 1, title: "GALAXY S26 ULTRA", image: banner1 },
  { id: 2, title: "MACBOOK NEO", image: banner2 },
  { id: 3, title: "OPPO FIND N6", image: banner3 },
];

function MainBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={cx("wrapper")}>
      {/* Tabs */}
      <div className={cx("tabs")}>
        {banners.map((b, i) => (
          <div key={b.id} className={i === activeIndex ? cx("active") : ""}>
            {b.title}
          </div>
        ))}
      </div>

      {/* Slider */}
      <Swiper
        modules={[Autoplay]} // ✅ bắt buộc
        autoplay={{ delay: 3000 }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {banners.map((b) => (
          <SwiperSlide key={b.id}>
            <img src={b.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MainBanner;
