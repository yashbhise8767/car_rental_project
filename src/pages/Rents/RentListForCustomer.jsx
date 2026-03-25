import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import RentDetailsModal from "./RentDetailsModal";

const RentListForCustomer = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRent, setSelectedRent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { authData } = useAuth();

  const fetchRents = async () => {
    try {
      const response = await axiosInstance.get("/api/rents/customer");
      const rentsWithImages = await Promise.all(
        response.data.map(async (rent) => {
          try {
            const imageResponse = await axiosInstance.get(
              `/view/cars/${rent.carId}/image`,
              {
                responseType: "blob",
              }
            );
            return {
              ...rent,
              carImage: URL.createObjectURL(imageResponse.data),
            };
          } catch (imageError) {
            console.error(
              `Error fetching image for car ${rent.carId}:`,
              imageError
            );
            return {
              ...rent,
              carImage: "https://dummyimage.com/400x300/000/fff",
            };
          }
        })
      );
      setRents(rentsWithImages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rents:", err);
      setError("Failed to fetch rents. Please try again later.");
      setLoading(false);
    }
  };
  const getStyle = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return {
          backgroundColor: "#e9ecef",
          color: "#333",
          padding: "5px 10px",
          borderRadius: "4px",
        }; // Grey for Not Started
      case "ONGOING":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "5px 10px",
          borderRadius: "4px",
        }; // Green for Ongoing
      case "COMPLETED":
        return {
          backgroundColor: "#cce5ff",
          color: "#004085",
          padding: "5px 10px",
          borderRadius: "4px",
        }; // Blue for Completed
      default:
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "5px 10px",
          borderRadius: "4px",
        }; // Red for Unknown
    }
  };

  useEffect(() => {
    fetchRents();
  }, [authData]);

  const handleRentClick = (rent) => {
    setSelectedRent(rent);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching rental data: {error}</div>;

  return (
    <div className="container">
      <h2>Your Rental History</h2>
      {rents.length === 0 ? (
        <p>No rental records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rent ID</th>
              <th></th>
              <th>Car</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Total Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rents.map((rent) => (
              <tr key={rent.id}>
                <td>{rent.id}</td>
                <td>
                  <img
                    src={rent.carImage}
                    alt={`${rent.carBrand} ${rent.carModel}`}
                    className="img-fluid rounded"
                    style={{
                      width: "100px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>
                  {rent.carBrand} {rent.carModel}
                </td>
                <td>{moment(rent.startDate).format("YYYY-MM-DD")}</td>
                <td>{moment(rent.endDate).format("YYYY-MM-DD")}</td>
                <td style={getStyle(rent.rentStatus)}>{rent.rentStatus}</td>
                <td>${rent.totalPrice?.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRentClick(rent)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <RentDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        rent={selectedRent}
      />
      {/* Inline Styles */}
      <style>
        {`
          h2 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }
          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #007bff;
            color: white;
            font-weight: bold;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
          .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .btn-primary:hover {
            background-color: #0056b3;
          }
          p {
            text-align: center;
            color: #6c757d;
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default RentListForCustomer;
