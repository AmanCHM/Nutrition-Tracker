import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./Routes/Routes";
import Loader from "./Component/Page-Components/Loader";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover  
        theme="light"
      />
      <Router>
        <Loader />
        <RoutesConfig />
      </Router>
    </>
  );
};

export default App;
