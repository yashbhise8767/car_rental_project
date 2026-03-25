// Rate Car component will get userid form auth, get Car ID from params and then the user will give raings
// send Car id and rating to the server /agency/cars/{carId}/rate

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { FaStar } from "react-icons/fa";

const RateCar = () => {
  const [rating, setRating] = useState(5);
  const { id } = useParams();
  const [error, setError] = useState(null);

  const StarRating = ({ rating, setRating }) => {
    return (
      <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={index}
              size={24}
              color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
              onClick={() => setRating(starValue)}
            />
          );
        })}
      </div>
    );
  };

  const handleRatingSubmit = async () => {
    try {
      await axiosInstance.post(`/ratings/cars/${id}/rate`, null, {
        params: { rating },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Rating submitted successfully!");
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You can only rate cars you have rented.");
      } else {
        setError("Failed to submit rating. Try again.");
      }
    }
  };

  return (
    <div>
      <p>Rate This Car:</p>
      <StarRating rating={rating} setRating={setRating} />
      <button onClick={handleRatingSubmit}>Submit Rating</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RateCar;
