// server.js

// 📂 backend/hackathon-flow/server.js
const express = require('express');
const cors = require('cors');


const inventoryRoutes = require('./routes/inventoryRoutes');

const wasteLogRoutes = require('./routes/wasteLogRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());



// Mount inventory, waste log, and supplier routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/waste', wasteLogRoutes);
app.use('/api/suppliers', supplierRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('WagaWaste-Watch Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server is live and listening on http://localhost:${PORT}`);
});
