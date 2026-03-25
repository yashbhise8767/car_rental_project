import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import CarOrderDetailsModal from "./CarOrderDetailsModal";

import BookingCalendar from "../../components/BookingCalendar";
import { MdVerified } from "react-icons/md";

const CarOrderList = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [car, setCar] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const { authData } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosInstance.get(`/view/cars/${id}`);
        setCar(response.data);
        const imageResponse = await axiosInstance.get(`/view/cars/${id}/image`, {
          responseType: "blob",
        });
        setCarImage(URL.createObjectURL(imageResponse.data));
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("Failed to fetch car details.");
      }
    };

    const fetchUnavailableDates = async () => {
      try {
        const response = await axiosInstance.get(`/api/rents/${id}/unavailable-dates`);
        setUnavailableDates(response.data.map(date => new Date(date)));
      } catch (err) {
        console.error("Error fetching unavailable dates:", err);
        setError("Failed to fetch unavailable dates.");
      }
    };

    fetchCarDetails();
    fetchUnavailableDates();
  }, [id]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersEndpoint =
          authData.role === "Agency" ? `/rent/orders/${id}/orders` : `/rent/orders/customer`;
        const response = await axiosInstance.get(ordersEndpoint);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id, authData]);
  
    // Function to determine the background color based on the order status
    const getStatusStyle = (status) => {
      switch (status) {
          case 'CANCEL':
              return { backgroundColor: '#f8d7da', color: '#721c24' }; // Red for Cancelled
          case 'PENDING':
              return { backgroundColor: '#fff3cd', color: '#856404' }; // Yellow for Pending
          case 'APPROVED':
              return { backgroundColor: '#d4edda', color: '#155724' }; // Green for Approved
          case 'DENIED':
              return { backgroundColor: '#f5c6cb', color: '#721c24' }; // Light Red for Denied
          default:
              return { backgroundColor: '#e9ecef', color: '#333' }; // Grey for Unknown
      }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleCancelOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/rent/orders/${orderId}/status?status=CANCEL`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCEL" } : order
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const handleStatusChange = async (orderId, status) =>{
    try {
      await axiosInstance.put(`/rent/orders/${orderId}/status?status=${status}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: status } : order
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  return (
    <div className="container my-4">
      <style>
        {`
          /* General Styles */
          body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff; /* White background */
            color: #333; /* Dark gray text */
          }
          h1 {
            font-weight: bold;
            color: #2c3e50; /* Dark blue heading */
            text-align: center;
            margin-bottom: 2rem;
          }
          .container {
            max-width: 1200px;
            margin: auto;
            padding: 20px;
            background: #ffffff; /* White container */
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          /* Image Styles */
          .car-image {
            display: block;
            margin: 0 auto;
            max-height: 300px;
            object-fit: cover;
            border-radius: 10px;
          }
          /* Table Styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd; /* Light gray borders */
            color: #333; /* Dark gray text */
          }
          th {
            background-color: #f8f9fa; /* Light gray header background */
            color: #2c3e50; /* Dark blue text for headers */
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9; /* Slightly lighter row background */
          }
          tr:hover {
            background-color: #f1f1f1; /* Light gray hover effect */
          }
          /* Button Styles */
          .btn {
            margin-right: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease-in-out;
          }
          /* Responsive Design */
          @media (max-width: 768px) {
            table {
              font-size: 14px;
            }
            .btn {
              width: 100%;
              margin-bottom: 10px;
            }
          }
        `}
      </style>

      {/* ✅ Display Car Image */}
      <div className="text-center">
        <img
          src={carImage || "https://dummyimage.com/400x300/000/fff"} // Placeholder if no image
          alt={`${car?.brand} ${car?.model}`}
          className="car-image"
        />
      </div>
      <div className="col-md-6">
          <BookingCalendar rentedDates={unavailableDates}  />
      </div>

      {/* ✅ Display Car Brand, Model, and ID in Title */}
      <h1>
        Orders Management for {car?.brand || "Car Brand"} {car?.model || "Car Model"} (ID: {id})
      </h1>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>PickUp Location</th>
            <th>DropOff Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id || `order-${index}`}>
              <td>{order.id || "N/A"}</td>
              <td>{order.customerName || "N/A"} {order?.customerVerificationStatus == "VERIFIED" ? <MdVerified style={{color:'navy'}}/> : ''}</td>
              <td>{order.startDate || "N/A"}</td>
              <td>{order.endDate || "N/A"}</td>
              <td>{order.pickUpLocation || "N/A"}</td>
              <td>{order.dropOffLocation || "N/A"}</td>
              <td style={getStatusStyle(order.status)}>{order.status || "N/A"}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleOrderClick(order)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CarOrderDetailsModal
        visible={showModal}
        onClose={handleCloseModal}
        order={selectedOrder}
        onApprove={(orderId) => handleStatusChange(orderId, "APPROVED")}
        onDeny={(orderId) => handleStatusChange(orderId, "DENIED")}
        onCancel={handleCancelOrder}
      />

      <button className="btn btn-secondary mt-4" onClick={() => navigate(`/`)}>
        Back
      </button>
    </div>
  );
};

export default CarOrderList;