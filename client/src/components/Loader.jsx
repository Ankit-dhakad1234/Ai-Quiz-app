import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <p className="skeleton-text">{message}</p>
    </div>
  );
};

export default Loader;
