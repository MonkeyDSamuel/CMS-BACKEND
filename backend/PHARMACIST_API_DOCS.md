# Pharmacist API Documentation

This document outlines all the CRUD operations available for the pharmacist module.

## Base URL
```
http://localhost:9002/api/pharmacist
```

## Medicine Endpoints

### 1. Add Medicine (POST)
**Endpoint:** `POST /medicines`

**Request Body:**
```json
{
  "medicine_id": "MED001",
  "name": "Paracetamol",
  "description": "Pain reliever and fever reducer",
  "status": "available"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "data": {
    "_id": "...",
    "medicine_id": "MED001",
    "name": "Paracetamol",
    "description": "Pain reliever and fever reducer",
    "status": "available",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Medicines (GET)
**Endpoint:** `GET /medicines`

**Query Parameters:**
- `status` (optional): Filter by status (`available` or `unavailable`)
- `search` (optional): Search in name and description

**Example:** `GET /medicines?status=available&search=para`

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "medicine_id": "MED001",
      "name": "Paracetamol",
      "description": "Pain reliever and fever reducer",
      "status": "available",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Medicine by ID (GET)
**Endpoint:** `GET /medicines/:medicineId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "medicine_id": "MED001",
    "name": "Paracetamol",
    "description": "Pain reliever and fever reducer",
    "status": "available",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Medicine (PUT)
**Endpoint:** `PUT /medicines/:medicineId`

**Request Body:**
```json
{
  "name": "Updated Paracetamol",
  "description": "Updated description",
  "status": "unavailable"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "data": {
    "_id": "...",
    "medicine_id": "MED001",
    "name": "Updated Paracetamol",
    "description": "Updated description",
    "status": "unavailable",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Medicine (DELETE)
**Endpoint:** `DELETE /medicines/:medicineId`

**Response:**
```json
{
  "success": true,
  "message": "Medicine deleted successfully"
}
```

### 6. Deactivate Medicine (PATCH)
**Endpoint:** `PATCH /medicines/:medicineId/deactivate`

**Response:**
```json
{
  "success": true,
  "message": "Medicine deactivated successfully",
  "data": {
    "_id": "...",
    "medicine_id": "MED001",
    "name": "Paracetamol",
    "status": "unavailable",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Inventory Endpoints

### 1. Add Inventory (POST)
**Endpoint:** `POST /inventory`

**Request Body:**
```json
{
  "inventory_id": "INV001",
  "medicine_id": "MED001",
  "quantity": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inventory added successfully",
  "data": {
    "_id": "...",
    "inventory_id": "INV001",
    "medicine_id": "MED001",
    "quantity": 100,
    "low_stock_flag": false,
    "status": "in_stock",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Inventory (GET)
**Endpoint:** `GET /inventory`

**Query Parameters:**
- `status` (optional): Filter by status (`in_stock` or `out_of_stock`)
- `low_stock` (optional): Filter by low stock flag (`true` or `false`)

**Example:** `GET /inventory?status=in_stock&low_stock=true`

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "inventory_id": "INV001",
      "medicine_id": "MED001",
      "quantity": 100,
      "low_stock_flag": false,
      "status": "in_stock",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Inventory by ID (GET)
**Endpoint:** `GET /inventory/:inventoryId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "inventory_id": "INV001",
    "medicine_id": "MED001",
    "quantity": 100,
    "low_stock_flag": false,
    "status": "in_stock",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Inventory (PUT)
**Endpoint:** `PUT /inventory/:inventoryId`

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inventory updated successfully",
  "data": {
    "_id": "...",
    "inventory_id": "INV001",
    "medicine_id": "MED001",
    "quantity": 50,
    "low_stock_flag": false,
    "status": "in_stock",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Inventory (DELETE)
**Endpoint:** `DELETE /inventory/:inventoryId`

**Response:**
```json
{
  "success": true,
  "message": "Inventory deleted successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

For validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Medicine ID is required",
      "path": "medicine_id",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Features

1. **Automatic Stock Management**: 
   - Low stock flag is automatically set when quantity < 10
   - Status automatically changes to 'out_of_stock' when quantity = 0

2. **Search and Filter**: 
   - Medicines can be searched by name and description
   - Filter by status and low stock indicators

3. **Validation**: 
   - Comprehensive input validation for all fields
   - Proper error messages for invalid data

4. **Timestamps**: 
   - Automatic creation and update timestamps
   - Track when records were last modified 