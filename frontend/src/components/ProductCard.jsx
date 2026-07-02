import { useState } from "react";
import "../styles/product.css";

function ProductCard({ product, quantity, onIncrease, onDecrease }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const icon =
    product.category === "Tea"
      ? "☕"
      : product.category === "Maggi" || product.category === "Korean Maggi"
      ? "🍜"
      : "🥤";

  const isMaggi =
    product.category === "Maggi" || product.category === "Korean Maggi";

  const options = [
    { name: "Extra Butter", price: 10 },
    { name: "Extra Cheese", price: 20 },
    { name: "Extra Spicy", price: 5 },
    { name: "Parcel", price: 5 },
  ];

  const toggleOption = (option) => {
    const exists = selectedOptions.find((item) => item.name === option.name);

    if (exists) {
      setSelectedOptions(
        selectedOptions.filter((item) => item.name !== option.name)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const extraAmount = selectedOptions.reduce(
    (sum, option) => sum + option.price,
    0
  );

  const finalPrice = product.price + extraAmount;

  return (
    <div className="product-card">
      <div className="product-image">
        <span>{icon}</span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-category">{product.category}</p>

        {isMaggi && (
          <div className="custom-options">
            {options.map((option) => (
              <label className="custom-option" key={option.name}>
                <input
                  type="checkbox"
                  checked={selectedOptions.some(
                    (item) => item.name === option.name
                  )}
                  onChange={() => toggleOption(option)}
                />
                <span>
                  {option.name} (+Rs.{option.price}/-)
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="product-bottom">
          <div className="price-section">
            <span className="rupee">Rs.</span>
            <span className="price">{finalPrice}</span>
            <span className="suffix">/-</span>
          </div>

          {quantity > 0 ? (
            <div className="qty-box">
              <button className="qty-btn" onClick={() => onDecrease(product)}>
                -
              </button>

              <span className="qty-number">{quantity}</span>

              <button
                className="qty-btn"
                onClick={() => onIncrease(product, selectedOptions)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="add-btn"
              onClick={() => onIncrease(product, selectedOptions)}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;