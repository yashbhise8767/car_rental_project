import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const TopRentedCars = () => {
  const [topRentedCars, setTopRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRentedCars = async () => {
      try {
        const response = await axiosInstance.get("/admin/top-rented-cars/10");
        setTopRentedCars(response.data);
      } catch (error) {
        console.error("Error fetching top rented cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRentedCars();
  }, []);

  return (
    <div className="content-container">
      <style>
        {`
          .top-rented-cars {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
             color: #333;
            
          }

          .top-rented-cars h3 {
            text-align: center;
            margin-bottom: 15px;
            font-size: 1.5rem;
            color: #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }

          th {
            background: gray;
            color: white;
            font-weight: bold;
          }

          tr:nth-child(even) {
            background: #f9f9f9;
          }

          tr:hover {
            background: #f1f1f1;
          }

          img {
            border-radius: 5px;
          }

          td img {
            display: block;
            margin: auto;
          }

          td[colspan="6"] {
            font-style: italic;
            color: #666;
            padding: 20px;
          }
        `}
      </style>

      <div className="top-rented-cars">
        <h3>Top 10 Most Rented Cars</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Total Rents</th>
              <th>Total Money Made ($)</th>
              <th>Total Days Rented</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : topRentedCars.length === 0 ? (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            ) : (
              topRentedCars.map((car, index) => (
                <tr key={car.id}>
                  <td>{index + 1}</td>
                  <td>
                    {car.imageData ? (
                      <img
                        src={`data:image/png;base64,${car.imageData}`}
                        alt={`${car.brand} ${car.model}`}
                        style={{ width: "80px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{car.brand} {car.model}</td>
                  <td>{car.totalRents}</td>
                  <td>${car.totalMoneyMade.toFixed(2)}</td>
                  <td>{car.totalDaysRented}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopRentedCars;
