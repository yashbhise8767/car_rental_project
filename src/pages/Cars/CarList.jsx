import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import "./CarList.css";

const fetchAllCars = async () => {
  try {
    const response = await axiosInstance.get("/view/cars");
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

// Helper function to get stored values from localStorage
const getStoredValue = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [error, setError] = useState(null);

  // Dynamic dropdown options
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]); // All models (flattened)
  const [makeModelMap, setMakeModelMap] = useState({}); // Map of makes to models
  const [categories, setCategories] = useState([]);

  // Selected filters
  const [make, setMake] = useState(() => getStoredValue("make", ""));
  const [model, setModel] = useState(() => getStoredValue("model", ""));
  const [category, setCategory] = useState(() =>
    getStoredValue("category", "")
  );
  const [minYear, setMinYear] = useState(() => getStoredValue("minYear", ""));
  const [maxYear, setMaxYear] = useState(() => getStoredValue("maxYear", ""));
  const [priceRange, setPriceRange] = useState(() =>
    getStoredValue("priceRange", { min: 0, max: 1000 })
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getStoredValue("currentPage", 1)
  );
  const [searchTerm, setSearchTerm] = useState(() =>
    getStoredValue("searchTerm", "")
  );

  const itemsPerPage = 9; // Adjust this value as needed
  const navigate = useNavigate();

  // Fetch cars and images when the component mounts
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchAllCars();
        setCars(data);

        // Extract unique makes, models, and categories
        const uniqueMakes = [...new Set(data.map((car) => car.brand))];
        const uniqueCategories = [...new Set(data.map((car) => car.category))];

        // Create a map of makes to their models
        const makeModelMap = {};
        data.forEach((car) => {
          if (!makeModelMap[car.brand]) {
            makeModelMap[car.brand] = new Set(); // Use Set to avoid duplicates
          }
          makeModelMap[car.brand].add(car.model);
        });

        // Convert Sets to arrays for easier rendering
        const processedMap = {};
        Object.keys(makeModelMap).forEach((make) => {
          processedMap[make] = [...makeModelMap[make]];
        });

        setMakes(uniqueMakes);
        setCategories(uniqueCategories);
        setMakeModelMap(processedMap);
        setModels(Object.values(makeModelMap).flat()); // Flatten all models
        fetchCarImages(data);
      } catch (err) {
        setError("Failed to load cars.");
      }
    };
    loadCars();
  }, []);

  // Fetch car images
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
          images[car.id] = "https://dummyimage.com/400x300/000/fff"; // Fallback placeholder
        }
      })
    );
    setCarImages(images);
  };

  // Memoize the filtered cars to avoid unnecessary recalculations
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const trimmedSearch = searchTerm.trim().toLowerCase();
      return (
        (trimmedSearch === "" ||
          `${car.brand} ${car.model}`.toLowerCase().includes(trimmedSearch) ||
          (car.category &&
            car.category.toLowerCase().includes(trimmedSearch))) &&
        (make === "" || car.brand === make) &&
        (model === "" || car.model === model) &&
        (category === "" ||
          (car.category &&
            car.category.toLowerCase() === category.toLowerCase())) &&
        (minYear === "" || car.year >= parseInt(minYear)) &&
        (maxYear === "" || car.year <= parseInt(maxYear)) &&
        car.pricePerDay >= priceRange.min &&
        car.pricePerDay <= priceRange.max
      );
    });
  }, [cars, searchTerm, make, model, category, minYear, maxYear, priceRange]);

  // Calculate total pages and current cars to display
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPage", pageNumber);
  };

  // Helper function to calculate visible page range
  const MAX_VISIBLE_PAGES = 5; // Maximum number of pages to display at once
  const getVisiblePages = (currentPage, totalPages) => {
    const halfMaxVisible = Math.floor(MAX_VISIBLE_PAGES / 2);

    let startPage = Math.max(1, currentPage - halfMaxVisible);
    let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Adjust startPage if endPage is at the boundary
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  // Save filter values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("searchTerm", JSON.stringify(searchTerm));
    localStorage.setItem("make", JSON.stringify(make));
    localStorage.setItem("model", JSON.stringify(model));
    localStorage.setItem("category", JSON.stringify(category));
    localStorage.setItem("minYear", JSON.stringify(minYear));
    localStorage.setItem("maxYear", JSON.stringify(maxYear));
    localStorage.setItem("priceRange", JSON.stringify(priceRange));
  }, [searchTerm, make, model, category, minYear, maxYear, priceRange]);

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange.max) {
      setPriceRange((prev) => ({ ...prev, min: value }));
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange.min) {
      setPriceRange((prev) => ({ ...prev, max: value }));
    }
  };

  return (
    <>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search Cars"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-bar">
          {/* Dynamic Makes Dropdown */}
          <select
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel(""); // Reset model when make changes
            }}
            className="dropdown"
          >
            <option value="">All Makes</option>
            {makes.map((make, index) => (
              <option key={index} value={make}>
                {make}
              </option>
            ))}
          </select>
          {/* Dynamic Models Dropdown */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="dropdown"
          >
            <option value="">All Models</option>
            {make
              ? makeModelMap[make]?.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))
              : Object.values(makeModelMap) // Flatten all models if no make is selected
                  .flat()
                  .map((model, index) => (
                    <option key={index} value={model}>
                      {model}
                    </option>
                  ))}
          </select>
          {/* Dynamic Categories Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
          >
            <option value="">All Categories</option>
            {categories.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="year-dropdown">
            <label>Year:</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="dropdown"
            >
              <option value="">Min Year</option>
              {[...Array(27).keys()].map((i) => (
                <option key={2000 + i} value={2000 + i}>
                  {2000 + i}
                </option>
              ))}
            </select>
            <select
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="dropdown"
            >
              <option value="">Max Year</option>
              {[...Array(27).keys()].map((i) => (
                <option key={2000 + i} value={2000 + i}>
                  {2000 + i}
                </option>
              ))}
            </select>
          </div>
          {/* Price Range with Input Boxes and Slider */}
          <div className="price-range">
            <label>
              Price Range: ${priceRange.min} - ${priceRange.max}
            </label>
            <div className="range-inputs">
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="price-input"
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="price-input"
              />
            </div>
            <div className="range-slider">
              <input
                type="range"
                name="min"
                min="0"
                max="1000"
                step="1"
                value={priceRange.min}
                onChange={handleMinPriceChange}
                className="slider"
              />
              <input
                type="range"
                name="max"
                min="0"
                max="1000"
                step="1"
                value={priceRange.max}
                onChange={handleMaxPriceChange}
                className="slider"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="car-list">
        <h1>Car List</h1>
        <h4>Total Cars: {filteredCars.length}</h4>
        {error && <p className="error-message">{error}</p>}
        {cars.length === 0 ? (
          <p>LOADING</p>
        ) : filteredCars.length === 0 ? (
          <p>No cars match your filter criteria.</p>
        ) : (
          <>
            <div className="car-cards">
              {currentCars.map((car) => (
                <Link
                  to={`/cars/${car.id}`}
                  key={car.id}
                  className="car-card-link"
                >
                  <div className="car-card">
                    <img
                      src={
                        carImages[car.id] ||
                        "https://dummyimage.com/400x300/000/fff"
                      }
                      alt={`${car.brand || "Unknown"} ${
                        car.model || "Unknown"
                      }`}
                      className="car-image"
                    />
                    <div className="car-info">
                      <h3>
                        {car.brand} {car.model}
                      </h3>
                      <p>Year: {car.year}</p>
                      <p>Price: ${car.pricePerDay}/day</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="pagination">
              {/* Jump to First Page Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                className="carlist-first"
                style={{
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                First
              </button>

              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="carlist-prev"
                style={{
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                Previous
              </button>

              {/* Dynamic Page Buttons */}
              {getVisiblePages(currentPage, totalPages).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={currentPage === pageNumber ? "active" : ""}
                  onClick={() => handlePageChange(pageNumber)}
                  id="page-button"
                  style={{
                    transform:
                      currentPage === pageNumber ? "scale(1.1)" : "scale(1)",
                    transition:
                      "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
                  }}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="carlist-next"
                style={{
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                Next
              </button>

              {/* Jump to Last Page Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="carlist-last"
                style={{
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                Last
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CarList;
