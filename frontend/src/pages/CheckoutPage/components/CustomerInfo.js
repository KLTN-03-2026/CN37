import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CustomerInfo.module.scss";
import { getProfile, updateProfile } from "../../../api/ProfileApi";

const cx = classNames.bind(styles);

export default function CustomerInfo({ user }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile().then((res) => {
      if (res.data) {
        setProfile(res.data);
      } else {
        setIsEditing(true);
      }
    });
  }, [user]);

  const handleSubmit = async () => {
    await updateProfile(form);
    setProfile(form);
    setIsEditing(false);
  };

  return (
    <div className={cx("card")}>
      <div className={cx("cardHeader")}>
        <span className={cx("cardTitle")}>Người đặt hàng</span>

        <div className={cx("actions")}>
          <span
            className={cx("changeBtn")}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Hủy bỏ" : "Thay đổi"}
          </span>

        </div>
      </div>

      {isEditing ? (
        <div className={cx("form")}>
          <input
            placeholder="Nhập họ tên"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          <button onClick={handleSubmit}>Lưu</button>
        </div>
      ) : (
        <div className={cx("customerInfo")}>
          <div className={cx("customerRow")}>
            <span className={cx("label")}>Họ tên:</span>
            <span className={cx("value")}>
              {profile?.fullName}
            </span>
          </div>

          <div className={cx("customerRow")}>
            <span className={cx("label")}>Số điện thoại:</span>
            <span className={cx("value")}>
              {profile?.phone}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}