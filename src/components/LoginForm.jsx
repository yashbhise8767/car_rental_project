import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/auth/login`, { email, password });
            login(response.data, response.data.token);
            if (response.data.role) {
                navigate('/');
            }

        } catch (err) {
            setError("Invalid login credentials");
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <h2> Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <style>
        {`
          /* General Styles */
          body {
            font-family: 'Arial', sans-serif;
            background-color: #ffffff; /* White background */
            color: #333; /* Dark gray text */
          }

          .container {
            max-width: 500px;
            margin: auto;
            padding: 20px;
            background: #ffffff; /* White container */
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          h2 {
            font-weight: bold;
            color: #2c3e50; /* Dark blue heading */
            text-align: center;
            margin-bottom: 1.5rem;
          }

          /* Form Styles */
          form {
            display: flex;
            flex-direction: column;
          }

          .mb-3 {
            margin-bottom: 1rem;
          }

          label {
            font-weight: bold;
            color: #2c3e50; /* Dark blue labels */
            margin-bottom: 0.5rem;
            display: block;
          }

          input[type="email"],
          input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd; /* Light gray border */
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease-in-out;
          }

          input[type="email"]:focus,
          input[type="password"]:focus {
            border-color: #007bff; /* Blue border on focus */
            outline: none;
          }

          /* Error Alert */
          .alert-danger {
            background-color: #f8d7da; /* Light red background */
            color: #721c24; /* Dark red text */
            padding: 10px;
            border: 1px solid #f5c6cb; /* Red border */
            border-radius: 5px;
            margin-bottom: 1rem;
          }

          /* Button Styles */
          .btn {
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease-in-out;
          }

          .btn-primary {
            background-color: #007bff; /* Blue primary button */
            border: none;
            color: #fff; /* White text */
          }

          .btn-primary:hover {
            background-color: #0056b3; /* Darker blue */
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .container {
              padding: 15px;
            }

            input[type="email"],
            input[type="password"] {
              font-size: 0.9rem;
            }
          }
        `}
      </style>

        </>
    );
};

export default LoginForm;
