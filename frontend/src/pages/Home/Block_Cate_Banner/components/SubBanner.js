import { useEffect, useState } from "react";
import styles from "../CateBanner.module.scss";
import classNames from "classnames/bind";
import banner1 from "../../../../assets/subBanner/subBanner1.webp";
import banner2 from "../../../../assets/subBanner/subBanner2.webp";
import banner3 from "../../../../assets/subBanner/subBanner3.webp";
import banner4 from "../../../../assets/subBanner/subBanner4.webp";
import banner5 from "../../../../assets/subBanner/subBanner5.webp";

const cx = classNames.bind(styles);


const banners = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner5,
];

function SubBannerSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visible = [
    banners[index],
    banners[(index + 1) % banners.length],
    banners[(index + 2) % banners.length],
  ];

  return (
    <div className={cx("slider")}>
      {visible.map((img, i) => (
        <img key={i} src={img} />
      ))}
    </div>
  );
}

export default SubBannerSlider;