import { useNavigate } from "react-router-dom";
import {
  FaTv,
  FaSnowflake,
  FaTshirt,
  FaWind,
  FaFan,
  FaFire,
  FaBlender,
  FaAirFreshener,
  FaBroom,
  FaUtensils,
  FaHome
} from "react-icons/fa";
import styles from "../CateBanner.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const categories = [
  { name: 'Tivi & thiết bị hiển thị', slug: 'tivi-thiet-bi-hien-thi', icon: <FaTv /> },
  { name: 'Tủ lạnh', slug: 'tu-lanh', icon: <FaSnowflake /> },
  { name: 'Máy Giặt', slug: 'may-giat', icon: <FaTshirt /> },
  { name: 'Máy lạnh (điều hòa)', slug: 'may-lanh-dieu-hoa', icon: <FaFan /> },
  { name: 'Quạt điện & thiết bị làm mát', slug: 'quat-dien-thiet-bi-lam-mat', icon: <FaFan /> },
  { name: 'Máy lọc nước', slug: 'may-loc-nuoc', icon: <FaFire /> },
  { name: 'Nồi cơm điện', slug: 'noi-com-dien', icon: <FaUtensils /> },
  { name: 'Máy lọc không khí', slug: 'may-loc-khong-khi', icon: <FaAirFreshener /> },
  { name: 'Máy hút bụi', slug: 'may-hut-bui', icon: <FaBroom /> },
  { name: 'Thiết bị nhà bếp thông minh', slug: 'thiet-bi-nha-bep-thong-minh', icon: <FaBlender /> },
  { name: 'Thiết bị gia dụng nhỏ', slug: 'thiet-bi-gia-dung-nho', icon: <FaHome /> },
];

export default function CategoryMenu() {
  const navigate = useNavigate();

  const handleCate = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <div className={cx("menu")}>
      {categories.map((c) => (
        <div
          key={c.slug}
          className={cx("item")}
          onClick={() => handleCate(c.slug)}
        >
          <div className={cx("icon")}>{c.icon}</div>
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}