import React from "react";
import classNames from "classnames/bind";
import styles from "./AddressList.module.scss";

const cx = classNames.bind(styles);

function AddressList({ addresses = [], onEdit, onDelete }) {
  if (!addresses.length) {
    return <div style={{ textAlign: "center", padding: 40 }}>
      <img
        src="https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/estore-v2/img/empty_address_book.png"
        style={{ width: 300, marginBottom: 20 }}
      />
      <p>Bạn chưa có địa chỉ nào</p>
    </div>;
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