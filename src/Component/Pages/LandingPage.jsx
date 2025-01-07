import React, { useState } from "react";
import "./LandingPage.css";
import Footer from "../Page-Components/Footer";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Feature from "../LandingPage-Components/Feature";
import Overview from "../LandingPage-Components/Overview";
import AIFeature from "../LandingPage-Components/AIFeature";
import { useDispatch, useSelector } from "react-redux";
import Image from "../Image/Image";
import { resetGoal } from "../../Redux/calorieGoalSlice";


const LandingPage = () => {
  const islogged = useSelector((state) => state.loggedReducer.logged);

 const dispatch = useDispatch()
  const navigate = useNavigate();
 const handleClick = ()=>{
       
  dispatch(resetGoal());
  navigate('/userinfo')
 }

  return (
    <>
      <Navbar/> 
      <div className="landing-page">
        <section className="hero">
          <div className="content">
            <b style={{ color: "grey" }}>Welcome to Nutrition Tracker</b>
            <p>Track your meals and stay healthy!</p>
          </div>
        </section>

        <section className="signup">
          <div className="description">
            <h1 style={{ color: "grey" }}>
              {" "}
              Eat smarter, <br />
              Live better.
            </h1>

            <h4 style={{ color: "grey" }}>
              Track your calories, exercise,
              <br />
              biometrics and health data.
            </h4>
           {islogged? '' : <button id="button"
            onClick={handleClick}>
          
             Let's Start 
         
        </button>}
            
          </div>
          <div>
            <img
              id="front-image"
            
              src={
               Image.mobile
              }
              alt=""
            />
          </div>
        </section>
      </div>

      <Feature />
      <Overview />
      <AIFeature />
      <Footer />
    </>
  );
};

export default LandingPage;

