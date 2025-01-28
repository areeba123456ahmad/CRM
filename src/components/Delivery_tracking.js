import React, { useState } from "react";
import './components.css';

const DeliveryTracking = () => {
  const [trackingId, setTrackingId] = useState(""); // Changed to trackingId
  const [orderStatus, setOrderStatus] = useState([]);
  const [error, setError] = useState(null);

  const handleTrackOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/order-status/${trackingId}`);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const data = await response.json();
      setOrderStatus(data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err.message);
      setOrderStatus([]); // Clear previous data
    }
  };

  return (
    <div className="Delivery-tracking">
      <input
        type="text"
        value={trackingId} // Updated to trackingId
        onChange={(e) => setTrackingId(e.target.value)} // Updated to trackingId
        placeholder="Enter tracking ID"
      />
      <button onClick={handleTrackOrder}>Track Order</button>
      {orderStatus.length > 0 && (
        <div className="orders" style={{position:"absolute", left:"150px", top:"290px", color:"Black", width:"70%", height:"auto"}}>
          {orderStatus.map((order, index) => (
            <div key={index}>
              <p>Order ID: {order.orderId}</p>
              <p>Customer Name: {order.customerName}</p>
              <p>Item ID: {order.itemId}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Agent ID: {order.agentId}</p>
              <p>Order Date: {order.orderDate}</p>
              <p>Tracking ID: {order.trackingId}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeliveryTracking;
