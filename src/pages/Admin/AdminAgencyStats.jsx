import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminAgencyStats = () => {
  const [agencyStats, setAgencyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null); // Track selected agency
  const [isLoadingChart, setIsLoadingChart] = useState(false); // Track chart loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgencyStats();
  }, []);

  const fetchAgencyStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/stats");
      const filteredStats = response.data.filter((agency) => agency.agencyName); // Exclude agencies without names
      setAgencyStats(filteredStats);
    } catch (error) {
      console.error("Error fetching agency stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ marginTop: "10px" }}>Loading agency stats...</p>
      </div>
    );

  if (agencyStats.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "red",
        }}
      >
        No agency data available.
      </div>
    );

  // Handle row click to select an agency
  const handleRowClick = (agency) => {
    setIsLoadingChart(true); // Start loading the chart
    setSelectedAgency(null); // Reset selected agency

    // Simulate a delay for loading the chart
    setTimeout(() => {
      setSelectedAgency(agency);
      setIsLoadingChart(false); // Stop loading the chart
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(to bottom, #ffffff, #f4f4f4)",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        📊 Agency Statistics
      </h2>

      {/* Table View */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "10px",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(to right, #4f46e5, #9333ea)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px", fontSize: "16px" }}>Agency ID</th>
              <th style={{ padding: "12px", fontSize: "16px" }}>Agency Name</th>
              <th
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                Total Orders
              </th>
              <th
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                Total Rents
              </th>
            </tr>
          </thead>
          <tbody>
            {agencyStats.map((agency, index) => (
              <tr
                key={agency.agencyId}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#eaeaea",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(agency)} // Set selected agency on click
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ddd")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#f9f9f9" : "#eaeaea")
                }
              >
                <td style={{ padding: "12px" }}>{agency.agencyId}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>
                  {agency.agencyName}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: "#4f46e5",
                    fontWeight: "bold",
                  }}
                >
                  {agency.totalOrders}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  {agency.totalRents}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart - Display only if an agency is selected */}
      {selectedAgency || isLoadingChart ? (
        <>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#444",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            📈 Orders & Rents for{" "}
            {isLoadingChart ? "Loading..." : selectedAgency.agencyName}
          </h3>
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#fff",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            {isLoadingChart ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #3498db",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <p style={{ marginTop: "10px" }}>Loading chart...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={[selectedAgency]} // Pass only the selected agency's data
                  style={{ margin: "0 auto" }}
                >
                  <XAxis dataKey="agencyName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="totalOrders"
                    fill="#6366F1"
                    name="Total Orders"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="totalRents"
                    fill="#22C55E"
                    name="Total Rents"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminAgencyStats;
