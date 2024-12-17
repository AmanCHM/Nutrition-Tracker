import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPage from '../Component/Pages/LandingPage';
import AboutUs from '../Component/Pages/AboutUs';
import Signup from '../Component/Pages/SignUp';
import Login from '../Component/Pages/Login';
import Reset from '../Component/Pages/Reset';
import CalorieCalculator from '../Component/Pages/CalorieCalculator';
import Home from '../Component/Pages/Home';
import ImageSearch from '../Component/Pages/ImageSearch';
import Dashboard from '../Component/Pages/Dashboard';




const PrivateRoute = ({ children }) => {
  const islogged = useSelector((state) => state.logged);
  return islogged ? children : <Navigate to="/login" />;
};

const RoutesConfig = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/aboutus",
      element: <AboutUs />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/reset",
      element: <Reset />,
    },
    {
      path: "/calorie-calculator",
      element: <CalorieCalculator />,
    },
    {
      path: "/home",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      ),
    },
    {
      path: "/image-search",
      element: (
        <PrivateRoute>
          <ImageSearch />
        </PrivateRoute>
      ),
    },
  ]);

  return routes;
};

export default RoutesConfig;
