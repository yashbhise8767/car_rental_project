import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { Card, CardContent } from '@mui/material';

const AgencyList = () => {
    const [agencies, setAgencies] = useState([]);
    const [agencyImages, setAgencyImages] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const response = await axiosInstance.get('/agency');
                setAgencies(response.data);

                // Fetch images for each agency
                const imagePromises = response.data.map(async (agency) => {
                    if (agency.imageName) {
                        try {
                            const imageResponse = await axiosInstance.get(`/view/agencies/${agency.id}/image`, {
                                responseType: 'blob',
                            });
                            return { id: agency.id, image: URL.createObjectURL(imageResponse.data) };
                        } catch (error) {
                            console.error(`Error fetching image for agency ${agency.id}:`, error);
                            return { id: agency.id, image: null };
                        }
                    }
                    return { id: agency.id, image: null };
                });

                const images = await Promise.all(imagePromises);
                const imageMap = images.reduce((acc, img) => ({ ...acc, [img.id]: img.image }), {});
                setAgencyImages(imageMap);
            } catch (error) {
                console.error('Error fetching agencies:', error);
                setAgencies([]);
            }
        };

        fetchAgencies();
    }, []);

    const handleAgencyClick = (agencyId) => {
        navigate(`/admin/agency/cars/${agencyId}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {agencies.length > 0 ? (
                agencies.map((agency) => (
                    <Card
                        key={agency.id}
                        className="cursor-pointer hover:shadow-lg p-4"
                        onClick={() => handleAgencyClick(agency.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                        {agencyImages[agency.id] ? (
                            <img
                                src={agencyImages[agency.id]}
                                alt="Agency"
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#555',
                                    fontSize: '0.8rem',
                                }}
                            >
                                No Image
                            </div>
                        )}
                        <CardContent>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{agency.username}</h3>
                            <p style={{ color: '#6b7280' }}>{agency.address}</p>
                            <p style={{ color: '#4b5563' }}>Contact: {agency.phoneNumber}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p>No agencies available.</p>
            )}
        </div>
    );
};

export default AgencyList;