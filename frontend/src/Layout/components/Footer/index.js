import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

import { aboutLinks, policyLinks } from "./FooterData";
import FooterColumn from "./components/FooterCollums";
import PaymentMethods from "./components/PaymentMethods";

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx("footer")}>
      <div className={cx("container")}>

        <div className={cx("grid")}>

          <FooterColumn
            title="VỀ CHÚNG TÔI"
            items={aboutLinks}
          />

          <FooterColumn
            title="CHÍNH SÁCH"
            items={policyLinks}
          />

          <div className={cx("paymentSection")}>
            <h4 className={cx("title")}>
              HỖ TRỢ THANH TOÁN
            </h4>

            <PaymentMethods />

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;