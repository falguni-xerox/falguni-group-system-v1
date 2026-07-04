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

  const API_URL = import.meta.env.VITE_API_URL;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startRazorpayPayment = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert(orderData.message || "Payment order creation failed");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Falguni Group",
        description: `Table No ${tableNo} Order Payment`,
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              alert("Payment verification failed");
              setLoading(false);
              return;
            }

            const saveOrderResponse = await fetch(`${API_URL}/api/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tableNo,
                items: cart,
                totalAmount,
                paymentMode: "Online",
                paymentStatus: "Paid",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
              }),
            });

            const saveOrderData = await saveOrderResponse.json();

            if (saveOrderData.success) {
              alert(
                `✅ Payment Successful

✅ Order Placed Successfully

Token No : ${saveOrderData.order.tokenNo}
Table No : ${saveOrderData.order.tableNo}`
              );

              clearCart();
              onClose();
            } else {
              alert(saveOrderData.message || "Order save failed");
            }
          } catch (error) {
            console.error(error);
            alert("Order save error");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: "Customer",
          contact: "",
          email: "",
        },

        theme: {
          color: "#16a34a",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment Error");
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

        {cart.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cart is Empty
          </p>
        ) : (
          cart.map((item) => (
            <div className="drawer-item" key={item.cartId}>
              <div className="drawer-item-info">
                <h3>{item.name}</h3>

                <p>
                  Rs. {item.price}/- × {item.quantity}
                </p>

                {item.customization?.length > 0 && (
                  <div className="addon-list">
                    {item.customization.map((option) => (
                      <span key={option.name}>+ {option.name}</span>
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
          ))
        )}

        <div className="drawer-total">
          <span>Grand Total</span>
          <strong>Rs. {totalAmount}/-</strong>
        </div>

        <button
          className="place-order-btn"
          onClick={startRazorpayPayment}
          disabled={loading || cart.length === 0}
        >
          {loading ? "Processing Payment..." : "Pay Online & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CartDrawer;