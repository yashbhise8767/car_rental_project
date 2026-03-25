import { useState, useEffect } from "react";
import "./FilterCar.css";

const getStoredValue = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const FilterCar = ({ cars, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(
    getStoredValue("searchTerm", "")
  );
  const [make, setMake] = useState(getStoredValue("make", ""));
  const [model, setModel] = useState(getStoredValue("model", ""));
  const [category, setCategory] = useState(getStoredValue("category", ""));
  const [minYear, setMinYear] = useState(getStoredValue("minYear", ""));
  const [maxYear, setMaxYear] = useState(getStoredValue("maxYear", ""));
  const [priceRange, setPriceRange] = useState(
    getStoredValue("priceRange", { min: 0, max: 1000 })
  );

  // Hardcoded dropdown options
  const hardcodedMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet ",
    "Tesla",
    "BMW",
    "Mercedes-Benz",
    "Nissan",
    "Audi",
    "Hyundai",
    "Mazda",
    "Subaru",
    "Lexus",
    "Kia",
    "Volkswagen",
    "Jeep",
    "Chrysler",
    "GMC",
  ];
  const hardcodedModels = [
    "Malibu",
    "Vitz",
    "Corolla",
    "Civic",
    "Mustang",
    "Tahoe",
    "Model S",
    "X5",
    "C-Class",
    "Altima",
    "Q7",
    "Elantra",
    "Camry",
    "F-150",
    "Impala",
    "CX-5",
    "Accord",
    "Optima",
    "Outback",
    "RX",
    "Malibu",
    "3 Series",
    "Golf",
    "Model 3",
    "Escape",
    "Wrangler",
    "A4",
    "Santa Fe",
    "Rogue",
    "Highlander",
    "Mazda3",
    "Pacifica",
    "Sierra",
  ];
  const hardcodedCategories = [
    "Sedan",
    "Coupe",
    "SUV",
    "Truck",
    "Hatchback",
    "Minivan",
  ]; // Replacing bodyTypes

  useEffect(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    const filteredList = cars.filter(
      (car) =>
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

    onFilterChange((prevList) => {
      return JSON.stringify(prevList) !== JSON.stringify(filteredList)
        ? filteredList
        : prevList;
    });
  }, [searchTerm, make, model, category, minYear, maxYear, priceRange, cars]);

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
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search Cars"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filter-bar">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="dropdown"
        >
          <option value="">All Makes</option>
          {hardcodedMakes.map((make, index) => (
            <option key={index} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="dropdown"
        >
          <option value="">All Models</option>
          {hardcodedModels.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="dropdown"
        >
          <option value="">All Categories</option>
          {hardcodedCategories.map((type, index) => (
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
            {[...Array(24).keys()].map((i) => (
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
            {[...Array(24).keys()].map((i) => (
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
  );
};

export default FilterCar;
