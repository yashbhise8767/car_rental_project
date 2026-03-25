import React, { useState } from "react";
import "./Services.css";
import { FaCar, FaTools, FaHandshake } from "react-icons/fa";
import Faq from "./Faq";
import StatisticsBanner from "./StatisticsBanner";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [faqOpen, setFaqOpen] = useState(false);

  const Navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Car Rentals",
      description: "Affordable and reliable cars for your journey.",
      details:
        "We offer a wide range of vehicles to suit your travel needs, from compact cars to spacious SUVs.",
      icon: <FaCar className="service-icon" />,
    },
    {
      id: 2,
      title: "Car Maintenance",
      description: "Professional maintenance for a smooth ride.",
      details:
        "Our maintenance services ensure your car is always in top condition, including oil changes, tire checks, and more.",
      icon: <FaTools className="service-icon" />,
    },
    {
      id: 3,
      title: "Partnerships",
      description: "Collaborate with us for mutual growth.",
      details:
        "Join our partnership program to grow your business and gain access to exclusive benefits.",
      icon: <FaHandshake className="service-icon" />,
    },
  ];

  const handleLearnMore = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const toggleFaq = () => {
    setFaqOpen(!faqOpen);
  };

  return (
    <>
      <div className="servicebg">
        {/* <img src="./serviceImg/servicebg.jpg" alt="servicebg" /> */}
      </div>
      <div className="services">
        <div className="services-hero">
          <h1>Our Services</h1>
          <p>
            Explore our wide range of offerings and find what fits your needs.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button
                className="learn-more"
                onClick={() => handleLearnMore(service)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
        {selectedService && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedService.title}</h3>
              <p>{selectedService.details}</p>
              <button className="close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
        <StatisticsBanner />
        <Faq />
        <div className="services-cta">
          <p>Need more information?</p>
          <div className="cta-options">
            <button className="contact-button" onClick={()=> Navigate('/contactUs')}>Contact Us</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
