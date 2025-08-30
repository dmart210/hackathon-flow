// 📂 backend/hackathon-flow/routes/wasteLogRoutes.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all waste log entries, including the name of the wasted item
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT w.id, i.name AS item_name, w.quantity_wasted, w.reason, w.logged_at
      FROM waste_log w
      JOIN inventory i ON w.inventory_id = i.id
      ORDER BY w.logged_at DESC;
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST a new waste log entry
router.post('/', async (req, res) => {
  const { inventory_id, quantity_wasted, reason } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO waste_log (inventory_id, quantity_wasted, reason) VALUES ($1, $2, $3) RETURNING *',
      [inventory_id, quantity_wasted, reason]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update waste log entry
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { inventory_id, quantity_wasted, reason } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE waste_log SET inventory_id = $1, quantity_wasted = $2, reason = $3 WHERE id = $4 RETURNING *',
      [inventory_id, quantity_wasted, reason, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Waste log not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE waste log entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM waste_log WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Waste log not found' });
    res.json({ message: 'Waste log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
