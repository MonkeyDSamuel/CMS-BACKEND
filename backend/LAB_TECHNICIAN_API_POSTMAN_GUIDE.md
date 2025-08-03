# Lab Technician API Postman Testing Guide

This guide provides comprehensive instructions for testing all Lab Technician API endpoints using Postman.

## Prerequisites

1. **Server Setup**: Ensure the backend server is running on `http://localhost:8002`
2. **Postman Collection**: Import the `Clinic_Management_API.postman_collection.json` file
3. **Authentication**: You'll need to login as a Lab Technician to get the authentication token

## Authentication Setup

### Step 1: Lab Technician Login
1. Open the "Authentication" folder in the collection
2. Find "Lab Technician Login" request
3. Update the request body with valid credentials:
```json
{
  "labtech_Id": "LABTECH0001",
  "password": "password123"
}
```
4. Send the request
5. Copy the `token` from the response

### Step 2: Set Environment Variables
1. In Postman, go to the "Variables" tab in the collection
2. Set `labtech_token` to the token received from login
3. Ensure `base_url` is set to `http://localhost:8002`

## Lab Technician API Endpoints

### 4.1 Lab Test Prescription Management

#### 4.1.1 Record Lab Test Result
- **Method**: PUT
- **URL**: `{{base_url}}/api/labtests/results/{labTestPrescriptionId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{labtech_token}}`
- **Body**:
```json
{
  "result_notes": "Normal blood count with all parameters within normal range",
  "status": "completed",
  "date_tested": "2024-01-15T10:30:00Z"
}
```

#### 4.1.2 Get Lab Test Result by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/labtests/results/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`

#### 4.1.3 List Lab Test Results by Date Range
- **Method**: GET
- **URL**: `{{base_url}}/api/labtests/results?startDate={startDate}&endDate={endDate}`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`
- **Query Parameters**:
  - `startDate`: Start date in YYYY-MM-DD format
  - `endDate`: End date in YYYY-MM-DD format

#### 4.1.4 Deactivate Lab Test Prescription
- **Method**: PATCH
- **URL**: `{{base_url}}/api/labtests/{labTestPrescriptionId}/deactivate`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`

### 4.2 Lab Test Management

#### 4.2.1 Add New Lab Test
- **Method**: POST
- **URL**: `{{base_url}}/api/labtests`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{labtech_token}}`
- **Body**:
```json
{
  "name": "Blood Test",
  "description": "Complete blood count test",
  "min_reading": 70,
  "max_reading": 140
}
```

#### 4.2.2 Update Lab Test Details
- **Method**: PUT
- **URL**: `{{base_url}}/api/labtests/{labTestId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{labtech_token}}`
- **Body**:
```json
{
  "name": "Complete Blood Count",
  "description": "Updated complete blood count test with detailed parameters",
  "min_reading": 65,
  "max_reading": 145
}
```

#### 4.2.3 Get Lab Test by ID
- **Method**: GET
- **URL**: `{{base_url}}/api/labtests/{labTestId}`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`

