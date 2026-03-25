import React, { useState, useEffect } from "react";
import BookingCalendar from "../../components/BookingCalendar"; // Assume this component exists
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./CarOrderForm.css";

const CarOrderForm = ({ car, unavailableDates, onClose }) => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    includeDriver: false,
    pickUpLocation: "",
    dropOffLocation: "",
    customerPhoneNumber: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const { authData } = useAuth();
  const navigate = useNavigate();

  const driverFeePerDay = car.driverFeePerDay || 0; // Fee per day for a driver
  const rentalPricePerDay = car.pricePerDay || 0; // Car's daily rental price

  // Calculate the total price whenever inputs change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      if (days > 0) {
        setNumberOfDays(days);
        const driverCost = formData.includeDriver ? days * driverFeePerDay : 0;
        setTotalPrice(days * rentalPricePerDay + driverCost);
      } else {
        setNumberOfDays(0);
        setTotalPrice(0);
      }
    } else {
      setNumberOfDays(0);
      setTotalPrice(0);
    }
    console.log("Car Details:", car);
  }, [formData, driverFeePerDay, rentalPricePerDay]);

  const handleDateSelect = ({ startDate, endDate }) => {
    setFormData((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.pickUpLocation ||
      !formData.dropOffLocation
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const postData = {
      carId: car.id,
      customerId: authData.user.id, // Assuming this is provided
      startDate: new Date(formData.startDate).toISOString().split("T")[0],
      endDate: new Date(formData.endDate).toISOString().split("T")[0],
      includeDriver: formData.includeDriver,
      pickUpLocation: formData.pickUpLocation,
      dropOffLocation: formData.dropOffLocation,
      customerPhoneNumber: formData.customerPhoneNumber,
      totalPrice: totalPrice,
    };
    console.log("auth data user id is ", authData.user.id);
    console.log("Post Data:", postData);
    try {
      const response = await axiosInstance.post("/rent/orders", postData);
      console.log("Order submitted successfully:", response.data);
      alert("Order Submitted Successfully");
      onClose();
      navigate("/cars");
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="car-order-form">
      <h2>Car Rental Order Form</h2>
      <p>
        <strong>Car Name:</strong> {car.brand} {car.model}
      </p>
      <p>
        <strong>Car ID:</strong> {car.id}
      </p>
      <form onSubmit={handleSubmit}>
        {/* Booking Calendar */}
        <div className="form-group">
          <label>Select Rental Dates:</label>
          <BookingCalendar
            rentedDates={unavailableDates}
            onDateSelect={handleDateSelect}
          />
        </div>
        {/* Number of Days */}
        {numberOfDays > 0 && <p>Number of Days: {numberOfDays}</p>}
        {/* Include Driver */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="includeDriver"
              checked={formData.includeDriver}
              onChange={handleChange}
            />
            Include Driver (${driverFeePerDay}/day)
          </label>
        </div>
        {/* Pickup Location */}
        <div className="form-group">
          <label>Pick-Up Location:</label>
          <input
            type="text"
            name="pickUpLocation"
            value={formData.pickUpLocation}
            onChange={handleChange}
            required
          />
        </div>
        {/* Drop-Off Location */}
        <div className="form-group">
          <label>Drop-Off Location:</label>
          <input
            type="text"
            name="dropOffLocation"
            value={formData.dropOffLocation}
            onChange={handleChange}
            required
          />
        </div>
        {/* Customer phone number */}
        <div className="form-group">
          <label>Your Phone Number:</label>
          <input
            type="text"
            name="customerPhoneNumber"
            value={formData.customerPhoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        {/* Total Price */}
        <p>
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </p>
        {/* Submit Button */}
        <button type="submit" className="submit-order">
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default CarOrderForm;
