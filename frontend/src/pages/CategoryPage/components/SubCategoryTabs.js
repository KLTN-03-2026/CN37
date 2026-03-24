import classNames from "classnames/bind";
import styles from "../CategoryPage.module.scss";

const cx = classNames.bind(styles);

function SubCategoryTabs({ categories, activeId, onSelect }) {
  return (
    <div className={cx("tabs")}>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cx("tab-item", {
            active: activeId === c.id,
          })}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

export default SubCategoryTabs;
