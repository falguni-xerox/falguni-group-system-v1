import { useEffect, useState } from "react";

import Header from "../components/Header";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import CartButton from "../components/CartButton";
import CartDrawer from "../components/CartDrawer";

import "../styles/app.css";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const tableNo =
    new URLSearchParams(window.location.search).get("table") || "1";

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data);
      })
      .catch((err) => {
        console.log("Products API Error:", err);
      });
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product, options = []) => {
    const extraAmount = options.reduce((sum, option) => sum + option.price, 0);

    const cartId =
      product._id + "-" + options.map((option) => option.name).join("-");

    const finalProduct = {
      ...product,
      id: product._id,
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
      .filter((item) => item._id === productId || item.id === productId)
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
              key={product._id}
              product={product}
              quantity={getProductQuantity(product._id)}
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