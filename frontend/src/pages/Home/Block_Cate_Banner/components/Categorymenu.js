import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTv,
  FaSnowflake,
  FaTshirt,
  FaFan,
  FaFire,
  FaAirFreshener,
  FaUtensils,
  FaHome,
  FaChevronRight,
} from "react-icons/fa";

import styles from "../CateBanner.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const categories = [
  {
    name: "Tivi & thiết bị hiển thị",
    slug: "tivi-thiet-bi-hien-thi",
    icon: <FaTv />,
    count: 256,
  },
  {
    name: "Tủ lạnh",
    slug: "tu-lanh",
    icon: <FaSnowflake />,
    count: 128,
  },
  {
    name: "Máy Giặt",
    slug: "may-giat",
    icon: <FaTshirt />,
    count: 94,
  },
  {
    name: "Máy lạnh (điều hòa)",
    slug: "may-lanh-dieu-hoa",
    icon: <FaFan />,
    count: 186,
  },
  {
    name: "Quạt điện & thiết bị làm mát",
    slug: "quat-dien-thiet-bi-lam-mat",
    icon: <FaFan />,
    count: 142,
  },
  {
    name: "Máy lọc nước",
    slug: "may-loc-nuoc",
    icon: <FaFire />,
    count: 78,
  },
  {
    name: "Nồi cơm điện",
    slug: "noi-com-dien",
    icon: <FaUtensils />,
    count: 64,
  },
  {
    name: "Camera",
    slug: "camera",
    icon: <FaAirFreshener />,
    count: 92,
  },
  // {
  //   name: "Máy hút bụi",
  //   slug: "may-hut-bui",
  //   icon: <FaBroom />,
  //   count: 105,
  // },
  {
    name: "Thiết bị gia dụng nhỏ",
    slug: "thiet-bi-gia-dung-nho",
    icon: <FaHome />,
    count: 210,
  },
];

export default function CategoryMenu() {
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleCate = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <div className={cx("categorySidebar")}>
      {/* Menu */}
      <div className={cx("menuList")}>
        {categories.map((c, index) => (
          <button
            key={c.slug}
            className={cx("menuItem", {
              active: hoveredIndex === index,
            })}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleCate(c.slug)}
          >
            {/* Left */}
            <div className={cx("left")}>
              <div className={cx("icon")}>{c.icon}</div>

              <span className={cx("label")}>
                {c.name}
              </span>
            </div>

            {/* Right */}
            <div className={cx("right")}>


              <FaChevronRight
                className={cx("arrow", {
                  arrowActive: hoveredIndex === index,
                })}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}