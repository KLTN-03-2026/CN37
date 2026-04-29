import classNames from "classnames/bind";
import styles from "./EditUserInfo.module.scss";

const cx = classNames.bind(styles);

export default function EditUserInfo({ data, onChange }) {
  return (
    <div className={cx("card")}>

      <div className={cx("grid")}>

        {/* FULL NAME */}
        <div className={cx("formGroup")}>
          <label>Họ tên</label>
          <input
            name="fullName"
            value={data.fullName || ""}
            onChange={onChange}
            placeholder="Nhập họ tên..."
          />
        </div>

        {/* PHONE */}
        <div className={cx("formGroup")}>
          <label>Số điện thoại</label>
          <input
            name="phone"
            value={data.phone || ""}
            onChange={onChange}
            placeholder="Nhập số điện thoại..."
          />
        </div>

        {/* STATUS */}
        <div className={cx("formGroup", "full")}>
          <label>Trạng thái</label>

          <label className={cx("switch")}>
            <input
              type="checkbox"
              name="isActive"
              checked={data.isActive}
              onChange={onChange}
            />
            <span className={cx("slider")}></span>
          </label>

          <span className={cx("statusText", {
            active: data.isActive,
            inactive: !data.isActive
          })}>
            {data.isActive ? "Hoạt động" : "Bị khóa"}
          </span>
        </div>

      </div>
    </div>
  );
}