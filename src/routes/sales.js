const express = require("express");
const router = express.Router();
const db = require("./db"); // Assuming you're using a database like MySQL

// Fetch all sales records
router.get("/api/sales", async (req, res) => {
  try {
    const salesRecords = await db.query("SELECT * FROM sales");
    res.json(salesRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sales records" });
  }
});

// Add a new sale record
router.post("/api/sales", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await db.query("INSERT INTO sales (email, password, role) VALUES (?, ?, ?)", [email, password, role]);
    res.status(201).json({ id: result.insertId, email, password, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add sale record" });
  }
});

// Update a sale record
router.put("/api/sales/:id", async (req, res) => {
  const { email, password, role } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query("UPDATE sales SET email = ?, password = ?, role = ? WHERE id = ?", [email, password, role, id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Sale record updated successfully" });
    } else {
      res.status(404).json({ error: "Sale record not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sale record" });
  }
});

module.exports = router;
