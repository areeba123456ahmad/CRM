import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ created_at: "", email: "", role: "", password: "" });
  const [updatedUser, setUpdatedUser] = useState({ created_at: "",  email: "", role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await axios.post("http://localhost:5000/create-user", newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewUser({ created_at: "", email: "", role: "", password: "" });
      alert("User created successfully");
      // Refetch users to update the list
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

 
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("User deleted successfully");
      // Refetch users to update the list
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="management">
      <h2>User Management</h2>

      {/* Add New User Form */}
      <div style={{background:'var(--Bg)' , borderRadius:"30px",marginBottom:"50px"}}>
       
      <label>Please Enter Email address :</label>
        <input className="management1"
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <br></br>
        <label>Please Enter the role for user:</label>
        <input className="management1"
          label="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        /> <br></br>
         <label>Please Enter a secure password :</label>
        <input className="management1"
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        /> <br></br>
        <Button onClick={handleCreateUser}>Create User</Button>
      </div>

     

      {/* User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserManagement;
