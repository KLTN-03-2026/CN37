import classNames from "classnames/bind";
import styles from "../Footer.module.scss";

const cx = classNames.bind(styles);

function PaymentMethods() {
  return (
    <div className={cx("payments")}>

      <img src="https://ifintech.vn/wp-content/uploads/2025/04/vnpt-money.png" alt="visa" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/500px-MasterCard_Logo.svg.png?_=20140711182052" alt="mastercard" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/500px-JCB_logo.svg.png?_=20160827145146" alt="jcb" />
      <img src="https://logos-world.net/wp-content/uploads/2024/12/MoMo-Logo-New.png" alt="momo" />
      <img src="https://ifintech.vn/wp-content/uploads/2025/04/zalopay.png" alt="zalopay" />
      <img src="https://www.logo.wine/a/logo/Apple_Pay/Apple_Pay-Logo.wine.svg" alt="applepay" />

    </div>
  );
}

export default PaymentMethods;