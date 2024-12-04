import React from "react";
import {
 BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Component/Home";
import SignUp from "./Component/Pages/SignUp";
import Login from "./Component/Pages/Login";
import Reset from "./Component/Pages/Reset";

import { useSelector } from "react-redux";
import Dashboard from "./Component/Dashboard";
const App = () => {
  const islogged = useSelector ((state)=>state.logged)
  const PrivateRoute = ()=>{
    return islogged==true?<Home/>:<Navigate to ="/"/>  
  }
  return(
    <>

   <Router>
    <Routes>
    <Route  path="/signup" element={<SignUp/>}></Route>
    <Route  path="/" element={<Login/>}></Route>
    <Route  path="/home" element={<PrivateRoute><Home/></PrivateRoute>}></Route>
    <Route  path="/reset" element={<Reset/>}></Route>
    <Route  path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
   </Router>

    </>
  );
};

export default App;
