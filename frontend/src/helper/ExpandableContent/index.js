import { useRef, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ExpandableContent.module.scss";

const cx = classNames.bind(styles);

export default function ExpandableContent({ children, maxHeight = 400 }) {
  const contentRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (contentRef.current.scrollHeight > maxHeight) {
      setShowButton(true);
    }
  }, [children, maxHeight]);

  return (
    <div className={cx("expand-wrapper")}>
      <div
        ref={contentRef}
        className={cx("expand-content", { expanded })}
        style={{
          maxHeight: expanded ? contentRef.current?.scrollHeight : maxHeight,
        }}
      >
        {children}
      </div>

      {showButton && (
        <button
          className={cx("expand-btn")}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}