import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { now } from "lodash";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import GlobalSelect from "../Page-Components/Globalselect";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/loaderSlice";
import { toast } from "react-toastify";

const EditDrinkModal = ({
    setEditDrinkModal,
    drinkName,
    drinkId,
    onDataUpdated
}) => {

    const [drinkType, setDrinkType] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [container, setContainer] = useState("");
    const dispatch = useDispatch();
    const  [drinkData ,setDrinkData]=useState()
    const servingSize =
    container === "Small Glass (100ml)" ? 100 : container === "Medium Glass (175ml)" ? 175 : 250;
    const totalAmount = servingSize * quantity;
 
    const handleEditDrinkData = async () => {
        console.log("insdie edit");

        if(!drinkType ||!container ){
            toast.error("Please select  all fields");
            return;
          }
          if(quantity<=0){
            toast.error("Please select the +ve number")
            return;
          }
        dispatch(showLoader());
        try {
          const user = auth.currentUser;
          const userId = user.uid;
          const data = {
            id: Date.now(),
            totalAmount:  totalAmount,
            drinklabel:container,
          };
          const date = new Date().toISOString().split("T")[0];
          const docRef = doc(db, "users", userId, "dailyLogs", date);
          const getData = (await getDoc(docRef)).data();

          console.log("before update", getData);
          console.log("drin");
            console.log(getData[drinkName]);
            const drinkdata = getData[drinkName].filter(
      (item) => item.id !== drinkId
    );
             console.log("drinkData",drinkData);
          await updateDoc(docRef, { [drinkName]: drinkdata });
    
          const newData = { [drinkType]: arrayUnion(data) };
          await updateDoc(docRef, newData);
          const updatedDoc = (await getDoc(docRef)).data();
          setDrinkData(updatedDoc);
          if (onDataUpdated) {
            onDataUpdated(); 
          }
          console.log("updated doc", updatedDoc);
        } catch (error) {
          console.log(error);
        } finally {
          setEditDrinkModal(false);
        //   setEditToggle(false);
          dispatch(hideLoader());
        }
      };

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

    //     function validateForm() {
    // // Check if the First Name is an Empty string or not.

    // if (firstName.length == 0) {
    //   alert('Invalid Form, First Name can not be empty')
    //   return
    // }

    // // Check if the Email is an Empty string or not.

    // if (email.length == 0) {
    //   alert('Invalid Form, Email Address can not be empty')
    //   return
    // }

  return (
    <>
      <button className="close-button" onClick={() => setEditDrinkModal(false)}>
        X
      </button>
      <h2 className="modal-title" style={{ color: "black" }}>
        Update Drink Details
      </h2>

      <div className="input-group">
        <label htmlFor="drinkType">Drink Type:</label>
        <GlobalSelect
          options={drinkTypeOptions}
          value={drinkTypeOptions.find((opt) => opt.value === drinkType)}
          onChange={(selected) => setDrinkType(selected?.value || "")}
          placeholder="Select a drink type"
        />
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
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          step="1"
          required
        />
      </div>

      <button
        className="submit-button"
        onClick={handleEditDrinkData}
      >
        Submit
      </button>
    </>
  );
};

export default EditDrinkModal;
