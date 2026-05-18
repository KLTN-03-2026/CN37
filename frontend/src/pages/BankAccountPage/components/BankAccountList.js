import classNames from "classnames/bind";
import styles from "./BankAccountList.module.scss";

const cx = classNames.bind(styles);

function BankAccountList({ accounts = [], onDelete }) {
  if (!accounts.length) {
    return (
      <div className={cx("empty")}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2830/2830284.png"
          alt="empty bank"
        />
        <p>Bạn chưa có tài khoản ngân hàng nào</p>
      </div>
    );
  }

  return (
    <div className={cx("listContainer")}>
      {accounts.map((account) => (
        <div key={account.id} className={cx("card")}>
          <img
            className={cx("bankLogo")}
            src={account.bankLogo}
            alt={account.bankName}
          />
          <div className={cx("info")}>
            <div className={cx("header")}>
              <span className={cx("bankName")}>{account.bankName}</span>

              {account.isDefault && (
                <span className={cx("default")}>Mặc định</span>
              )}
            </div>

            <p>
              Số tài khoản: <b>{account.bankAccountNumber}</b>
            </p>

            <p>
              Chủ tài khoản: <b>{account.bankAccountName}</b>
            </p>
          </div>

          {!account.isDefault && (
            <button
              className={cx("deleteBtn")}
              onClick={() => onDelete(account.id)}
            >
              Xóa
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default BankAccountList;
