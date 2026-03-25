import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Table, Button, Select, Alert } from 'antd';
import AgencyVerificationDetailsModal from './AgencyVerificationDetailsModal';

const { Option } = Select;

const AgencyVerificationList = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    useEffect(() => {
        fetchVerifications();
    }, [currentPage, selectedStatus]);

    const fetchVerifications = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const params = { page: currentPage, size: 10 };
            if (selectedStatus !== 'ALL') {
                params.status = selectedStatus;
            }
            const response = await axiosInstance.get('/admin/verifications/agencies/sort', { params });
            if (response.data.success) {
                const pageData = response.data.data || {};
                setVerifications(pageData.content || []);
                setTotalItems(pageData.totalElements || 0);
                setSuccess(response.data.message);
            } else {
                setError(response.data.message || 'Failed to fetch agency verifications');
                setVerifications([]);
            }
        } catch (error) {
            console.error('Error fetching verifications:', error);
            setError(error.response?.data?.message || 'Failed to fetch agency verifications');
            setVerifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1); // Adjust for 0-based indexing
    };

    return (
        <div className="agency-verification-list">
            <h1>Agency Verifications</h1>

            {/* Alerts */}
            {loading && (
                <Alert
                    message="Loading..."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                    className="custom-alert"
                />
            )}
            {/* {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 20 }}
                    className="custom-alert"
                />
            )}
            {success && !loading && (
                <Alert
                    message={success}
                    type="success"
                    showIcon
                    style={{ marginBottom: 20 }}
                    className="custom-alert"
                />
            )} */}

            {/* Status Filter */}
            <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Filter by Status"
                style={{
                    width: 200,
                    marginBottom: 20,
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    float: 'right'
                }}
                className="status-select"
            >
                <Option value="ALL">All Statuses</Option>
                <Option value="PENDING">Pending</Option>
                <Option value="VERIFIED">Verified</Option>
                <Option value="REUPLOAD">Reupload</Option>
                <Option value="DENIED">Denied</Option>
            </Select>

            {/* Table */}
            <Table
                columns={[
                    { title: 'ID', dataIndex: 'agencyId', key: 'agencyId' },
                    { title: 'Username', dataIndex: 'username', key: 'username' },
                    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
                    { title: 'City', dataIndex: 'city', key: 'city' },
                    {
                        title: 'Status',
                        dataIndex: 'verificationStatus',
                        key: 'verificationStatus',
                    },
                    {
                        title: 'Actions',
                        render: (_, record) => (
                            <Button
                                onClick={() => {
                                    setSelectedVerification(record);
                                    setShowModal(true);
                                }}
                                disabled={loading}
                                className="action-button"
                                aria-label="View Details"
                            >
                                View Details
                            </Button>
                        ),
                    },
                ]}
                dataSource={verifications}
                loading={loading}
                pagination={{
                    current: currentPage + 1,
                    total: totalItems,
                    pageSize: 10,
                    onChange: handlePageChange,
                    className: 'centered-pagination',
                    style: {display:"flex", justifyContent:"center", alignItems:"center"}
                }}
                rowKey="agencyId"
                className="verification-table"
            />

            {/* Modal */}
            {selectedVerification && (
                <AgencyVerificationDetailsModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    verification={selectedVerification}
                    refreshList={fetchVerifications}
                />
            )}

            {/* Styles */}
            <style jsx>{`
                .agency-verification-list {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 30px;
                    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                h1 {
                    color: #1a3c6d;
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Alerts */
                :global(.custom-alert.ant-alert) {
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                /* Table */
                :global(.verification-table.ant-table) {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                :global(.verification-table .ant-table-thead > tr > th) {
                    background: linear-gradient(to right, #1a3c6d, #2e5b9e);
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 13px;
                    padding: 12px 16px;
                    border-bottom: none;
                }

                :global(.verification-table .ant-table-tbody > tr > td) {
                    padding: 14px 16px;
                    border-bottom: 1px solid #e8ecef;
                    color: #333;
                    font-size: 14px;
                }

                :global(.verification-table .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td) {
                    background: #f8fafc;
                    transition: background 0.2s ease;
                }

                /* Buttons */
                :global(.action-button.ant-btn) {
                    background: linear-gradient(to right, #1890ff, #40c4ff);
                    border: none;
                    color: white;
                    border-radius: 6px;
                    padding: 6px 16px;
                    font-weight: 500;
                    text-transform: uppercase;
                    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
                    transition: all 0.3s ease;
                }

                :global(.action-button.ant-btn:hover) {
                    background: linear-gradient(to right, #40c4ff, #1890ff);
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5);
                    color: white;
                }

                /* Pagination */
                :global(.centered-pagination.ant-pagination) {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                :global(.centered-pagination .ant-pagination-item) {
                    border-radius: 50%;
                    border: 1px solid #d9e0e7;
                    transition: all 0.3s ease;
                }

                :global(.centered-pagination .ant-pagination-item:hover) {
                    border-color: #1890ff;
                }

                :global(.centered-pagination .ant-pagination-item-active) {
                    background: linear-gradient(to right, #1890ff, #40c4ff);
                    border-color: #1890ff;
                }

                :global(.centered-pagination .ant-pagination-item-active a) {
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default AgencyVerificationList;