import React from "react";
import { Modal, Button } from "antd";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { MdVerified } from "react-icons/md";

const AllCarsRentDetailsModal = ({ show, handleClose, rent, onMarkOngoing, onMarkCompleted }) => {
  const { authData } = useAuth();

  if (!rent) return null;
  console.log(rent);

  return (
    <Modal
      title="Rent Details"
      open={show}
      onCancel={handleClose}
      footer={[
        authData.role === "Agency" ? (
          <>
            <Button
              key="ongoing"
              onClick={() => onMarkOngoing(rent.id)}
              type="primary"
              disabled={rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"}
            >
              Mark as Ongoing
            </Button>
            <Button
              key="complete"
              onClick={() => onMarkCompleted(rent.id)}
              danger
              disabled={rent.rentStatus === "COMPLETED"}
            >
              Mark as Completed
            </Button>
          </>
        ) : (
          <Button key="close" onClick={handleClose}>
            Close
          </Button>
        ),
      ]}
      centered
    >
      <div className="text-center mb-3">
        <img
          src={rent.carImage || "https://dummyimage.com/400x300/000/fff"}
          alt={`${rent.carBrand} ${rent.carModel}`}
          className="img-fluid rounded"
          style={{ maxHeight: "200px", objectFit: "cover", borderRadius: "10px" }}
        />
      </div>

      <h3>Rent Details</h3>
      <p>Car: {rent.carBrand} {rent.carModel}</p>
      <p>Customer ID: {rent.customerId}</p>
      <p>Customer Name: {rent.customerName || "Unknown"} {rent.customerVerificationStatus == "VERIFIED" ? <MdVerified style={{color:'navy'}}/> : ""}</p>
      <p>Pickup Location: {rent.pickUpLocation}</p>
      <p>Drop-Off Location: {rent.dropOffLocation}</p>
      <p>Customer Phone Number: {rent.customerPhoneNumber}</p>
      <p>Start Date: {moment(rent.startDate).format("YYYY-MM-DD")}</p>
      <p>End Date: {moment(rent.endDate).format("YYYY-MM-DD")}</p>
      <p>Status: {rent.rentStatus}</p>
    </Modal>
  );
};

export default AllCarsRentDetailsModal;
