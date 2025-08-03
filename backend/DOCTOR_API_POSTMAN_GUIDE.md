# Doctor API Postman Testing Guide

This guide provides comprehensive instructions for testing all Doctor API endpoints using Postman.

## Prerequisites

1. **Server Setup**: Ensure the backend server is running on `http://localhost:8002`
2. **Postman Collection**: Import the `Clinic_Management_API.postman_collection.json` file
3. **Authentication**: You'll need to login as a Doctor to get the authentication token

## Authentication Setup

### Step 1: Doctor Login
1. Open the "Authentication" folder in the collection
2. Find "Doctor Login" request
3. Update the request body with valid credentials:
```json
{
  "doctor_Id": "DOC0001",
  "password": "password123"
}
```
4. Send the request
5. Copy the `token` from the response

### Step 2: Set Environment Variables
1. In Postman, go to the "Variables" tab in the collection
2. Set `doctor_token` to the token received from login
3. Ensure `base_url` is set to `http://localhost:8002`

## Doctor API Endpoints

### 3.1 Consultation Notes

#### 3.1.1 Add Consultation Note
- **Method**: POST
- **URL**: `{{base_url}}/api/consultations`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "Notes": "Patient shows symptoms of common cold. Temperature: 37.5°C, Blood Pressure: 120/80. Prescribed rest and fluids."
}
```

#### 3.1.2 Update Consultation Note
- **Method**: PUT
- **URL**: `{{base_url}}/api/consultations/{consultationId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "Notes": "Updated: Patient condition improved. Temperature: 36.8°C, Blood Pressure: 118/78. Continue with prescribed medication."
}
```

#### 3.1.3 Get Consultation Note by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/consultations/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.1.4 List Consultation Notes by Doctor
- **Method**: GET
- **URL**: `{{base_url}}/api/consultations/doctor/{doctorId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

### 3.2 Medicine Prescription

#### 3.2.1 Create Medicine Prescription
- **Method**: POST
- **URL**: `{{base_url}}/api/prescriptions/medicine`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "medicine_id": ["MED0001", "MED0002"],
  "Notes": "Take after meals. Avoid alcohol."
}
```

#### 3.2.2 Update Medicine Prescription
- **Method**: PUT
- **URL**: `{{base_url}}/api/prescriptions/medicine/{prescriptionId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "medicine_id": ["MED0001", "MED0003"],
  "Notes": "Updated prescription. Take with food."
}
```

#### 3.2.3 Get Prescription by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/medicine/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.2.4 List Prescriptions by Patient
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/medicine/patient/{patientId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

### 3.3 Lab Test Prescription

#### 3.3.1 Create Lab Test Prescription
- **Method**: POST
- **URL**: `{{base_url}}/api/prescriptions/labtest`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "Labtest_Id": ["LABTEST0001", "LABTEST0002"],
  "Notes": "Blood test and urine analysis required. Fasting required for 12 hours."
}
```

#### 3.3.2 Update Lab Test Prescription
- **Method**: PUT
- **URL**: `{{base_url}}/api/prescriptions/labtest/{prescriptionId}`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{doctor_token}}`
- **Body**:
```json
{
  "Appointment_Id": "APP0001",
  "Doctor_Id": "DOC0001",
  "Labtest_Id": ["LABTEST0001", "LABTEST0003"],
  "Notes": "Updated: Additional cholesterol test required. Fasting for 14 hours."
}
```

#### 3.3.3 Get Lab Test Prescription by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/labtest/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.3.4 List Lab Test Prescriptions by Patient
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/labtest/patient/{patientId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

### 3.4 Consultation History

#### 3.4.1 List Consultation History by Patient
- **Method**: GET
- **URL**: `{{base_url}}/api/consultations/patient/{patientId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.4.2 List Consultation History by Doctor
- **Method**: GET
- **URL**: `{{base_url}}/api/consultations/doctor/{doctorId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.4.3 Get Consultation History by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/consultations/history/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

### 3.5 Medicine Prescription History

#### 3.5.1 List Medicine Prescription History by Patient
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/medicine/history/patient/{patientId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.5.2 List Medicine Prescription History by Doctor
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/medicine/history/doctor/{doctorId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

#### 3.5.3 Get Medicine Prescription History by Appointment ID
- **Method**: GET
- **URL**: `{{base_url}}/api/prescriptions/medicine/history/appointment/{appointmentId}`
- **Headers**: 
  - `Authorization: Bearer {{doctor_token}}`

## Testing Workflow

### Step 1: Setup Test Data
Before testing, ensure you have:
- Valid appointment IDs (e.g., "APP0001")
- Valid doctor IDs (e.g., "DOC0001")
- Valid patient IDs (e.g., "PAT0001")
- Valid medicine IDs (e.g., "MED0001", "MED0002")
- Valid lab test IDs (e.g., "LABTEST0001", "LABTEST0002")

### Step 2: Authentication
1. Login as a doctor to get the authentication token
2. Set the `doctor_token` variable in the collection

### Step 3: Test Consultation Notes
1. Create a consultation note using POST `/api/consultations`
2. Retrieve the consultation by appointment ID
3. Update the consultation note using PUT `/api/consultations/{consultationId}`
4. List consultations by doctor

### Step 4: Test Medicine Prescriptions
1. Create a medicine prescription using POST `/api/prescriptions/medicine`
2. Retrieve the prescription by appointment ID
3. Update the prescription using PUT `/api/prescriptions/medicine/{prescriptionId}`
4. List prescriptions by patient

### Step 5: Test Lab Test Prescriptions
1. Create a lab test prescription using POST `/api/prescriptions/labtest`
2. Retrieve the lab test prescription by appointment ID
3. Update the lab test prescription using PUT `/api/prescriptions/labtest/{prescriptionId}`
4. List lab test prescriptions by patient

### Step 6: Test History Endpoints
1. Test consultation history endpoints
2. Test medicine prescription history endpoints

## Expected Responses

### Successful Responses
- **201 Created**: For successful creation of consultations/prescriptions
- **200 OK**: For successful updates and retrievals
- **200 OK**: For successful list operations (returns array)

### Error Responses
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure the doctor token is valid and properly set
2. **404 Errors**: Verify that the referenced IDs (appointments, patients, etc.) exist
3. **400 Errors**: Check that the request body matches the expected schema
4. **Server Connection**: Ensure the backend server is running on the correct port

### Debugging Tips
1. Check the server logs for detailed error messages
2. Verify the request headers and body format
3. Ensure all required fields are provided in the request body
4. Test with valid IDs that exist in the database

## Data Models

### Consultation Schema
```javascript
{
  Consultation_Id: String (auto-generated),
  Appointment_Id: String (required),
  Doctor_Id: String (required),
  Notes: String
}
```

### Medicine Prescription Schema
```javascript
{
  Prescription_Id: String (auto-generated),
  Appointment_Id: String (required),
  Doctor_Id: String (required),
  medicine_id: [String] (required),
  Notes: String
}
```

### Lab Test Prescription Schema
```javascript
{
  LabPrescription_Id: String (auto-generated),
  Appointment_Id: String (required),
  Doctor_Id: String (required),
  Labtest_Id: [String] (required),
  Notes: String
}
```

## Notes

- All endpoints require Doctor or Administrator role authentication
- Auto-generated IDs follow the pattern: `CONSULT0001`, `PRESC0001`, `LABPRES0001`
- The system automatically generates sequential IDs for new records
- All timestamps are handled automatically by MongoDB
- References to other collections (Appointment, Doctor, Medicine, LabTest) are validated 