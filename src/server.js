import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Use promise-based API
import { jwtDecode } from 'jwt-decode';

import fastCsv from 'fast-csv';


import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ClientRMl',
});


try {
  await db.connect();
  console.log('Connected to the database');
} catch (err) {
  console.error('Error connecting to the database:', err);
}

// Login route to authenticate and generate token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    const user = results[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Compare plain password directly (not recommended for production)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Get permissions for the logged-in user (except for admin/superadmin)
    const permissionQuery = `
      SELECT Per_edit, Per_add, Per_performance 
      FROM permissions
      WHERE user_id = ?`;
    const [permissionsResults] = await db.query(permissionQuery, [user.id]);
    const permissions = permissionsResults[0]; // Assuming only one row of permissions

    // Sign the token with the permissions as well
    const token = jwt.sign(
      { 
        email: user.email, 
        role: user.role, 
        id: user.id, 
        permissions: permissions // Add permissions to token
      }, 
      "areeba@123", 
      { expiresIn: "1h" }
    );

    return res.json({ success: true, role: user.role, token, id: user.id });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, "areeba@123", (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user; // Add the user object to the request
    next();
  });
};


// Get all sales records
app.get("/api/orders", async (req, res) => {
  try {
    const [orderRecords] = await db.query("SELECT * FROM userOrders");
    res.status(200).json(orderRecords);
  } catch (err) {
    console.error("Error fetching order records:", err);
    res.status(500).json({ error: "Failed to fetch order records" });
  }
});

