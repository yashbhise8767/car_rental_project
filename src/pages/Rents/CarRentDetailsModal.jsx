import React from "react";
import { Modal, Button } from "antd";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { MdVerified } from "react-icons/md";

const CarRentDetailsModal = ({ visible, onClose, rent, onOngoing, onComplete }) => {
  const { authData } = useAuth();

  if (!rent) return null;

  return (
    <Modal
      title="Rent Details"
      open={visible}
      onCancel={onClose}
      footer={[
        authData.role === "Agency" ? (
          <>
            <Button
              key="ongoing"
              onClick={() => onOngoing(rent.id)}
              type="primary"
              disabled={rent.rentStatus === "ONGOING" || rent.rentStatus === "COMPLETED"}
            >
              Mark as Ongoing
            </Button>
            <Button
              key="complete"
              onClick={() => onComplete(rent.id)}
              danger
              disabled={rent.rentStatus === "COMPLETED"}
            >
              Mark as Completed
            </Button>
          </>
        ) : (
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ),
      ]}
      centered
    >
      <h3>Rent Details</h3>
      <p>Customer Name: {rent.customerName || "Unknown"} {rent.customerVerificationStatus == "VERIFIED" ? <MdVerified style={{color:'navy'}}/> : ""}</p>
      <p>Start Date: {moment(rent.startDate).format("YYYY-MM-DD")}</p>
      <p>End Date: {moment(rent.endDate).format("YYYY-MM-DD")}</p>
      <p>Status: {rent.rentStatus}</p>
    </Modal>
  );
};

export default CarRentDetailsModal;
