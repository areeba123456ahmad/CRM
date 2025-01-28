import React, { useState, useEffect } from "react";
import axios from "axios";
import "./components.css";
import { jwtDecode } from "jwt-decode";
const SalesRecords = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({
    customer_name: "",
    product: "",
    status: "",
  });
  const [editingSale, setEditingSale] = useState(null);
 const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
        const role=decoded.role;
  // Function to fetch sales records
  const fetchSales = () => {
    axios
      .get("http://localhost:5000/api/sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setSales(response.data))
      .catch((error) => console.error("Error fetching sales data:", error));
  };

  // Fetch sales records on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingSale) {
      setEditingSale({ ...editingSale, [name]: value });
    } else {
      setNewSale({ ...newSale, [name]: value });
    }
  };


  const canadd = () => {
    if(role==='Agent'){const permissions = JSON.parse(localStorage.getItem("permissions"));
      return permissions ? permissions.Per_add : false;}
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canadd()) {
      alert("You do not have permission to edit.");
      return;
    }
    const endpoint = editingSale
      ? `http://localhost:5000/api/sales/${editingSale.id}`
      : "http://localhost:5000/api/sales";

    const method = editingSale ? "put" : "post";
    
    const data = editingSale
    ? editingSale
    : { ...newSale, agent_id: decoded.id };
    
    axios[method](endpoint, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        fetchSales();
        setNewSale({ customer_name: "", product: "", status: "" });
        setEditingSale(null);
      })
      .catch((error) => console.error("Error submitting sale:", error));
  };


  const canEdit = () => {
    if(role==='Agent'){const permissions = JSON.parse(localStorage.getItem("permissions"));
      return permissions ? permissions.Per_add : false;}
    return true;
  };

 

  const handleEdit = (sale) => {
    if (!canEdit()) {
      alert("You do not have permission to edit.");
      return;
    }
    setEditingSale({ ...sale });
  };

  const handleCancelEdit = () => {
    setEditingSale(null);
  };

  return (
   
    <div className="sales-records">
      <h2>Sales Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customer_name}</td>
              <td>{sale.product}</td>
              <td>{sale.status}</td>
              <td>
                <button onClick={() => handleEdit(sale)}  disabled={!canEdit()}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customer_name"
          value={editingSale ? editingSale.customer_name : newSale.customer_name}
          onChange={handleChange}
          placeholder="Customer Name"
          required
        />
        <input
          type="text"
          name="product"
          value={editingSale ? editingSale.product : newSale.product}
          onChange={handleChange}
          placeholder="Product"
          required
        />
        <input
          type="text"
          name="status"
          value={editingSale ? editingSale.status : newSale.status}
          onChange={handleChange}
          placeholder="Status"
          required
        />
        <button type="submit" disabled={!canadd()}>
          {editingSale ? "Update Sale" : "Add Sale"}
        </button>
        {editingSale && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  
  );
};

export default SalesRecords;
