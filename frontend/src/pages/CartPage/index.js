import { useEffect, useRef, useState } from "react";
import { getCart, updateCart, removeItem } from "../../api/CartApi";

import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSumary";

import styles from "./Cart.module.scss";
import classNames from "classnames/bind";
import ConfirmDialog from "../../components/ConfirmDialog";

const cx = classNames.bind(styles);

function CartPage() {
  const [cart, setCart] = useState(null);
  const [selected, setSelected] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const checkAllRef = useRef();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const res = await getCart();
    setCart(res.data);
    setSelected(res.data.items.map((x) => x.productId));
  };

  const handleUpdate = async (productId, quantity) => {
    if (quantity <= 0) return;
    await updateCart({ productId, quantity });
    loadCart();
  };

  const handleAskRemove = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleRemove = async (productId) => {
    await removeItem(productId);
    setShowConfirm(false);
    loadCart();
  };

  const handleCheck = (id, isChecked) => {
    setSelected((prev) => {
      if (isChecked) {
        return prev.includes(id) ? prev : [...prev, id];
      } else {
        return prev.filter((x) => x !== id);
      }
    });
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelected(cart.items.map((x) => x.productId));
    } else {
      setSelected([]);
    }
  };

  const isAllChecked =
    cart?.items.length > 0 && selected.length === cart.items.length;

  useEffect(() => {
    if (checkAllRef.current) {
      checkAllRef.current.indeterminate =
        selected.length > 0 && selected.length < cart.items.length;
    }
  }, [selected, cart]);

  if (!cart) return <div className={cx("loading")}>Loading...</div>;

  const selectedItems = cart.items.filter((x) =>
    selected.includes(x.productId),
  );

  return (
    <div className={cx("cart-container")}>
      <h2>Giỏ hàng của bạn</h2>

      <div className={cx("cart-page")}>
        {/* LEFT */}
        <div className={cx("left")}>
          <div className={cx("check-all")}>
            <input
              ref={checkAllRef}
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => handleCheckAll(e.target.checked)}
            />
            <span>
              Chọn tất cả ({selected.length}/{cart.items.length})
            </span>
          </div>

          {cart.items.length === 0 && (
            <div className={cx("empty")}>🛒 Giỏ hàng trống</div>
          )}

          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              checked={selected.includes(item.productId)}
              onCheck={handleCheck}
              onUpdate={handleUpdate}
              onRemove={handleAskRemove}
            />
          ))}
        </div>

        {/* RIGHT */}
        <div className={cx("right")}>
          <CartSummary items={selectedItems} />
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Xóa sản phẩm"
        message="Bạn có chắc muốn xóa sản phẩm này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleRemove(selectedId)}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default CartPage;
