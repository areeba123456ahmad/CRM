import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Switch, Button } from "@mui/material";
import './components.css';
const AdminPermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch permissions data
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/permissions");
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  // Handle permission toggle
  const handleToggle = (id, field) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, [field]: !perm[field] } : perm
      )
    );
  };

  // Save changes to backend
  const saveChanges = async (id, updatedPermissions) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/permissions/${id}`, updatedPermissions);
      setLoading(false);
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      setLoading(false);
    }
  };

  return (
    <div className="permissions ">
      <h2>Manage User Permissions</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Can Edit</TableCell>
            <TableCell>Can Add</TableCell>
            <TableCell>View Performance</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((perm) => (
            <TableRow key={perm.id}>
              <TableCell>{perm.user_id}</TableCell>
              <TableCell>
                <Switch
                  checked={perm.Per_edit}
                  onChange={() => handleToggle(perm.id, "Per_edit")}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={perm.Per_add}
                  onChange={() => handleToggle(perm.id, "Per_add")}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={perm.Per_performance}
                  onChange={() => handleToggle(perm.id, "Per_performance")}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    saveChanges(perm.id, {
                      Per_edit: perm.Per_edit,
                      Per_add: perm.Per_add,
                      Per_performance: perm.Per_performance,
                    })
                  }
                  disabled={loading}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPermissions;
