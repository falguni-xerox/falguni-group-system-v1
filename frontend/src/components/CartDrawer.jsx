import { useState } from "react";
import "../styles/cart.css";

function CartDrawer({
  isOpen,
  cart,
  onClose,
  onIncrease,
  onDecrease,
  totalAmount,
  tableNo,
  clearCart,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNo,
          items: cart,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `✅ Order Placed Successfully\n\nToken No : ${data.order.tokenNo}\nTable No : ${data.order.tableNo}`
        );

        console.log(data.order);

        clearCart();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawer-overlay">
      <div className="cart-drawer">
        <div className="drawer-header">
          <h2>Your Order</h2>
          <button onClick={onClose}>×</button>
        </div>

        <div
          style={{
            background: "#fff5e6",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "700",
            color: "#6b3e00",
          }}
        >
          🍽️ Table No : {tableNo}
        </div>

        {cart.map((item) => (
          <div className="drawer-item" key={item.cartId}>
            <div className="drawer-item-info">
              <h3>{item.name}</h3>

              <p>
                Rs. {item.price}/- × {item.quantity}
              </p>

              {item.customization?.length > 0 && (
                <div className="addon-list">
                  {item.customization.map((option) => (
                    <span key={option.name || option}>
                      + {option.name || option}
                    </span>
                  ))}
                </div>
              )}

              <strong className="item-total">
                Item Total : Rs. {item.price * item.quantity}/-
              </strong>
            </div>

            <div className="qty-box">
              <button className="qty-btn" onClick={() => onDecrease(item)}>
                -
              </button>

              <span className="qty-number">{item.quantity}</span>

              <button className="qty-btn" onClick={() => onIncrease(item)}>
                +
              </button>
            </div>
          </div>
        ))}

        <div className="drawer-total">
          <span>Grand Total</span>
          <strong>Rs. {totalAmount}/-</strong>
        </div>

        <button
          className="place-order-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CartDrawer;