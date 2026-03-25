import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateCarForm.css"; // Import your CSS file here

const UpdateCarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    vin: "",
    mileage: "",
    color: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    features: "",
    description: "",
    pricePerDay: "",
    available: "",
  });

  const [imageFiles, setImageFiles] = useState({
    main: null,
    first: null,
    second: null,
    third: null,
  });

  const [previewImages, setPreviewImages] = useState({
    main: null,
    first: null,
    second: null,
    third: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axiosInstance.get(`/agency/cars/${id}`);
        const car = response.data;
        setCarData(car);

        const convertToBase64 = (data, type) =>
          data ? `data:${type};base64,${data}` : null;

        setPreviewImages({
          main: convertToBase64(car.imageData, car.imageType),
          first: convertToBase64(car.firstImageData, car.firstImageType),
          second: convertToBase64(car.secondImageData, car.secondImageType),
          third: convertToBase64(car.thirdImageData, car.thirdImageType),
        });
      } catch (err) {
        setError("Failed to fetch car details.");
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [imageType]: reader.result }));
        setImageFiles((prev) => ({ ...prev, [imageType]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(carData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (imageFiles.main) formData.append("imageFile", imageFiles.main);
    if (imageFiles.first) formData.append("firstImage", imageFiles.first);
    if (imageFiles.second) formData.append("secondImage", imageFiles.second);
    if (imageFiles.third) formData.append("thirdImage", imageFiles.third);

    try {
      await axiosInstance.put(`/agency/cars/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Car updated successfully!");
      navigate(`/cars/${id}`);
    } catch (err) {
      alert("Failed to update car.");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="update-car-form-container">
      <h2>Update Car</h2>
      <form onSubmit={handleSubmit}>
        {/* Two-Column Layout */}
        <div className="update-car-form-columns">
          {/* Left Column */}
          <div className="update-car-form-column">
            {[
              { label: "Brand", name: "brand", type: "text" },
              { label: "Model", name: "model", type: "text" },
              { label: "Year", name: "year", type: "number" },
              { label: "License Plate", name: "licensePlate", type: "text" },
              { label: "VIN", name: "vin", type: "text" },
              { label: "Mileage", name: "mileage", type: "number" },
              { label: "Color", name: "color", type: "text" },
            ].map((field) => (
              <div key={field.name} className="update-car-form-group">
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={carData[field.name]}
                  onChange={handleChange}
                  className="update-car-form-control"
                  required
                />
              </div>
            ))}

            {/* Category Dropdown */}
            <div className="update-car-form-group">
              <label>Category</label>
              <select
                name="category"
                value={carData.category}
                onChange={handleChange}
                className="update-car-form-control"
                required
              >
                <option value="">Select Category</option>
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
          <div className="update-car-form-column">
            {/* Fuel Type Dropdown */}
            <div className="update-car-form-group">
              <label>Fuel Type</label>
              <select
                name="fuelType"
                value={carData.fuelType}
                onChange={handleChange}
                className="update-car-form-control"
                required
              >
                <option value="">Select Fuel Type</option>
                {["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"].map(
                  (fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Transmission Dropdown */}
            <div className="update-car-form-group">
              <label>Transmission</label>
              <select
                name="transmission"
                value={carData.transmission}
                onChange={handleChange}
                className="update-car-form-control"
                required
              >
                <option value="">Select Transmission</option>
                {["AUTOMATIC", "MANUAL"].map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            {[
              { label: "Seats", name: "seats", type: "number" },
              { label: "Price Per Day", name: "pricePerDay", type: "number" },
            ].map((field) => (
              <div key={field.name} className="update-car-form-group">
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={carData[field.name]}
                  onChange={handleChange}
                  className="update-car-form-control"
                  required
                />
              </div>
            ))}

            {/* Features Textarea */}
            <div className="update-car-form-group">
              <label>Features (comma separated)</label>
              <textarea
                name="features"
                value={carData.features}
                onChange={handleChange}
                className="update-car-textarea"
                rows="3"
                placeholder="Enter features (comma separated)"
              ></textarea>
            </div>

            {/* Description Textarea */}
            <div className="update-car-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleChange}
                className="update-car-textarea"
                rows="5"
                placeholder="Enter a detailed description"
              ></textarea>
            </div>

            <div className="update-car-form-group">
              <label>Available</label>
              <input
                type="checkbox"
                checked={carData.available}
                onChange={(e) =>
                  setCarData({ ...carData, available: e.target.checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <h3 className="update-car-underline">Images</h3>
        <div className="update-car-image-upload">
          {["main", "first", "second", "third"].map((type) => (
            <div key={type} className="update-car-form-group">
              <label>
                {type.charAt(0).toUpperCase() + type.slice(1)} Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, type)}
                className="update-car-file-input"
              />
              {previewImages[type] && (
                <img
                  src={previewImages[type]}
                  alt={`${type} preview`}
                  className="update-car-image-preview"
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="update-car-submit-btn">
          Update Car
        </button>
      </form>
    </div>
  );
};

export default UpdateCarForm;
