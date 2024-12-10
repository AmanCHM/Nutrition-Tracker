import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { loggedout } from "../../Redux/counterSlice";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/");
  };
  return (
    <div>
      <nav className="navbar">
        <div id="company-name">Nutrition Tracker</div>

        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/food"}>Search-Food</NavLink>
        <NavLink to={"/image-search"}>ImageSearch</NavLink>
        <NavLink to={"/dashboard"}>Dashboard</NavLink>
        <NavLink to={"/aboutus"}>About</NavLink>

        <button type="submit" onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Navbar;
