import React from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css'
const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Nutrition Tracker</div>
     
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/food"}>Search-Food</NavLink>
        <NavLink to={"/image-search"}>ImageSearch</NavLink>
        <NavLink to={"/dashboard"}>Dashboard</NavLink>
        <NavLink to={"/aboutus"}>About</NavLink>

      </nav>
    </div>
  );
};

export default Navbar;
