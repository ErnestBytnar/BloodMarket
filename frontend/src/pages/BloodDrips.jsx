import React from 'react';
import './BloodDrips.css'; // Stwórz ten plik

const BloodDrips = () => {
  return (
    <div className="blood-drips-container">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="blood-drip"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${10 + Math.random() * 30}px`,
            width: `${10 + Math.random() * 30}px`,
            animationDelay: `-${Math.random() * 5}s`,
            backgroundColor: `rgba(200, 0, 0, ${0.5 + Math.random() * 0.5})`
          }}
        />
      ))}

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="svg-filter">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default BloodDrips;