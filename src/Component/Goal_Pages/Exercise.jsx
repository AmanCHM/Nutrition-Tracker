import React, { useState } from "react";
import {
  setActivityLevel,
  setRequiredCalorie,
} from "../../Redux/calorieGoalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Exercise = () => {
  const [activity, setActivity] = useState("1.2");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [calories, setCalories] = useState();

  const height = useSelector((state) => state.calorieGoalReducer.height);
  const weight = useSelector((state) => state.calorieGoalReducer.currentWeight);
  const age = useSelector((state) => state.calorieGoalReducer.age);
  const gender = useSelector((state) => state.calorieGoalReducer.gender);
  const goal = useSelector((state) => state.calorieGoalReducer.goal);
 

     
  // console.log(goal);
  // console.log(weight);
  // console.log(height);
   

  const handleSubmit = (event) => {
    event.preventDefault();
  
    dispatch(setActivityLevel(activity));
  
    // Directly calculate and dispatch the calories
    const { recommendedCalories } = calculateCalories();
    dispatch(setRequiredCalorie(recommendedCalories));
  
    navigate("/calorie-need");
  };
  
  const calculateCalories = () => {
    let bmrCurrent = 0;
  
    // Calculate BMR based on gender
    if (gender === "male") {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
   
    const maintenance = Math.round(bmrCurrent * parseFloat(activity));
  

    let recommendedCalories = maintenance;
    if (goal === "loose") {
      recommendedCalories = maintenance - 1100; 
    } else if (goal === "gain") {
      recommendedCalories = maintenance + 1100; 
    }else{
      recommendedCalories = maintenance;
    }
  
    return { recommendedCalories }; // Return calculated values
  };
  
    console.log(height)
    console.log(goal)
    console.log(activity)
    console.log(calories)
  return (
    <>
      <div className="calorie-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="activity">Select Activity</label>
            <select
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary (little to no exercise)</option>
              <option value="1.375">
                Lightly active (light exercise 1–3 days/week)
              </option>
              <option value="1.55">
                Moderately active (moderate exercise 3–5 days/week)
              </option>
              <option value="1.725">
                Very active (hard exercise 6–7 days/week)
              </option>
              <option value="1.9">
                Extra active (very hard exercise or a physical job)
              </option>
            </select>
          </div>

          <button type="submit" style={{ color: "white", fontSize: "17px" }}>
            Next
          </button>
        </form>
      </div>
    </>
  );
};

export default Exercise;
