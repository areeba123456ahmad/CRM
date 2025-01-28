import React, { useState } from 'react';
import axios from 'axios';

const TrackOrders = () => {
  const [trackingId, setTrackingId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [message, setMessage] = useState('');

  const handleFetchOrder = async () => {
    if (!trackingId) {
      setMessage('Please enter a tracking ID.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/order/${trackingId}`);
      setOrderDetails(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching order details:', error);
      if (error.response && error.response.status === 404) {
        setMessage('Order not found. Please check the tracking ID.');
      } else {
        setMessage('Failed to fetch order details. Please try again.');
      }
      setOrderDetails(null);
    }
  };

  return (
    <div style={{ margin: '20px', textAlign: 'center' }}>
      <h2>Get Order Details</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '200px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleFetchOrder}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Fetch Order
        </button>
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {orderDetails && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            display: 'inline-block',
            textAlign: 'left',
          }}
        >
          <h3>Order Receipt</h3>
          <p>
            <strong>Tracking ID:</strong> {orderDetails.tracking_id}
          </p>
          <p>
            <strong>Customer Name:</strong> {orderDetails.customer_name}
          </p>
          <p>
            <strong>Agent:</strong> {orderDetails.agent_id}
          </p>
          <p>
            
          </p>
          <h4>Items:</h4>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                {item.item_description} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
