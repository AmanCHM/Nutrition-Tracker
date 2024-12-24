import React, { useState } from "react";
import "./DrinkModal.css";
import { useDispatch, useSelector } from "react-redux";
import { setAlcohol, setCaffeine, setWater } from "../../Redux/waterSlice";

const DrinkModal = ({ setShowDrinkModal }) => {
  const [drinkType, setDrinkType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [container, setContainer] = useState("");
   const dispatch = useDispatch();

   const { water, alcohol, caffeine } = useSelector((state) => state.waterReducer);

  const handleSubmit = () => {
    if (!drinkType || !quantity || !container) {
      alert("Please fill out all fields.");
      return;
    }
    const servingSize =
      container === "sGlass" ? 100 : container === "mGlass" ? 175 : 250;
    const totalAmount = servingSize * quantity;
      console.log("total amount",totalAmount);
    if (drinkType === "Water") {
      dispatch(setWater(totalAmount));
   
    } else if (drinkType === "Alcohol") {
      dispatch(setAlcohol(totalAmount));
    } else if (drinkType === "Caffeine") {
      dispatch(setCaffeine(totalAmount));
    }
  
    // setDrinkType("");
    // setQuantity("");
    // setContainer("");
    setShowDrinkModal(false)
  };

  // const handleReset = () => {

  //   dispatch(resetIntake());
  // };
//  console.log("modalwater ",water);
  
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
                <option value="Water">Water      </option>
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

