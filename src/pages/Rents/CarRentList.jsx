import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
// import RentsForACarDetailsModal from "./CarRentDetailsModal"; // ✅ Import new modal
import CarRentDetailsModal from "./CarRentDetailsModal";
import { MdVerified } from "react-icons/md";

const CarRentList = () => {
  const { id } = useParams(); // Car ID from the URL
  const [rents, setRents] = useState([]);
  const [car, setCar] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const { authData } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRent, setSelectedRent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Car Details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosInstance.get(`/agency/cars/${id}`);
        setCar(response.data);

        const imageResponse = await axiosInstance.get(`/view/cars/${id}/image`, {
          responseType: "blob",
        });
        setCarImage(URL.createObjectURL(imageResponse.data));
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("Failed to fetch car details.");
      }
    };

    fetchCarDetails();
  }, [id]);

  // ✅ Fetch Rents
  useEffect(() => {
    const fetchRents = async () => {
      try {
        const rentsEndpoint =
          authData.role === "Agency" ? `/api/rents/${id}/rents` : `/api/rents/customer`;
        const response = await axiosInstance.get(rentsEndpoint);
        setRents(response.data);
      } catch (err) {
        console.error("Error fetching rents:", err);
        setError("Failed to fetch rents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRents();
  }, [id]);

  const handleRentClick = (rent) => {
    setSelectedRent(rent);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRent(null);
  };

  const handleStatusChange = async (rentId, newStatus) => {
    try {
      await axiosInstance.put(`/api/rents/${rentId}/status`, null, {
        params: { status: newStatus },
      });
      setRents((prevRents) =>
        prevRents.map((rent) =>
          rent.id === rentId ? { ...rent, rentStatus: newStatus } : rent
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Error updating rent status:", err);
      alert("Failed to update rent status. Please try again.");
    }
  };

  if (loading) return <p>Loading rents...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-4">
      <style>
        {`
          /* General Styles */
          h1 {
            font-weight: bold;
            color: #2c3e50; /* Dark blue heading */
            text-align: center;
            margin-bottom: 2rem;
          }

          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .car-image {
            display: block;
            margin: 0 auto;
            max-height: 300px;
            object-fit: cover;
            border-radius: 10px;
          }

          /* Table Styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
            color: #333;
          }

          th {
            background-color: #f8f9fa;
            color: #2c3e50;
            font-weight: bold;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          tr:hover {
            background-color: #f1f1f1;
          }
        `}
      </style>

      {/* ✅ Display Car Image */}
      <div className="text-center">
        <img
          src={carImage || "https://dummyimage.com/400x300/000/fff"}
          alt={`${car?.brand} ${car?.model}`}
          className="car-image"
        />
      </div>

      {/* ✅ Display Car Brand, Model, and ID in Title */}
      <h1>
        Rents Management for {car?.brand || "Car Brand"} {car?.model || "Car Model"} (ID: {id})
      </h1>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Car ID</th>
            <th>Customer Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rents.map((rent, index) => (
            <tr key={rent.id || `rent-${index}`}>
              <td>{rent.carId || "N/A"}</td>
              <td>{rent.customerName || "N/A"} {rent?.customerVerificationStatus == "VERIFIED" ? <MdVerified style={{color:'navy'}}/> : ''}</td>
              <td>{rent.startDate || "N/A"}</td>
              <td>{rent.endDate || "N/A"}</td>
              <td>{rent.rentStatus || "N/A"}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleRentClick(rent)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CarRentDetailsModal
        visible={showModal}
        onClose={handleCloseModal}
        rent={selectedRent}
        onOngoing={(rentId) => handleStatusChange(rentId, "ONGOING")}
        onComplete={(rentId) => handleStatusChange(rentId, "COMPLETED")}
      />

      <button className="btn btn-secondary mt-4" onClick={() => navigate(`/cars/${id}`)}>
        Back
      </button>
    </div>
  );
};

export default CarRentList;
