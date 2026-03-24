import { useNavigate } from "react-router-dom";
import styles from "../Header.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Logo() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={cx("logo")} onClick={handleClick}>
      <img src="https://www.techai.ai/logo.png" alt="logo" height="40" />
    </div>
  );
}

export default Logo;
