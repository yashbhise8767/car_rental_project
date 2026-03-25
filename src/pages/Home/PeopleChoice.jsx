import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import "./PeopleChoice.css";
import axiosInstance from "../../api/axios";

const PeopleChoice = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axiosInstance.get('/view/cars');
                const carsWithImages = await Promise.all(response.data.map(async (car) => {
                    const imageSrc = await fetchImage(car.id);
                    return { ...car, image: imageSrc };
                }));
                setCars(carsWithImages);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const fetchImage = async (carId) => {
        try {
            const response = await axiosInstance.get(`/view/cars/${carId}/image`, {
                responseType: "blob",
            });
            console.log(`Image set for carid ${carId} in People choice`);
            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error(`Error fetching image for car ID ${carId}:`, error);
            return "https://storage.googleapis.com/gd-prod/images/a910d418-7123-4bc4-aa3b-ef7e25e74ae6.60c498c559810aa0.webp"; // Default image
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="people-choice">
            <h2 className="header">People's Choice</h2>
            <Carousel
                showThumbs={false}
                autoPlay={true}
                infiniteLoop={true}
                showStatus={false}
                showIndicators={true}
                showArrows={true}
                swipeable={true}
                emulateTouch={true}
                interval={3000}
                transitionTime={500}
            >
                {cars.map((car) => (
                    <div key={car.id} className="car-card">
                        <img
                            src={car.image}
                            className="card-img-top"
                            alt={`${car.brand} ${car.model}`}
                        />
                        <div className="car-info">
                            <h3>{car.brand} {car.model}</h3>
                            <p>{car.category}</p>
                            <h4>{car.pricePerDay} $/day</h4>
                        </div>
                        <button className="details-button">See Details</button>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default PeopleChoice;
