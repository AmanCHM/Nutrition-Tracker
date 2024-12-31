import React from "react";
import "./NutritionModal.css";

import GlobalSelect from './../Page-Components/Globalselect';

const EditDataModal = ({
  setModal,
  quantity,
  setQuantity,
  selectquantity,
  setSelectquantity,
  selectedFoodData,
  selectCategory,
  setSelectCategory,
  calculateCalories,
  handleEditModalData,
  mealName
}) => {

console.log("mealname",mealName);
console.log(selectquantity);
// console.log(object);
  const options =[
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];

 console.log("claculate Calories",calculateCalories);
  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2 className="modal-title" style={{ color: "black" }}>
          Update Meal
        </h2>

        <h3 style={{ color: "#063970", textAlign:'center', paddingTop:'10px'}}>{selectedFoodData?.foods[0]?.food_name?.charAt(0).toUpperCase() + 
         selectedFoodData?.foods[0]?.food_name?.slice(1)}</h3>
       

        <div className="input-container">
          <label>Choose Quantity</label>
          <input
            type="number"
            min='1'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="1"
          />
        </div>

        <div className="select-container">
          <label>Select Slices</label>
          <GlobalSelect
            options={
              selectedFoodData?.foods.flatMap((food, foodIndex) =>
                food.alt_measures.map((measure, index) => ({
                  value: measure.serving_weight,
                  label: measure.measure,
                }))
              )
            }
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label: selectedFoodData?.foods
                      .flatMap((food) => food.alt_measures)
                      .find((measure) => measure.serving_weight === selectquantity)?.measure,
                  }
                : null
            }
            
            onChange={(selectedOption) => setSelectquantity(selectedOption.value)}
          />
        </div>

        <label className="meal-label">Choose Meal</label>
        <GlobalSelect
          options={[
            { value: "Breakfast", label: "Breakfast" },
            { value: "Lunch", label: "Lunch" },
            { value: "Snack", label: "Snack" },
            { value: "Dinner", label: "Dinner" },
          ]}
         value= {options.find((option)=>option.value ===options.value)} 
          onChange={(selectedOption) => setSelectCategory(selectedOption.value)}
        />

        <p className="calorie-info">Calorie Served: {Math.round(calculateCalories)}</p>
        <button className="add-meal-button" onClick={handleEditModalData}>
          Update Meal
        </button>
      </div>
    </>
  );
};

export default EditDataModal;
