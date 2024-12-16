import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import LandingPage from "./Component/Pages/LandingPage";
import AboutUs from "./Component/Pages/AboutUs";
import ImageSearch from "./Component/Pages/ImageSearch";
import Dashboard from "./Component/Pages/Dashboard";
import Signup from "./Component/Pages/SignUp";
import Login from "./Component/Pages/Login";
import Reset from "./Component/Pages/Reset";
import Home from "./Component/Pages/Home";
import CalorieCalculator from "./Component/Pages/CalorieCalculator";

const App = () => {
  const islogged = useSelector((state) => state.logged);

  const PrivateRoute = ({ children }) => {
    return islogged ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        //public route
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/aboutus" element={<AboutUs />} />

        //private route
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/image-search"
          element={
            <PrivateRoute>
              <ImageSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/calorie-calculator"
          element={
            <PrivateRoute>
              <CalorieCalculator />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
