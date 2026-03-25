import React from "react";
import { Modal, Button } from "antd";
import moment from "moment";

const RentDetailsModal = ({ show, handleClose, rent }) => {
  if (!rent) return null;

  return (
    <Modal
      title="Rent Details"
      open={show}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Close
        </Button>,
      ]}
      centered
    >
      <div className="text-center mb-3">
        <img
          src={rent.carImage || "https://dummyimage.com/400x300/000/fff"}
          alt={`${rent.carBrand} ${rent.carModel}`}
          className="img-fluid rounded"
          style={{
            maxHeight: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        />
      </div>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Rent Details</h3>
      <div style={{ lineHeight: "1.8" }}>
        <p><strong>Car:</strong> {rent.carBrand} {rent.carModel}</p>
        <p><strong>Pickup Location:</strong> {rent.pickUpLocation}</p>
        <p><strong>Drop-Off Location:</strong> {rent.dropOffLocation}</p>
        <p><strong>Start Date:</strong> {moment(rent.startDate).format("YYYY-MM-DD")}</p>
        <p><strong>End Date:</strong> {moment(rent.endDate).format("YYYY-MM-DD")}</p>
        <p><strong>Status:</strong> {rent.rentStatus}</p>
        <p><strong>Total Cost:</strong> ${rent.totalPrice?.toFixed(2)}</p>
      </div>
    </Modal>
  );
};

export default RentDetailsModal;