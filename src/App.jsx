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
import Home from './Component/Pages/Home';



const App = () => {
  const islogged = useSelector ((state)=>state.logged)
  const PrivateRoute = ()=>{
    return islogged==true?<Home/>:<Navigate to ="/"/>  
  }


  return(
    <>

   <Router>
    <Routes>

    {/* public routes */}
    <Route  path="/signup" element={<Signup/>}></Route>   
    <Route path="/" element={<LandingPage/>}></Route> 
    <Route  path="/login" element={<Login/>}></Route>
    <Route  path="/reset" element={<Reset/>}></Route>

   {/* private Routes */}
    <Route  path="/image-search" element={<ImageSearch/>}></Route>
    <Route path="/aboutus" element={<AboutUs/>}> </Route> 
    <Route  path="/home" element={<PrivateRoute><Home/></PrivateRoute>}></Route>
    <Route  path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
   </Router>

    </>
  );
};

export default App;
