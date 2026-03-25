import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import AllCarsOrderDetailsModal from "./AllCarsOrderDetailsModal";
import { MdVerified } from "react-icons/md";
import "./AllCarsOrderList.css";

const AllCarsOrderList = () => {
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

  const handleApproveOrder = async (orderid) => {
    setModalLoading(true);
    try {
      console.log("Sending approve status to the server for id" + orderid);
      await axiosInstance.put(`/rent/orders/${orderid}/status?status=APPROVED`);
      fetchRentalOrders();
      handleCloseModal();
    } catch (err) {
      console.error("Error approving order:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDenyOrder = async (orderId) => {
    setModalLoading(true);
    try {
      await axiosInstance.put(`/rent/orders/${orderId}/status?status=DENIED`);
      fetchRentalOrders();
      handleCloseModal();
    } catch (err) {
      console.error("Error denying order:", err);
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
    <div className="agency-all-cars-orders">
      <h2 className="agency-all-cars-title" style={{ textAlign: "center" }}>
        Rental Orders For All Of Your Cars
      </h2>
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
                  <th>Name</th>
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
                      {order.customerName || "N/A"}{" "}
                      {order?.customerVerificationStatus == "VERIFIED" ? (
                        <MdVerified style={{ color: "navy" }} />
                      ) : (
                        ""
                      )}
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
                <div className="order-field">ID: {order.id}</div>
                <div className="order-field">
                  Car: {order.carBrand} {order.carModel}
                </div>
                <div className="order-field">
                  Name: {order.customerName || "N/A"}{" "}
                  {order?.customerVerificationStatus == "VERIFIED" ? (
                    <MdVerified style={{ color: "navy" }} />
                  ) : (
                    ""
                  )}
                </div>
                <div className="order-field">
                  Start Date:{" "}
                  {order.startDate
                    ? moment(order.startDate).format("YYYY-MM-DD")
                    : "N/A"}
                </div>
                <div className="order-field">
                  End Date:{" "}
                  {order.endDate
                    ? moment(order.endDate).format("YYYY-MM-DD")
                    : "N/A"}
                </div>
                <div className="order-field">
                  Pick-Up Location: {order.pickUpLocation || "N/A"}
                </div>
                <div className="order-field">
                  Drop-Off Location: {order.dropOffLocation || "N/A"}
                </div>
                <div className="order-field">
                  Total Price:{" "}
                  {order.totalPrice ? `$${order.totalPrice.toFixed(2)}` : "N/A"}
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
      <AllCarsOrderDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        order={selectedOrder}
        onApprove={handleApproveOrder}
        onDeny={handleDenyOrder}
      />
    </div>
  );
};

export default AllCarsOrderList;
