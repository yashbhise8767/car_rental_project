import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Modal, Rate } from "antd";
import CarOrderForm from "./CarOrderForm";
import RateCar from "../../components/RateCar";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCar,
} from "react-icons/fa";
import "./CarDetails.css";
import { MdVerified } from "react-icons/md";
import { PiCarProfileFill } from "react-icons/pi";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [carImages, setCarImages] = useState([]); // Updated state for multiple images
  const [mainImage, setMainImage] = useState(""); // Main image state
  const [error, setError] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [carImagesMap, setCarImagesMap] = useState({});
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [AgencyData, setAgencyData] = useState(null);

  useEffect(() => {
    if (!authData.token) {
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const carEndpoint = `/view/cars/${id}`;
        const carResponse = await axiosInstance.get(carEndpoint);
        const carData = carResponse.data;
        setCar(carData);

        // Convert images
        const images = [
          carData.imageData &&
            `data:${carData.imageType};base64,${carData.imageData}`,
          carData.firstImageData &&
            `data:${carData.firstImageType};base64,${carData.firstImageData}`,
          carData.secondImageData &&
            `data:${carData.secondImageType};base64,${carData.secondImageData}`,
          carData.thirdImageData &&
            `data:${carData.thirdImageType};base64,${carData.thirdImageData}`,
        ].filter(Boolean);

        setCarImages(images);
        if (images.length > 0) setMainImage(images[0]); // Set first image as main

        fetchRecommendedCars(carData.brand, carData.category);
        fetchAgencyData(carData.id);
      } catch (err) {
        setError("Failed to fetch car details. Please try again later.");
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/rents/${id}/unavailable-dates`
        );
        setUnavailableDates(response.data.map((date) => new Date(date)));
      } catch (err) {
        setError("Failed to fetch unavailable dates. Please try again later.");
      }
    };

    fetchCarDetails();
    fetchUnavailableDates();
  }, [id, authData.token, authData.role]);

  const fetchAgencyData = async (carid) => {
    try {
      const response = await axiosInstance.get(`/view/cars/${carid}/agency`);

      console.log("Agency JSON = ", response.data);
      setAgencyData(response.data);
    } catch (error) {
      console.error("Error fetching car agency data:", error);
    }
  };

  const fetchRecommendedCars = async (brand, category) => {
    try {
      const response = await axiosInstance.get("/view/cars");

      // Step 1: Filter cars by brand first
      const brandFilteredCars = response.data.filter(
        (c) => c.brand === brand && c.id !== Number(id) // Exclude the current car
      );

      // Step 2: Filter cars by category (excluding those already in brandFilteredCars)
      const categoryFilteredCars = response.data.filter(
        (c) =>
          c.category === category &&
          c.id !== Number(id) && // Exclude the current car
          !brandFilteredCars.some((b) => b.id === c.id) // Exclude cars already in brandFilteredCars
      );

      // Step 3: Combine results, prioritizing brand-filtered cars
      const filteredCars = [
        ...brandFilteredCars,
        ...categoryFilteredCars,
      ].slice(0, 4);

      // Update state with recommended cars
      setRecommendedCars(filteredCars);
      fetchCarImages(filteredCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
    }
  };

  const fetchCarImages = async (carsList) => {
    const images = {};
    await Promise.all(
      carsList.map(async (car) => {
        try {
          const response = await axiosInstance.get(
            `/view/cars/${car.id}/image`,
            {
              responseType: "blob",
            }
          );
          images[car.id] = URL.createObjectURL(response.data);
        } catch (error) {
          images[car.id] = "https://dummyimage.com/400x300/000/fff";
        }
      })
    );
    setCarImagesMap(images);
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!car && authData.token) {
    return <p>Loading car details...</p>;
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/agency/cars/${id}`);
      alert("Car deleted successfully.");
      navigate("/agency/cars");
    } catch (err) {
      alert("Failed to delete car. Please try again.");
    }
  };

  const handleUpdate = () => {
    navigate(`/agency/cars/${id}/edit`);
  };

  const handleOrder = () => {
    navigate(`/agency/cars/${id}/orders`);
  };

  const handleRents = () => {
    navigate(`/agency/cars/${id}/rents`);
  };

  const handleRent = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      className="car-details-container-custom"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {authData.token ? (
        <>
          <div className="car-images-wrapper">
            <div className="main-image">
              <img src={mainImage} alt="Main Car" className="large-car-image" />
            </div>
            <div className="thumbnail-column">
              {carImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Car ${index + 1}`}
                  className="thumbnail-image"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="car-details-main-custom">
            <div className="car-details-title-custom">
              <h2>
                {car?.year} {car?.brand} {car?.model}
              </h2>
              {/* Rating Section */}
              <div className="car-rating">
                {car?.avgRating !== null &&
                car?.avgRating !== undefined &&
                car?.ratingCount !== 0 ? (
                  <>
                    <Rate allowHalf disabled value={car.avgRating} />
                    <span className="rating-number">
                      {" "}
                      ({car.avgRating.toFixed(1)})
                    </span>
                  </>
                ) : (
                  <div className="no-ratings">
                    <Rate
                      allowHalf
                      disabled
                      value={0}
                      style={{
                        color: "#ccc",
                      }}
                    />
                    <span className="no-rating-text">No ratings yet!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="car-details-price-custom">
              <p>
                <span className="car-details-price-text-custom">
                  Price per Day:
                </span>{" "}
                <strong>${car?.pricePerDay}</strong>
              </p>
              <p>
                <span className="car-details-price-text-custom">
                  Driver Fee:
                </span>{" "}
                <strong>${car?.driverFeePerDay || "N/A"}</strong>
              </p>
            </div>
          </div>

          <hr className="divider-custom" />

          <div className="car-details-specs-custom">
            <div className="car-details-specs-row-custom">
              <span>{car?.year || "N/A"}</span>
              <span>Year</span>
            </div>

            <div className="car-details-specs-row-custom">
              <span>{car?.mileage || "N/A"}</span>
              <span>Mileage</span>
            </div>

            <div className="car-details-specs-row-custom">
              <span>{car?.transmission || "N/A"}</span>
              <span>Transmission</span>
            </div>

            <div className="car-details-specs-row-custom">
              <span>{car?.fuelType || "N/A"}</span>
              <span>Fuel Type</span>
            </div>

            <div className="car-details-specs-row-custom">
              <span>{car?.category || "N/A"}</span>
              <span>Body Type</span>
            </div>

            <div className="car-details-specs-row-custom">
              <span>{car?.seats || "N/A"}</span>
              <span>Seat</span>
            </div>
          </div>

          <hr className="divider-custom" />

          <div className="car-details-description-custom">
            <h4>About This Car</h4>
            <p className="car-details-description-text-custom">
              {car?.description || "No description available"}
            </p>
          </div>
          <hr className="divider-custom" />

          <div className="car-features">
            <h4 className="features-title">Features</h4>
            <ul className="features-list">
              {car?.features?.split(",").map((feature, index) => (
                <li key={index} className="feature-item">
                  {feature.trim()}
                </li>
              ))}
            </ul>
          </div>
          <hr className="divider-custom" />

          {/* own by */}
          <div className="owned-by">
            <h3>Owned by</h3>
            <p
              onClick={() => navigate(`/page/agency/${AgencyData?.id}`)}
              style={{
                cursor: "pointer",
                fontSize: "1.2rem",
                fontWeight: "900",
                color: "#000",
              }}
            >
              <FaUser /> {AgencyData?.username}{" "}
              {AgencyData?.verificationStatus === "VERIFIED" ? (
                <MdVerified style={{ color: "navy" }} />
              ) : (
                ""
              )}
            </p>
            <p>
              <FaPhone /> {AgencyData?.phoneNumber}
            </p>
            <p>
              <FaEnvelope /> {AgencyData?.email}
            </p>
            <p>
              <FaMapMarkerAlt /> {AgencyData?.city}, {AgencyData?.address}
            </p>
            {/* <p>
              <FaCar /> Cars Uploaded: {AgencyData?.totalCar || 0}
            </p> */}
          </div>
          <hr className="divider-custom" />

          {authData.role === "Agency" &&
            AgencyData &&
            AgencyData.id === authData.user?.id && (
              <div className="agency-actions-custom">
                <button onClick={handleUpdate} className="btn-custom btn-edit">
                  Edit
                </button>
                <button onClick={handleOrder} className="btn-custom btn-orders">
                  Orders
                </button>
                <button onClick={handleRents} className="btn-custom btn-rents">
                  Rents
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-custom btn-delete"
                >
                  Delete
                </button>
              </div>
            )}

          {authData.role === "Customer" && (
            <button onClick={handleRent} className="customer-rent-btn">
              <PiCarProfileFill
                style={{ marginRight: "1rem", transform: "scale(1.8)" }}
              />{" "}
              Rent This Car
            </button>
          )}

          {authData.role === "Customer" && <RateCar carId={id} />}

          <Modal
            title="Rent This Car"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            centered
            className="custom-rent-modal"
          >
            <CarOrderForm
              car={car}
              unavailableDates={unavailableDates}
              onClose={handleModalClose}
            />
          </Modal>
          <hr className="divider-custom" />

          {/* Recommended Cars Section */}

          {authData.role === "Customer" && (
            <div className="recommended-cars-section">
              <h3>Recommended Cars</h3>
              <div className="recommended-cars-list">
                {recommendedCars.length > 0 ? (
                  recommendedCars.map((recCar) => (
                    <Link
                      to={`/cars/${recCar.id}`}
                      key={recCar.id}
                      className="recommended-car-card"
                    >
                      <img
                        src={
                          carImagesMap[recCar.id] ||
                          "https://dummyimage.com/400x300/000/fff"
                        }
                        alt={`${recCar.brand} ${recCar.model}`}
                        className="recommended-car-image"
                      />
                      <div className="recommended-car-info">
                        <h4>
                          {recCar.brand} {recCar.model}
                        </h4>
                        <p>Year: {recCar.year}</p>
                        <p>Price: ${recCar.pricePerDay}/day</p>
                        <p>Car Body: {recCar.category}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No recommended cars available.</p>
                )}
              </div>
            </div>
          )}

          {/* recommended section end */}
        </>
      ) : (
        <p>Please log in to view car details.</p>
      )}
    </div>
  );
};

export default CarDetails;
