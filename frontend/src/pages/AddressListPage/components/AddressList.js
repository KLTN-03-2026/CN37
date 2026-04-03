import React from "react";
import classNames from "classnames/bind";
import styles from "./AddressList.module.scss";

const cx = classNames.bind(styles);

function AddressList({ addresses = [], onEdit, onDelete }) {
  if (!addresses.length) {
    return <div className={cx("listContainer")}>Chưa có địa chỉ nào</div>;
  }

  return (
    <div className={cx("listContainer")}>
      {addresses.map((addr) => (
        <div key={addr.id} className={cx("card")}>
          <div className={cx("header")}>
            <div className={cx("info")}>
              <span className={cx("name")}>{addr.receiverName}</span> |{" "}
              <span className={cx("phone")}>{addr.receiverPhone}</span>
              {addr.isDefault && (
                <span className={cx("default")}>Mặc định</span>
              )}
            </div>

            <div className={cx("actions")}>
              <button onClick={() => onEdit(addr)}>Sửa</button>
              {!addr.isDefault && (
                <button onClick={() => onDelete(addr.id)}>Xóa</button>
              )}
            </div>
          </div>

          <div className={cx("address")}>
            {addr.street}, {addr.ward}, {addr.district}, {addr.province}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AddressList;