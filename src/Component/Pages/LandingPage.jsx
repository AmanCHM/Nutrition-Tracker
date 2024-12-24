import React, { useState } from "react";
import "./LandingPage.css";
import Footer from "../Page-Components/Footer";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
import Feature from "../LandingPage-Components/Feature";
import Overview from "../LandingPage-Components/Overview";
import AIFeature from "../LandingPage-Components/AIFeature";


const LandingPage = () => {
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

            <button id="button">
           
              <Link
                to={"/userinfo"}
                style={{ color: "white", fontSize: "17px"  }}
              >
                 Let's Start 
              </Link>{" "}
            </button>
          </div>
          <div>
            <img
              id="front-image"
            
              src={
                "https://raw.githubusercontent.com/harshu878/nutrimeter/b24e158e4f21902c1fe890e3fcec626ae022ebaf/client/public/Images/mobile.svg"
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
