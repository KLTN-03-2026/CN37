import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

function CategoryHeader({ category }) {
  return (
    <div className={cx("category-header")}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
    </div>
  );
}

export default CategoryHeader;
