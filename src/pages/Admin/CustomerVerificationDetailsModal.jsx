import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { Modal, Button } from 'antd';

const CustomerVerificationDetailsModal = ({ show, handleClose, verification, setVerifications }) => {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await axiosInstance.put(`/admin/verifications/customers/${verification.customerId}/status?status=${newStatus}`);

            // ✅ Instantly update UI
            setVerifications((prev) =>
                prev.map((v) =>
                    v.customerId === verification.customerId ? { ...v, verificationStatusDescription: newStatus } : v
                )
            );

            handleClose();
        } catch (error) {
            console.error('Error updating verification status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Verification Details for ${verification.username}`}
            open={show}
            onCancel={handleClose}
            footer={[
                <Button 
                    key="deny" 
                    onClick={() => handleStatusChange('DENIED')} 
                    disabled={verification.verificationStatusDescription === 'VERIFIED' || verification.verificationStatusDescription === 'DENIED'}>
                    DENIED
                </Button>,

                <Button 
                    key="reupload" 
                    onClick={() => handleStatusChange('REUPLOAD')} 
                    disabled={verification.verificationStatusDescription === 'VERIFIED' || verification.verificationStatusDescription === 'REUPLOAD'}>
                    REUPLOAD
                </Button>,

                <Button 
                    key="verified" 
                    onClick={() => handleStatusChange('VERIFIED')} 
                    disabled={verification.verificationStatusDescription === 'VERIFIED'}>
                    VERIFIED
                </Button>,

            ]}
            centered
        >
            <p><strong>ID:</strong> {verification.customerId}</p>
            <p><strong>Username:</strong> {verification.username}</p>
            <p><strong>Phone Number:</strong> {verification.phoneNumber}</p>
            <p><strong>City:</strong> {verification.city}</p>
            <p><strong>Aadhaar Card:</strong> {verification.nrc}</p>
            <p><strong>Verification Status:</strong> {verification.verificationStatusDescription}</p>

            {/* ✅ Display Images */}
            {verification.profileImage && (
                <div>
                    <p><strong>Profile Image:</strong></p>
                    <img src={`data:image/jpeg;base64,${verification.profileImage}`} alt="Profile" width="100" />
                </div>
            )}
            {verification.nrcPhotoFront && (
                <div>
                    <p><strong> Aadhaar Card   Front:</strong></p>
                    <img src={`data:image/jpeg;base64,${verification.nrcPhotoFront}`} alt="NRC Front" width="150" />
                </div>
            )}
            {verification.nrcPhotoBack && (
                <div>
                    <p><strong>Aadhaar Card Back:</strong></p>
                    <img src={`data:image/jpeg;base64,${verification.nrcPhotoBack}`} alt="NRC Back" width="150" />
                </div>
            )}
        </Modal>
    );
};

export default CustomerVerificationDetailsModal;
