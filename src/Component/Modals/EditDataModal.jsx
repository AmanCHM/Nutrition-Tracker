import React from "react";
import "./NutritionModal.css";


const EditDataModal = ({
 
  setModal,
  quantity,
  setQuantity,
  selectquantity,
  setSelectquantity,
  selectedFoodData,
  setSelectCategory,
  calculateCalories,
  handleEditModalData,
}) => {



    
  return (
    <>

    <div className="modal"  >
      <button className="close-button" style={{marginTop:"-9%", backgroundColor:"white"}} onClick={() => setModal(false)}>
        x
      </button>
      <h2 className="modal-title">Update Meal</h2>

      <label style={{fontSize:"1.3rem"}}> <strong>{selectedFoodData?.foods[0]?.food_name}</strong></label>

      <div className="input-container">
        <label>Choose Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          step="1"
        />
      </div>

      <div className="select-container">
        <label>Select Slices</label>
        <select
          onChange={(e) => setSelectquantity(e.target.value)}
        >
          {selectedFoodData?.foods.map((food, foodIndex) =>
            food.alt_measures.map((measure, index) => (
              <option
                key={`${foodIndex}-${index}`}
                value={measure.serving_weight}
              >
                {` ${measure.measure} `}
              </option>
            ))
          )}
        </select>
      </div>

      <label className="meal-label">Choose Meal</label>
      <select
        className="meal-select"
        name="meal-category"
        id="meal-category"
        onChange={(e) => setSelectCategory(e.target.value)}
      >
        <option value="choose">Choose here</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Snack">Snack</option>
        <option value="Dinner">Dinner</option>
      </select>
      <p className="calorie-info">
        Calorie Served: {Math.round(calculateCalories)}
      </p>
      <button className="add-meal-button" onClick={handleEditModalData}>
        Update Meal
      </button>
      </div>
    </>
  );
};

export default EditDataModal;
