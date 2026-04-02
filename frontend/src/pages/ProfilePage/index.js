import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProfilePage.module.scss";
import { getProfile, updateProfile, updateProfileAvatar } from "../../api/ProfileApi";
import { notifySuccess, notifyError } from "../../components/Nofitication";

const cx = classNames.bind(styles);

export default function ProfilePage() {
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getProfile();
    const data = res.data || {};

    // tách ngày sinh
    let day = "",
      month = "",
      year = "";
    if (data.birthDate) {
      const d = new Date(data.birthDate);
      day = d.getDate();
      month = d.getMonth() + 1;
      year = d.getFullYear();
    }

    setForm({
      ...data,
      day,
      month,
      year,
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateProfileAvatar(formData);
      if (res.success) {
        notifySuccess("Cập nhật avatar thành công");
        fetchProfile(); // load lại avatar mới
      } else {
        notifyError("Cập nhật avatar thất bại");
      }
    } catch (err) {
      console.error(err);
      notifyError("Có lỗi xảy ra khi tải ảnh lên");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { day, month, year, ...rest } = form;

    const birthDate =
      day && month && year ? new Date(Date.UTC(year, month - 1, day)) : null;

    const res = await updateProfile({
      ...rest,
      birthDate,
    });

    if (res) {
      notifySuccess("Cập nhật thông tin thành công");
    } else {
      notifyError("Cập nhật thông tin thất bại. Vui lòng thử lại");
    }

    fetchProfile();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("card")}>
        {/* TITLE */}
        <h2 className={cx("title")}>Thông tin cá nhân</h2>

        {/* AVATAR */}
        <div className={cx("avatarSection")}>
          <div className={cx("avatar")}>
            <img
              src={
                form.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
            />
          </div>

          <input
            type="file"
            accept="image/*"
            id="avatarInput"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <span
            className={cx("changeAvatar")}
            onClick={() => document.getElementById("avatarInput").click()}
          >
            Thay đổi ảnh đại diện
          </span>
        </div>

        {/* FORM */}
        <div className={cx("form")}>
          <div className={cx("group")}>
            <label>Họ và tên</label>
            <input
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
            />
          </div>

          <div className={cx("group")}>
            <label>Số điện thoại</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={(e) => {
                // Chỉ cho phép nhập số, bỏ ký tự khác
                const value = e.target.value.replace(/\D/g, "");
                setForm({
                  ...form,
                  phone: value,
                });
              }}
              placeholder="Nhập số điện thoại"
              maxLength={11} // giới hạn số ký tự (tùy theo chuẩn)
              className={cx("phoneInput")}
            />
          </div>

          <div className={cx("group")}>
            <label>Giới tính</label>
            <div className={cx("radioGroup")}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={handleChange}
                />
                Nam
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>
          </div>

          <div className={cx("group")}>
            <label>Ngày sinh</label>
            <div className={cx("dob")}>
              <select name="day" value={form.day || ""} onChange={handleChange}>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                name="month"
                value={form.month || ""}
                onChange={handleChange}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={form.year || ""}
                onChange={handleChange}
              >
                {[...Array(50)].map((_, i) => {
                  const y = 1975 + i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button className={cx("submit")} onClick={handleSubmit}>
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
