import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

export default function StatisticsBanner() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/public/api/stats");
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch statistics. Please try again later.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      style={{
        margin: "1rem 0rem",
        width: "100%",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "15px",
        color :"black",
        }}
      >
        🚀 Our Platform Has 🚀
      </h2>
      {error ? (
        <p style={{ color: "#F87171" }}>{error}</p>
      ) : stats ? (
        <div
          style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}
          className="statsContainer"
        >
          <div>{stats.totalCars} Cars 🚗</div>
          <div>{stats.totalAgencies} Agencies 🏢</div>
          <div>{stats.totalCustomers} Customers 🧑</div>
          <div>{stats.totalRentalOrders} Rental Orders 📄</div>
          <div>{stats.totalRents} Rents 🔁</div>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}

      <style>
        {`
          .statsContainer div {
            background-color: white;
            color: rgb(34, 34, 33);
            font-weight: bold;
            padding: 10px 30px;
            text-align: center;
            border-radius: 10px;
            font-size: 16px;
            border: 2px solid white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease; /* Smooth transition for hover effects */
          }

          .statsContainer div:hover {
            background-color: #f0c040; /* Changes to yellow on hover */
            color: white; /* Text turns white on hover */
            transform: translateY(-2px); /* Slight lift effect */
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
            cursor: pointer; /* Indicates interactivity */
          }
        `}
      </style>
    </div>
  );
}