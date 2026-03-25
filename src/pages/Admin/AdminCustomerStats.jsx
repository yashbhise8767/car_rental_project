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

const AdminCustomerStats = () => {
    const [customerStats, setCustomerStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerStats();
    }, []);

    const fetchCustomerStats = async () => {
        try {
            const response = await axiosInstance.get("/admin/customer/stats");
            const filteredStats = response.data.filter(customer => customer.customerName); // Exclude agencies without names
            setCustomerStats(filteredStats);
        } catch (error) {
            console.error("Error fetching customer stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return <div style={{ textAlign: "center", padding: "20px", fontSize: "18px", fontWeight: "bold", color: "#666" }}>Loading customer stats...</div>;
    if (customerStats.length === 0)
        return <div style={{ textAlign: "center", padding: "20px", fontSize: "18px", fontWeight: "bold", color: "red" }}>No customer data available.</div>;

    return (
        <div style={{ padding: "20px", background: "linear-gradient(to bottom, #ffffff, #f4f4f4)", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: "20px" }}>📊 Customer Statistics</h2>

            {/* Table View */}
            <div style={{ overflowX: "auto", borderRadius: "10px", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "10px" }}>
                    <thead>
                        <tr style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)", color: "#fff", textAlign: "left" }}>
                            <th style={{ padding: "12px", fontSize: "16px" }}>Customer ID</th>
                            <th style={{ padding: "12px", fontSize: "16px" }}>Customer Name</th>
                            <th style={{ padding: "12px", fontSize: "16px", textAlign: "center" }}>Total Orders</th>
                            <th style={{ padding: "12px", fontSize: "16px", textAlign: "center" }}>Total Rents</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerStats.map((customer, index) => (
                            <tr key={customer.customerId} style={{
                                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#eaeaea",
                                transition: "background 0.2s",
                                cursor: "pointer"
                            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#ddd"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#eaeaea"}
                            >
                                <td style={{ padding: "12px" }}>{customer.customerId}</td>
                                <td style={{ padding: "12px", fontWeight: "bold" }}>{customer.customerName}</td>
                                <td style={{ padding: "12px", textAlign: "center", color: "#4f46e5", fontWeight: "bold" }}>{customer.totalOrders}</td>
                                <td style={{ padding: "12px", textAlign: "center", color: "#22c55e", fontWeight: "bold" }}>{customer.totalRents}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bar Chart */}
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#444", textAlign: "center", marginTop: "20px" }}>📈 Orders & Rents Per Customer</h3>
            <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#fff", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={customerStats} style={{ margin: "0 auto" }}>
                        <XAxis dataKey="customerName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalOrders" fill="#6366F1" name="Total Orders" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="totalRents" fill="#22C55E" name="Total Rents" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminCustomerStats;