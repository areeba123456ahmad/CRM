import React, { useState, useEffect } from "react";
import axios from "axios";
import './components.css';
const OrderTracking = () => {
  const [orders, setOrders] = useState([]);

  // Function to fetch orders
  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/orders") // Your backend URL
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    
    <div className="order-tracking">
      <h2>Order Tracking</h2>

      {/* Table to display the order data */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Tracking_info</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Updated_at</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.tracking_info}</td>
              <td>{order.status}</td>
              <td>{order.created_at}</td>
              <td>{order.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   
  );
};

export default OrderTracking;
