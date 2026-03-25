import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        city: "",
        phoneNumber: "",
        address: "",
        drivingLiscene: ""
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosInstance.get(`/${authData.role.toLowerCase()}/${authData.user.id}`);
           
                setFormData({
                    username: data.username || "",
                    city: data.city || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    drivingLiscene: data.drivingLiscene
                });
                if (data.imageName) {
                    const imageResponse = await axiosInstance.get(
                        `/view/${authData.role.toLowerCase() === "agency" ? "agencies" : "customers"}/${authData.user.id}/image`,
                        { responseType: "blob" }
                    );
                    setPreviewImage(URL.createObjectURL(imageResponse.data));
                }
            } catch (err) {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [authData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImageFile(selectedImage);
            setPreviewImage(URL.createObjectURL(selectedImage));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
        if (imageFile) formDataToSend.append("image", imageFile);

        try {
            await axiosInstance.put(`/${authData.role.toLowerCase()}/${authData.user.id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Profile updated successfully!");
            setTimeout(() => navigate(`/${authData.role.toLowerCase()}/profile`), 2000);
        } catch (err) {
            setError("Failed to update profile.");
        }
    };

    return (
        <div className="container">
            <style>
                {`
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background: #f9f9f9;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        animation: fadeIn 1s ease-in-out;
                       color: #333;
                    
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .form-control {
                        width: 100%;
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        transition: border-color 0.3s ease;
                    }
                    .form-control:focus {
                        border-color: #007bff;
                        outline: none;
                    }
                    .btn-primary {
                        width: 100%;
                        padding: 10px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }
                    .btn-primary:hover {
                        background: #0056b3;
                    }
                    .alert {
                        padding: 10px;
                        margin: 10px 0;
                        border-radius: 5px;
                        text-align: center;
                        animation: slideDown 0.5s ease-in-out;
                    }
                    .alert-success {
                        background: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                    }
                    .alert-danger {
                        background: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                    }
                    img {
                        border-radius: 5px;
                        border: 1px solid #ddd;
                        transition: transform 0.3s ease;
                    }
                    img:hover {
                        transform: scale(1.1);
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideDown {
                        from { transform: translateY(-20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>
            <h1>Update {authData.role} Profile</h1>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID: {authData.user.id}</label>
                </div>
                <div>
                    <label>Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                </div>
                
                <div>
                    <label>Phone</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control" />
                </div>
                <div>
                    <label>City</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="form-control" required />
                </div>
                {authData.role.toLowerCase() == "agency" &&
                <div>
                    <label>Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="form-control" />
                </div>
                }

                {authData.role.toLowerCase() == "customer" &&
                <div>
                    <label>Driving Liscene</label>
                    <input name="drivingLiscene" value={formData.drivingLiscene} onChange={handleChange} className="form-control" />
                </div>

                }
                <div>
                    <label>Profile Image</label>
                    <input type="file" onChange={handleImageChange} className="form-control" />
                    {previewImage && <img src={previewImage} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;