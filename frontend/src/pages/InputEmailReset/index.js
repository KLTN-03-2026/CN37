import { useState } from "react";
import styles from "../LogIn/LogIn.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { register, requestPasswordReset } from "../../api/AuthApi";
import { notifySuccess, notifyError } from "../../components/Nofitication";

const cx = classNames.bind(styles);

function InputEmailReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    setLoading(true);
    try {
      await requestPasswordReset(email);
      notifySuccess("Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.");
    } catch (error) {
      const errMsg = error.response?.data || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header_title")}>
        <div className={cx("welcome_title")}>
          <h2>Nhập email để đặt lại mật khẩu</h2>
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
            "Gửi yêu cầu"
          )}
        </button>
      </div>
      <div className={cx("signup-link")}>
        <span>Bạn đã nhớ mật khẩu? </span>
        <Link to="/login">Quay lại</Link>
      </div>
    </div>
  );
}

export default InputEmailReset;
