import React, { useState } from "react";
import "./DrinkModal.css";

const DrinkModal = ({ showModal, setShowModal }) => {
  const [drinkType, setDrinkType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [container, setContainer] = useState("");

  const handleSubmit = () => {
    if (!drinkType || !quantity || !container) {
      alert("Please fill out all fields.");
      return;
    }
    const drinkDetails = { drinkType, quantity, container };
    console.log("Drink Details:", drinkDetails);
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Add Drink Details</h2>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <div className="modal-content">
        
              <div className="form-group">
                <label htmlFor="drinkType">Drink Type:</label>
                <select
                  id="drinkType"
                  value={drinkType}
                  onChange={(e) => setDrinkType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Water">Water</option>
                  <option value="Alcohol">Alcohol</option>
                  <option value="Caffeine">Caffeine</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

           
              <div className="form-group">
                <label htmlFor="container">Container Type:</label>
                <select
                  id="container"
                  value={container}
                  onChange={(e) => setContainer(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Cup">Cup</option>
                  <option value="Glass">Glass</option>
                </select>
              </div>

              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DrinkModal;
