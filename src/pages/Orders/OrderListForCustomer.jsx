import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import OrderDetailsModalForCustomer from "./OrderDetailsModalForCustomer";
import "./OrderListForCustomer.css";

const OrderListForCustomer = () => {
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { authData } = useAuth();

  const fetchRentalOrders = async () => {
    try {
      const rolePath = authData.role.toLowerCase();
      const response = await axiosInstance.get(
        `/rent/orders/${rolePath === "agency" ? "agency" : "customer"}`
      );
      console.log("Fetched Rental Orders:", response.data);
      setRentalOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalOrders();
  }, [authData]);

  const handleOrderClick = (order) => {
    console.log("Selected Order:", order);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCancelOrder = async (orderId) => {
    setModalLoading(true);
    try {
      await axiosInstance.put(`/rent/orders/${orderId}/status?status=CANCEL`);
      fetchRentalOrders();
      handleCloseModal();
    } catch (err) {
      console.error("Error canceling order:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Function to determine the background color based on the order status
  const getStatusStyle = (status) => {
    switch (status) {
      case "CANCEL":
        return { backgroundColor: "#f8d7da", color: "#721c24" }; // Red for Cancelled
      case "PENDING":
        return { backgroundColor: "#fff3cd", color: "#856404" }; // Yellow for Pending
      case "APPROVED":
        return { backgroundColor: "#d4edda", color: "#155724" }; // Green for Approved
      case "DENIED":
        return { backgroundColor: "#f5c6cb", color: "#721c24" }; // Light Red for Denied
      default:
        return { backgroundColor: "#e9ecef", color: "#333" }; // Grey for Unknown
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error fetching rental orders: {error?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="customer-order-list">
      <h2 className="customer-order-list-title">Rental Orders</h2>
      {rentalOrders.length === 0 ? (
        <p>No rental orders found.</p>
      ) : (
        <>
          {/* Traditional Table for Desktop */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Car</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Pick-Up Location</th>
                  <th>Drop-Off Location</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentalOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.carBrand} {order.carModel}
                    </td>
                    <td>
                      {order.startDate
                        ? moment(order.startDate).format("YYYY-MM-DD")
                        : "N/A"}
                    </td>
                    <td>
                      {order.endDate
                        ? moment(order.endDate).format("YYYY-MM-DD")
                        : "N/A"}
                    </td>
                    <td>{order.pickUpLocation || "N/A"}</td>
                    <td>{order.dropOffLocation || "N/A"}</td>
                    <td>
                      {order.totalPrice
                        ? `$${order.totalPrice.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td style={getStatusStyle(order.status)}>
                      {order.status || "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOrderClick(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile-Friendly Single-Line Layout */}
          <div className="mobile-order-list">
            {rentalOrders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-field">
                  ID: <span>{order.id}</span>
                </div>
                <div className="order-field">
                  Car:{" "}
                  <span>
                    {order.carBrand} {order.carModel}
                  </span>
                </div>
                <div className="order-field">
                  Start Date:{" "}
                  <span>
                    {order.startDate
                      ? moment(order.startDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </span>
                </div>
                <div className="order-field">
                  End Date:{" "}
                  <span>
                    {order.endDate
                      ? moment(order.endDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </span>
                </div>
                <div className="order-field">
                  Pick-Up Location: <span>{order.pickUpLocation || "N/A"}</span>
                </div>
                <div className="order-field">
                  Drop-Off Location:{" "}
                  <span>{order.dropOffLocation || "N/A"}</span>
                </div>
                <div className="order-field">
                  Total Price:{" "}
                  <span>
                    {order.totalPrice
                      ? `$${order.totalPrice.toFixed(2)}`
                      : "N/A"}
                  </span>
                </div>
                <div
                  className="order-field status-field"
                  style={getStatusStyle(order.status)}
                >
                  Status: {order.status || "N/A"}
                </div>
                <div className="order-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOrderClick(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <OrderDetailsModalForCustomer
        show={showModal}
        handleClose={handleCloseModal}
        order={selectedOrder}
        onCancel={handleCancelOrder}
      />
    </div>
  );
};

export default OrderListForCustomer;
