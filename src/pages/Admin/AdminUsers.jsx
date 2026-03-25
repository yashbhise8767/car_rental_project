import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [selectedRole, setSelectedRole] = useState(""); // Role filter state
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/get-all-users");
      setUsers(response.data.ourUsersList || []);
      setFilteredUsers(response.data.ourUsersList || []); // Initialize filtered users
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle role filter change
  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    if (role === "") {
      setFilteredUsers(users); // Show all users if no role is selected
    } else {
      const filtered = users.filter((user) => user.role === role);
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset pagination when filtering
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateUser = (userId) => {
    navigate(`/admin/update-user/${userId}`);
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-users-container">
      <h2>Admin User Management</h2>

      {/* Role Filter Dropdown */}
      <div className="filter-dropdown">
        <label htmlFor="roleFilter">Filter by Role:</label>
        <select
          id="roleFilter"
          value={selectedRole}
          onChange={handleRoleFilter}
        >
          <option value="">All Roles</option>
          <option value="Customer">Customer</option>
          <option value="Agency">Agency</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => updateUser(user.id)} className="update">
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
