import React, { useState } from "react";
import Select from "react-select";
import "./MealModal.css";

import GlobalSelect from "./../Page-Components/Globalselect";

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
  selectCategory,
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
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];

  const image =
    selectedFoodData?.foods.length > 0
      ? selectedFoodData?.foods[0]?.photo?.thumb
      : "no data";
  console.log("imagea", image);
  // console.log("fooddata",selectedFoodData)

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
      handleModalData();
    }
  };
  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2>Select Meal</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={image} alt="" />
        </div>
        <h3
          style={{ color: "#063970", textAlign: "center", paddingTop: "10px" }}
        >
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
          {errors.quantity && (
            <div style={{ color: "red" }}>{errors.quantity}</div>
          )}
        </div>

        <div className="select-container">
          <label>Select Serving Size</label>
          <GlobalSelect
            placeholder="Choose a meal"
            options={sliceOptions}
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label: selectedFoodData?.foods
                      .flatMap((food) => food.alt_measures)
                      .find(
                        (measure) => measure.serving_weight === selectquantity
                      )?.measure,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setSelectquantity(selectedOption.value)
            }
            onBlur={handleBlur}
          />
          {errors.selectquantity && (
            <div style={{ color: "red" }}>{errors.selectquantity}</div>
          )}
        </div>

        <label className="meal-label">Choose Meal</label>
        <GlobalSelect
          options={mealOptions}
          value={mealOptions.find((option) => option.value === selectCategory)}
          onChange={(selectedOption) => setSelectCategory(selectedOption.value)}
          onBlur={handleBlur}
        />
        {errors.selectCategory && (
          <div style={{ color: "red" }}>{errors.selectCategory}</div>
        )}

        <p className="calorie-info">
          Calorie Served: {Math.round(calculateCalories)}
        </p>
        <button className="add-meal-button" onClick={handleSubmit}>
          Add Meal
        </button>
      </div>
    </>
  );
};

export default MealModal;
