import classNames from "classnames/bind";
import styles from "./SidebarSettings.module.scss";

const cx = classNames.bind(styles);

const menu = [
  "Profile",
  "Security",
  "Active Sessions",
  "Notifications",
];

export default function SidebarSettings() {
  return (
    <div className={cx("sidebar")}>
      {menu.map((item) => (
        <div
          key={item}
          className={cx("item", {
            active: item === "Active Sessions",
          })}
        >
          {item}
        </div>
      ))}
    </div>
  );
}