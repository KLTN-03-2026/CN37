import { useState } from "react";
import styles from "./LogIn.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../api/AuthApi";
import { Bounce, ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(styles);

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [rememberChecked, setRememberChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await logIn(email, password);
      if (res) {
        toast.success("Đăng nhập thành công", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      const errorMsg = error.response?.data || "Đăng nhập thất bại";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header_title")}>
        <div className={cx("welcome_title")}>
          <h1>Chào mừng trở lại!</h1>
          <p>Đăng nhập bằng tài khoản bạn để tiếp tục</p>
        </div>
      </div>
      <div className={cx("input_container")}>
        <div className={cx("input_email_container")}>
          <h4>Email</h4>
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
          <div className={cx("password-title")}>
            <h4>Mật khẩu</h4>
            <Link to="/register">Quên mật khẩu</Link>
          </div>

          <div className={cx("input_password")}>
            <div className={cx("input_icon")}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
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
      </div>
      <div className={cx("remember_me")}>
        <input
          className={cx("checkbox")}
          type="checkbox"
          checked={rememberChecked}
          onChange={(e) => setRememberChecked(e.target.checked)}
        />
        Lưu mật khẩu cho lần đăng nhập tới
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div className={cx("signin-button")}>
        <button
          className={cx("button", "signin-btn")}
          onClick={handleLogin}
          type="submit"
          color="white"
        >
          {loading ? (
            <>
              <span className={cx("spinner")} aria-hidden="true"></span>
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </div>
      <div className={cx("divider")}>
        <span>or continue with</span>
      </div>
      <div className={cx("signin-button")}>
        <button className={cx("button", "google-btn")}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          <span>Đăng nhập bằng Google</span>
        </button>
        <button className={cx("button", "passkey-btn")}>
          <img
            src="https://img.icons8.com/?size=100&id=21602&format=png&color=000000"
            alt="google"
          />
          <span>Đăng nhập bằng Passkey</span>
        </button>
      </div>
      <div className={cx("signup-link")}>
        <span>Bạn chưa có tài khoản? </span>
        <Link to="/register">Đăng ký</Link>
      </div>
    </div>
  );
}

export default LogIn;
