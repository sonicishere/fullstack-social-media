import React from 'react';

const Loader = ({ fullPage }) => {
  return (
    <div className={`loader-container${fullPage ? ' loader-fullpage' : ''}`}>
      <div className="loader-spinner">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
    </div>
  );
};

export default Loader;
