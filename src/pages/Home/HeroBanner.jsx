import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = () => {
  const navigate = useNavigate();

  const handleExploreFleet = () => {
    navigate("/cars");
  };

  const carLogos = [
    "./popular-brands-image/toyota.png",
    "./popular-brands-image/honda.png",
    "./popular-brands-image/byd.png",
    "./popular-brands-image/chevrolet.png",
    "./popular-brands-image/mercedes.png",
    "./popular-brands-image/lexus.png",
    "./popular-brands-image/mazda.png",
  ];

  return (
    <>
      {/* Hero Banner Section */}
      <div
        className="hero-banner"
        style={{ backgroundImage: `url('./porsche.jpg')` }}
      >
        <div className="overlay-text">
          <h1>Drive the Future</h1>
          <p>
            Rent luxury cars at unbeatable prices. Experience comfort,
            performance, and style.
          </p>
          <div className="cta-buttons">
            <button className="secondary-btn" onClick={handleExploreFleet}>
              Explore Fleet
            </button>
          </div>
        </div>
      </div>

      {/* Popular Brands Section */}
      <div className="pupular-brands">
        <h2>Popular Brands</h2>
        <div className="car-logos">
          {carLogos.map((logo, index) => (
            <div key={index} className="car-logo-container">
              <img
                src={logo}
                alt={`Car logo ${index + 1}`}
                className="car-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
