import React from "react";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <section className="content-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to our MZP Car Rental Service. By booking and using our rental
          vehicles, you agree to abide by these terms and conditions. Please
          read them carefully before proceeding with any rental.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          To rent a vehicle, you must be at least 21 years of age and hold a
          valid driver's license. Additional documents such as a passport or
          proof of address may be required.
        </p>

        <h2>3. Vehicle Usage</h2>
        <p>
          The vehicle is for personal use only and cannot be used for commercial
          purposes, including for ridesharing or delivery services. Any
          violation of this condition may lead to additional fees or termination
          of the rental agreement.
        </p>

        <h2>4. Rental Period</h2>
        <p>
          Rental periods are calculated based on a 24-hour cycle. If the vehicle
          is returned after the agreed rental period, additional charges may
          apply.
        </p>

        <h2>5. Insurance</h2>
        <p>
          All vehicles come with basic insurance coverage, but you may opt for
          additional coverage during the booking process. Please ensure you
          understand the details of your insurance coverage.
        </p>

        <h2>6. Fuel Policy</h2>
        <p>
          The vehicle must be returned with the same amount of fuel as when it
          was rented. A refueling charge will be applied if the fuel level is
          lower upon return.
        </p>

        <h2>7. Maintenance and Repairs</h2>
        <p>
          Any issues or damages to the vehicle should be reported immediately.
          Renters are responsible for any damages incurred during the rental
          period, except in cases of mechanical failure not caused by the
          renter.
        </p>

        <h2>8. Termination of Rental</h2>
        <p>
          We reserve the right to terminate the rental agreement at any time if
          the vehicle is used for illegal activities, damaged, or if the renter
          violates any terms in this agreement.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Our liability is limited to the rental charges paid by the renter. We
          are not responsible for any indirect, incidental, or consequential
          damages during the rental period.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These terms and conditions are governed by the laws of the country or
          state where the car rental service is provided.
        </p>

        <p>
          By proceeding with your car rental booking, you acknowledge that you
          have read and agree to these terms and conditions.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
