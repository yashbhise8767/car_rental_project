import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CustomerVerificationForm = () => {
    const { authData } = useAuth();
    const [formData, setFormData] = useState({
        customerId: authData?.user?.id || '',
        nrc: '',
        nrcPhotoFront: null,
        nrcPhotoBack: null
    });
    const [verification, setVerification] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVerification = async () => {
            if (!authData?.user?.id) return;
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/customer/verification/${authData.user.id}`);
                setVerification(response.data);
                setIsVerified(response.data?.verificationStatus === 'VERIFIED');
            } catch (error) {
                console.error('Error fetching verification:', error);
                setError('Failed to load verification status');
            } finally {
                setLoading(false);
            }
        };
        fetchVerification();
    }, [authData?.user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isVerified) {
            alert('Cannot modify verified verification data.');
            return;
        }
        if (!formData.nrc || !formData.nrcPhotoFront || !formData.nrcPhotoBack) {
            alert('Please fill in all required fields');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const formDataToSend = new FormData();
            const customerId = Number(authData?.user?.id);
            if (isNaN(customerId)) {
                throw new Error('Invalid customer ID');
            }
            formDataToSend.append('customerId', customerId);
            formDataToSend.append('nrc', formData.nrc);
            formDataToSend.append('nrcPhotoFront', formData.nrcPhotoFront);
            formDataToSend.append('nrcPhotoBack', formData.nrcPhotoBack);
    
            console.log('Sending payload:', {
                customerId,
                nrc: formData.nrc,
                nrcPhotoFront: formData.nrcPhotoFront?.name,
                nrcPhotoBack: formData.nrcPhotoBack?.name,
            });
    
            const response = await axiosInstance.post('/customer/verification/upload', formDataToSend);
            setVerification(response.data.data); // Use 'data' field for CustomerVerification
            setIsVerified(response.data.data?.verificationStatus === 'VERIFIED');
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating verification:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update verification';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customer-verification-form">
            <h2>Customer Verification</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            {isVerified && <p className="alert alert-warning">Verification is already verified. Cannot modify data.</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nrc">Aadhaar Card Number:</label>
                    <input
                        id="nrc"
                        type="text"
                        name="nrc"
                        value={formData.nrc}
                        onChange={handleChange}
                        required
                        disabled={isVerified || loading}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nrcPhotoFront">Aadhaar Card Photo Front:</label>
                    <input
                        id="nrcPhotoFront"
                        type="file"
                        name="nrcPhotoFront"
                        onChange={(e) => handleFileChange(e, 'nrcPhotoFront')}
                        required
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nrcPhotoBack">Aadhaar Card Photo Back:</label>
                    <input
                        id="nrcPhotoBack"
                        type="file"
                        name="nrcPhotoBack"
                        onChange={(e) => handleFileChange(e, 'nrcPhotoBack')}
                        required
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <button type="submit" disabled={isVerified || loading} className="btn btn-primary">
                    {loading ? 'Uploading...' : 'Upload/Update Verification'}
                </button>
            </form>
        </div>
    );
};

export default CustomerVerificationForm;