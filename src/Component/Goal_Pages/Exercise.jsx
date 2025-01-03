import React, { useState } from "react";
import {
  openCalorieModal,
  setActivityLevel,
  setRequiredCalorie,
} from "../../Redux/calorieGoalSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import GlobalSelect from "./../Page-Components/Globalselect";
import { toast } from "react-toastify";

const Exercise = () => {
  const height = useSelector((state) => state.calorieGoalReducer.height);
  const weight = useSelector((state) => state.calorieGoalReducer.currentWeight);
  const age = useSelector((state) => state.calorieGoalReducer.age);
  const gender = useSelector((state) => state.calorieGoalReducer.gender);
  const goal = useSelector((state) => state.calorieGoalReducer.goal);
  const activities = useSelector((state) => state.calorieGoalReducer.activity);
 
  const [activity, setActivity] = useState(activities);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!activity) {
      toast.error("Please select Activity!");
      return;
    }
    dispatch(setActivityLevel(activity));
    dispatch(openCalorieModal());
    const { recommendedCalories } = calculateCalories();
    dispatch(setRequiredCalorie(recommendedCalories));
    navigate("/calorie-need");
  };

  const calculateCalories = () => {
    let bmrCurrent = 0;
    if (gender === "Male") {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    let activityValue = 0;
    if (activity === "Sedentary (little to no exercise)") {
      activityValue = 1.2;
    } else if (activity === "Lightly active (light exercise 1-3 days/week)") {
      activityValue = 1.375;
    } else if (
      activity === "Moderately active (moderate exercise 3-5 days/week)"
    ) {
      activityValue = 1.55;
    } else if (activity === "Very active (hard exercise 6-7 days/week)") {
      activityValue = 1.725;
    } else {
      activityValue = 1.9;
    }

    const maintenance = Math.round(bmrCurrent * parseFloat(activityValue));

    let recommendedCalories = maintenance;
    if (goal === "Loose Weight") {
      recommendedCalories = maintenance - 550;
    } else if (goal === "Gain Weight") {
      recommendedCalories = maintenance + 550;
    }

    return { recommendedCalories };
  };

  const activityOptions = [
    {
      value: "Sedentary (little to no exercise)",
      label: "Sedentary (little to no exercise)",
    },
    {
      value: "Lightly active (light exercise 1-3 days/week)",
      label: "Lightly active (light exercise 1-3 days/week)",
    },
    {
      value: "Moderately active (moderate exercise 3-5 days/week)",
      label: "Moderately active (moderate exercise 3-5 days/week)",
    },
    {
      value: "Very active (hard exercise 6-7 days/week)",
      label: "Very active (hard exercise 6-7 days/week)",
    },
    {
      value: "Extra active (very hard exercise or a physical job)",
      label: "Extra active (very hard exercise or a physical job)",
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ height: "430px" }}>
        <h3
          style={{
            fontSize: "2.3rem",
            color: "#737373",
            textAlign: "center",
            marginTop: "5%",
          }}
        >
          What is your baseline activity level?
        </h3>
        <h3 style={{ textAlign: "center", color: "#627373" }}>
          Not including workouts–we count that separately
        </h3>

        <div className="calorie-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="activity" style={{ fontSize: "1.2rem" }}>
                Select Activity
              </label>
              <GlobalSelect
                options={activityOptions}
                value={activityOptions.find(
                  (option) => option.value === activity
                )}
                onChange={(selectedOption) => setActivity(selectedOption.value)}
                placeholder="Select an Option"
              />
            </div>
            <div style={{ marginTop: "20px", marginLeft: "5%" }}>

              <button onClick={ ()=>  navigate("/input-weight")}  >
        
                
                  Back
              
              </button>

              <button
                type="submit"
                style={{ color: "white" , marginLeft: "60%" }}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Exercise;
