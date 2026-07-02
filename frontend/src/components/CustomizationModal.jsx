import { useState, useEffect } from "react";
import "../styles/modal.css";

function CustomizationModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions([]);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const options = [
    { name: "Parcel", price: 5 },
    { name: "Extra Butter", price: 10 },
    { name: "Extra Cheese", price: 20 },
    { name: "Extra Spicy", price: 0 },
  ];

  const toggleOption = (option) => {
    const exists = selectedOptions.find(
      (item) => item.name === option.name
    );

    if (exists) {
      setSelectedOptions(
        selectedOptions.filter(
          (item) => item.name !== option.name
        )
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const extraAmount = selectedOptions.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const finalPrice = product.price + extraAmount;

  return (
    <div className="modal-overlay">
      <div className="custom-modal">

        <h2>{product.name}</h2>

        <p className="base-price">
          Base Price : Rs.{product.price}/-
        </p>

        <div className="option-list">
          {options.map((option) => (
            <label key={option.name} className="option-row">
              <input
                type="checkbox"
                checked={selectedOptions.some(
                  (item) => item.name === option.name
                )}
                onChange={() => toggleOption(option)}
              />

              <span>
                {option.name}

                {option.price > 0
                  ? ` (+Rs.${option.price})`
                  : " (Free)"}
              </span>
            </label>
          ))}
        </div>

        <div className="modal-total">
          Total : <strong>Rs.{finalPrice}/-</strong>
        </div>

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={() =>
              onAddToCart(product, selectedOptions)
            }
          >
            Add To Cart
          </button>
        </div>

      </div>
    </div>
  );
}

export default CustomizationModal;