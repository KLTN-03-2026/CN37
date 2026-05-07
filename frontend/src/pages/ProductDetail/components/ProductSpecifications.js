import { useState } from "react";
import classNames from "classnames/bind";
import styles from "../ProductDetail.module.scss";

const cx = classNames.bind(styles);

const highlightKeys = [
  "Model",
  "Xuất xứ",
  "Năm ra mắt"
];

export default function ProductSpecifications({ specs = [] }) {
  const [showModal, setShowModal] = useState(false);

  const highlightSpecs = specs.filter(spec =>
    highlightKeys.includes(spec.specName)
  );

  return (
    <>
      {/* 🔥 Thông số nổi bật */}
      <div className={cx("highlightSpecs")}>
        <div className={cx("header")}>
          <h3>Thông số nổi bật</h3>
          <button onClick={() => setShowModal(true)}>
            Xem tất cả thông số
          </button>
        </div>

        <div className={cx("list")}>
          {highlightSpecs.map((spec) => (
            <div key={spec.id} className={cx("item")}>
              <span className={cx("name")}>{spec.specName}</span>
              <span className={cx("value")}>{spec.specValue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🧾 Modal full specs */}
      {showModal && (
        <div className={cx("modalOverlay")}>
          <div className={cx("modal")}>
            <div className={cx("modalHeader")}>
              <h3>Thông số kỹ thuật</h3>
              <button className={cx("btnClose")} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className={cx("modalBody")}>
              <table>
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.id}>
                      <td>{spec.specName}</td>
                      <td>{spec.specValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}