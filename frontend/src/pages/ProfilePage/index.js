import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProfilePage.module.scss";
import { getProfile, updateProfile } from "../../api/ProfileApi";

const cx = classNames.bind(styles);    

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getProfile();
    setProfile(res.data);
    setForm(res.data || {});
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await updateProfile(form);
    fetchProfile();
  };

  const noData = !profile;

  return (
    <div className={cx("profile-container")}>
      <div className={cx("profile-card")}>

        <div className={cx("profile-header")}>
          <h2>Thông tin cá nhân</h2>

        </div>

        <div className={cx("profile-body")}>

          {/* Avatar */}
          <div className={cx("avatar-box")}>
            <img
              src={
                form.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
            />
          </div>

          {/* Form */}
            <div className={cx("form")}>

              <input
                name="fullName"
                placeholder="Họ tên"
                value={form.fullName || ""}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone || ""}
                onChange={handleChange}
              />

              <input
                type="date"
                name="birthDate"
                value={form.birthDate?.split("T")[0] || ""}
                onChange={handleChange}
              />

              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>

              <button onClick={handleSubmit}>
                Lưu thông tin
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}