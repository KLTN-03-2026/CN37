import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AddressSection.module.scss";
import { getAddresses } from "../../../api/UserAddressApi";

const cx = classNames.bind(styles);

export default function AddressSection({ selectedAddress, setSelectedAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    getAddresses().then(res => {
      setAddresses(res.data);

      const defaultAddr = res.data.find(x => x.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    });
  }, []);

  const selected = addresses.find(a => a.id === selectedAddress);

  return (
    <div className={cx("card")}>
      
      {/* HEADER */}
      <div className={cx("cardHeader")}>
        <span className={cx("cardTitle")}>Địa chỉ nhận hàng</span>

        <div className={cx("actions")}>
          <span
            className={cx("changeBtn")}
            onClick={() => setShowList(!showList)}
          >
            {showList ? "Thu gọn" : "Thay đổi"}
          </span>

          <button className={cx("addBtn")}>+ Thêm</button>
        </div>
      </div>

      {/* DEFAULT ADDRESS */}
      {!showList && selected && (
        <div className={cx("addressItem", "active")}>
          <div className={cx("addressInfo")}>
            <div className={cx("addressTop")}>
              <span className={cx("receiver")}>
                {selected.receiverName}
              </span>
              <span className={cx("phone")}>
                {selected.receiverPhone}
              </span>
            </div>

            <div className={cx("addressDetail")}>
              {selected.street}, {selected.ward}, {selected.district}, {selected.province}
            </div>

            {selected.isDefault && (
              <span className={cx("defaultTag")}>Mặc định</span>
            )}
          </div>
        </div>
      )}

      {/* FULL LIST */}
      {showList && (
        <div className={cx("addressList")}>
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={cx("addressItem", {
                active: selectedAddress === addr.id
              })}
              onClick={() => {
                setSelectedAddress(addr.id);
                setShowList(false); // 👉 chọn xong auto thu gọn
              }}
            >
              <input
                type="radio"
                checked={selectedAddress === addr.id}
                readOnly
              />

              <div className={cx("addressInfo")}>
                <div className={cx("addressTop")}>
                  <span className={cx("receiver")}>
                    {addr.receiverName}
                  </span>
                  <span className={cx("phone")}>
                    {addr.receiverPhone}
                  </span>
                </div>

                <div className={cx("addressDetail")}>
                  {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                </div>

                {addr.isDefault && (
                  <span className={cx("defaultTag")}>Mặc định</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}