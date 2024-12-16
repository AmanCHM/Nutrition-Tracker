import React from "react";
import "./NutritionModal.css";

const NutritionModal = ({  onClose, foodData }) => {
  if ( !foodData || !foodData.foods) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-content">
        <h2>Nutritional Facts</h2>

        {foodData.foods.length > 0 ? (
          foodData.foods.map((food, index) => (
            <div key={index} className="food-details">
              <h3>{food.food_name}</h3>
              <p ><strong>Calories:</strong> {food.nf_calories} kcal</p>
              <p><strong>Total Fat:</strong> {food.nf_total_fat} g</p>
              <p><strong>Saturated Fat:</strong> {food.nf_saturated_fat} g</p>
              <p><strong>Cholesterol:</strong> {food.nf_cholesterol} mg</p>
              <p><strong>Sodium:</strong> {food.nf_sodium} mg</p>
              <p><strong>Total Carbohydrate:</strong> {food.nf_total_carbohydrate} g</p>
              <p><strong>Dietary Fiber:</strong> {food.nf_dietary_fiber} g</p>
              <p><strong>Sugars:</strong> {food.nf_sugars} g</p>
              <p><strong>Protein:</strong> {food.nf_protein} g</p>
              <p><strong>Potassium:</strong> {food.nf_potassium} mg</p>
              <p><strong>Phosphorus:</strong> {food.nf_p} mg</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No food data available.</p>
        )}

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    
    </div>
  );
};

export default NutritionModal;
