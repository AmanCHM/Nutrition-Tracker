import React from "react";
import "./MealModal.css";

const NutritionModal = ({
  onClose,
  foodData,
  calories,
  proteins,
  carbs,
  fats,
}) => {


  return (
    <>
      <div className="logout-modal-content">
  <h2>Nutritional Facts</h2>
  <h3 style={{ color: "#063970", textAlign:'center', paddingTop:'10px'}}>{foodData?.foods[0]?.food_name?.charAt(0).toUpperCase() + 
foodData?.foods[0]?.food_name?.slice(1)
}</h3>
  <table style={{ width: "100%", borderCollapse: "collapse", color: "black" }}>
    <thead>
      <tr>
        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Nutrient</th>
        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: "8px" }}>Calories</td>
        <td style={{ padding: "8px" }}>{calories} kcal</td>
      </tr>
      <tr>
        <td style={{ padding: "8px" }}>Total Fat</td>
        <td style={{ padding: "8px" }}>{fats} g</td>
      </tr>
      <tr>
        <td style={{ padding: "8px" }}>Total Carbohydrate</td>
        <td style={{ padding: "8px" }}>{carbs} g</td>
      </tr>
      <tr>
        <td style={{ padding: "8px" }}>Protein</td>
        <td style={{ padding: "8px" }}>{proteins} g</td>
      </tr>
    </tbody>
  </table>
  <button onClick={onClose} className="modalClose-button" style={{ marginTop: "15px" }}>
    Close
  </button>
</div>

    </>
  );
};

export default NutritionModal;
