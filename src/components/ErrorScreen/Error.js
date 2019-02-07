import React from "react";
import "./Error.css";

const Error = props => {
  const reload = evt => {
    evt.preventDefault();
    window.location.reload();
  };
  return (
    <div className={`Error`}>
      <h1>Something went wrong</h1>
      <button onClick={reload}>Try again</button>
    </div>
  );
};

export default Error;
