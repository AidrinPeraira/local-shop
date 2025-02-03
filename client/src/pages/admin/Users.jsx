import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import axios from "axios";

export const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "1234",
    role: "user-buyer",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        withCredentials: true, // Send cookies with the request
      });
      setUsers(response.data); // Set the fetched user data in state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on page load
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleSaveChanges = async () => {
    console.log("Saving changes for user:", selectedUser);

    const confirmUpdate = window.confirm(
      "Are you sure you want to update this user?"
    );

    console.log("runnin");
    if (confirmUpdate) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/users/${selectedUser._id}`,
          {
            username: selectedUser.username,
            email: selectedUser.email,
            role: selectedUser.role,
          },
          {
            withCredentials: true, // Ensures cookies (JWT) are sent
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        alert("User updated successfully.");

        fetchUsers();
        setOpenEditModal(false)

        return response.data;
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user. Please try again.");
      }
    }

    handleCloseEditModal();
  };

  const handleCreateUser = async () => {
    console.log("Creating new user:", newUser);

    // Basic validation
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Please fill in all the input fields.");
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/admin/create", {
        username : newUser.username,
        email : newUser.email,
        password : newUser.password,
      }, {
        withCredentials: true, // Ensures cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("User created successfully.");

      fetchUsers()

      setOpenCreateModal(false)

    } catch (error) {
      console.error("Error creating user:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    }
    handleCloseCreateModal();
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        withCredentials: true,
      });

      alert("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
          sx={{ mb: 2 }}
        >
          Create New User
        </Button>

        <TextField
          fullWidth
          placeholder="Search by username..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            width: "100%",
            maxWidth: 200, // Adjust width as needed
            "& .MuiOutlinedInput-root": {
              height: 40, // Match button height
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Registered On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((user) => {
                // If searchQuery is empty, return all users
                if (!searchQuery) return true;

                // Filter users based on the search query (case-insensitive matching)
                return (
                  user.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  user.role.toLowerCase().includes(searchQuery.toLowerCase())
                );
              })
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <img
                      width="50px"
                      height="50px"
                      src={`${user.imgUrl}`}
                      alt="Profile"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(user)}>Edit</Button>
                    <Button
                      onClick={() => handleDeleteUser(user._id)}
                      color="secondary"
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <h3>Edit User</h3>
          <TextField
            label="Username"
            fullWidth
            value={selectedUser?.username || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedUser?.role || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <MenuItem value="user-buyer">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Create New User Modal */}
      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <h3>Create New User</h3>
          <TextField
            label="Username"
            required
            fullWidth
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            required
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="password"
            type="password"
            required
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user-buyer">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            color="primary"
          >
            Create User
          </Button>
        </div>
      </Modal>
    </div>
  );
};
