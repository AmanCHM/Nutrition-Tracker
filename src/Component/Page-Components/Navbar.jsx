import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { loggedout } from "../../Redux/counterSlice";
import { MdLogout } from "react-icons/md";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/login");
  };
  return (
    <div>
      <nav className="navbar">
        <div id="company-name">Nutrition Tracker</div>

        <NavLink to={"/"}>Feature</NavLink>
        <NavLink to={"/home"}>Home</NavLink>
        <NavLink to={"/image-search"}>ImageSearch</NavLink>
        <NavLink to={"/dashboard"}>Dashboard</NavLink>
        <NavLink to={"/aboutus"}>About</NavLink>
             
        <button id="nav-button"    type="submit" onClick={handleLogout}> 
<MdLogout /></button>
      </nav>
    </div>
  );
};

export default Navbar;
