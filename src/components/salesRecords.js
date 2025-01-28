import React, { useState, useEffect } from "react";
import axios from "axios";
import "./components.css";
import { jwtDecode } from "jwt-decode";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    item_id: "",
    quantity: "",
    order_date: "",
    tracking_id: "",
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = decoded.role;

  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [name]: value });
    } else {
      setNewOrder({ ...newOrder, [name]: value });
    }
  };

  const canAdd = () => {
    if (role === "Agent") {
      const permissions = JSON.parse(localStorage.getItem("permissions"));
      return permissions ? permissions.Per_add : false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canAdd()) {
      alert("You do not have permission to add.");
      return;
    }
    const endpoint = editingOrder
      ? `http://localhost:5000/api/orders/${editingOrder.id}`
      : "http://localhost:5000/api/orders";

    const method = editingOrder ? "put" : "post";
    const data = editingOrder
      ? editingOrder
      : { ...newOrder, agent_id: decoded.id };

    axios[method](endpoint, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        fetchOrders();
        setNewOrder({ customer_name: "", item_id: "", quantity: "", order_date: "", tracking_id: "" });
        setEditingOrder(null);
      })
      .catch((error) => console.error("Error submitting order:", error));
  };

  const canEdit = () => {
    if (role === "Agent") {
      const permissions = JSON.parse(localStorage.getItem("permissions"));
      return permissions ? permissions.Per_edit : false;
    }
    return true;
  };

  const handleEdit = (order) => {
    if (!canEdit()) {
      alert("You do not have permission to edit.");
      return;
    }
    setEditingOrder({ ...order });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  return (
    <div className="orders">
      <h2>Order Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Item ID</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Tracking ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.item_id}</td>
              <td>{order.quantity}</td>
              <td>{order.order_date}</td>
              <td>{order.tracking_id}</td>
              <td>
                <button onClick={() => handleEdit(order)} disabled={!canEdit()}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customer_name"
          value={editingOrder ? editingOrder.customer_name : newOrder.customer_name}
          onChange={handleChange}
          placeholder="Customer Name"
          required
        />
        <input
          type="number"
          name="item_id"
          value={editingOrder ? editingOrder.item_id : newOrder.item_id}
          onChange={handleChange}
          placeholder="Item ID"
          required
        />
        <input
          type="number"
          name="quantity"
          value={editingOrder ? editingOrder.quantity : newOrder.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          type="date"
          name="order_date"
          value={editingOrder ? editingOrder.order_date : newOrder.order_date}
          onChange={handleChange}
          placeholder="Order Date"
          required
        />
        <input
          type="text"
          name="tracking_id"
          value={editingOrder ? editingOrder.tracking_id : newOrder.tracking_id}
          onChange={handleChange}
          placeholder="Tracking ID"
          required
        />
        <button type="submit" disabled={!canAdd()}>
          {editingOrder ? "Update Order" : "Add Order"}
        </button>
        {editingOrder && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default Orders;