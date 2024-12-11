import React, { useState } from "react";
import "./LandingPage.css";

import Footer from "../Page-Components/Footer";
import { NavLink } from "react-router-dom";
import Navbar from "../Page-Components/Navbar";
const LandingPage = () => {
  return (
    <>
      <Navbar className="navbar" />

      <div className="landing-page" >
        <section className="hero">
          <div className="content">
            <b>Welcome to Nutrition Tracker</b>
            <p>Track your meals and stay healthy!</p>
          </div>
        </section>

        <section className="signup">
          <div className="description">
            <h1>
              {" "}
              Eat smarter, <br />
              Live better.
            </h1>

            <h4>
              Track your calories, exercise,
              <br />
              biometrics and health data.
            </h4>

            <button id="button">
              {" "}
              <NavLink to={"/signup"}>SignUp</NavLink>{" "}
            </button>
          </div>
          <div>
            <img
              src={
                "https://raw.githubusercontent.com/harshu878/nutrimeter/b24e158e4f21902c1fe890e3fcec626ae022ebaf/client/public/Images/mobile.svg"
              }
              alt=""
            />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;
