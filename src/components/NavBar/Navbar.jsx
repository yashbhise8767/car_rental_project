import { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const handleToggle = () => setIsMobile(!isMobile);

  // Close menu after clicking a link
  const handleCloseMenu = () => setIsMobile(false);

  const getLinkClassName = (path) => {
    return location.pathname === path ? "active-link-custom" : "";
  };

  const { authData, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const navigate = useNavigate();

  // Fetch user profile data (customer or agency)
  const fetchUserProfile = async () => {
    try {
      if (!authData.token || !authData.role || !authData.user?.id) {
        console.warn("User information is missing. Cannot fetch profile.");
        return;
      }

      const rolePath = authData.role.toLowerCase(); // "agency" or "customer"
      const response = await axiosInstance.get(
        `/${rolePath}/${authData.user.id}`
      );
      console.log("Fetched Profile Data:", response.data);
      setUserProfile(response.data); // Store profile data in state
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  // Fetch user profile when the component mounts
  useEffect(() => {
    if (
      authData.token &&
      (authData.role === "Customer" || authData.role === "Agency")
    ) {
      fetchUserProfile();
    }
  }, [authData.token, authData.role, authData.user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseMenu(); // Ensure menu closes after logging out
  };

  return (
    <>
      <nav className="navbar-custom">
        <Link className="logo-custom" to="/" onClick={handleCloseMenu}>
          <img src="/mzpLogo.png" alt="MZP Logo" width="100px" height="60px" />
        </Link>
        <div className="hamburger-custom" onClick={handleToggle}>
          <span className="bar-custom"></span>
          <span className="bar-custom"></span>
          <span className="bar-custom"></span>
        </div>
        <ul className={`nav-links-custom ${isMobile ? "active" : ""}`}>
          <li>
            <Link
              className={getLinkClassName("/")}
              to="/"
              onClick={handleCloseMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={getLinkClassName("/cars")}
              to="/cars"
              onClick={handleCloseMenu}
            >
              Cars
            </Link>
          </li>
          <li>
            <Link
              className={getLinkClassName("/services")}
              to="/services"
              onClick={handleCloseMenu}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              className={getLinkClassName("/contactUs")}
              to="/contactUs"
              onClick={handleCloseMenu}
            >
              Contact Us
            </Link>
          </li>
          {!authData.token ? (
            <li className="nav-item-custom">
              <Link
                className="nav-link-custom"
                to="/agency/login"
                onClick={handleCloseMenu}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="login-icon" />{" "}
                Login
              </Link>
            </li>
          ) : (
            <li className="nav-item-custom">
              <Dropdown className="dropdown-custom">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="dropdown-toggle-custom"
                  style={{ borderRadius: "50%" }}
                >
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom">
                  {authData.role === "Customer" && (
                    <>
                      {/* <Dropdown.Item className="dropdown-item-profile-name">
                        {userProfile?.username || "Unknown"}
                      </Dropdown.Item> */}
                      <Dropdown.Item
                        as={Link}
                        to="/customer/profile"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/cars/orders"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/cars/rents"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Rents
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/customer/verification-form"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Verification
                      </Dropdown.Item>
                    </>
                  )}
                  {authData.role === "Agency" && (
                    <>
                      {/* <Dropdown.Item className="dropdown-item-profile-name">
                        {userProfile?.username || "Profile"}
                      </Dropdown.Item> */}
                      <Dropdown.Item
                        as={Link}
                        to="/agency/profile"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/add-car"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Add Car
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        My Cars
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars/orders"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        My Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/cars/rents"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Rented Cars
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/agency/verification-form"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Verification
                      </Dropdown.Item>
                    </>
                  )}
                  {authData.role === "Admin" && (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/admin/dashboard"
                        className="dropdown-item-custom"
                        onClick={handleCloseMenu}
                      >
                        Dashboard
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item-custom"
                  >
                    <span className="logout-text">Logout </span>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="logout-icon"
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
