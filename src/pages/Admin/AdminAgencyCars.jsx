import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Cars/AgencyCars.css";

const fetchAgencyCars = async (id) => {
    try {
        const response = await axiosInstance.get(`/agency/cars/byId/${id}`);
        const carsData = Array.isArray(response.data) ? response.data : [];
        console.log("Fetched Cars Data:", carsData); // Debugging fetched data

        // Fetch images for each car
        const carImages = {};
        await Promise.all(
            carsData.map(async (car) => {
                try {
                    const imgResponse = await axiosInstance.get(`/view/cars/${car.id}/image`, {
                        responseType: "blob",
                    });
                    carImages[car.id] = URL.createObjectURL(imgResponse.data);
                } catch (error) {
                    console.error(`Error fetching image for car ID ${car.id}`, error);
                    carImages[car.id] = "https://dummyimage.com/100x60/ccc/000&text=No+Image"; // Placeholder
                }
            })
        );

        return { carsData, carImages };
    } catch (error) {
        console.error("Error fetching agency cars:", error);
        throw error;
    }
};

const AdminAgencyCars = () => {
    const [cars, setCars] = useState([]);
    const [carImages, setCarImages] = useState({});
    const [error, setError] = useState(null);
    const { id } = useParams();  // Moved useParams here
    const navigate = useNavigate();

    useEffect(() => {
        const loadCars = async () => {
            try {
                console.log("Agency ID:", id);  // Check if ID is retrieved
                if (!id) {
                    setError("Invalid agency ID.");
                    return;
                }
                const { carsData, carImages } = await fetchAgencyCars(id);
                setCars(carsData);
                setCarImages(carImages);
            } catch (err) {
                setError("Failed to load cars.");
            }
        };
        loadCars();
    }, [id]);

    const handleCarClick = (carId) => {
        navigate(`/cars/${carId}`);
    };

    return (
        <div className="agency-container my-4">
            <h1 className="agency-mb-4 text-center">Agency Cars</h1>
            {error && <p className="agency-text-danger text-center">{error}</p>}
    
            {cars.length === 0 && !error ? (
                <p className="text-center">No cars available at the moment.</p>
            ) : (
                <div className="agency-table-responsive">
                    <table className="agency-table agency-table-striped agency-table-hover text-center">
                        <thead className="agency-table-dark">
                            <tr>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>VIN</th>
                                <th>License Plate</th>
                                <th>Price Per Day</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => (
                                <tr key={car.id}>
                                    <td>{car.brand}</td>
                                    <td>{car.model}</td>
                                    <td>{car.vin}</td>
                                    <td>{car.licensePlate}</td>
                                    <td>${car.pricePerDay}</td>
                                    <td>
                                        <img
                                            src={carImages[car.id] || "https://dummyimage.com/100x60/ccc/000&text=No+Image"}
                                            alt={`${car.brand} ${car.model}`}
                                            className="agency-car-image"
                                            onError={(e) => (e.target.src = "https://dummyimage.com/100x60/ccc/000&text=No+Image")}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className="agency-btn agency-btn-primary agency-btn-sm"
                                            onClick={() => handleCarClick(car.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
    
};

export default AdminAgencyCars;