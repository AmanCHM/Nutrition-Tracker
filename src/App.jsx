
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./Routes/Routes";
import Loader from "./Component/Page-Components/Loader";


const App = () => {
  return (
    <Router>
       <Loader/>
    <RoutesConfig />
  </Router>
  )
}

export default App


