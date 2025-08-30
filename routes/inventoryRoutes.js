// 📂 backend/hackathon-flow/routes/inventoryRoutes.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all inventory items, including supplier name using a JOIN
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT i.id, i.name, i.on_hand, i.cost_per_unit, s.name AS supplier_name
      FROM inventory i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ORDER BY i.name ASC;
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST a new inventory item
router.post('/', async (req, res) => {
  const { name, on_hand, cost_per_unit, supplier_id } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO inventory (name, on_hand, cost_per_unit, supplier_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, on_hand, cost_per_unit, supplier_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update inventory item (including on_hand)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, on_hand, cost_per_unit, supplier_id } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE inventory SET name = $1, on_hand = $2, cost_per_unit = $3, supplier_id = $4 WHERE id = $5 RETURNING *',
      [name, on_hand, cost_per_unit, supplier_id, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM inventory WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
