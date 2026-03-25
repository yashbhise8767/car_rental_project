import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";

const AgencyPage = () => {
  const { id: agencyID } = useParams();
  const { authData } = useAuth();
  const [details, setDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carList, setCarList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    if (!agencyID) {
      setError("Invalid agency ID.");
      setLoading(false);
      return;
    }

    const loadAgencyData = async () => {
      try {
        // Fetch Agency Details
        const agencyResponse = await axiosInstance.get(`/view/agencies/${agencyID}`);
        setDetails(agencyResponse.data);

        // Fetch Agency Image
        if (agencyResponse.data) {
          const imageResponse = await axiosInstance.get(`/view/agencies/${agencyID}/image`, {
            responseType: "blob",
          });
          setProfileImage(URL.createObjectURL(imageResponse.data));
        }

        // Fetch Cars Owned by Agency
        const carResponse = await axiosInstance.get(`/view/agencies/${agencyID}/cars`);
        setCarList(carResponse.data);
        console.log(carList);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load agency data.");
      } finally {
        setLoading(false);
      }
    };

    loadAgencyData();
  }, [agencyID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h1>{details.username || "N/A"}</h1>

      {/* Agency Profile Image */}
      <div className="profile-img-container">
        {profileImage ? (
          <img src={profileImage} alt="Agency Profile" className="profile-img" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      {/* Agency Details */}
      {details && (
        <div>
          <div><strong>Email:</strong> {details.email || "N/A"}</div>
          <div><strong>Phone:</strong> {details.phoneNumber || "N/A"}</div>
          <div><strong>City:</strong> {details.city || "N/A"}</div>
          <div><strong>Address:</strong> {details.address || "N/A"}</div>
          <div><strong>Verification Status:</strong> {details.verificationStatus || "Not Verified"}</div>
        </div>
      )}

      {/* Agency Cars Section */}
      <h3>Cars Owned by Agency</h3>
      {carList.length > 0 ? (
        <div className="car-list">
          {carList.map((car) => (
            <div key={car.id} className="car-card" onClick={()=>Navigate(`/cars/${car.id}`)}>
                <img
                src={`data:${car.imageType};base64,${car.imageData}`}
                alt={car.model}
                className="car-image"
                onError={(e) => (e.target.src = "https://dummyimage.com/400x300/ccc/000&text=No+Image")}
                />
                <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Price Per Day:</strong> ${car.pricePerDay}</p>
                </div>
            </div>
            ))}

        </div>
      ) : (
        <p>No cars available.</p>
      )}

        <style>
        {`
            .container {
            margin: auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .profile-img-container {
            text-align: center;
            margin-bottom: 20px;
            }

            .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #007bff;
            }

            .no-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ccc;
            color: #555;
            }

            /* Car List - Flex Layout */
            .car-list {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
            justify-content: center; /* Centers cars when fewer than max per row */
            }

            .car-card {
            flex: 1 1 calc(33.333% - 20px); /* 3 cards per row on large screens */
            max-width: 300px; /* Prevents stretching */
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            background-color: #fff;
            text-align: left;
            transition: transform 0.3s ease-in-out;
            }

            .car-card:hover {
            transform: scale(1.04);
            }

            .car-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 4px;
            }

            .car-info {
            margin-top: 10px;
            }

            .btn {
            display: inline-block;
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            background-color: #007bff;
            color: white;
            text-align: center;
            }

            .btn:hover {
            background-color: #0056b3;
            }

            /* Responsive Design */
            @media (max-width: 900px) {
            .car-card {
                flex: 1 1 calc(50% - 20px); /* 2 cards per row */
            }
            }

            @media (max-width: 600px) {
            .car-card {
                flex: 1 1 100%; /* 1 card per row */
            }
            }
        `}
        </style>

    </div>
  );
};

export default AgencyPage;
