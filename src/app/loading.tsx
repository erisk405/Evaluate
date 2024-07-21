import React from "react";
import "./globals.css"
const loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="loader">
        <div className="loader-text">Loading...</div>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
};

export default loading;
