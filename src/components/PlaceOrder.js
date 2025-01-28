import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './receipt.css';
const PlaceOrder = () => {
  const [customer_name, setName] = useState('');
  const [agent_id, setSelectedAgent] = useState('');
  const [agents, setAgents] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);  // Array to hold selected items and quantities
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/agents')
      .then((response) => setAgents(response.data))
      .catch((error) => console.error('Error fetching agents:', error));

    axios
      .get('http://localhost:5000/api/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...selectedItems];
    updatedItems[index][name] = value;
    setSelectedItems(updatedItems);
  };

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { item_id: '', quantity: '' }]); // Add an empty item object
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Failed to place order. Please log in again.');
      return;
    }

    const orderData = {
      customer_name,
      agent_id,
      items: selectedItems, // Pass the array of selected items and quantities
    };

    try {
      const response = await axios.post('http://localhost:5000/api/place-order', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Order placed successfully.');
      setReceipt(response.data.orderDetails);
      setSelectedAgent('');
      setName('');
      setSelectedItems([]);
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Failed to place order. Please try again.');
    }
  };

  return (
    <div className='orders'>
    <div className='order-form'>
      <h2>Place Order</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleOrderSubmit}>
        <label>
          Select Agent:
          <select
            value={agent_id}
            onChange={(e) => setSelectedAgent(e.target.value)}
            required
          >
            <option value="">Select an Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.agent_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Customer Name:
          <input
            type="text"
            value={customer_name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <div>
          <h3>Items</h3>
          {selectedItems.map((item, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <label>
                Select Item:
                <select
                  name="item_id"
                  value={item.item_id}
                  onChange={(e) => handleItemChange(e, index)}
                  required
                >
                  <option value="">Select an Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_description}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                  required
                />
              </label>

              <button type="button" onClick={() => handleRemoveItem(index)}>
                Remove Item
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
        </div>

        <button type="submit">Place Order</button>
      </form>

      {receipt && (
        <div className='order-receipt'>
          <h3 style={{textAlign:"center"}}>Order Receipt</h3>
          <p>Tracking ID: {receipt.tracking_id}</p>
          <p>Customer Name: {receipt.customer_name}</p>
          {receipt.items.map((item, index) => (
            <div key={index}>
            </div>
          ))}
          <p>Total Bill: ${receipt.total_bill}</p>
          <p>Agent: {receipt.agent_id}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default PlaceOrder;
