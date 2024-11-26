import React from "react";
import {
 BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Component/Home";
const App = () => {
  return(
    <>

   <Router>
    <Routes>
    <Route  path="/" element={<Home/>}></Route>


    </Routes>
   </Router>

    </>
  );
};

export default App;
