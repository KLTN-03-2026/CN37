import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones, FaWatch, FaCamera, FaTv, FaKeyboard, FaPlug, FaSnowflake, FaHome } from "react-icons/fa";
import { IoWatch } from "react-icons/io5";
import styles from "../CateBanner.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const categories = [
  { name: 'Điện thoại', slug: 'dien-thoai', icon: <FaMobileAlt /> },
  { name: 'Laptop', slug: 'laptop', icon: <FaLaptop /> },
  { name: 'Máy tính bảng', slug: 'may-tinh-bang', icon: <FaTabletAlt /> },
  { name: 'Phụ kiện', slug: 'phu-kien', icon: <FaPlug /> },
  { name: 'Âm thanh, Mic Thu âm', slug: 'am-thanh', icon: <FaHeadphones /> },
  { name: 'Đồng Hồ', slug: 'dong-ho', icon: <IoWatch /> },
  { name: 'Camera', slug: 'camera', icon: <FaCamera /> },
  { name: 'Tivi, Điện máy', slug: 'tivi', icon: <FaTv /> },
  { name: 'Linh kiện PC', slug: 'linh-kien-pc', icon: <FaKeyboard /> },
  { name: 'Tủ lạnh, tủ đông', slug: 'tu-lanh', icon: <FaSnowflake /> },
  { name: 'Đồ gia dụng', slug: 'do-gia-dung', icon: <FaHome /> },
];

export default function CategoryMenu() {
  const navigate = useNavigate();

  const handleCate = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <div className={cx("menu")}>
      {categories.map((c) => (
        <div key={c.slug} className={cx("item")} onClick={() => handleCate(c.slug)}>
          <div className={cx("icon")}>{c.icon}</div>
          <span>{c.name}</span>
        </div>
      ))}
    </div>
  );
}