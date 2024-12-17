import React from "react";
import { useSelector } from "react-redux";
import "./Loader.css"; 

const Loader = () => {
  const loading = useSelector((state) => state.loading);

  if (!loading) return null;

  return <div className="loading"></div>;
};

export default Loader;
