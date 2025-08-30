# WagaWaste-Watch Backend API

A comprehensive REST API for restaurant waste management and inventory tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Setup
1. **Clone and navigate to backend:**
   ```bash
   cd backend/hackathon-flow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

5. **Server runs on:** `http://localhost:8080`

---

## 📊 Database Schema

### Tables
- **suppliers** - Supplier information
- **inventory** - Food items and stock levels
- **waste_log** - Waste tracking events

### Sample Data
The database comes pre-populated with:
- 2 suppliers (Fresh Produce Inc., Meats & More Co.)
- 3 inventory items (Noodles, Broth, Chicken)
- 2 waste log entries

---

## 🔗 API Endpoints

### Health Check
```
GET /
```
**Response:** Server status message

---

## 🏪 Suppliers API

### Get All Suppliers
```
GET /api/suppliers
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Fresh Produce Inc.",
    "contact_person": "Alice Smith",
    "phone_number": "212-555-0101"
  }
]
```

### Create New Supplier
```
POST /api/suppliers
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Fresh Foods Inc",
  "contact_person": "John Doe",
  "phone_number": "555-0123"
}
```

### Update Supplier
```
PATCH /api/suppliers/:id
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Updated Supplier Name",
  "contact_person": "Jane Smith",
  "phone_number": "555-9999"
}
```

### Delete Supplier
```
DELETE /api/suppliers/:id
```
**Response:** `{ "message": "Supplier deleted" }`

---

## 📦 Inventory API

### Get All Inventory Items
```
GET /api/inventory
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Noodles",
    "on_hand": 85,
    "cost_per_unit": "0.50",
    "supplier_name": "Fresh Produce Inc."
  }
]
```

### Create New Inventory Item
```
POST /api/inventory
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Ramen Noodles",
  "on_hand": 100,
  "cost_per_unit": 2.50,
  "supplier_id": 1
}
```

### Update Inventory Item
```
PATCH /api/inventory/:id
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Updated Noodles",
  "on_hand": 75,
  "cost_per_unit": 3.00,
  "supplier_id": 2
}
```

### Delete Inventory Item
```
DELETE /api/inventory/:id
```
**Response:** `{ "message": "Inventory item deleted" }`

---

## 🗑️ Waste Log API

### Get All Waste Logs
```
GET /api/waste
```
**Response:**
```json
[
  {
    "id": 1,
    "item_name": "Noodles",
    "quantity_wasted": "2.50",
    "reason": "Overcooked batch",
    "logged_at": "2025-08-30T10:30:00.000Z"
  }
]
```

### Create New Waste Log
```
POST /api/waste
Content-Type: application/json
```
**Request Body:**
```json
{
  "inventory_id": 1,
  "quantity_wasted": 2.5,
  "reason": "Dropped on floor during busy period"
}
```

### Update Waste Log
```
PATCH /api/waste/:id
Content-Type: application/json
```
**Request Body:**
```json
{
  "inventory_id": 1,
  "quantity_wasted": 3.0,
  "reason": "Updated reason for waste"
}
```

### Delete Waste Log
```
DELETE /api/waste/:id
```
**Response:** `{ "message": "Waste log deleted" }`

---

## 🧪 Testing with cURL

### Test Server Health
```bash
curl http://localhost:8080/
```

### Get All Inventory
```bash
curl http://localhost:8080/api/inventory
```

### Add New Inventory Item
```bash
curl -X POST http://localhost:8080/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Noodles",
    "on_hand": 50,
    "cost_per_unit": 1.25,
    "supplier_id": 1
  }'
```

### Add New Waste Log
```bash
curl -X POST http://localhost:8080/api/waste \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_id": 1,
    "quantity_wasted": 1.5,
    "reason": "Testing waste tracking"
  }'
```

---

## 🛠️ Development

### Project Structure
```
backend/hackathon-flow/
├── docker-compose.yml          # PostgreSQL container config
├── package.json               # Node.js dependencies
├── server.js                  # Main server file
├── db.js                     # Database connection
└── routes/
    ├── inventoryRoutes.js    # Inventory CRUD operations
    ├── supplierRoutes.js     # Supplier CRUD operations
    └── wasteLogRoutes.js     # Waste log CRUD operations
```

### Database Connection
- **Host:** localhost
- **Port:** 5432
- **Database:** waga_db
- **User:** myuser
- **Password:** mypassword

### Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `pg` - PostgreSQL client

---

## 🚨 Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `404` - Not found
- `500` - Server error

Error format:
```json
{
  "error": "Error description here"
}
```

---

## 📝 Notes

- All timestamps are in UTC ISO format
- Numeric values are returned as strings for precision
- Foreign key relationships are maintained between tables
- CORS is enabled for all origins (suitable for development)

---

## 🎯 Next Steps

1. **Frontend Integration:** Build a React/Vue/HTML frontend
2. **Authentication:** Add user login/signup
3. **Analytics:** Create waste reporting dashboards
4. **Deployment:** Deploy to cloud platform
5. **Mobile App:** Create mobile companion app

---

**Happy coding! 🎉**
