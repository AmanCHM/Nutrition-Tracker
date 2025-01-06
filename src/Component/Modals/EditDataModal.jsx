import React, { useEffect, useState } from "react";
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

  const [errors, setErrors] = useState({
    quantity: "",
    selectquantity: "",
    selectCategory: "",
  });

  // Validate Quantity
  const validateQuantity = (value) => {
    if (!value || value <= 0) {
      return "Please enter a valid quantity.";
    }
    return "";
  };

  // Validate Select Quantity
  const validateSelectQuantity = (value) => {
    if (!value) {
      return "Please select a quantity.";
    }
    return "";
  };

  // Validate Meal Category
  const validateMealCategory = (value) => {
    if (!value) {
      return "Please choose a meal category.";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Trigger validation on blur
    if (name === "quantity") {
      newErrors.quantity = validateQuantity(value);
    }
    if (name === "selectquantity") {
      newErrors.selectquantity = validateSelectQuantity(value);
    }
    if (name === "selectCategory") {
      newErrors.selectCategory = validateMealCategory(value);
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      quantity: validateQuantity(quantity),
      selectquantity: validateSelectQuantity(selectquantity),
      selectCategory: validateMealCategory(selectCategory),
    };

    setErrors(newErrors);

 
    if (Object.values(newErrors).every((error) => !error)) {
      handleEditModalData();
    }
  };

  const mealOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];

  useEffect(() => {
    if (mealName) {
      setSelectCategory(mealName);
    }
  }, [mealName, setSelectCategory]);
  
  console.log(selectCategory);
  console.log(mealName)
  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2 className="modal-title" style={{ color: "black" }}>
          Update Meal
        </h2>

        <h3 style={{ color: "#063970", textAlign:'center', paddingTop:'10px'}}>
          {selectedFoodData?.foods[0]?.food_name?.charAt(0).toUpperCase() + 
          selectedFoodData?.foods[0]?.food_name?.slice(1)}
        </h3>

        <div className="input-container">
          <label>Choose Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={handleBlur} 
            step="1"
          />
          {errors.quantity && <div style={{ color: "red" }}>{errors.quantity}</div>}
        </div>

        <div className="select-container">
          <label>Select Serving Size</label>
          <GlobalSelect
            options={
              selectedFoodData?.foods.flatMap((food) =>
                food.alt_measures.map((measure) => ({
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
            onBlur={handleBlur} 
          />
          {errors.selectquantity && <div style={{ color: "red" }}>{errors.selectquantity}</div>}
        </div>

        <label className="meal-label">Choose Meal</label>
        <GlobalSelect
          options={mealOptions}
          value={mealOptions.find((option) => option.value === selectCategory)}
          onChange={(selectedOption) => setSelectCategory(selectedOption.value)}
          onBlur={handleBlur} 
        />
        {errors.selectCategory && <div style={{ color: "red" }}>{errors.selectCategory}</div>}

        <p className="calorie-info">Calorie Served: {Math.round(calculateCalories)}</p>

        <button className="add-meal-button" onClick={handleSubmit}>
          Update Meal
        </button>
      </div>
    </>
  );
};

export default EditDataModal;
