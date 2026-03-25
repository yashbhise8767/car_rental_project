import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./AgencyCars.css";

const fetchAgencyCars = async () => {
  try {
    const response = await axiosInstance.get("/agency/cars");
    const carsData = response.data;

    // Fetch images for each car
    const carImages = {};
    await Promise.all(
      carsData.map(async (car) => {
        try {
          const imgResponse = await axiosInstance.get(
            `/view/cars/${car.id}/image`,
            {
              responseType: "blob",
            }
          );
          carImages[car.id] = URL.createObjectURL(imgResponse.data);
        } catch (error) {
          console.error(`Error fetching image for car ID ${car.id}`, error);
          carImages[car.id] =
            "https://dummyimage.com/100x60/ccc/000&text=No+Image"; // Placeholder
        }
      })
    );

    return { carsData, carImages };
  } catch (error) {
    console.error("Error fetching agency cars", error);
    throw error;
  }
};

const AgencyCars = () => {
  const [cars, setCars] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [carsPerPage] = useState(5); // Number of cars per page
  const navigate = useNavigate();

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { carsData, carImages } = await fetchAgencyCars();
        setCars(carsData);
        setCarImages(carImages);
      } catch (err) {
        setError("Failed to load cars");
      }
    };
    loadCars();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Sort the cars array
    const sortedCars = [...cars].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCars(sortedCars);
  };

  const handleCarClick = (id) => {
    navigate(`/cars/${id}`);
  };

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const totalPages = Math.ceil(cars.length / carsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="agency-container my-4">
      <h1 className="agency-my-cars-header">My Cars</h1>
      <div>Total Lists = {cars?.length}</div>
      {error && <p className="agency-text-danger text-center">{error}</p>}

      <div className="agency-table-responsive">
        <table className="agency-table agency-table-striped agency-table-hover text-center">
          <thead className="agency-table-dark">
            <tr>
              <th onClick={() => handleSort("id")}>
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("brand")}>
                Brand{" "}
                {sortConfig.key === "brand" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("model")}>
                Model{" "}
                {sortConfig.key === "model" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("vin")}>
                VIN{" "}
                {sortConfig.key === "vin" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("licensePlate")}>
                License Plate{" "}
                {sortConfig.key === "licensePlate" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("pricePerDay")}>
                Price Per Day{" "}
                {sortConfig.key === "pricePerDay" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.vin}</td>
                <td>{car.licensePlate}</td>
                <td>${car.pricePerDay}</td>
                <td>
                  <img
                    src={
                      carImages[car.id] ||
                      "https://dummyimage.com/100x60/ccc/000&text=No+Image"
                    }
                    alt={`${car.brand} ${car.model}`}
                    className="agency-car-image"
                    onError={(e) =>
                      (e.target.src =
                        "https://dummyimage.com/100x60/ccc/000&text=No+Image")
                    }
                  />
                </td>
                <td>
                  <button
                    className="agency-btn agency-btn-primary agency-btn-sm"
                    onClick={() => handleCarClick(car.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`pagination-btn ${
              currentPage === number + 1 ? "active" : ""
            }`}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgencyCars;
