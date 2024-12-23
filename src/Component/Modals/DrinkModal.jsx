import React, { useState } from "react";
import "./DrinkModal.css";
import { CiGlass } from "react-icons/ci";

import { FaTint, FaWineGlassAlt, FaCoffee } from "react-icons/fa"; 
const DrinkModal = ({ setShowDrinkModal, setDrinkDetails }) => {
  const [drinkType, setDrinkType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [container, setContainer] = useState("");
  // const handleSubmit = () => {
  //   if (!drinkType || !quantity || !container) {
  //     alert("Please fill out all fields.");
  //     return;
  //   }
  //   if (container === "sGlass") {
  //     setDrinkDetails({
  //       [drinkType]: { ServingSize: 100, quantity: quantity },
  //     });
  //   } else if (container === "mGlass") {
  //     setDrinkDetails({
  //       [drinkType]: { ServingSize: 175, quantity: quantity },
  //     });
  //   } else {
  //     setDrinkDetails({
  //      [drinkType]: { ServingSize: 250, quantity: quantity },
  //     });
  //   }

  //   setShowDrinkModal(false);
  // };
  const handleSubmit = () => {

    if (!drinkType || !quantity || !container) {
      alert("Please fill out all fields.");
      return;
    }
    const servingSize =
      container === "sGlass" ? 100 : container === "mGlass" ? 175 : 250;
  
    setDrinkDetails(() => ({
      [drinkType]: {
        ServingSize: servingSize,
        quantity: quantity,
      },
    }));
  
    setShowDrinkModal(false);
  };
  

  return (
    <>
      <div>
      
          <button
            className="close-button"
            onClick={() => setShowDrinkModal(false)}
          >
            X
          </button>

          <h2 className="modal-title" style={{ color: "black" }}>
            Add Drink Details
          </h2>

          <div>
            <div className="input-group">
              <label htmlFor="drinkType">Drink Type:</label>
              <select
                id="drinkType"
                value={drinkType}
                onChange={(e) => setDrinkType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Water">Water      <FaWineGlassAlt size={24} color="#00BFFF" /></option>
                <option value="Alcohol">Alcohol</option>
                <option value="Caffeine">Caffeine</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="container">Container Type:</label>
            <select
              id="container"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
            >
              <option value="">Select</option>
              <option value="sGlass">Small Glass 100ml  </option>
              <option value="mGlass">Medium Glass 175ml</option>
              <option value="lGlass">Large Glass 250ml</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="quantity">Quantity:{quantity}</label>
             <button onClick={()=> setQuantity(quantity+1)}> Add more</button>
               
      
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      
    </>
  );
};

export default DrinkModal;
