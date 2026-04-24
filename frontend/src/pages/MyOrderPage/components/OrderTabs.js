import classNames from "classnames/bind";
import styles from "./OrderTabs.module.scss";
import { useState } from "react";

const cx = classNames.bind(styles);

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Đang xử lý", value: "Đang xử lý" },
  { label: "Đang giao", value: "Đang giao" },
  { label: "Hoàn tất", value: "Hoàn tất" },
  { label: "Đã hủy", value: "Đã hủy" },
];

export default function OrderTabs({ onChange }) {
  const [active, setActive] = useState("");

  const handleClick = (value) => {
    setActive(value);
    onChange(value);
  };

  return (
    <div className={cx("tabs")}>
        {tabs.map((t) => (
          <div
            key={t.value}
            className={cx("tab", { active: active === t.value })}
            onClick={() => handleClick(t.value)}
          >
            {t.label}
          </div>
        ))}
      </div>
  );
}