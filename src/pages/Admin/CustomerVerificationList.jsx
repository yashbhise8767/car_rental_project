import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Table, Button, Select } from 'antd';
import CustomerVerificationDetailsModal from './CustomerVerificationDetailsModal';

const { Option } = Select;

const CustomerVerificationList = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    useEffect(() => {
        fetchVerifications();
    }, [currentPage, selectedStatus]);

    const fetchVerifications = async () => {
        try {
            const response = await axiosInstance.get(`/admin/verifications/customers/sort`, {
                params: { page: currentPage, status: selectedStatus }
            });
            setVerifications(response.data);
            setTotalPages(parseInt(response.headers['x-total-count'], 10));
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        setCurrentPage(0);
    };

    const columns = [
        { title: 'ID', dataIndex: 'customerId', key: 'customerId' },
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Aadhaar Card', dataIndex: 'nrc', key: 'nrc' },
        { title: 'Verification Status', dataIndex: 'verificationStatusDescription', key: 'verificationStatusDescription' },
        {
            title: 'Profile Image',
            dataIndex: 'profileImage',
            key: 'profileImage',
            render: (profileImage) =>
                profileImage ? (
                    <img src={`data:image/jpeg;base64,${profileImage}`} alt="Profile" width="50" />
                ) : "N/A",
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => {
                    setSelectedVerification(record);
                    setShowModal(true);
                }}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div className="customer-verification-list">
            <div className="header-section">
                <h1>Customer Verifications</h1>
                <Select
                    defaultValue="ALL"
                    onChange={handleStatusChange}
                    className="status-select"
                >
                    <Option value="ALL">All</Option>
                    <Option value="VERIFIED">Verified</Option>
                    <Option value="REUPLOAD">Reupload</Option>
                    <Option value="DENIED">Denied</Option>
                    <Option value="PENDING">Pending</Option>
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={verifications}
                loading={loading}
                rowKey="customerId"
                pagination={{
                    current: currentPage + 1,
                    total: totalPages * 10, // Ant Design pagination uses total items (not pages), adjust accordingly
                    onChange: handlePageChange,
                    className: "centered-pagination",
                    style:{display: "center", justifyContent:"center", alignItems: "center"}
                }}
                className="verification-table"
            />

            {selectedVerification && (
                <CustomerVerificationDetailsModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    verification={selectedVerification}
                    setVerifications={setVerifications}
                />
            )}

            <style jsx>{`
                .customer-verification-list {
                    max-width: 1300px;
                    margin: 40px auto;
                    padding: 30px;
                    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                h1 {
                    color: #1a3c6d;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .status-select {
                    width: 220px;
                }

                .verification-table {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                /* Ant Design Table Customization */
                :global(.ant-table) {
                    border: none;
                }

                :global(.ant-table-thead > tr > th) {
                    background: linear-gradient(to right, #1a3c6d, #2e5b9e);
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 13px;
                    padding: 12px 16px;
                    border-bottom: none;
                }

                :global(.ant-table-tbody > tr > td) {
                    padding: 14px 16px;
                    border-bottom: 1px solid #e8ecef;
                    color: #333;
                    font-size: 14px;
                }

                :global(.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td) {
                    background: #f8fafc;
                    transition: background 0.2s ease;
                }

                /* Profile Image */
                :global(.ant-table-tbody img) {
                    border-radius: 50%;
                    border: 2px solid #e8ecef;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                :global(.ant-table-tbody img:hover) {
                    transform: scale(1.1);
                }

                /* Button */
                :global(.ant-btn) {
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

                :global(.ant-btn:hover) {
                    background: linear-gradient(to right, #40c4ff, #1890ff);
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5);
                    color: white;
                }

                

                /* Pagination */
                :global(.centered-pagination.ant-pagination) {
                    display: flex;
                    justify-content: center;
                    margin: 30px auto 0px auto;
                    

                }
                

                :global(.ant-pagination-item) {
                    
                    border-radius: 50%;
                    border: 1px solid #d9e0e7;
                    transition: all 0.3s ease;
                }

                :global(.ant-pagination-item:hover) {
                    border-color: #1890ff;
                }

                :global(.ant-pagination-item-active) {
                    background: linear-gradient(to right, #1890ff, #40c4ff);
                    border-color: #1890ff;
                }

                :global(.ant-pagination-item-active a) {
                    color: white;

                }

                :global(.ant-pagination-prev, .ant-pagination-next) {
                    border-radius: 50%;
                }

                :global(.ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link) {
                    border-radius: 50%;
                    border: 1px solid #d9e0e7;
                    background: #fff;
                    transition: all 0.3s ease;
                }

                :global(.ant-pagination-prev:hover .ant-pagination-item-link, .ant-pagination-next:hover .ant-pagination-item-link) {
                    border-color: #1890ff;
                    color: #1890ff;
                }
            `}</style>
        </div>
    );
};

export default CustomerVerificationList;