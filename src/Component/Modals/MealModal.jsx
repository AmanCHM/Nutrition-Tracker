import React from "react";
import Select from "react-select";
import "./MealModal.css";

import GlobalSelect from './../Page-Components/Globalselect';

const MealModal = ({
  modal,
  setModal,
  quantity,
  setQuantity,
  selectquantity,
  setSelectquantity,
  selectedFoodData,
  setSelectCategory,
  calculateCalories,
  handleModalData,
}) => {
  // Prepare options for react-select
  const sliceOptions = selectedFoodData?.foods.flatMap((food, foodIndex) =>
    food.alt_measures.map((measure, index) => ({
      value: measure.serving_weight,
      label: measure.measure,
      key: `${foodIndex}-${index}`,
    }))
  );

  const mealOptions = [
    { value: "choose", label: "Choose here" },
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];


 

  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2>Select Meal</h2>
        <h3 style={{ color: "#063970", textAlign:'center', paddingTop:'10px'}}>{selectedFoodData?.foods[0]?.food_name?.charAt(0).toUpperCase() + 
selectedFoodData?.foods[0]?.food_name?.slice(1)
}</h3>
       
        <div className="input-container">
          <label>Choose Quantity</label>
          {/* <label>Choose Quantity</label> */}
          <input
            type="number"
            min='0'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="1"
          />
        </div>

        <div className="select-container">
          <label>Select Slices</label>
          <GlobalSelect
            options={sliceOptions}
            onChange={(selectedOption) => setSelectquantity(selectedOption.value)}
            placeholder="Select slice"
            isSearchable={true}
          />
        </div>

        <label className="meal-label">Choose Meal</label>
        <GlobalSelect
          options={mealOptions}
          onChange={(selectedOption) => setSelectCategory(selectedOption.value)}
          placeholder="Choose a meal"
          isSearchable={false}
        />

        <p className="calorie-info">Calorie Served: {Math.round(calculateCalories)}</p>
        <button className="add-meal-button" onClick={handleModalData}>
          Add Meal
        </button>
      </div>
    </>
  );
};

export default MealModal;
