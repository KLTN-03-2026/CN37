import classNames from "classnames/bind";
import styles from "../Footer.module.scss";

const cx = classNames.bind(styles);

function FooterColumn({ title, items }) {
  return (
    <div className={cx("column")}>
      
      <h4 className={cx("title")}>
        {title}
      </h4>

      <ul className={cx("list")}>

        {items.map((item, index) => (
          <li key={index} className={cx("item")}>
            {item}
          </li>
        ))}

      </ul>

    </div>
  );
}

export default FooterColumn;