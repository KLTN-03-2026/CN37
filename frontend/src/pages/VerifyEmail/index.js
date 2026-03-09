import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../api/AuthApi";
import { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import style from "./VerifyEmail.module.scss";

function VerifyEmail() {
  const [searchParam] = useSearchParams();
  const called = useRef(false)
  const [status, setStatus] = useState("Loading");
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang xác thực Email của bạn");

  const cx = classNames.bind(style);
  const token = searchParam.get("token");

  useEffect(() => {
    if(called.current) return;
    called.current = true;
    const callVerify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Xác minh Email thành công");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage("Xác thực thất bại");
      }
    };
    if (token) {
      callVerify();
    } 
  }, [token]);
  return (
    <div className={cx("verify-wrapper")}>
      <div className={cx("icon-area")}>
        {status === "loading" && <div className={cx("spinner")}></div>}

        {status === "success" && (
          <svg className={cx("success-icon")} viewBox="0 0 52 52">
            <circle className={cx("circle")} cx="26" cy="26" r="25" fill="none" />
            <path className={cx("check")} fill="none" d="M14 27l7 7 16-16" />
          </svg>
        )}

        {status === "error" && <div className={cx("error-icon")}>✖</div>}
      </div>

      <h2>
        {status === "loading" && "Verifying Email"}
        {status === "success" && "Email Verified"}
        {status === "error" && "Verification Failed"}
      </h2>

      <p>{message}</p>

      {status === "success" && (
        <p className={cx("redirect-text")}>Redirecting to login page...</p>
      )}
    </div>
  );
}

export default VerifyEmail;
