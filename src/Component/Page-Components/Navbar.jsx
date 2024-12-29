import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";
import Modal from "react-modal";
import { loggedin, loggedout } from "../../Redux/logSlice";
import { RiAccountCircleFill } from "react-icons/ri";
import LogoutModal from "../Modals/LogoutModal";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const islogged = useSelector((state) => state.loggedReducer.logged);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  useEffect(() => {
    if (islogged) {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email);
      } else {
        setEmail();
      }
    }
  }, [islogged]);

  const handleLogout = () => {
    dispatch(loggedout());
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };

  const classNameFunc = ({ isActive }) => (isActive ? "active_link" : "");

  return (
    <div>
      <nav className="navbar">
        <div id="company-name">Nutrition Tracker</div>

        {islogged ? (
          <div className="navbar-login">
            <NavLink to="/" className={classNameFunc}>Home</NavLink>
            <NavLink to="/home" className={classNameFunc}>Dashboard</NavLink>
            <NavLink to="/dashboard" className={classNameFunc}>Reports</NavLink>
            <NavLink to="/calorie-calculator" className={classNameFunc}>Calculator</NavLink>
            <NavLink to="/aboutus" className={classNameFunc}>About</NavLink>
          </div>
        ) : (
          <div className="navbar-login">
            <NavLink to='/' className={classNameFunc}>Home</NavLink>
            <NavLink to="/aboutus" className={classNameFunc}>About</NavLink>
            <NavLink  to='/contactUs'  className={classNameFunc}>ContactUs</NavLink>
          </div>
        )}

        <div className="nav-button">
          {islogged ? (
        <div  style={{display:"flex", gap:"10px"}}>{email !== undefined ? email : ''}
            <RiAccountCircleFill size={40} onClick={handleModal} /></div>
          ) : (
            <span
              className="login-span"
              onClick={handleLogin}
              style={{ fontSize: "1.1rem" }}
            >
              Login
            </span>
          )}
        </div>

        <Modal isOpen={isModalOpen} style={customStyles}>
          <LogoutModal
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              handleLogout();
              setIsModalOpen(false);
              toast.success("Logged out successfully");
            }}
          />
        </Modal>
      </nav>
    </div>
  );
};

export default Navbar;
