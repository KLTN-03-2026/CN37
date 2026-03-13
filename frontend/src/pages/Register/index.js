import { useState } from "react";
import styles from "../LogIn/LogIn.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { register } from "../../api/AuthApi";
import { notifySuccess, notifyError } from "../../components/Nofitication";

const cx = classNames.bind(styles);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(email, password, confirmPassword);
      notifySuccess("Đăng ký thành công");
    } catch (error) {
      const errMsg = error.response?.data || "Đăng ký thất bại";
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header_title")}>
        <div className={cx("welcome_title")}>
          <h1>Đăng ký tài khoản</h1>
          <p>Đăng ký để tham gia cùng chúng tôi</p>
        </div>
      </div>
      <div className={cx("input_container")}>
        <div className={cx("input_email_container")}>
          <p>Email</p>
          <div className={cx("input_email")}>
            <div className={cx("input_icon")}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="text"
              autoComplete="username"
              style={{ display: "none" }}
            />
            <input
              type="email"
              placeholder="you@gmail.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
        </div>
        <div className={cx("input_password_container")}>
          <p>Mật khẩu</p>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <i onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon
                className={cx("eye")}
                icon={showPassword ? faEyeSlash : faEye}
              ></FontAwesomeIcon>
            </i>
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
              type={showPassword1 ? "text" : "password"}
              placeholder="● ● ● ● ● ●"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <i onClick={() => setShowPassword1(!showPassword1)}>
              <FontAwesomeIcon
                className={cx("eye")}
                icon={showPassword1 ? faEyeSlash : faEye}
              ></FontAwesomeIcon>
            </i>
          </div>
        </div>
      </div>
      <div className={cx("signin-button")}>
        <button
          className={cx("button", "signin-btn")}
          onClick={handleRegister}
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
            "Đăng ký"
          )}
        </button>
      </div>
      <div className={cx("signup-link")}>
        <span>Bạn đã có tài khoản? </span>
        <Link to="/">Đăng nhập</Link>
      </div>
    </div>
  );
}

export default Register;
