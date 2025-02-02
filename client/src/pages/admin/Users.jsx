import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const users = [
  { id: 1, username: "John Doe", email: "john@example.com", role: "Admin", createdAt: "2021-01-01" },
  { id: 2, username: "Jane Smith", email: "jane@example.com", role: "User", createdAt: "2022-02-02" },
  // Add more users as needed
];

export const Users = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "User" });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleSaveChanges = () => {
    console.log("Saving changes for user:", selectedUser);
    handleCloseEditModal();
  };

  const handleCreateUser = () => {
    console.log("Creating new user:", newUser);
    // Add logic to save new user
    handleCloseCreateModal();
  };

  const handleDeleteUser = (id) => {
    console.log("Deleting user with ID:", id);
    // Add logic to delete user from the array
  };

  return (
    <div>
      <h2>User Management</h2>
      <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)} sx={{ mb: 2 }}>
        Create New User
      </Button>

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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <img src={`https://i.pravatar.cc/40?img=${user.id}`} alt="Profile" />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(user)}>Edit</Button>
                  <Button onClick={() => handleDeleteUser(user.id)} color="secondary" sx={{ ml: 1 }}>
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
        <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", maxWidth: "400px", margin: "auto", marginTop: "10%" }}>
          <h3>Edit User</h3>
          <TextField
            label="Username"
            fullWidth
            value={selectedUser?.username || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedUser?.email || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedUser?.role || ""}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">Save Changes</Button>
        </div>
      </Modal>

      {/* Create New User Modal */}
      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", maxWidth: "400px", margin: "auto", marginTop: "10%" }}>
          <h3>Create New User</h3>
          <TextField
            label="Username"
            fullWidth
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleCreateUser} variant="contained" color="primary">Create User</Button>
        </div>
      </Modal>
    </div>
  );
};
