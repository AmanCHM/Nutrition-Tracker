import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { resetGoal, updateGoal } from "../../Redux/calorieGoalSlice";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";
import GlobalSelect from "./../Page-Components/Globalselect";
import { toast } from "react-toastify";

function WeightTracker() {
  const currentweight = useSelector(
    (state) => state.calorieGoalReducer.currentWeight
  );
  const target = useSelector((state) => state.calorieGoalReducer.targetWeight);
  const goaloption = useSelector((state) => state.calorieGoalReducer.goal);
  const [presentWeight, setPresentWeight] = useState(currentweight);
  const [targetWeight, setTargetWeight] = useState(target);
  const [goal, setGoal] = useState(goaloption);

  const dispatch = useDispatch();
  const navigate = useNavigate();
//  const  reset = useSelector((state)=>state.calorieGoalReducer.resetGoal)
useEffect(()=>{
  if(goal=="Maintain Weight"){
   setTargetWeight(presentWeight)
  }
} ,[presentWeight])
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!goal) {
      toast.error("Please select a goal.");
      return;
    }
    if (!presentWeight || !targetWeight) {
      toast.error("Please enter both present and target weights.");
      return;
    }

    let weightdifference = targetWeight - presentWeight;

    console.log(weightdifference);
    console.log("weightDifference", weightdifference);
    if (goal === "Loose Weight" && weightdifference > 0) {
      toast.error("Target weight must less than current weight");
      return;
    } else if (goal === "Gain Weight" && weightdifference < 0) {
      toast.error("Target weight must greater than current weight");
      return;
    } else if (goal === "Maintain Weight" && !weightdifference == 0) {
      toast.error("Target weight must equal to current weight");
      return;
    }
    dispatch(
      updateGoal({
        goal,
        currentWeight: presentWeight,
        targetWeight,
        weightdifference,
      })
    );
 
    navigate("/input-workout");
  };

  const goalOptions = [
    { value: "Loose Weight", label: "Loose Weight" },
    { value: "Gain Weight", label: "Gain Weight" },
    { value: "Maintain Weight", label: "Maintain Weight" },
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
              min="1"
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
              min="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="Enter your target weight"
              required
            />
          </div>
          <div style={{ marginTop: "20px", marginLeft: "5%" }}>
            <button className="submit">
              <Link
                to={"/userinfo"}
                style={{ color: "white", fontSize: "17px" }}
              >
                Back
              </Link>{" "}
            </button>
            <button
              type="submit"
              style={{ color: "white", fontSize: "17px", marginLeft: "60%" }}
            >
              Next
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default WeightTracker;
