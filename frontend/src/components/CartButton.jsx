import "../styles/cart.css";

function CartButton({ cartCount, totalAmount, onOpenCart }) {
  if (cartCount === 0) return null;

  return (
    <div className="cart-button">
      <div className="cart-left">
        <div className="cart-icon">🛒</div>

        <div className="cart-details">
          <h3>
            {cartCount} Item{cartCount > 1 ? "s" : ""}
          </h3>

          <p>Total Rs. {totalAmount}/-</p>
        </div>
      </div>

      <button
        className="proceed-btn"
        onClick={onOpenCart}
      >
        Proceed →
      </button>
    </div>
  );
}

export default CartButton;