import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import MainBanner from "./components/MainBanner.js";
import SubBannerSlider from "./components/SubBanner.js";
import CategoryMenu from "./components/Categorymenu.js";

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx("home")}>
      <div className={cx("topSection")}>
        <CategoryMenu />
        <div className={cx("bannerGroup")}>
          <MainBanner />
          <SubBannerSlider />
        </div>
      </div> 
    </div>
  );
}

export default Home;
