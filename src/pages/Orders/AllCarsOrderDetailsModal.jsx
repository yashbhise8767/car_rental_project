import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';
import axiosInstance from '../../api/axios';
import {useAuth} from '../../context/AuthContext';

const AllCarsOrderDetailsModal = ({ show, handleClose, order, onApprove, onDeny, orderStatus }) => {
    const [carImage, setCarImage] = useState(null);
    const [carDetails, setCarDetails] = useState(null);
    const [error, setError] = useState(null);
    const [carLoading, setCarLoading] = useState(true);

    const { authData } = useAuth();

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
                const imageResponse = await axiosInstance.get(`/view/cars/${carId}/image`, {
                    responseType: 'blob',
                });
                setCarImage(URL.createObjectURL(imageResponse.data));
                console.log("Car image fetched");
    
                // Fetch car details
                const detailsResponse = await axiosInstance.get(`/view/cars/${carId}`);
                setCarDetails(detailsResponse.data);
            } catch (err) {
                console.error('Error fetching car details:', err);
                setError('Failed to fetch car details or image.');
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

    const numberOfDays = order.startDate && order.endDate 
        ? moment(order.endDate).diff(moment(order.startDate), 'days') + 1
        : 'N/A';

    const handleApprove = () => onApprove(order.id);
    const handleDeny = () => onDeny(order.id);

    return (
        <Modal
            title="Order Details"
            open={show}
            onCancel={handleClose}
            footer={[
                <Button key="deny" onClick={handleDeny} danger disabled={order.status == 'APPROVED' ? false : true}>
                    Deny
                </Button>,
                <Button key="approve" onClick={handleApprove} type="primary" disabled={order.status == 'PENDING' ? false : true}>
                    Approve
                </Button>,
            ]}
            centered
        >
            <h3>Car Details</h3>
            {carLoading ? (
                <p>Loading car details...</p>
            ) : (
                <>
                    {carImage ? (
                        <img
                            src={carImage}
                            alt="Car"
                            style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }}
                        />
                    ) : (
                        <p>Car image not available.</p>
                    )}
                    <p>Car Name: {carDetails?.brand} {carDetails?.model}</p>
                    <p>Color: {carDetails?.color}</p>
                    <p>License Plate: {carDetails?.licensePlate}</p>
                    <p>Price Per Day: ${carDetails?.pricePerDay}</p>
                    <p>Driver Fee Per Day: ${carDetails?.driverFeePerDay?.toFixed(2) || 'N/A'}</p>
                </>
            )}

            <h3>Order Details</h3>
            <p>Customer Name: {order?.customerName || 'N/A'}</p>
            <p>Customer Phone Number: {order.customerPhoneNumber || 'N/A'}</p>
            <p>Start Date: {moment(order.startDate).format('YYYY-MM-DD')}</p>
            <p>End Date: {moment(order.endDate).format('YYYY-MM-DD')}</p>
            <p>Pick-Up Location: {order.pickUpLocation || 'N/A'}</p>
            <p>Drop-Off Location: {order.dropOffLocation || 'N/A'}</p>
            <p>Number of Days: {numberOfDays}</p>
            <p>Total Price: ${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
            <p>Include Driver: {order.includeDriver ? 'Yes' : 'No'}</p>
        </Modal>
    );
};

export default AllCarsOrderDetailsModal;
