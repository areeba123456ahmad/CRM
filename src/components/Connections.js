import React, { useState, useEffect } from "react";
import './components.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [newConnection, setNewConnection] = useState({
    name: "",
    details: "",
    status: "Active",
  });

  // Fetch connections from the server
  const fetchConnections = async () => {
    const response = await fetch("http://localhost:5000/connections");
    const data = await response.json();
    setConnections(data);
  };

  useEffect(() => {
    fetchConnections(); // Fetch connections when the component mounts
  }, []);

  // Update connection status
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/connections/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    fetchConnections(); // Refresh the list after status update
  };

  // Add a new connection
  const addConnection = async (e) => {
    e.preventDefault();
    const { name, details, status } = newConnection;

    const response = await fetch("http://localhost:5000/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, details, status }),
    });

    if (response.ok) {
      fetchConnections(); // Refresh after adding
      setNewConnection({ name: "", details: "", status: "Active" }); // Clear form
    } else {
      alert("Failed to add new connection");
    }
  };

  // Delete a connection
  const deleteConnection = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this connection?");
    if (!confirmed) return;

    const response = await fetch(`http://localhost:5000/connections/${id}`, {
      method: "DELETE",
    });
   
    if (response.ok) {
      // Refresh after deletion
      alert("Connection deleted successfully.");
      fetchConnections();
    } else {
      alert("Failed to delete connection");
    }
  };

  return (
  
      <div className="connection-tracking">
        <h2>Connections</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Details</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((connection) => (
              <tr key={connection.id}>
                <td>{connection.name}</td>
                <td>{connection.details || "N/A"}</td>
                <td>
                  <select
                    value={connection.status}
                    onChange={(e) => updateStatus(connection.id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>{new Date(connection.last_updated).toLocaleString()}</td>
                <td>
                  <button onClick={() => deleteConnection(connection.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add New Connection</h3>
        <form onSubmit={addConnection}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={newConnection.name}
              onChange={(e) =>
                setNewConnection({ ...newConnection, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>Details: </label>
            <textarea
              value={newConnection.details}
              onChange={(e) =>
                setNewConnection({ ...newConnection, details: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status: </label>
            <select
              value={newConnection.status}
              onChange={(e) =>
                setNewConnection({ ...newConnection, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button type="submit">Add Connection</button>
        </form>
      </div>
    
  );
};

export default Connections;
