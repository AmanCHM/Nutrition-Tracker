import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ShowCalorie = () => {
  const calories = useSelector((state) => state.calorieGoalReducer.requiredCalorie);
  const goal = useSelector((state) => state.calorieGoalReducer.goal);

  // if (!calories || !goal) {
  //   return <h2>Calorie information not available. Please calculate first!</h2>;
  // }
  const navigate = useNavigate();

  console.log(calories)
  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === "loose") {
    recommendedCalories = calories;
    goalDescription = "to lose  1 kg weight/week ";
  } else if (goal === "gain") {
    recommendedCalories = calories;
    goalDescription = "to gain 1 kg weight/week";
  } else {
    recommendedCalories = calories;
    goalDescription = "to maintain weight";
  }

  return (
    <div className="calorie-container">
      <h1>Calorie Requirements</h1>
      <div className="calorie-data">
        <ul>
          <li><strong>Your Goal:</strong> {goalDescription.charAt(0).toUpperCase() + goalDescription.slice(1)}</li>
          <li> 
        <strong>Recommended Calories:</strong> {recommendedCalories} kcal/day</li>
        

        </ul>
      </div>
   
      <button type="submit" style={{ color: "white", fontSize: "17px" }} onClick={()=>navigate("../signup")}>
          Create Your Account
        </button>
    </div>
  );
};

export default ShowCalorie;
