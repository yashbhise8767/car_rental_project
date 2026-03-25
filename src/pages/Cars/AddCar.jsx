import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import "./AddCar.css"; // Import your CSS file here
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const [carData, setCarData] = useState({
    brand: "Toyota",
    model: "Vitz",
    year: "2010",
    licensePlate: "9P/1234",
    vin: "65473",
    mileage: "100000",
    color: "White",
    category: "SEDAN",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    seats: "4",
    features: "Aircons",
    description: "Nice",
    pricePerDay: "80",
    driverFeePerDay: "50",
  });

  const [mainImage, setMainImage] = useState(null);
  const [firstImage, setFirstImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [thirdImage, setThirdImage] = useState(null);

  const [imagePreviews, setImagePreviews] = useState({
    main: null,
    first: null,
    second: null,
    third: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleImageChange = (e, imageType) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setImagePreviews((prev) => ({ ...prev, [imageType]: previewURL }));

      switch (imageType) {
        case "main":
          setMainImage(selectedFile);
          break;
        case "first":
          setFirstImage(selectedFile);
          break;
        case "second":
          setSecondImage(selectedFile);
          break;
        case "third":
          setThirdImage(selectedFile);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (const key in carData) {
        formData.append(key, carData[key]);
      }

      // Append images if they exist
      if (mainImage) formData.append("imageFile", mainImage);
      if (firstImage) formData.append("firstImage", firstImage);
      if (secondImage) formData.append("secondImage", secondImage);
      if (thirdImage) formData.append("thirdImage", thirdImage);

      await axiosInstance.post("/agency/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Car added successfully!");

      // Reset form and image states
      setCarData({
        brand: "Toyota",
        model: "Vitz",
        year: "2010",
        licensePlate: "9P/1234",
        vin: "65473",
        mileage: "100000",
        color: "White",
        category: "SEDAN",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        seats: "4",
        features: "Aircons",
        description: "Nice",
        pricePerDay: "80",
        driverFeePerDay: "50",
      });

      setMainImage(null);
      setFirstImage(null);
      setSecondImage(null);
      setThirdImage(null);
      setImagePreviews({ main: null, first: null, second: null, third: null });

      navigate("/agency/cars");
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Error adding car. Please try again.");
    }
  };

  return (
    <form className="add-car-form-container" onSubmit={handleSubmit}>
      <h2>Add Car</h2>

      <div className="form-columns">
        {/* Left Column */}
        <div className="form-column">
          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              className="add-car-form-control"
              name="brand"
              value={carData.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              className="add-car-form-control"
              name="model"
              value={carData.model}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              className="add-car-form-control"
              name="year"
              value={carData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>License Plate</label>
            <input
              type="text"
              className="add-car-form-control"
              name="licensePlate"
              value={carData.licensePlate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>VIN</label>
            <input
              type="text"
              className="add-car-form-control"
              name="vin"
              value={carData.vin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mileage</label>
            <input
              type="number"
              className="add-car-form-control"
              name="mileage"
              value={carData.mileage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <input
              type="text"
              className="add-car-form-control"
              name="color"
              value={carData.color}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="add-car-form-control"
              name="category"
              value={carData.category}
              onChange={handleChange}
            >
              {[
                "SUV",
                "HATCHBACK",
                "SEDAN",
                "COUPE",
                "CONVERTIBLE",
                "TRUCK",
                "VAN",
                "OTHER",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="form-column">
          <div className="form-group">
            <label>Fuel Type</label>
            <select
              className="add-car-form-control"
              name="fuelType"
              value={carData.fuelType}
              onChange={handleChange}
            >
              {["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"].map(
                (fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Transmission</label>
            <select
              className="add-car-form-control"
              name="transmission"
              value={carData.transmission}
              onChange={handleChange}
            >
              {["AUTOMATIC", "MANUAL"].map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Seats</label>
            <input
              type="number"
              className="add-car-form-control"
              name="seats"
              value={carData.seats}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Features (comma separated)</label>
            <input
              type="text"
              className="add-car-form-control"
              name="features"
              value={carData.features}
              onChange={handleChange}
              placeholder="Air Conditioning, Navigation System"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="add-car-form-control"
              name="description"
              value={carData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Price per Day</label>
            <input
              type="number"
              step="0.01"
              className="add-car-form-control"
              name="pricePerDay"
              value={carData.pricePerDay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Driver Fee per Day</label>
            <input
              type="number"
              step="0.01"
              className="add-car-form-control"
              name="driverFeePerDay"
              value={carData.driverFeePerDay}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      {/* Image Uploads */}
      <h3 className="add-car-underline">Images</h3>
      <div className="add-car-image-container">
        <div className="form-group">
          <label>Main Image</label>
          <input
            type="file"
            className="add-car-form-control"
            onChange={(e) => handleImageChange(e, "main")}
          />
          {imagePreviews.main && (
            <img
              src={imagePreviews.main}
              alt="Main"
              className="image-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label>First Image</label>
          <input
            type="file"
            className="add-car-form-control"
            onChange={(e) => handleImageChange(e, "first")}
          />
          {imagePreviews.first && (
            <img
              src={imagePreviews.first}
              alt="First"
              className="image-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label>Second Image</label>
          <input
            type="file"
            className="add-car-form-control"
            onChange={(e) => handleImageChange(e, "second")}
          />
          {imagePreviews.second && (
            <img
              src={imagePreviews.second}
              alt="Second"
              className="image-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label>Third Image</label>
          <input
            type="file"
            className="add-car-form-control"
            onChange={(e) => handleImageChange(e, "third")}
          />
          {imagePreviews.third && (
            <img
              src={imagePreviews.third}
              alt="Third"
              className="image-preview"
            />
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Add Car
      </button>
    </form>
  );
};

export default AddCar;
