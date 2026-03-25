import React from "react";
import "./OurServices.css";
import { FaSearch, FaCalendarAlt, FaCar } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const OurServices = () => {
  return (
    <div className="our-services">
      <h2>Steps to Rent</h2>
      <div className="service-steps">
        <div className="step">
          <span className="step-bg"></span>
          <div className="step-number">1</div>
          <FaSearch className="step-icon" />
          <div className="step-content">
            <h3>Choose Location</h3>
            <p>Find your nearest pick-up and drop-off points.</p>
          </div>
        </div>
        <MdArrowForward className="step-arrow" />

        <div className="step">
          <span className="step-bg"></span>
          <div className="step-number">2</div>
          <FaCalendarAlt className="step-icon" />
          <div className="step-content">
            <h3>Pick Your Date</h3>
            <p>Select the dates that suit your schedule.</p>
          </div>
        </div>
        <MdArrowForward className="step-arrow" />

        <div className="step">
          <span className="step-bg"></span>
          <div className="step-number">3</div>
          <FaCar className="step-icon" />
          <div className="step-content">
            <h3>Find the Car and Book</h3>
            <p>Choose the car you love and book easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
