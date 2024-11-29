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
const App = () => {

  const PrivateRoute = ()=>{
     let isAuthenticated = localStorage.getItem("isAuthenticated")
     console.log(isAuthenticated);
    return isAuthenticated=="true"? <Home/>:<Navigate to ="/"/>
    
  }
  return(
    <>

   <Router>
    <Routes>
    <Route  path="/signup" element={<SignUp/>}></Route>
    <Route  path="/" element={<Login/>}></Route>
    <Route  path="/home" element={<PrivateRoute><Home/></PrivateRoute>}></Route>
    <Route  path="/reset" element={<Reset/>}></Route>
    </Routes>
   </Router>

    </>
  );
};

export default App;
