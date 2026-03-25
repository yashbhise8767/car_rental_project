import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(
        "https://storage.googleapis.com/gd-prod/images/a910d418-7123-4bc4-aa3b-ef7e25e74ae6.60c498c559810aa0.webp"
    );

    useEffect(() => {
        console.log(`Car id is  ${car.id}`);
        const fetchImage = async () => {
            try {
                const response = await axiosInstance.get(`/view/cars/${car.id}/image`, {
                    responseType: "blob",
                });
                setImageSrc(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };
        fetchImage();
    }, [car.id]);

    return (
        <div className="card" onClick={()=> navigate(`/cars/${car.id}`)} style={{ width: "18rem", margin: "1rem", backgroundColor: "#dbdbdb", padding: "5px" }}>
            <img
                src={imageSrc}
                className="card-img-top"
                alt={`${car.brand} ${car.model}`}
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
            />
            <div className="card-body">
                <h5 className="card-title">{car.brand} {car.model}</h5>
                <p className="card-text">Price per day: ${car.pricePerDay}</p>
            </div>
        </div>
    );
};

export default CarCard;
