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
            <th>Customer Name</th>
            <th>Agent ID</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Tracking Id</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.agent_id}</td>
              <td>{order.quantity}</td>
              <td>{order.order_date}</td>
              <td>{order.tracking_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   
  );
};

export default OrderTracking;
