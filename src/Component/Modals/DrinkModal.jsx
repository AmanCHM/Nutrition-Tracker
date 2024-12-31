import React, { useState } from "react";
import "./DrinkModal.css";
import { useDispatch } from "react-redux";
import GlobalSelect from "../Page-Components/Globalselect";
import { arrayUnion, doc, getDoc, queryEqual, setDoc, updateDoc } from "firebase/firestore";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { merge } from "lodash";
import { auth, db } from "../../firebase";
// Import your reusable component

const DrinkModal = ({ setShowDrinkModal ,onDataUpdated}) => {
  const [drinkType, setDrinkType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [container, setContainer] = useState("");

  const dispatch = useDispatch();

  
  const servingSize =
    container === "Small Glass (100ml)" ? 100 : container === "Medium Glass (175ml)" ? 175 : 250;
  const totalAmount = servingSize * quantity;

  const handleDrinkData = async (e) => {

    try {
      dispatch(showLoader())
      const user = auth.currentUser;
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const data = {
        id: Date.now(),
        totalAmount:  totalAmount,
        drinklabel:container
      };
        const newData = { [drinkType]: arrayUnion(data) };
          await setDoc(docRef,newData , { merge: true })


          if (onDataUpdated) {
            onDataUpdated(); 
          }
        // console.log(newData);
    } catch (error) {
      console.log(error);
    } finally {
      setShowDrinkModal(false)
      dispatch(hideLoader());
    }
  };


  console.log("drinkType",drinkType);
 console.log("quantity",quantity);
 console.log("totalamount",totalAmount);
  

  // Options for the drink type and container type dropdowns
  const drinkTypeOptions = [
    { value: "Water", label: "Water" },
    { value: "Alcohol", label: "Alcohol" },
    { value: "Caffeine", label: "Caffeine" },
  ];

  const containerOptions = [
    { value: "Small Glass (100ml)", label: "Small Glass (100ml)" },
    { value: "Medium Glass (175ml)", label: "Medium Glass (175ml)" },
    { value: "Large Glass (250ml)", label: "Large Glass (250ml)" },
  ];


  console.log("container",container);
  return (
    <div>


      <button className="close-button" onClick={() => setShowDrinkModal(false)}>
        X
      </button>

      <h2 className="modal-title" style={{ color: "black" }}>
        Add Drink Details
      </h2>

      <div>
        <div className="input-group">
          <label htmlFor="drinkType">Drink Type:</label>
          <GlobalSelect
            options={drinkTypeOptions}
            value={drinkTypeOptions.find((opt) => opt.value === drinkType)}
            onChange={(selected) => setDrinkType(selected?.value || "")}
            placeholder="Select a drink type"
            
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="container">Container Type:</label>
        <GlobalSelect
          options={containerOptions}
          value={containerOptions.find((opt) => opt.value === container)}
          onChange={(selected) => setContainer(selected?.value || "")}
          placeholder="Select a container type"
        />
      </div>

      <div className="input-group">
        <label htmlFor="quantity">Quantity</label>
        <input
            type="number"
            min='1'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="1"
            required
          />
      </div>

      <button className="submit-button" onClick={handleDrinkData}>
        Submit
      </button>
    </div>
  );
};

export default DrinkModal;
