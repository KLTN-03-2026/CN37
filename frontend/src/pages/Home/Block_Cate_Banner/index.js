import styles from "./CateBanner.module.scss";
import classNames from "classnames/bind";
import MainBanner from "./components/MainBanner.js";
import SubBannerSlider from "./components/SubBanner.js";
import CategoryMenu from "./components/Categorymenu.js";
import InfoComponent from "./components/InfoComponent.js";

const cx = classNames.bind(styles);

function CategoryBanner() {
  return (
    <div className={cx("homecontainer")}>
      <div className={cx("topSection")}>
        <CategoryMenu />
        <div className={cx("bannerGroup")}>
          <MainBanner />
          <SubBannerSlider />
        </div>
        <InfoComponent />
      </div> 
    </div>
  );
}

export default CategoryBanner;
