import classNames from "classnames/bind";
import styles from "../CateBanner.module.scss";
import {
  FaRobot,
  FaGift,
  FaLaptop,
  FaSyncAlt,
  FaApple,
  FaAndroid,
  FaBuilding,
} from "react-icons/fa";

const cx = classNames.bind(styles);

function InfoComponent() {
  return (
    <div className={cx("infoWrapper")}>
      {/* HEADER */}
      <div className={cx("header")}>
        <FaRobot className={cx("icon")} />
        <h4>TechAI</h4>
        <p>Trợ lý mua sắm thông minh</p>
      </div>

      {/* AUTH */}
      <div className={cx("auth")}>
        <button className={cx("btnPrimary")}>Đăng nhập</button>
        <button className={cx("btnOutline")}>Đăng ký</button>
      </div>
      
      <hr />

      {/* BLOCK 1 */}
      <div className={cx("block")}>
        <h5>Ưu đãi thành viên</h5>
        <ul>
          <li><FaGift /> Nhận ưu đãi <b>AI Member</b></li>
          <li><FaLaptop /> Laptop <b>giá tốt</b></li>
        </ul>
      </div>

      {/* BLOCK 2 */}
      <div className={cx("block")}>
        <h5>Thu cũ lên đời</h5>
        <ul>
          <li><FaApple /> iPhone trợ giá <b>đến 3 triệu</b></li>
          <li><FaAndroid /> Samsung trợ giá <b>đến 4 triệu</b></li>
        </ul>
      </div>

      {/* BLOCK 3 */}
      <div className={cx("block")}>
        <h5>Deal công nghệ</h5>
        <ul>
          <li><FaRobot /> Deal hot <b>mỗi ngày</b></li>
          <li><FaSyncAlt /> Thu cũ đổi mới <b>giá cao</b></li>
        </ul>
      </div>
    </div>
  );
}

export default InfoComponent;
