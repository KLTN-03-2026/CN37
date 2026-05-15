import {
  FaTv,
  FaSnowflake,
  FaTshirt,
  FaFan,
  FaFire,
  FaUtensils,
  FaAirFreshener,
} from "react-icons/fa";

import styles from "./CategoryGrid.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { LuCctv } from "react-icons/lu";

const cx = classNames.bind(styles);

const categories = [
  {
    icon: FaTv,
    name: "Tivi & thiết bị hiển thị",
    slug: "tivi-thiet-bi-hien-thi",
    count: 256,
    color: "blue",
  },
  {
    icon: FaSnowflake,
    name: "Tủ lạnh",
    slug: "tu-lanh",
    count: 128,
    color: "cyan",
  },
  {
    icon: FaTshirt,
    name: "Máy Giặt",
    slug: "may-giat",
    count: 94,
    color: "purple",
  },
  {
    icon: FaFan,
    name: "Máy lạnh (điều hòa)",
    slug: "may-lanh-dieu-hoa",
    count: 186,
    color: "green",
  },
  {
    icon: FaFan,
    name: "Quạt điện & thiết bị làm mát",
    slug: "quat-dien-thiet-bi-lam-mat",
    count: 142,
    color: "indigo",
  },
  {
    icon: FaFire,
    name: "Máy lọc nước",
    slug: "may-loc-nuoc",
    count: 78,
    color: "orange",
  },
  {
    icon: FaUtensils,
    name: "Nồi cơm điện",
    slug: "noi-com-dien",
    count: 64,
    color: "pink",
  },
  {
    icon: LuCctv,
    name: "Camera",
    slug: "camera",
    count: 92,
    color: "red",
  },
];

function CategoryGrid() {
  const navigate = useNavigate();

  const handleCate = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Header */}
        <div className={cx("header")}>
          <h2 className={cx("title")}>
            Danh mục <span>sản phẩm</span>
          </h2>

          <p className={cx("subtitle")}>
            Khám phá đa dạng danh mục sản phẩm gia dụng và công nghệ hiện đại
          </p>
        </div>

        {/* Grid */}
        <div className={cx("grid")}>
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <div
                key={index}
                className={cx("card", category.color)}
                onClick={() => handleCate(category.slug)}
              >
                <div className={cx("iconBox")}>
                  <Icon className={cx("icon")} />
                </div>

                <div className={cx("content")}>
                  <h3 className={cx("name")}>
                    {category.name}
                  </h3>

                  <p className={cx("count")}>
                    {category.count} sản phẩm
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;