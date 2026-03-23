import styles from "../CateBanner.module.scss";
import classNames from "classnames/bind";   

const cx = classNames.bind(styles);

function UnderBanner() {
    return ( 
        <div className={cx("underBanner")}>
            <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1200:75/q:100/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" />
        </div>
     );
}

export default UnderBanner;