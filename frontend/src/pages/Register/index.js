import { useState } from "react";
import styles from "../LogIn/LogIn.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              type="password"
              placeholder="● ● ● ● ● ●"
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
              type="password"
              placeholder="● ● ● ● ● ●"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
        </div>
      </div>
      <div className={cx("signin-button")}>
        <button
          className={cx("button", "signin-btn")}
          type="submit"
          color="white"
        >
          Đăng ký
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
