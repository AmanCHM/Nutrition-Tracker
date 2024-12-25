import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Modal from "react-modal";
import { loggedin, loggedout } from "../../Redux/logSlice";
import { MdLogout } from "react-icons/md";
import { auth } from "../../firebase";
import { RiAccountCircleFill } from "react-icons/ri";
import { CgLogIn } from "react-icons/cg";

import LogoutModal from "../Modals/LogoutModal";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const islogged = useSelector((state) => state.loggedReducer.logged);
  const [isModalOpen,setIsModalOpen]=useState(false);

  const [email,setEmail]= useState();
  const handleLogout = () => {


    dispatch(loggedout());
    navigate("/");
  };
  const handleLogin = () => {
    // dispatch(loggedin());
    navigate("/login");
  };

  const handleModal= ()=>{
    setIsModalOpen(true)
  }

  // if(islogged){
  //   const user = auth.currentUser;
  //   if(user){
  //     setEmail(user.email)
  //   }{
  //    setEmail()
  //   }
  // }
  
  // console.log("login details",islogged)

  return (
    <div>
      <nav className="navbar">
        <div id="company-name">Nutrition Tracker</div>

        {islogged === false ? (
          <div className="navbar">
            <NavLink to={"/"}>Home</NavLink>

            <NavLink to={"/aboutus"}>About</NavLink>
          </div>
        ) : (
          ""
        )}

        {islogged ? (
          <div className="navbar">
              <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/home"}>Dashboard</NavLink>
            {/* <NavLink to={"/image-search"}>ImageSearch</NavLink> */}
            <NavLink to={"/dashboard"}>Reports</NavLink>
            <NavLink to={"/calorie-calculator"}>Calculator</NavLink>
            <NavLink to={"/aboutus"}>About</NavLink>
          </div>
        ) : (
          ""
        )}

      
        <div className="nav-button">
          {islogged ? (
             <RiAccountCircleFill size={40} onClick={handleModal}/>
           
          ) : (
             <CgLogIn  size={35}  onClick={handleLogin} />
          )}
        </div>

        <Modal isOpen={isModalOpen}  >
              <LogoutModal
              onClose={() => setIsModalOpen(false)}
              onConfirm={() => {
                handleLogout();
                setIsModalOpen(false);
              }}
            />
            </Modal>
      </nav>
    </div>
  );
};

export default Navbar;
