import React, { useState, useRef } from "react";
import "./About-us.css";

const AboutUs = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    { name: "Phyoe Thet Htun", role: "Back-end" },
    { name: "Zaw Htet Aung", role: "Front-end" },
    { name: "Myat Thura Soe", role: "Full stack" },
  ];

  // Refs for team members' positions
  const teamMemberRefs = teamMembers.map(() => useRef(null));

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Learn more about our mission, values, and team!</p>
      </div>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Car Rentals, our mission is to provide affordable, reliable, and
            high-quality car rental services to individuals and businesses
            around the world. We aim to make your travel experience seamless
            with easy online booking and a wide selection of vehicles.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>Customer Satisfaction: We put our customers first.</li>
            <li>Integrity: We believe in honesty and transparency.</li>
            <li>
              Innovation: We embrace new ideas and technology to improve
              services.
            </li>
            <li>Sustainability: We are committed to eco-friendly practices.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Meet Our Team</h2>
          <div className="image-overlay">
            {/* Image */}
            <img
              src="/about-us/selfie.webp"
              alt="Team Photo"
              className="team-img"
            />
            {/* Overlay divs for hoverable regions */}
            <div
              className={`overlay overlay-1 ${
                hoveredMember === 0 ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredMember(0)}
              onMouseLeave={() => setHoveredMember(null)}
            ></div>
            <div
              className={`overlay overlay-2 ${
                hoveredMember === 1 ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredMember(1)}
              onMouseLeave={() => setHoveredMember(null)}
            ></div>
            <div
              className={`overlay overlay-3 ${
                hoveredMember === 2 ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredMember(2)}
              onMouseLeave={() => setHoveredMember(null)}
            ></div>
          </div>

          {/* Team member names and roles */}
          <div className="team">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                ref={teamMemberRefs[index]}
                className={`team-member ${
                  hoveredMember === index ? "hovered" : ""
                }`}
              >
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>

          {/* SVG for drawing arrows */}
          <svg
            className="arrow-svg"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {hoveredMember !== null && (
              <path
                d={`M${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                } 
                   C${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                } 
                   ${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                }
                   ${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                }
                   L${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                }
                   C${teamMemberRefs[hoveredMember].current.offsetLeft + 50},${
                  teamMemberRefs[hoveredMember].current.offsetTop + 50
                }
                   50,${teamMemberRefs[hoveredMember].current.offsetTop + 50}
                   50,${teamMemberRefs[hoveredMember].current.offsetTop + 50}`}
                stroke="red"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
              />
            )}
          </svg>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
