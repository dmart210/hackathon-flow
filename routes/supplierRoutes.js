// 📂 backend/hackathon-flow/routes/supplierRoutes.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM suppliers ORDER BY name ASC;');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new supplier
router.post('/', async (req, res) => {
  const { name, contact_person, phone_number } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO suppliers (name, contact_person, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [name, contact_person, phone_number]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update supplier
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone_number } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE suppliers SET name = $1, contact_person = $2, phone_number = $3 WHERE id = $4 RETURNING *',
      [name, contact_person, phone_number, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM suppliers WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