#### 4.2.4 List All Lab Tests
- **Method**: GET
- **URL**: `{{base_url}}/api/labtests`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`
- **Optional Query Parameters**:
  - `status`: Filter by status (available, unavailable)
  - `search`: Search by name or description

#### 4.2.5 Deactivate Lab Test
- **Method**: PATCH
- **URL**: `{{base_url}}/api/labtests/{labTestId}/deactivate`
- **Headers**: 
  - `Authorization: Bearer {{labtech_token}}`

## Testing Workflow

### Step 1: Setup Test Data
Before testing, ensure you have:
- Valid lab test prescription IDs (e.g., "LABPRES0001")
- Valid appointment IDs (e.g., "APP0001")
- Valid lab test IDs (e.g., "LABTEST0001")
- Valid date ranges for testing

### Step 2: Authentication
1. Login as a lab technician to get the authentication token
2. Set the `labtech_token` variable in the collection

### Step 3: Test Lab Test Management
1. Create a new lab test using POST `/api/labtests`
2. Retrieve the lab test by ID using GET `/api/labtests/{labTestId}`
3. Update the lab test details using PUT `/api/labtests/{labTestId}`
4. List all lab tests using GET `/api/labtests`
5. Deactivate a lab test using PATCH `/api/labtests/{labTestId}/deactivate`

### Step 4: Test Lab Test Prescription Management
1. Record lab test results using PUT `/api/labtests/results/{labTestPrescriptionId}`
2. Get lab test results by appointment ID using GET `/api/labtests/results/appointment/{appointmentId}`
3. List lab test results by date range using GET `/api/labtests/results?startDate={startDate}&endDate={endDate}`
4. Deactivate lab test prescription using PATCH `/api/labtests/{labTestPrescriptionId}/deactivate`

## Expected Responses

### Successful Responses
- **201 Created**: For successful creation of lab tests
- **200 OK**: For successful updates and retrievals
- **200 OK**: For successful list operations (returns array)
- **200 OK**: For successful deactivation operations

### Error Responses
- **400 Bad Request**: Invalid request data or missing required parameters
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

## Data Models

### Lab Test Schema
```javascript
{
  _id: ObjectId (auto-generated),
  name: String (required),
  description: String,
  min_reading: Number,
  max_reading: Number,
  status: String (default: 'available'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Lab Test Result Schema
```javascript
{
  _id: ObjectId (auto-generated),
  lab_test_id: String (required),
  app_id: String (required),
  doc_id: String (required),
  result_notes: String,
  status: String (default: 'pending'),
  date_tested: Date,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Query Parameters

### List All Lab Tests
- `status`: Filter by status ('available', 'unavailable')
- `search`: Search in name and description fields

### List Lab Test Results by Date Range
- `startDate`: Start date in YYYY-MM-DD format (required)
- `endDate`: End date in YYYY-MM-DD format (required)

## Status Values

### Lab Test Status
- `available`: Test is available for use
- `unavailable`: Test is deactivated/unavailable

### Lab Test Result Status
- `pending`: Result is pending
- `completed`: Result is completed
- `cancelled`: Result is cancelled

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure the lab technician token is valid and properly set
2. **404 Errors**: Verify that the referenced IDs (lab tests, appointments, etc.) exist
3. **400 Errors**: Check that the request body matches the expected schema
4. **Date Range Errors**: Ensure startDate and endDate are in correct format (YYYY-MM-DD)
5. **Server Connection**: Ensure the backend server is running on the correct port

### Debugging Tips
1. Check the server logs for detailed error messages
2. Verify the request headers and body format
3. Ensure all required fields are provided in the request body
4. Test with valid IDs that exist in the database
5. Use proper date formats for date range queries

## Additional Features

### Lab Test Results Management (Extended)
The system also includes additional endpoints for comprehensive lab test results management:

- **Create Lab Test Result**: `POST /api/labtest-results`
- **Update Lab Test Result**: `PUT /api/labtest-results/{resultId}`
- **Get Lab Test Result by ID**: `GET /api/labtest-results/{resultId}`
- **List All Lab Test Results**: `GET /api/labtest-results`
- **Delete Lab Test Result**: `DELETE /api/labtest-results/{resultId}`
- **Get Results by Appointment**: `GET /api/labtest-results/appointment/{appointmentId}`
- **Get Results by Doctor**: `GET /api/labtest-results/doctor/{doctorId}`
- **Update Result Status**: `PATCH /api/labtest-results/{resultId}/status`

## Notes

- All endpoints require Lab Technician or Administrator role authentication
- Auto-generated IDs follow MongoDB ObjectId format
- The system automatically generates timestamps for creation and updates
- All references to other collections (LabTest, Appointment, Doctor) are validated
- Date ranges are inclusive of start date and exclusive of end date
- Status updates are atomic operations 