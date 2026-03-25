import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", accountStatus: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get(`/admin/get-users/${userId}`);
      const userWithoutPassword = {
        email: response.data.ourUsers.email,
        accountStatus: response.data.ourUsers.accountStatus,
      };
      setUser(userWithoutPassword);
    } catch (err) {
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user };
      if (password) {
        updatedUser.password = password;
      }
      await axiosInstance.put(`/admin/update/${userId}`, updatedUser);
      alert("User updated successfully!");
      navigate("/");
    } catch (err) {
      setError("Failed to update user");
    }
  };

  if (loading)
    return (
      <div
        style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}
      >
        Loading user details...
      </div>
    );
  if (error)
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: "400px",
        color :"black",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Update User
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <p style={{ display: "flex", gap: "10px" }}>
          <label
            style={{
              fontWeight: "bolder",
              borderBottom: "1px solid #ccc",
            }}
          >
            Email:{" "}
          </label>
          <span style={{ color: "#333" }}>{user.email}</span>
        </p>

        <label>Account Status:</label>
        <select
          name="accountStatus"
          value={user.accountStatus}
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="Active">Active</option>
          <option value="Banned">Banned</option>
          <option value="Suspended">Suspended</option>
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
