import React from "react";
import "./MealModal.css";

const NutritionModal = ({
  onClose,
  foodData,
  calories,
  protein,
  carbs,
  fats,
}) => {


  return (
    <>
      <div className="modal-content" style={{color:"black"}}>
        <h2>Nutritional Facts</h2>
        <h3 style={{color:"#2980b9"}}>{foodData?.foods[0]?.food_name}</h3>
        <p style={{color:"black"}}>
          <strong>Calories:</strong> {calories} kcal
        </p>
        <p style={{color:"black"}}>
          <strong>Total Fat:</strong> {fats} g
        </p>
        <p style={{color:"black"}}>
          <strong>Total Carbohydrate:</strong> {carbs} g
        </p>
        <p style={{color:"black"}}>
          <strong>Protein:</strong> {protein} g
        </p>
        <button onClick={onClose} className="modalClose-button">
          Close
        </button>
      </div>
    </>
  );
};

export default NutritionModal;
