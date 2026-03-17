import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function UserButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  }

  return (
    <button className={cx("userBtn")} onClick={handleClick}>
      <FaUser />
    </button>
  );
}

export default UserButton;
