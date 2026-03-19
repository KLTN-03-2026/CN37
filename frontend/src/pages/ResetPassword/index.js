import { useState } from "react";
import styles from "../LogIn/LogIn.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { notifySuccess, notifyError } from "../../components/Nofitication";
import { resetPassword } from "../../api/AuthApi";

const cx = classNames.bind(styles);

function ResetPassword() {
  const [searchParam] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const token = searchParam.get("token");

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetPassword(token, password, confirmPassword);
      notifySuccess("Đặt lại mật khẩu thành công");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data || "Đặt lại mật khẩu thất bại";
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header_title")}>
        <div className={cx("welcome_title")}>
          <h1>Đặt lại mật khẩu</h1>
        </div>
      </div>
      <div className={cx("input_container")}>
        <div className={cx("input_password_container")}>
          <p>Nhập mật khẩu mới</p>
          <div className={cx("input_password")}>
            <div className={cx("input_icon")}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              autoComplete="new-password"
              style={{ display: "none" }}
            />
            <input
              type="text"
              placeholder="Nhập mật khẩu mới"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
        </div>
        <div className={cx("input_password_container")}>
          <p>Nhập lại mật khẩu</p>
          <div className={cx("input_password")}>
            <div className={cx("input_icon")}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              autoComplete="new-password"
              style={{ display: "none" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="● ● ● ● ● ●"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <i onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon
                className={cx("eye")}
                icon={showPassword ? faEyeSlash : faEye}
              ></FontAwesomeIcon>
            </i>
          </div>
        </div>
      </div>
      <div className={cx("signin-button")}>
        <button
          className={cx("button", "signin-btn")}
          onClick={handleResetPassword}
          type="submit"
          color="white"
        >
          {loading ? (
            <>
              <span>
                <span className={cx("spinner")} aria-hidden="true"></span>
                Đang xử lý...
              </span>
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </button>
      </div>
      <div className={cx("signup-link")}>
        <span>Bạn đã có tài khoản? </span>
        <Link to="/login">Đăng nhập</Link>
      </div>
    </div>
  );
}

export default ResetPassword;
