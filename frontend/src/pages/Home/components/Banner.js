import classNames from "classnames/bind";
import styles from "../Home.module.scss";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import banner from "../../../assets/banner/banner1.webp";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const cx = classNames.bind(styles);

const banners = [
  {
    img: banner,
    bg: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_bg_0039c11813.png",
  },
  {
    img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_e2f3095a14.png",
    bg: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_bg_7211f4456f.png",
  },
  {
    img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_1_41eccf67d3.png",
    bg: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_bg_1_f095a0c3e0.png",
  },
];

function Banner() {
  const [index, setIndex] = useState(0);

  return (
    <div className={cx("bannerSection")}>
      {/* Background */}
      <div
        className={cx("bgLayer")}
        style={{
          backgroundImage: `url(${banners[index].bg})`,
        }}
      />

      <div className={cx("overlay")} />

      {/* Content */}
      <div className={cx("container")}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 3000 }}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setIndex(swiper.realIndex)}
        >
          {banners.map((item, i) => (
            <SwiperSlide key={i}>
              <img src={item.img} className={cx("mainBanner")} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Banner;