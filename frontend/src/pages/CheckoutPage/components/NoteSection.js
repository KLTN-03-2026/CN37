import classNames from "classnames/bind";
import styles from "./NoteSection.module.scss";

const cx = classNames.bind(styles);

export default function NoteSection({ note, setNote }) {
  const maxLength = 200;

  return (
    <div className={cx("card")}>
      <div className={cx("cardTitle")}>Ghi chú cho đơn hàng</div>

      <div className={cx("noteWrapper")}>
        <textarea
          className={cx("textarea")}
          value={note}
          onChange={e => {
            if (e.target.value.length <= maxLength) {
              setNote(e.target.value);
            }
          }}
          placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
        />

        <div className={cx("noteFooter")}>
          <span className={cx("noteHint")}>
            Không bắt buộc
          </span>

          <span className={cx("charCount")}>
            {note.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
}