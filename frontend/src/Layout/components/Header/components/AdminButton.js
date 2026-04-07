import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { RiAdminFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function AdminButton() {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    navigate("/admin");
  }

  return (
    <button className={cx("cartBtn")} onClick={handleAdminClick}>
      <RiAdminFill /> Quản trị
    </button>
  );
}

export default AdminButton;