# Pharmacist API Postman Testing Guide

This guide provides comprehensive instructions for testing all Pharmacist API endpoints using Postman.

## Prerequisites

1. **Server Setup**: Ensure the backend server is running on `http://localhost:8002`
2. **Postman Collection**: Import the `Clinic_Management_API.postman_collection.json` file
3. **Authentication**: You'll need to login as a Pharmacist to get the authentication token

## Authentication Setup

### Step 1: Pharmacist Login
1. Open the "Authentication" folder in the collection
2. Find "Pharmacist Login" request
3. Update the request body with valid credentials:
```json
{
  "pharmacist_Id": "PHM0001",
  "password": "password123"
}
```
4. Send the request
5. Copy the `token` from the response

### Step 2: Set Environment Variables
1. In Postman, go to the "Variables" tab in the collection
2. Set `pharmacist_token` to the token received from login
3. Ensure `base_url` is set to `http://localhost:8002`

## Pharmacist API Endpoints

### 5.1 Medicine Management

#### 5.1.1 Add New Medicine
- **Method**: POST
- **URL**: `{{base_url}}/api/medicines`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{pharmacist_token}}`
- **Body**:
```json
{
  "name": "Paracetamol",
  "description": "Pain reliever",
  "quantity": 100,
  "price_per_unit": 5.50
}
```

#### 5.1.2 Update Medicine Details
- **Method**: PUT
- **URL**: `{{base_url}}/api/medicines/{medicineId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{pharmacist_token}}`
- **Body**:
```json
{
  "name": "Paracetamol 500mg",
  "description": "Updated pain reliever with specific dosage",
  "quantity": 150,
  "price_per_unit": 6.00
}
```

#### 5.1.3 Get Medicine by ID
- **Method**: GET
- **URL**: `{{base_url}}/api/medicines/{medicineId}`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`

#### 5.1.4 List All Medicines
- **Method**: GET
- **URL**: `{{base_url}}/api/medicines`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`
- **Optional Query Parameters**:
  - `status`: Filter by status (available, unavailable)
  - `search`: Search by name or description
  - `low_stock`: Filter low stock items (true/false)

#### 5.1.5 Deactivate Medicine
- **Method**: PATCH
- **URL**: `{{base_url}}/api/medicines/{medicineId}/deactivate`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`

### 5.2 Medicine Inventory Management

#### 5.2.1 Add New Inventory Item
- **Method**: POST
- **URL**: `{{base_url}}/api/inventory/medicine`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{pharmacist_token}}`
- **Body**:
```json
{
  "name": "Aspirin",
  "description": "Pain reliever",
  "quantity": 50,
  "price_per_unit": 3.00
}
```

#### 5.2.2 Update Inventory Quantity
- **Method**: PUT
- **URL**: `{{base_url}}/api/inventory/medicine/{medicineStockId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{pharmacist_token}}`
- **Body**:
```json
{
  "quantity": 75,
  "price_per_unit": 3.50
}
```

#### 5.2.3 Get Inventory by Medicine ID
- **Method**: GET
- **URL**: `{{base_url}}/api/inventory/medicine/{medicineId}`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`

#### 5.2.4 List All Inventory Items
- **Method**: GET
- **URL**: `{{base_url}}/api/inventory/medicine`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`

#### 5.2.5 Flag Low Stock
- **Method**: PATCH
- **URL**: `{{base_url}}/api/inventory/medicine/{medicineStockId}/flag-low`
- **Headers**: 
  - `Authorization: Bearer {{pharmacist_token}}`

## Testing Workflow

### Step 1: Setup Test Data
Before testing, ensure you have:
- Valid medicine IDs (e.g., "MED0001")
- Valid medicine stock IDs (e.g., "MEDSTOCK0001")
- Valid medicine names and descriptions for testing

### Step 2: Authentication
1. Login as a pharmacist to get the authentication token
2. Set the `pharmacist_token` variable in the collection

### Step 3: Test Medicine Management
1. Create a new medicine using POST `/api/medicines`
2. Retrieve the medicine by ID using GET `/api/medicines/{medicineId}`
3. Update medicine details using PUT `/api/medicines/{medicineId}`
4. List all medicines using GET `/api/medicines`
5. Deactivate a medicine using PATCH `/api/medicines/{medicineId}/deactivate`

### Step 4: Test Medicine Inventory Management
1. Add a new inventory item using POST `/api/inventory/medicine`
2. Update inventory quantity using PUT `/api/inventory/medicine/{medicineStockId}`
3. Get inventory by medicine ID using GET `/api/inventory/medicine/{medicineId}`
4. List all inventory items using GET `/api/inventory/medicine`
5. Flag low stock using PATCH `/api/inventory/medicine/{medicineStockId}/flag-low`

## Expected Responses

### Successful Responses
- **201 Created**: For successful creation of medicines/inventory items
- **200 OK**: For successful updates and retrievals
- **200 OK**: For successful list operations (returns array)
- **200 OK**: For successful deactivation and flagging operations

### Error Responses
- **400 Bad Request**: Invalid request data or missing required parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

## Data Models

### Medicine Schema
```javascript
{
  _id: ObjectId (auto-generated),
  name: String (required),
  description: String,
  quantity: Number,
  price_per_unit: Number,
  status: String (default: 'available'),
  low_stock_flag: Boolean (default: false),
  addedAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Medicine Inventory Schema
```javascript
{
  _id: ObjectId (auto-generated),
  medicine_id: String (required),
  name: String (required),
  description: String,
  quantity: Number,
  price_per_unit: Number,
  low_stock_flag: Boolean (default: false),
  addedAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Query Parameters

### List All Medicines
- `status`: Filter by status ('available', 'unavailable')
- `search`: Search in name and description fields
- `low_stock`: Filter low stock items ('true', 'false')

## Status Values

### Medicine Status
- `available`: Medicine is available for use
- `unavailable`: Medicine is deactivated/unavailable

### Low Stock Flag
- `true`: Medicine is flagged as low stock
- `false`: Medicine has sufficient stock

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure the pharmacist token is valid and properly set
2. **404 Errors**: Verify that the referenced IDs (medicines, inventory items, etc.) exist
3. **400 Errors**: Check that the request body matches the expected schema
4. **Server Connection**: Ensure the backend server is running on the correct port

### Debugging Tips
1. Check the server logs for detailed error messages
2. Verify the request headers and body format
3. Ensure all required fields are provided in the request body
4. Test with valid IDs that exist in the database
5. Use proper query parameters for filtering

## Additional Features

### Medicine Quantity Management
The system includes additional endpoints for comprehensive medicine quantity management:

- **Update Medicine Quantity**: `PUT /api/medicines/{medicineId}/quantity`
- **Get Low Stock Medicines**: `GET /api/medicines/low-stock`

### Inventory Management Features
- Automatic low stock detection
- Price tracking and updates
- Stock level monitoring
- Inventory history tracking

## Business Logic

### Low Stock Detection
- Medicines with quantity below threshold are automatically flagged
- Manual flagging available for special cases
- Low stock alerts for inventory management

### Price Management
- Price per unit tracking
- Price update capabilities
- Cost analysis and reporting

### Status Management
- Active/Inactive medicine status
- Deactivation without deletion
- Status-based filtering and reporting

## Notes

- All endpoints require Pharmacist or Administrator role authentication
- Auto-generated IDs follow MongoDB ObjectId format
- The system automatically generates timestamps for creation and updates
- All references to other collections are validated
- Low stock flags are automatically managed based on quantity thresholds
- Price updates are tracked with timestamps
- Inventory management includes comprehensive stock tracking 