import React from "react";
import { useSelector } from "react-redux";

const ShowCalorie = () => {
  const calories = useSelector((state) => state.calorieGoalReducer.requiredCalorie);
  const goal = useSelector((state) => state.calorieGoalReducer.goal);

  // if (!calories || !goal) {
  //   return <h2>Calorie information not available. Please calculate first!</h2>;
  // }

  console.log(calories)
  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === "loose") {
    recommendedCalories = calories;
    goalDescription = "to lose weight";
  } else if (goal === "gain") {
    recommendedCalories = calories;
    goalDescription = "to gain weight";
  } else {
    recommendedCalories = calories;
    goalDescription = "to maintain weight";
  }

  return (
    <div className="calorie-container">
      <h1>Calorie Requirements</h1>
      <div className="calorie-data">
        <p><strong>Your Goal:</strong> {goalDescription.charAt(0).toUpperCase() + goalDescription.slice(1)}</p>
        <p><strong>Recommended Calories:</strong> {recommendedCalories} kcal/day</p>
      </div>
    </div>
  );
};

export default ShowCalorie;
