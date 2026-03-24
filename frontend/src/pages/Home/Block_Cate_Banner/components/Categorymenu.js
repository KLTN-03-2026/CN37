import { useEffect, useState } from "react";
import styles from "../CateBanner.module.scss";
import {getCategories} from "../../../../api/CategoryApi";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleCate = (slug) => {
    console.log("CLICK:", slug);
    navigate(`/category/${slug}`); // ✅ truyền slug
  }

  useEffect(() => {
    getCategories().then(res => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className={cx("menu")}>
      {categories.map(c => (
        <div key={c.id} className={cx("item")} onClick={() => handleCate(c.slug)}>
          {c.name}
        </div>
      ))}
    </div>
  );
}

export default CategoryMenu;