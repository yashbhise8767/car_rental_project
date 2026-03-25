import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import moment from "moment";
import axiosInstance from "../../api/axios";
import "./OrderDetailsModalForCustomer.css";

const OrderDetailsModalForCustomer = ({
  show,
  handleClose,
  order,
  onCancel,
}) => {
  const [carImage, setCarImage] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [error, setError] = useState(null);
  const [carLoading, setCarLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!order || !order.carId) {
        console.log("There is no car in the modal", order);
        return;
      }

      let carId = order.carId; // Handle cases where `order.car` is an object or an ID
      setCarLoading(true);
      try {
        // Fetch car image
        const imageResponse = await axiosInstance.get(
          `/view/cars/${carId}/image`,
          {
            responseType: "blob",
          }
        );
        setCarImage(URL.createObjectURL(imageResponse.data));
        console.log("Car image fetched");

        // Fetch car details
        const detailsResponse = await axiosInstance.get(`/view/cars/${carId}`);
        setCarDetails(detailsResponse.data);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("Failed to fetch car details or image.");
      } finally {
        setCarLoading(false);
      }
    };

    fetchCar();
  }, [order]);

  if (!order) {
    return (
      <Modal
        title="Order Details"
        open={show}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
        centered
      >
        <p>Error: Order details are incomplete.</p>
      </Modal>
    );
  }

  const numberOfDays =
    order.startDate && order.endDate
      ? moment(order.endDate).diff(moment(order.startDate), "days") + 1
      : "N/A";

  const handleCancel = () => onCancel(order.id);

  return (
    <div>
      <Modal
        title="Order Details"
        open={show}
        onCancel={handleClose}
        footer={[
          <Button
            key="deny"
            onClick={handleCancel}
            danger
            disabled={order.status == "PENDING" ? false : true}
          >
            Cancel the order
          </Button>,
        ]}
        centered
      >
        <div className="order-details-container">
          <h3>Car Details</h3>
          {carLoading ? (
            <p>Loading car details...</p>
          ) : (
            <>
              {carImage ? (
                <img
                  src={carImage}
                  alt="Car"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    marginBottom: "20px",
                  }}
                />
              ) : (
                <p>Car image not available.</p>
              )}
              <p>
                Car Name:{" "}
                <span>
                  {carDetails?.brand} {carDetails?.model}
                </span>
              </p>
              <p>
                Color: <span>{carDetails?.color}</span>
              </p>
              <p>
                License Plate: <span>{carDetails?.licensePlate}</span>
              </p>
              <p>
                Price Per Day: <span>${carDetails?.pricePerDay}</span>
              </p>
              <p>
                Driver Fee Per Day:
                <span>${carDetails?.driverFeePerDay?.toFixed(2) || "N/A"}</span>
              </p>
            </>
          )}

          <h1>Order Details</h1>
          <p>
            Customer Name: <span>{order.customerName || "N/A"}</span>
          </p>
          <p>
            Customer Phone Number:{" "}
            <span>{order.customerPhoneNumber || "N/A"}</span>
          </p>
          <p>
            Start Date:{" "}
            <span>{moment(order.startDate).format("YYYY-MM-DD")}</span>
          </p>
          <p>
            End Date: <span>{moment(order.endDate).format("YYYY-MM-DD")}</span>
          </p>
          <p>
            Pick-Up Location: <span>{order.pickUpLocation || "N/A"}</span>
          </p>
          <p>
            Drop-Off Location: <span>{order.dropOffLocation || "N/A"}</span>
          </p>
          <p>
            Number of Days: <span>{numberOfDays}</span>
          </p>
          <p>
            Total Price:
            <span>
              ${order.totalPrice ? order.totalPrice.toFixed(2) : "N/A"}
            </span>
          </p>
          <p>
            Include Driver: <span>{order.includeDriver ? "Yes" : "No"}</span>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsModalForCustomer;
