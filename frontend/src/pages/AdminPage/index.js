import classNames from "classnames/bind";
import styles from "./AdminPage.module.scss";
import { FaChartLine } from "react-icons/fa";

const cx = classNames.bind(styles);

function AdminPage() {
  return (
    <div className={cx("container")}>
      <div className={cx("card")}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906334.png"
          alt="admin"
          className={cx("image")}
        />

        <h1 className={cx("title")}>
          Chào mừng đến trang quản trị
        </h1>

        <p className={cx("desc")}>
          Quản lý hệ thống, sản phẩm, đơn hàng và theo dõi hiệu suất kinh doanh một cách dễ dàng.
        </p>
      </div>
    </div>
  );
}

export default AdminPage;