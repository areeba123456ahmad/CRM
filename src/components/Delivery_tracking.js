import React, { useState } from "react";
import './components.css';
const DeliveryTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleTrackOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/order-status/${trackingNumber}`);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const data = await response.json();
      setOrderStatus(data);
      setError(null); // Clear previous errors
    } catch (err) {
      setError(err.message);
      setOrderStatus(null); // Clear previous data
    }
  };

  return (
   
    <div className="Delivery-tracking">
      <input
        type="text"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        placeholder="Enter tracking number"
      />
      <button onClick={handleTrackOrder}>Track Order</button>
      {orderStatus && (
        <div className="orders" style={{position:"absolute",left:"150px",top:"290px", color:"Black",width:"70%",height:"200px"}}>
          <p>Order ID: {orderStatus.orderId}</p>
          <p>Status: {orderStatus.status}</p>
          <p>Tracking Info: {orderStatus.trackingInfo}</p>
          <p>Delivery Date: {orderStatus.deliveryDate}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
   
  );
};

export default DeliveryTracking;
