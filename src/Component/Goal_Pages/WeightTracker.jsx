import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateGoal } from "../../Redux/calorieGoalSlice";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";

function WeightTracker() {
  const [presentWeight, setPresentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
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
      Thanks fds! Now for your goals.
      </h3>
      <h3 style={{textAlign:"center",color:"#627373"}}>You have to select your goal. <br /> Provide your targets.</h3>
      <div className="calorie-container">
        {/* <h1>User Details</h1> */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="goal">Select Goal:</label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="">-- Select a Goal --</option>
              <option value="loose">Loose Weight</option>
              <option value="gain">Gain Weight</option>
              <option value="maintain">Maintain Weight</option>
            </select>
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

          <button type="submit" style={{ color: "white", fontSize: "17px",marginLeft:'130px'}}>
            Next
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default WeightTracker;
