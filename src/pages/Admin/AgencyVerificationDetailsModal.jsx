import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { Modal, Button, Alert } from 'antd';

const AgencyVerificationDetailsModal = ({ show, handleClose, verification, refreshList }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleStatusChange = async (newStatus) => {
        if (verification.verificationStatus === 'VERIFIED') {
            setError('Cannot modify verified verification status.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axiosInstance.put(
                `/admin/verifications/agencies/${verification.agencyId}/status?status=${newStatus}`
            );
            if (response.data.success) {
                setSuccess(response.data.message);
                refreshList(); // Refresh parent list
                setTimeout(handleClose, 1000); // Close after brief delay to show success
            } else {
                setError(response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating verification status:', error);
            setError(error.response?.data?.message || 'Failed to update verification status');
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
                    disabled={verification.verificationStatus === 'VERIFIED' || loading}
                    loading={loading}
                >
                    DENIED
                </Button>,
                <Button
                    key="reupload"
                    onClick={() => handleStatusChange('REUPLOAD')}
                    disabled={verification.verificationStatus === 'VERIFIED' || loading}
                    loading={loading}
                >
                    REUPLOAD
                </Button>,
                <Button
                    key="verified"
                    onClick={() => handleStatusChange('VERIFIED')}
                    disabled={verification.verificationStatus === 'VERIFIED' || loading}
                    loading={loading}
                    type="primary"
                >
                    VERIFIED
                </Button>,
            ]}
            centered
        >
            {loading && <Alert message="Processing..." type="info" showIcon style={{ marginBottom: 16 }} />}
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
            {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}
            <p><strong>ID:</strong> {verification.agencyId}</p>
            <p><strong>Username:</strong> {verification.username}</p>
            <p><strong>Phone Number:</strong> {verification.phoneNumber}</p>
            <p><strong>City:</strong> {verification.city}</p>
            <p><strong>Aadhaar Card:</strong> {verification.nrc}</p>
            <p><strong>Verification Status:</strong> {verification.verificationStatusDescription}</p>

            {/* Display Images - Match Customer Modal */}
            {verification.profileImage && (
                <div>
                    <p><strong>Profile Image:</strong></p>
                    <img
                        src={`data:image/jpeg;base64,${verification.profileImage}`}
                        alt="Profile"
                        width="100"
                    />
                </div>
            )}
            {verification.nrcPhotoFront && (
                <div>
                    <p><strong>Aadhaar Card Front:</strong></p>
                    <img
                        src={`data:image/jpeg;base64,${verification.nrcPhotoFront}`}
                        alt="NRC Front"
                        width="150"
                    />
                </div>
            )}
            {verification.nrcPhotoBack && (
                <div>
                    <p><strong>Aadhaar Card Back:</strong></p>
                    <img
                        src={`data:image/jpeg;base64,${verification.nrcPhotoBack}`}
                        alt="NRC Back"
                        width="150"
                    />
                </div>
            )}
            {verification.agencyLicenseFront && (
                <div>
                    <p><strong>Agency License Front:</strong></p>
                    <img
                        src={`data:image/jpeg;base64,${verification.agencyLicenseFront}`}
                        alt="License Front"
                        width="150"
                    />
                </div>
            )}
            {verification.agencyLicenseBack && (
                <div>
                    <p><strong>Agency License Back:</strong></p>
                    <img
                        src={`data:image/jpeg;base64,${verification.agencyLicenseBack}`}
                        alt="License Back"
                        width="150"
                    />
                </div>
            )}
        </Modal>
    );
};

export default AgencyVerificationDetailsModal;