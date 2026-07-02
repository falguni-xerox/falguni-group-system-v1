import { useState } from "react";
import products from "../data/products";

import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import CartButton from "../components/CartButton";
import CartDrawer from "../components/CartDrawer";

import "../styles/app.css";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const tableNo =
    new URLSearchParams(window.location.search).get("table") || "1";

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product, options = []) => {
    const extraAmount = options.reduce((sum, option) => sum + option.price, 0);

    const cartId =
      product.id + "-" + options.map((option) => option.name).join("-");

    const finalProduct = {
      ...product,
      cartId,
      basePrice: product.price,
      price: product.price + extraAmount,
      customization: options,
    };

    const existingItem = cart.find((item) => item.cartId === cartId);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...finalProduct, quantity: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const existingItem = cart.find((item) => item.cartId === product.cartId);

    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      setCart(cart.filter((item) => item.cartId !== product.cartId));
    } else {
      setCart(
        cart.map((item) =>
          item.cartId === product.cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getProductQuantity = (productId) => {
    return cart
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="app">
      <Header />

      <main className="page-container">
        <div className="table-badge">Table No: {tableNo}</div>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="menu-list">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getProductQuantity(product.id)}
              onIncrease={addToCart}
              onDecrease={removeFromCart}
            />
          ))}
        </div>
      </main>

      {!isCartOpen && (
        <CartButton
          cartCount={cartCount}
          totalAmount={totalAmount}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onIncrease={addToCart}
        onDecrease={removeFromCart}
        totalAmount={totalAmount}
        tableNo={tableNo}
        clearCart={clearCart}
      />
    </div>
  );
}

export default Home;