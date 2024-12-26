import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Footer from "../Page-Components/Footer";

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
    goalDescription = "to lose  0.5 kg weight/week ";
  } else if (goal === "gain") {
    recommendedCalories = calories;
    goalDescription = "to gain 0.5 kg weight/week";
  } else {
    recommendedCalories = calories;
    goalDescription = "to maintain weight";
  }

  return (

    <>
 
 <Navbar/>

 <h3  style={{fontSize:"2.3rem", color:"#737373",textAlign:"center", marginTop:"5%"}} >What is your weekly goal? </h3>
    <h3 style={{textAlign:"center",color:"#627373"}}>Let's break down your overall health goal into a weekly one you can maintain. <br />  Slow-and-steady is best!</h3>
  

    <div className="calorie-container" style={{height:"300px"}}>
      <h2>Calorie Requirements</h2  >
      <div className="calorie-data">
        <ul>
          <li><strong>Your Goal:</strong> {goalDescription.charAt(0).toUpperCase() + goalDescription.slice(1)}</li>
          <li> 
        <strong>Recommended Calories:</strong> {recommendedCalories} kcal/day</li>
        

        </ul>
      </div>
   
      <button type="submit" style={{ color: "white", fontSize: "17px", marginTop:"20px" }} onClick={()=>navigate("../signup")}>
          Create Your Account
        </button>
    </div>

    <Footer/>
    </>
  );
};

export default ShowCalorie;