// Add a new order record
app.post("/api/orders", async (req, res) => {
  const { customer_name, item_id, quantity, order_date, tracking_id } = req.body;
  const agent_id = req.agent_id;
  try {
    const [result] = await db.query(
      "INSERT INTO userOrders (agent_id, customer_name, item_id, quantity, order_date, tracking_id) VALUES (?, ?, ?, ?, ?, ?)",
      [agent_id, customer_name, item_id, quantity, order_date, tracking_id]
    );

    const [performance] = await db.query(
      "SELECT * FROM agent_performance WHERE agent_id = ?",
      [agent_id]
    );

    if (performance.length > 0) {
      // Update the existing performance record
      await db.query(
        "UPDATE agent_performance SET total_sales = total_sales + 1, fulfillment_rate = (total_sales / sales_target) * 100, pending_tasks = pending_tasks - 1 WHERE agent_id = ?",
        [agent_id]
      );
    } else {
      // Insert a new performance record
      await db.query(
        `INSERT INTO agent_performance (
            agent_id, 
            total_sales, 
            sales_target, 
            fulfillment_rate, 
            pending_tasks, 
            performance_date, 
            created_at, 
            updated_at
          ) 
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          agent_id,       // Agent ID
          1,              // Initial total_sales
          100,            // Default sales_target
          (1 / 100) * 100, // Fulfillment rate = (1 / sales_target) * 100
          10,              // Pending tasks default to 10
          new Date(),     // Performance date set to today
        ]
      );
    }

    res.status(201).json({ id: result.insertId, customer_name, item_id, quantity, order_date, tracking_id });
  } catch (err) {
    console.error("Error adding order record:", err);
    res.status(500).json({ error: "Failed to add order record" });
  }
});

// Update an order record
app.put("/api/orders/:id", async (req, res) => {
  const { customer_name, item_id, quantity, order_date, tracking_id } = req.body;
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE userOrders SET customer_name = ?, item_id = ?, quantity = ?, order_date = ?, tracking_id = ? WHERE id = ?",
      [customer_name, item_id, quantity, order_date, tracking_id, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Order record updated successfully" });
    } else {
      res.status(404).json({ error: "Order record not found" });
    }
  } catch (err) {
    console.error("Error updating order record:", err);
    res.status(500).json({ error: "Failed to update order record" });
  }
});

// display order for tracking
app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders"); // Use `execute` with async/await
    res.json(rows); // Send orders data as JSON
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Error fetching orders");
  }
});



app.get("/connections", async (req, res) => {
  try {
    
    const [rows] = await db.query("SELECT * FROM connections");
    res.json(rows);
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching connections");
  }
});

// Edit the status of a connection
app.put("/connections/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
   
    const [result] = await db.query(
      "UPDATE connections SET status = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows > 0) {
      res.send("Connection status updated successfully");
    } else {
      res.status(404).send("Connection not found");
    }

    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating connection status");
  }
});

// Add a new connection
app.post("/connections", async (req, res) => {
  const { name, details, status } = req.body;

  try {
    
    const [result] = await db.query(
      "INSERT INTO connections (name, details, status) VALUES (?, ?, ?)",
      [name, details, status]
    );

    res.status(201).json({ id: result.insertId, name, details, status, last_updated: new Date() });
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding new connection");
  }
});



app.delete("/connections/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM connections WHERE id = ?", [id], function (err) {
    app.delete("/connections/:id", (req, res) => {
      const { id } = req.params;
    
      db.run("DELETE FROM connections WHERE id = ?", [id], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes > 0) {
          // Successfully deleted
          res.status(200).json({ success: true, message: "Connection deleted successfully" });
        } else {
          // No rows deleted (e.g., invalid ID)
          res.status(404).json({ success: false, message: "Connection not found" });
        }
      });
    });
    
  });
});

app.get('/api/order-status/:trackingId', async (req, res) => {
  const trackingId = req.params.trackingId;
  console.log("Received tracking ID:", trackingId);

  const query = "SELECT id, customer_name, item_id, quantity, agent_id, order_date, tracking_id FROM userOrders WHERE tracking_id = ?";
  
  try {
    const [results] = await db.execute(query, [trackingId]); // Execute query with async/await
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orders = results.map(order => ({
      orderId: order.id,
      customerName: order.customer_name,
      itemId: order.item_id,
      quantity: order.quantity,
      agentId: order.agent_id,
      orderDate: order.order_date,
      trackingId: order.tracking_id,
    }));
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: 'Error executing query' });
  }
});


app.get('/performance', async (req, res) => {
  try {


      
      // Extract the token from the Authorization header, removing the 'Bearer' keyword
      const token = req.headers['authorization']?.split(' ')[1]; // Split the string at space

      if (!token) {
          return res.status(401).json({ message: 'Authorization token not provided.' });
      }

      
      const decoded = jwt.verify(token, 'areeba@123'); 
      const userId = decoded.id; 

      console.log("server",userId); 
   const query='SELECT * from agent_performance where agent_id=?';
   const [results] = await db.execute(query, [userId]);
console.log(results);
      if (results.length===0) {
          return res.status(404).json({ message: 'Performance data not found for this agent.' });
      }

      // Send performance data in response
      return res.status(200).json({
          results,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error while fetching performance data.' });
  }
});



app.get("/sales/statistics", async (req, res) => {
  const query = `
    SELECT 
      DATE(o.order_date) AS date,
      COUNT(o.id) AS total_sales,
      SUM(o.quantity * i.price) AS revenue
    FROM userOrders o
    JOIN items i ON o.item_id = i.id
    GROUP BY DATE(o.order_date)
    ORDER BY DATE(o.order_date);
  `;

  try {
    const [rows] = await db.query(query);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No sales data found." });
    }

    const daily_sales = rows.map(row => ({
      date: row.date,
      sales: row.total_sales,
    }));

    return res.json({
      total_sales: rows.reduce((sum, row) => sum + row.total_sales, 0),
      revenue: rows.reduce((sum, row) => sum + row.revenue, 0),
      daily_sales,
    });
  } catch (err) {
    console.error("Error fetching sales statistics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Fetch Team Performance
app.get("/sales/team-performance", async (req, res) => {
  const query = `
    SELECT 
      ad.agent_id,
      ad.agent_name,
      ad.sales_completed AS total_sales,
      ad.sales_target,
      ROUND((ad.sales_completed / ad.sales_target) * 100, 2) AS fulfillment_rate
    FROM 
      agentDetails ad
  `;

  try {
    const [results] = await db.query(query);
    res.json({ team_performance: results });
  } catch (err) {
    console.error("Error fetching team performance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Route to get sales targets
app.get("/sales/targets", async (req, res) => {
  const query = `
    SELECT agent_id, sales_target, performance_date
    FROM agent_performance
    ORDER BY performance_date DESC;
  `;

  try {
    const [results] = await db.query(query);
    res.json({ sales_targets: results });
  } catch (err) {
    console.error("Error fetching sales targets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/report/performance-csv', async (req, res) => {
  try {
    
    const [results] = await db.query('SELECT * FROM agentDetails');
    
    const parser = new Parser();
    const csv = parser.parse(results);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('team_performance.csv');
    res.send(csv);
  } catch (error) {
    console.error("Error fetching data for CSV:", error);
    res.status(500).send("Error fetching data");
  }
});



app.get('/report/orders-csv', async (req, res) => {
  try {
    // Query data from the orders table
    const [orders] = await db.query('SELECT * FROM userOrders');

    // Convert the fetched data to CSV
    const parser = new Parser();
    const csv = parser.parse(orders);

    // Set response headers and send the CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (error) {
    console.error("Error fetching data for Orders CSV:", error);
    res.status(500).send("Error fetching data for Orders CSV");
  }
});



app.get('/report/sales-csv', async (req, res) => {
  try {
    // Query data from the salesdetails table
    const [salesDetails] = await db.query('SELECT * FROM agentDetails');

    // Convert the fetched data to CSV
    const parser = new Parser();
    const csv = parser.parse(salesDetails);

    // Set response headers and send the CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('salesdetails.csv');
    res.send(csv);
  } catch (error) {
    console.error("Error fetching data for Sales Details CSV:", error);
    res.status(500).send("Error fetching data for Sales Details CSV");
  }
});



app.get('/admin/orders-status-summary', async (req, res) => {
  try {
    const query = `
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `;
    const [results] = await db.query(query);
    res.json(results); 
  } catch (error) {
    console.error('Error fetching order status summary:', error);
    res.status(500).send('Error fetching data');
  }
});
app.get('/admin/orders', async (req, res) => {
  try {
    const query = `SELECT * FROM orders`;
    const [orders] = await db.query(query);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});
app.put('/admin/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = `UPDATE orders SET status = ? WHERE id = ?`;
    await db.query(query, [status, id]);
    res.status(200).send('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Error updating order status');
  }
});


//admin permissions
app.get("/permissions", async (req, res) => {
  const query = `
    SELECT 
      permissions.id, 
      users.id AS user_id,  
      permissions.Per_edit, 
      permissions.Per_add, 
      permissions.Per_performance 
    FROM permissions 
    JOIN users ON permissions.user_id = users.id 
    WHERE users.role NOT IN ('admin', 'superadmin');
  `;

  try {
    const [results] = await db.query(query); // Use promise-based query
    res.status(200).json(results);          // Return the results
  } catch (err) {
    console.error("Error fetching permissions:", err);
    res.status(500).json({
      message: "Error fetching permissions.",
      error: err.message, // Include error details for debugging
    });
  }
});



// Update permissions
app.put("/permissions/:id", async(req, res) => {
  const { id } = req.params;
  const { Per_edit, Per_add, Per_performance } = req.body;

  const query = `
    UPDATE permissions 
    SET Per_edit = ?, Per_add = ?, Per_performance = ? 
    WHERE id = ?;
  `;

  const values = [Per_edit, Per_add, Per_performance, id];

 await db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating permissions:", err);
      return res.status(500).json({ message: "Error updating permissions." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Permission not found." });
    }

    res.status(200).json({ message: "Permissions updated successfully." });
  });
});



app.post("/create-user", async (req, res) => {
  const { email, role, password } = req.body;

  try {
    
   

    
    const query = 'INSERT INTO users ( email, role, password, created_at) VALUES ( ?, ?, ?, NOW())';
    await db.query(query, [ email, role, password]);

    res.status(200).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error
    res.status(500).json({ success: false, message: "Error creating user", error });
  }
});





app.delete("/delete-user/:id",  async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.query(query, [id]);

    // Log the action
    //await logAction("Delete User", adminId, `Deleted user with ID: ${id}`);

    res.status(200).json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user", error });
  }
});

app.get("/users",  async (req, res) => {
  try {
    const query = 'SELECT id,  email, role,created_at FROM users WHERE users.role NOT IN ("admin", "superadmin") ';
    const [users] = await db.query(query);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error });
  }
});





//user sideee


// Fetch user details with their orders
app.get('/api/user-details', async (req, res) => {
  const userId = req.query.userId; // Get userId from query params

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Fetch user details
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    // Fetch user orders
    const [orders] = await db.query('SELECT * FROM userOrders WHERE userId = ?', [user.id]);
    user.userOrders = orders;

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err });
  }
});

// Fetch agents for dropdown
app.get('/api/agents', async (req, res) => {
  try {
    const [agents] = await db.query('SELECT * FROM agentDetails');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agents', error: err });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM items');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err });
  }
});


const generateTrackingId = () => {
  return 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(); // Generate random tracking ID
};

// app.post('/api/place-order', async (req, res) => {

//   const { customer_name, quantity, agent_id, item_id } = req.body;
// console.log(customer_name, quantity, agent_id, item_id);

//   if (!customer_name ||   !quantity || !agent_id || !item_id) {
//     return res.status(400).json({ message: 'Missing required fields.' });
//   }

//   try {
//     const [[itemPrice]] = await db.execute(
//       'SELECT price FROM items WHERE id = ?',
//       [item_id]
//     );

//     if (!itemPrice) {
//       return res.status(400).json({ message: 'Invalid item selected.' });
//     }
 
//     const tracking_id = generateTrackingId();
   

//     await db.execute(
//       'INSERT INTO userOrders (customer_name,  quantity,  agent_id, item_id, tracking_id, order_date) VALUES (?,   ?, ?, ?, ?, NOW())',
//       [customer_name,  quantity,  agent_id, item_id, tracking_id]
//     );

//     await db.execute(
//       'UPDATE agentDetails SET sales_completed = sales_completed + 1 WHERE id = ?',
//       [agent_id]
//     );

//     res.json({ message: 'Order placed successfully.' });
//   } catch (err) {
//     console.error('Error placing order:', err);
//     res.status(500).json({ message: 'Error placing order', error: err.message });
//   }

// });





// const generateTrackingId = () => {
//   // Example function to generate tracking ID, you can customize the logic
//   return 'TRK-' + Math.random().toString(36).substring(2, 12).toUpperCase();
// };

app.post('/api/place-order', async (req, res) => {
  const { customer_name, agent_id, items } = req.body;

  // Ensure all required fields are provided
  if (!customer_name || !agent_id || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  console.log(items);
  try {
    console.log('Request Data:', req.body); // Log request data to verify input

    // Map items to numeric item IDs
    const itemIds = items.map(item => Number(item.item_id));
    console.log('Item IDs:', itemIds); // Log item IDs to verify

    // Ensure all item IDs are numbers
    for (let id of itemIds) {
      if (isNaN(id)) {
        console.error(`Invalid item_id found: ${id}`);
        return res.status(400).json({ message: `Invalid item_id found: ${id}` });
      }
    }

    // Check if we have valid itemIds
    if (itemIds.length === 0) {
      return res.status(400).json({ message: 'No valid item IDs provided.' });
    }

    // Create a dynamic query with the item IDs
    const [validItems] = await db.execute(
      'SELECT id, price, item_description FROM items WHERE id IN (' + itemIds.join(',') + ')'
    );
    console.log('Query Result:', validItems); // Log the result of the query

    if (validItems.length === 0) {
      console.error('No valid items found.');
      return res.status(400).json({ message: 'No valid items found.' });
    }

    let totalBill = 0;
    let tracking_id = generateTrackingId();
    
    // Ensure the tracking ID is unique
   // Ensure the tracking ID is unique
let isUnique = false;
while (!isUnique) {
  const [existingOrder] = await db.execute(
    'SELECT COUNT(*) AS count FROM userOrders WHERE tracking_id = ?',
    [tracking_id]
  );
  if (existingOrder[0].count === 0) {
    isUnique = true;
  } else {
    console.log('Duplicate tracking_id found:', tracking_id); // Log duplicate for debugging
    tracking_id = generateTrackingId(); // Regenerate if not unique
  }
}


    await db.beginTransaction();

    // Process each item in the order
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const validItem = validItems.find(validItem => validItem.id === Number(item.item_id));

      if (!validItem) {
        console.error(`Invalid item_id: ${item.item_id}`);
        continue; // Skip invalid items
      }

      // Calculate total item price
      const totalItemPrice = validItem.price * item.quantity;
      totalBill += totalItemPrice;

      console.log(`Item ID: ${item.item_id}, Quantity: ${item.quantity}, Price: ${validItem.price}, Total Item Price: ${totalItemPrice}`);

      // Insert the order details for each valid item
      await db.execute(
        'INSERT INTO userOrders (customer_name, quantity, agent_id, item_id, tracking_id, order_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [customer_name, item.quantity, agent_id, item.item_id, tracking_id]
      );
    }

    // Update agent's sales count
    await db.execute(
      'UPDATE agentDetails SET sales_completed = sales_completed + 1 WHERE id = ?',
      [agent_id]
    );

    await db.commit();

    console.log('Total Bill:', totalBill); // Log the total bill calculation
    res.json({
      message: 'Order placed successfully.',
      orderDetails: {
        tracking_id,
        customer_name,
        items,
        total_bill:totalBill,
        agent_id,
      },
    });
  } catch (err) {
    await db.rollback();
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});




app.get('/api/order/:trackingId', async (req, res) => {
  // Step 1: Log the incoming request and tracking ID
  console.log('Received request for tracking ID:', req.params.trackingId);

  const trackingId = req.params.trackingId;

  const orderQuery = `
    SELECT 
      od.tracking_id, 
      od.customer_name, 
      a.agent_name, 
      od.quantity, 
      i.item_description
    FROM userOrders od
    INNER JOIN agentDetails a ON od.agent_id = a.id
    INNER JOIN items i ON od.item_id = i.id
    WHERE od.tracking_id = ?;
  `;

  // Step 2: Log the query to check its correctness
  console.log('Executing query:', orderQuery);

  db.query(orderQuery, [trackingId], (err, results) => {
    // Step 3: Check for query execution errors
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ message: 'Error fetching order details' });
    }

    // Step 4: Log the raw results returned by the database
    console.log('Query executed successfully. Results:', results);

    if (results.length === 0) {
      console.log('No order found for the provided tracking ID.');
      return res.status(404).json({ message: 'Order not found' });
    }

    // Step 5: Log the mapped `orderDetails` object to ensure correctness
    const orderDetails = {
      tracking_id: results[0].tracking_id,
      customer_name: results[0].customer_name,
      agent_name: results[0].agent_name,
      items: results.map((row) => ({
        item_description: row.item_description,
        quantity: row.quantity,
      })),
    };

    console.log('Constructed order details:', orderDetails);

    // Step 6: Log the response before sending it
    console.log('Sending response:', orderDetails);

    res.status(200).json(orderDetails);
  });
});






// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
