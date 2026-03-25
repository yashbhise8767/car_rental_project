import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import "./AdminFeedback.css";

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10; // Each page contains 10 feedbacks

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const fetchFeedback = async (page) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/feedback/page/${page}`);
      setFeedbackList(response.data);
    } catch (error) {
      setError("Failed to fetch feedback. Please try again.");
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="admin-feedback">
      <h2>User Feedback</h2>

      {loading && <p>Loading feedback...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="feedback-list">
        {feedbackList.length > 0
          ? feedbackList.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <h4>{feedback.name}</h4>
                <p>
                  <strong>Email:</strong> {feedback.email}
                </p>
                <p>{feedback.message}</p>
                <p className="timestamp">
                  <strong>Received at:</strong>{" "}
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          : !loading && <p>No feedback available.</p>}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={feedbackList.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminFeedback;
