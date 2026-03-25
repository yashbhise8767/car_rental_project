import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "./MyAccount.css";

const MyAccount = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    email: "",
    password: "",
    role: "",
  });

  // State to track password validation
  const [passwordValidations, setPasswordValidations] = useState({
    hasCapitalLetter: false,
    hasNumber: false,
    hasSpecialCharacter: false,
    hasMinLength: false,
  });

  // State to track registered emails (simulated for frontend-only validation)
  const [registeredEmails, setRegisteredEmails] = useState([]);

  // Fetch registered emails (simulated here; replace with actual API call if needed)
  useEffect(() => {
    // Simulate fetching registered emails from the backend
    const fetchRegisteredEmails = async () => {
      // Replace this with an actual API call in a real-world scenario
      const mockRegisteredEmails = ["test@example.com", "user@gmail.com"];
      setRegisteredEmails(mockRegisteredEmails);
      console.log("Registered Emails:", mockRegisteredEmails); // Debugging log
    };

    fetchRegisteredEmails();
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });

    // Validate password if the field is "password"
    if (name === "password") {
      const hasCapitalLetter = /[A-Z]/.test(value); // At least one capital letter
      const hasNumber = /[0-9]/.test(value); // At least one number
      const hasSpecialCharacter = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(
        value
      ); // At least one special character
      const hasMinLength = value.length >= 8; // At least 8 characters

      setPasswordValidations({
        hasCapitalLetter,
        hasNumber,
        hasSpecialCharacter,
        hasMinLength,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Show loading animation

    try {
      const response = await axiosInstance.post(`/auth/login`, {
        email: accountInfo.email,
        password: accountInfo.password,
      });

      // Check if the response contains a valid token
      if (response.data && response.data.token) {
        login(response.data, response.data.token);
        toast.success("Login successful! 🎉", { duration: 2000 });

        setTimeout(() => {
          setIsLoggingIn(false);
          navigate("/");
        }, 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setIsLoggingIn(false);

      let errorMessage = "Email or password is incorrect. Please try again.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message; // Use the backend's error message
      }

      // Display the error message
      toast.error(errorMessage);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (
      !passwordValidations.hasCapitalLetter ||
      !passwordValidations.hasNumber ||
      !passwordValidations.hasSpecialCharacter ||
      !passwordValidations.hasMinLength
    ) {
      return toast.error(
        "Password must contain at least one capital letter, one number, one special character, and be at least 8 characters long."
      );
    }
  
    try {
      const response = await axiosInstance.post(`/auth/register`, accountInfo);
      const { statusCode, message } = response.data;
  
      if (statusCode !== 200) {
        toast.error(`❌ ${message}`);
        return;
      }
  
      // ✅ Success: show toast, auto-fill email/password, toggle to login form
      toast.success("Registration successful! Please log in. ✅", {
        duration: 2000,
      });
  
      // Auto-fill login form
      setAccountInfo((prev) => ({
        ...prev,
        email: accountInfo.email,
        password: accountInfo.password,
      }));
  
      setIsRegistering(false); // Switch to login view
  
      // ✅ Prevent execution from continuing into the catch block
      return;
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed. Please try again. ❌";
  
      if (err.response?.data?.message) {
        errorMessage = `❌ ${err.response.data.message}`;
      }
  
      toast.error(errorMessage);
    }
  };
  

  return (
    <div className="my-account">
      <Toaster richColors position="top-right" /> {/* Sonner Toaster */}
      <div className="loginBg"></div>
      <div>
        <div className="auth-container">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <>
                <div className="form-group">
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    name="role"
                    value={accountInfo.role}
                    onChange={handleAccountChange}
                    required
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="Customer">Customer</option>
                    <option value="Agency">Agency</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                placeholder="johndoe@gmail.com"
                type="email"
                id="email"
                name="email"
                value={accountInfo.email}
                onChange={handleAccountChange}
                required
              />
            </div>

            <div className="form-group password-group">
              <div
                style={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={accountInfo.password}
                  onChange={handleAccountChange}
                  required
                />
              </div>
              {isRegistering && (
                <div className="password-validation">
                  <p
                    className={
                      passwordValidations.hasMinLength ? "valid" : "invalid"
                    }
                  >
                    {passwordValidations.hasMinLength ? "✔" : "✘"} At least 8
                    characters
                  </p>
                  <p
                    className={
                      passwordValidations.hasCapitalLetter ? "valid" : "invalid"
                    }
                  >
                    {passwordValidations.hasCapitalLetter ? "✔" : "✘"} At least
                    one capital letter
                  </p>
                  <p
                    className={
                      passwordValidations.hasNumber ? "valid" : "invalid"
                    }
                  >
                    {passwordValidations.hasNumber ? "✔" : "✘"} At least one
                    number
                  </p>
                  <p
                    className={
                      passwordValidations.hasSpecialCharacter
                        ? "valid"
                        : "invalid"
                    }
                  >
                    {passwordValidations.hasSpecialCharacter ? "✔" : "✘"} At
                    least one special character
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <div className="spinner"></div> // Show spinner during login
              ) : isRegistering ? (
                "Register"
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="toggle-auth-container">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              className="toggle-auth"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
          {!isRegistering && (
            <button
              className="toggle-auth"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
