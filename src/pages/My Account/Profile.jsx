import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCar,
  FaIdCard,
} from "react-icons/fa";
import "./Profile.css";
import { MdCarRental } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Profile = () => {
  const { authData } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authData?.role || !authData?.user?.id) {
      setError("User information is missing.");
      setLoading(false);
      return;
    }

    const rolePath = authData.role.toLowerCase();
    console.log(`Fetching profile from: /${rolePath}/${authData.user.id}`);

    const loadProfile = async () => {
      try {
        // Fetch profile details including base64 image data
        const response = await axiosInstance.get(
          `/${rolePath}/${authData.user.id}`
        );
        setDetails(response.data);
        console.log("Profile Data:", response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert-danger">{error}</div>;

  const profileDetails = details && (
    <div className="profile-details">
      <div>
        <FaEnvelope /> <strong>Email:</strong>{" "}
        <span>{authData?.user?.email || "N/A"}</span>
      </div>
      <div>
        <FaUser /> <strong>Username:</strong>{" "}
        <span>{details.username || "N/A"}</span>
      </div>
      <div>
        <FaPhoneAlt /> <strong>Phone:</strong>{" "}
        <span>{details.phoneNumber || "N/A"}</span>
      </div>
      <div>
        <FaMapMarkerAlt /> <strong>City:</strong>{" "}
        <span>{details.city || "N/A"}</span>
      </div>
      {authData.role === "Agency" && (
        <>
          <div>
            <FaMapMarkerAlt /> <strong>Address:</strong>{" "}
            {details.address || "N/A"}
          </div>
          <div>
            <FaCar />
            <strong>
              <Link to="/agency/cars" className="cars-managed">
                Cars Managed:
              </Link>
            </strong>
            {details.cars?.length || 0}
          </div>
          <div>
            <MdCarRental /> <strong>Total Rents:</strong>{" "}
            {details.totalRents || "0"}
          </div>
          <div>
            <FaMoneyBillTrendUp /> <strong>Total Revenue:</strong>{" "}
            {details.totalRevenue || "0"}$
          </div>
          <Link to="/agency/profile-update" className="agency-update-btn">
            <span>Update Profile</span>
          </Link>
        </>
      )}
      {authData.role === "Customer" && (
        <>
          <div>
            <FaIdCard /> <strong>Driving License:</strong>{" "}
            {details.drivingLiscene || "N/A"}
          </div>
          <div>
            <MdCarRental /> <strong>Total Rents:</strong>{" "}
            {details.totalRents || "0"}
          </div>
          <div>
            <FaMoneyBillTrendUp /> <strong>Total Spending:</strong>{" "}
            {details.totalSpending || "0"}$
          </div>
          <Link to="/customer/profile-update" className="customer-update-btn">
            <span>Update Profile</span>
          </Link>
        </>
      )}
    </div>
  );

  // Convert base64 image data to usable src format if it exists
  const profileImageSrc = details?.imageData
    ? `data:image/jpeg;base64,${details.imageData}`
    : null;

  return (
    <div className="profile-container">
      <h1>{authData.role} Profile</h1>

      {/* Profile Image */}
      <div className="profile-img-container">
        {profileImageSrc ? (
          <img src={profileImageSrc} alt="Profile" className="profile-img" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      {/* Profile Details */}
      {profileDetails}
    </div>
  );
};

export default Profile;
