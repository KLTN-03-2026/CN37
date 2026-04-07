import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./CheckoutPage.module.scss";

import ProductList from "./components/ProductList";
import OrderSummary from "./components/OrderSummary";
import CustomerInfo from "./components/CustomerInfo";
import AddressSection from "./components/AddressSection";
import PaymentMethod from "./components/PaymentMethod";
import NoteSection from "./components/NoteSection";
import Breadcrumb from "./components/Breadcrumb";
import { fetchCheckoutBuyNow, fetchCheckoutCart } from "../../api/CheckoutApi";
import { getCurrentUser } from "../../api/UserApi";
import { useLocation } from "react-router-dom";

export default function CheckoutPage({ type, productId, quantity }) {
  const useParam = new URLSearchParams(window.location.search);
  const typeProduct = useParam.get("type");
  const product_id = useParam.get("productId");
  const quantity_product = useParam.get("quantity");
  const [data, setData] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const cx = classNames.bind(styles);

  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    getCurrentUser().then((res) => {
      setUserProfile(res.data);
    });

    type = type || typeProduct;
    productId = productId || product_id;
    quantity = quantity || quantity_product;

    const fetchData = async () => {
      if (state?.type === "cart") {
        const res = await fetchCheckoutCart(state.items);
        setData(res);
      } else if (type === "buy-now") {
        setData(await fetchCheckoutBuyNow(productId, quantity));
      }
    };

    fetchData();
  }, []);

  const handleOrder = async () => {
    const body = {
      addressId,
      paymentMethod,
      note,
      items: data.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    const res = await axios.post("/api/orders", body);
    alert("Đặt hàng thành công! ID: " + res.data.orderId);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className={cx("checkoutPage")}>
      <div className={cx("breadcrumb")}>
        <Breadcrumb />
      </div>
      <div className={cx("checkoutContainer")}>
        {/* LEFT */}
        <div className={cx("checkoutLeft")}>
          <ProductList items={data.items} />
          <CustomerInfo user={userProfile} />
          <AddressSection
            selectedAddress={addressId}
            setSelectedAddress={setAddressId}
          />
          <NoteSection note={note} setNote={setNote} />
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
  
        {/* RIGHT */}
        <div className={cx("checkoutRight")}>
          <OrderSummary items={data.items} onSubmit={handleOrder} />
        </div>
      </div>
    </div>
  );
}
