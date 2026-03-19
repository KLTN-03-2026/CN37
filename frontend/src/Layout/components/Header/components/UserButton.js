import styles from "../Header.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../../../api/AuthApi";

const cx = classNames.bind(styles);

function UserButton() {
  const token = localStorage.getItem("accessToken");
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (token) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [token]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logOut(localStorage.getItem("refreshToken"));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className={cx("userBtnWrapper")}>
      <button className={login ? cx("userBtn") : cx("categoryBtn")} onClick={handleClick}>
        <FaUser />
        {login ? "" : "Đăng nhập"}
      </button>
      {login && (
        <div className={cx("dropdown")}>
          <div
            className={cx("dropdownItem")}
            onClick={() => navigate("/profile")}
          >
            Hồ sơ của tôi
          </div>
          <div
            className={cx("dropdownItem")}
            onClick={() => navigate("/profile")}
          >
            Đơn hàng của tôi
          </div>
          <div
            className={cx("dropdownItem")}
            onClick={handleLogout}
          >
            Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
}

export default UserButton;
