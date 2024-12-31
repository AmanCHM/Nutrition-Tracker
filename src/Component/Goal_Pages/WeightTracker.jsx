import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateGoal } from "../../Redux/calorieGoalSlice";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";

import GlobalSelect from './../Page-Components/Globalselect';

function WeightTracker() {

  const currentweight = useSelector((state) => state.calorieGoalReducer.currentWeight);
  const target =useSelector((state) => state.calorieGoalReducer.targetWeight);
  const [presentWeight, setPresentWeight] = useState(currentweight);
  const [targetWeight, setTargetWeight] = useState(target);
  const [goal, setGoal] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!goal) {
      alert("Please select a goal.");
      return;
    }
    if (!presentWeight || !targetWeight) {
      alert("Please enter both present and target weights.");
      return;
    }
    dispatch(updateGoal({ goal, currentWeight: presentWeight, targetWeight }));
    navigate("/input-workout");
  };

  const goalOptions = [
    { value: "loose", label: "Loose Weight" },
    { value: "gain", label: "Gain Weight" },
    { value: "maintain", label: "Maintain Weight" },
  ];

  return (
    <>
      <Navbar />

      <h3
        style={{
          fontSize: "2.3rem",
          color: "#737373",
          textAlign: "center",
          marginTop: "3%",
        }}
      >
        Thanks! Now for your goals.
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        Select your goal and provide your target weights.
      </h3>
      <div className="calorie-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="goal">Select Goal:</label>
            <GlobalSelect
              options={goalOptions}
              value={goalOptions.find((option) => option.value === goal)}
              onChange={(selectedOption) => setGoal(selectedOption.value)}
              // placeholder="-- Select a Goal --"
            />
          </div>

          <div className="input-group">
            <label htmlFor="CurrentWeight">Current Weight (kg)</label>
            <input
              type="number"
              id="CurrentWeight"
              min="0"
              value={presentWeight}
              onChange={(e) => setPresentWeight(e.target.value)}
              placeholder="Enter your current weight"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="targetWeight">Target Weight (kg)</label>
            <input
              type="number"
              id="targetWeight"
              min="0"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="Enter your target weight"
              required
            />
          </div>


            <button className="submit">
            
            <Link
              to={"/userinfo"}
              style={{ color: "white", fontSize: "17px"  }}
            >
              Back
            </Link>{" "}
          </button>


          <button
            type="submit"
            style={{ color: "white", fontSize: "17px",  marginLeft:"40%" }}
          >
            Next
          </button>

        </form>
      </div>
      <Footer />
    </>
  );
}

export default WeightTracker;
