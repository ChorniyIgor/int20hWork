import React from "react";
import "./Preloader.css";

const Preloader = props => {
  return (
    <div className={"Preloader"}>
      <div className={`PreloaderImg`} />
      <p className={`LoadingPercentages`} />
    </div>
  );
};

export default Preloader;
