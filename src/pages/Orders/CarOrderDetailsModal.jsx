import React from "react";
import { Modal, Button } from "antd";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

const CarOrderDetailsModal = ({ visible, onClose, order, onApprove, onDeny, onCancel }) => {
  const { authData } = useAuth(); // Get user role

  if (!order) return null;

  return (
    <Modal
      title="Order Details"
      open={visible}
      onCancel={onClose}
      footer={[
        authData.role === "Customer" ? (
          order.status === "PENDING" ? (
            <>
              <Button key="cancel" onClick={() => onCancel(order.id)}>
                Cancel Order
              </Button>
              <Button key="close" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <Button key="close" onClick={onClose}>
              Close
            </Button>
          )
        ) : (
          <>
            <Button key="deny" onClick={() => onDeny(order.id)} danger disabled={order.status == 'APPROVED' ? false : true}>
              Deny
            </Button>
            <Button key="approve" onClick={() => onApprove(order.id)} type="primary" disabled={order.status == 'PENDING' ? false : true}>
              Approve
            </Button>
          </>
        ),
      ]}
      centered
    >
      <h3>Order Details</h3>
      <p>Customer Name: {order.customerName || "N/A"}</p>
      <p>Customer Phone Number: {order.customerPhoneNumber || "N/A"}</p>
      <p>Start Date: {moment(order.startDate).format("YYYY-MM-DD")}</p>
      <p>End Date: {moment(order.endDate).format("YYYY-MM-DD")}</p>
      <p>Pick-Up Location: {order.pickUpLocation || "N/A"}</p>
      <p>Drop-Off Location: {order.dropOffLocation || "N/A"}</p>
      <p>Total Price: ${order.totalPrice ? order.totalPrice.toFixed(2) : "N/A"}</p>
      <p>Status: {order.status}</p>
    </Modal>
  );
};

export default CarOrderDetailsModal;
