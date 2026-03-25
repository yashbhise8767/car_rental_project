import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import AgencyRentListDetailsModal from "./AllCarsRentDetailsModal";
import moment from "moment";
import AllCarsRentDetailsModal from "./AllCarsRentDetailsModal";
import { MdVerified } from "react-icons/md";

const AllCarsRentList = () => {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRent, setSelectedRent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { authData } = useAuth();

  // ✅ Fetch all active rents for the agency's cars
  const fetchRents = async () => {
    try {
      const response = await axiosInstance.get("/api/rents/agency");
      const rentsWithImages = await Promise.all(
        response.data.map(async (rent) => {
          try {
            const imageResponse = await axiosInstance.get(`/view/cars/${rent.carId}/image`, {
              responseType: "blob",
            });
            return { ...rent, carImage: URL.createObjectURL(imageResponse.data) };
          } catch (imageError) {
            console.error(`Error fetching image for car ${rent.carId}:`, imageError);
            return { ...rent, carImage: "https://dummyimage.com/400x300/000/fff" }; // Placeholder if image fails
          }
        })
      );

      setRents(rentsWithImages);
      setLoading(false);
      console.log(rents);
    } catch (err) {
      console.error("Error fetching rents:", err);
      setError("Failed to fetch rents. Please try again later.");
      setLoading(false);
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

  const handleMarkOngoing = async (rentId) => {
    try {
      await axiosInstance.put(`/api/rents/${rentId}/status?status=ONGOING`);
      fetchRents();
      handleCloseModal();
    } catch (err) {
      console.error("Error marking rent as ongoing:", err);
    }
  };

  const handleMarkCompleted = async (rentId) => {
    try {
      await axiosInstance.put(`/api/rents/${rentId}/status?status=COMPLETED`);
      fetchRents();
      handleCloseModal();
    } catch (err) {
      console.error("Error marking rent as completed:", err);
    }
  };

  const getStyle = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return { backgroundColor: "#e9ecef", color: "#333", padding: "5px 10px", borderRadius: "4px" }; // Grey for Not Started
      case "ONGOING":
        return { backgroundColor: "#d4edda", color: "#155724", padding: "5px 10px", borderRadius: "4px" }; // Green for Ongoing
      case "COMPLETED":
        return { backgroundColor: "#cce5ff", color: "#004085", padding: "5px 10px", borderRadius: "4px" }; // Blue for Completed
      default:
        return { backgroundColor: "#f8d7da", color: "#721c24", padding: "5px 10px", borderRadius: "4px" }; // Red for Unknown
    }
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching rental data: {error?.message || "Unknown error"}</div>;

  return (
    <div className="container">
      <h2>Rents for Your Cars</h2>

      {/* ✅ Show car image above table
      {selectedRent && (
        <div className="text-center mb-3">
          <img
            src={selectedRent.carImage || "https://dummyimage.com/400x300/000/fff"}
            alt={`${selectedRent.carBrand} ${selectedRent.carModel}`}
            className="car-image"
          />
        </div>
      )} */}

      {rents.length === 0 ? (
        <p>No active rents found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rent ID</th>
              <th></th>
              <th>Car</th>
              <th>Customer Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
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
                    style={{ width: "100px", height: "60px", objectFit: "cover" }}
                  />
                </td>
                <td>{rent.carBrand} {rent.carModel}</td>
                <td>{rent.customerName || "N/A"} {rent?.customerVerificationStatus == "VERIFIED" ? <MdVerified style={{color:'navy'}}/> : ''}</td>
                <td>{moment(rent.startDate).format("YYYY-MM-DD")}</td>
                <td>{moment(rent.endDate).format("YYYY-MM-DD")}</td>
                <td style={getStyle(rent.rentStatus)}>{rent.rentStatus}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleRentClick(rent)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AllCarsRentDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        rent={selectedRent}
        onMarkOngoing={handleMarkOngoing}
        onMarkCompleted={handleMarkCompleted}
      />

      <style>
        {`
          .container {
            min-height: 80vh;
            padding: 20px;
          }
          h2 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }

          .car-image {
            display: block;
            margin: auto;
            max-height: 300px;
            object-fit: cover;
            border-radius: 10px;
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
            background-color:rgb(0, 0, 0);
            color: white;
            font-weight: bold;
          }

          tr:hover {
            background-color: #f1f1f1;
          }

          .btn-primary {
            background-color: navy;
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

export default AllCarsRentList;
