import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { loggedin, loggedout } from "../../Redux/logSlice";
import { MdLogout } from "react-icons/md";
import { auth } from "../../firebase";
import { div } from "@tensorflow/tfjs";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const islogged = useSelector((state) => state.logged);

  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/");
  };
  const handleLogin = () => {
    dispatch(loggedin());
    navigate("/login");
  };

  // console.log("login details",islogged)

  // const user = auth.currentUser;

  // const userEmail = user?.email;

  return (
    <div>
      <nav className="navbar">
        <div id="company-name">Nutrition Tracker</div>

        {islogged === false ? (
          <div className="navbar">
            <NavLink to={"/"}>Feature</NavLink>

            <NavLink to={"/aboutus"}>About</NavLink>
          </div>
        ) : (
          ""
        )}

        {islogged ? (
          <div className="navbar">
            <NavLink to={"/home"}>Home</NavLink>
            <NavLink to={"/image-search"}>ImageSearch</NavLink>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
            <NavLink to={"/calorie-calculator"}>Calculator</NavLink>
            <NavLink to={"/aboutus"}>About</NavLink>
          </div>
        ) : (
          ""
        )}

        {/* <div style={{marginLeft:"9%"}}>   <p style={{color:"black"}}>{userEmail}</p> </div>  */}
        <div className="nav-button">
          {islogged == true ? (
            <button type="submit" onClick={handleLogout} >
              <MdLogout />
            </button>
          ) : (
            <button  id="login-button"  onClick={handleLogin} >Login</button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
