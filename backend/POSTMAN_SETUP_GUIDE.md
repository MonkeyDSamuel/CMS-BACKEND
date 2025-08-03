# 🚀 Postman Setup Guide

## 📥 Import Collection
1. Open Postman
2. Click "Import" button
3. Select the file: `Clinic_Management_API.postman_collection.json`
4. Click "Import"

## 🔧 Environment Setup
1. Create a new environment in Postman
2. Add the following variables:

| Variable Name | Initial Value | Current Value |
|---------------|---------------|---------------|
| `base_url` | `http://localhost:8002` | `http://localhost:8002` |
| `admin_token` | (leave empty) | (will be filled after login) |
| `receptionist_token` | (leave empty) | (will be filled after login) |
| `doctor_token` | (leave empty) | (will be filled after login) |
| `labtech_token` | (leave empty) | (will be filled after login) |
| `pharmacist_token` | (leave empty) | (will be filled after login) |

## 🔐 Testing Authentication

### Step 1: Test Admin Login
1. Go to "Authentication" folder
2. Run "Admin Login" request
3. Copy the token from response
4. Set `admin_token` variable with the copied token

### Step 2: Test Other Logins
Repeat for each user type:
1. Run the respective login request
2. Copy token from response
3. Set the corresponding token variable

## 📋 Test Credentials

### Admin
```json
{
  "username": "admin",
  "password": "pass123"
}
```

### Receptionist
```json
{
  "receptionist_Id": "REC0001",
  "password": "password123"
}
```

### Doctor
```json
{
  "doctor_Id": "DOC0001",
  "password": "password123"
}
```

### Lab Technician
```json
{
  "labtech_Id": "LAB0001",
  "password": "password123"
}
```

### Pharmacist
```json
{
  "pharmacist_Id": "PHM0001",
  "password": "password123"
}
```

## 🧪 Testing CRUD Operations

### Administrator Tests
- ✅ Create Staff
- ✅ Get All Staff
- ✅ Create Doctor
- ✅ Create Specialization

### Receptionist Tests
- ✅ Register Patient
- ✅ Schedule Appointment
- ✅ Get Appointments by Date

### Doctor Tests
- ✅ Add Consultation Note
- ✅ Create Medicine Prescription

### Lab Technician Tests
- ✅ Add New Lab Test
- ✅ Record Lab Test Result

### Pharmacist Tests
- ✅ Add New Medicine
- ✅ Add Inventory Item

## ⚠️ Important Notes

1. **Server Must Be Running**: Ensure your server is running on port 8002
2. **Database Must Be Connected**: MongoDB should be connected
3. **Tokens Expire**: JWT tokens expire after 3 hours
4. **Role-Based Access**: Each endpoint requires specific role permissions

## 🔄 Token Management

### Automatic Token Extraction (Optional)
Add this test script to each login request:

```javascript
// For Admin Login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("admin_token", response.token);
}

// For Receptionist Login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("receptionist_token", response.token);
}

// Repeat for other user types
```

## 🚨 Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Token expired or invalid
2. **403 Forbidden**: Insufficient role permissions
3. **400 Bad Request**: Missing required fields
4. **404 Not Found**: Resource doesn't exist

### Solutions:
1. Re-login to get fresh token
2. Check user role permissions
3. Verify request body format
4. Ensure resource exists in database

## 📊 Expected Responses

### Successful Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "role": "Role"
  }
}
```

### Error Response
```json
{
  "error": "Invalid credentials or inactive account"
}
```

## 🎯 Testing Workflow

1. **Start Server**: `npm start`
2. **Import Collection**: Load the Postman collection
3. **Set Environment**: Configure variables
4. **Test Authentication**: Run login requests
5. **Test CRUD Operations**: Run protected endpoints
6. **Verify Responses**: Check status codes and data

## 📈 Performance Testing

For load testing, you can:
1. Duplicate requests in Postman
2. Use Postman's Runner feature
3. Set up automated test suites
4. Monitor response times

## 🔒 Security Testing

Test these scenarios:
1. **Invalid Credentials**: Wrong username/password
2. **Missing Token**: Request without Authorization header
3. **Invalid Token**: Request with malformed token
4. **Expired Token**: Request with old token
5. **Wrong Role**: Access endpoint with insufficient permissions 