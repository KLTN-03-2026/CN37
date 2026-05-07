import classNames from "classnames/bind";
import DOMPurify from "dompurify";
import styles from "../ProductDetail.module.scss";
import ExpandableContent from "../../../helper/ExpandableContent";

const cx = classNames.bind(styles);

export default function ProductDescription({ description }) {
  return (
    <div className={cx("description")}>
      <ExpandableContent maxHeight={300}>
        <div
          className={cx("content")}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description),
          }}
        />
      </ExpandableContent>
    </div>
  );
}