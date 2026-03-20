import styles from "./Home.module.scss"; 
import classNames from "classnames/bind";
import CategoryBanner from "./Block_Cate_Banner/index.js";

const cx = classNames.bind(styles);   
function Home() {
    return ( 
        <div className={cx("homecontainer")}>
            <CategoryBanner />
        </div>
    );
}

export default Home;