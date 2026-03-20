import { useEffect, useState } from "react";
import styles from "../CateBanner.module.scss";
import {getCategories} from "../../../../api/CategoryApi";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function CategoryMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(res => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className={cx("menu")}>
      {categories.map(c => (
        <div key={c.id} className={cx("item")}>
          {c.name}
        </div>
      ))}
    </div>
  );
}

export default CategoryMenu;