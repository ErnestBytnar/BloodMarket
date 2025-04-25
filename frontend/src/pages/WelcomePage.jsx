import React from 'react';
import BloodDrips from './BloodDrips';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      <BloodDrips />
      <div className="welcome-content">
        <h1>Witaj w BloodMarket</h1>
        {/* Reszta zawartości strony */}
      </div>
    </div>
  );
};

export default WelcomePage;