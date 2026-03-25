// src/pages/Admin/DashboardMain.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import "./DashboardMain.css"

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BiMoneyWithdraw } from "react-icons/bi";
import TopRentedCars from "../../components/TopRentedCars";
import { Flex } from "antd";

const DashboardMain = () => {

  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0.0);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/public/api/stats");
        setStats(response.data);
        console.log("Stats are ", stats);
      } catch (err) {
        setError("Failed to fetch statistics. Please try again later.");
      }
    };

    fetchStats();

    const fetchTotalRevenue = async () => {
      try {
        const response = await axiosInstance.get("/admin/totalRevenue"); // Replace with your API endpoint
        console.log("Total Revenue " + response.data);
        setTotalRevenue(response.data);
      } catch (error) {
        console.error("Error fetching totalRevenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRevenue();
  }, []);

  // Sample data for charts (you can replace this with API data)
  const barChartData = [
    { name: "A1", orders: 12, rents: 10 },
    { name: "A2", orders: 24, rents: 19 },
    { name: "A3", orders: 8, rents: 5 },
    { name: "A4", orders: 20, rents: 15 },
  ];

  const pieChartData = [
    { name: "Agencies", value: stats?.totalAgencies },
    { name: "Customers", value: stats?.totalCustomers },
  ];

  const donutChartData = [
    { name: "Agencies", value: stats?.totalAgencies },
    { name: "Customers", value: stats?.totalCustomers },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const DONUT_COLORS = ["#36A2EB", "#4BC0C0"];

  

  return (
    <div className="content-container">
      
      {/* Charts */}
      <div className="charts">
        {/* Donut Chart using Recharts */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <h3 className="chart-title">Total Revenue</h3>
            <div className="totalRevenue-container" style={{height: "100%", display: "flex", alignItems:"center", justifyContent: "center", fontSize:"3rem", fontWeight: "bolder"}}>
            {totalRevenue}<BiMoneyWithdraw fill="orange"/>
            </div>
            
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <h3>Top Agencies Orders & Rents</h3>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="black" name="Orders" />
              <Bar dataKey="rents" fill="orange" name="Rents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-container">
          <h3>Total Users: {stats?.totalAgencies + stats?.totalCustomers}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Agencies", value: stats?.totalAgencies || 0 },
                  { name: "Customers", value: stats?.totalCustomers || 0 },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={75}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell key="cell-0" fill="#cc88dd" />
                <Cell key="cell-1" fill="navy" />
              </Pie>
              <Tooltip />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <TopRentedCars/>
      
    </div>

  );
};

export default DashboardMain;