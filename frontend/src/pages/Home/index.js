import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import Banner from "./components/Banner.js";

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx("bannerSection")}>
      <div className={cx("bannerContent")}>
        <Banner />
      </div>
    </div>
  );
}

export default Home;
