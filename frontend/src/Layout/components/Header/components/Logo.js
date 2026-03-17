import styles from "../Header.module.scss"
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Logo() {
    return (
    <div className={cx("logo")}>
      <img
        src="https://www.techai.ai/logo.png"
        alt="logo"
        height="40"
      />
    </div>
  );
}

export default Logo;