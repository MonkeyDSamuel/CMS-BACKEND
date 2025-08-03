# 🔐 Authentication System Guide

## Overview
The Clinic Management System uses ID-based authentication instead of email-based authentication. Each user type has specific credentials and access permissions.

## 🏥 User Types & Authentication

### 1. **Administrator** 
- **Username**: `admin`
- **Password**: `pass123`
- **Access**: Full system access (Staff, Doctor, Specialization management)

### 2. **Receptionist**
- **Login Field**: `receptionist_Id` (Staff ID)
- **Password**: Hashed password stored in database
- **Access**: Patient, Appointment, Billing management

### 3. **Doctor**
- **Login Field**: `doctor_Id` (Doctor ID)
- **Password**: Hashed password stored in database
- **Access**: Consultation, Prescription management

### 4. **Lab Technician**
- **Login Field**: `labtech_Id` (Staff ID)
- **Password**: Hashed password stored in database
- **Access**: Lab Test management

### 5. **Pharmacist**
- **Login Field**: `pharmacist_Id` (Staff ID)
- **Password**: Hashed password stored in database
- **Access**: Medicine and Inventory management

## 🔑 Authentication Endpoints

### Administrator Login
```http
POST /api/auth/admin
Content-Type: application/json

{
  "username": "admin",
  "password": "pass123"
}
```

### Receptionist Login
```http
POST /api/auth/receptionist
Content-Type: application/json

{
  "receptionist_Id": "REC0001",
  "password": "password123"
}
```

### Doctor Login
```http
POST /api/auth/doctor
Content-Type: application/json

{
  "doctor_Id": "DOC0001",
  "password": "password123"
}
```

### Lab Technician Login
```http
POST /api/auth/labtech
Content-Type: application/json

{
  "labtech_Id": "LAB0001",
  "password": "password123"
}
```

### Pharmacist Login
```http
POST /api/auth/pharmacist
Content-Type: application/json

{
  "pharmacist_Id": "PHM0001",
  "password": "password123"
}
```

## 📋 Response Format

### Successful Login Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "receptionist_Id": "REC0001", // or doctor_Id, labtech_Id, pharmacist_Id
    "role": "Receptionist"
  }
}
```

### Error Response
```json
{
  "error": "Invalid credentials or inactive account"
}
```

## 🛡️ Using Authentication Tokens

### Protected Endpoint Example
```http
GET /api/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Role-Based Access Control

### Administrator Access
- ✅ Staff Management (`/api/staff/*`)
- ✅ Doctor Management (`/api/doctors/*`)
- ✅ Specialization Management (`/api/specializations/*`)

### Receptionist Access
- ✅ Patient Management (`/api/patients/*`)
- ✅ Appointment Management (`/api/appointments/*`)
- ✅ Billing Management (`/api/billing/*`)

### Doctor Access
- ✅ Consultation Notes (`/api/consultations/*`)
- ✅ Medicine Prescriptions (`/api/prescriptions/medicine/*`)
- ✅ Lab Test Prescriptions (`/api/prescriptions/labtest/*`)

### Lab Technician Access
- ✅ Lab Test Management (`/api/labtests/*`)
- ✅ Lab Test Results (`/api/labtests/results/*`)

### Pharmacist Access
- ✅ Medicine Management (`/api/medicines/*`)
- ✅ Inventory Management (`/api/inventory/medicine/*`)

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Missing required fields |
| 401 | Unauthorized - Invalid credentials or missing token |
| 403 | Forbidden - Insufficient role permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## 📝 Example Usage

### 1. Login as Administrator
```bash
curl -X POST http://localhost:8002/api/auth/admin \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass123"}'
```

### 2. Login as Receptionist
```bash
curl -X POST http://localhost:8002/api/auth/receptionist \
  -H "Content-Type: application/json" \
  -d '{"receptionist_Id": "REC0001", "password": "password123"}'
```

### 3. Use Token for Protected Endpoint
```bash
curl -X GET http://localhost:8002/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Database Requirements

### Staff Table Structure
```javascript
{
  Staff_Id: "REC0001", // Receptionist ID
  name: "John Doe",
  password: "hashed_password",
  role: "Receptionist",
  isActive: true
}
```

### Doctor Table Structure
```javascript
{
  Doctor_Id: "DOC0001", // Doctor ID
  name: "Dr. Smith",
  password: "hashed_password",
  specialization: "Cardiology",
  isActive: true
}
```

## ⚠️ Important Notes

1. **Admin Credentials**: Hardcoded as `admin`/`pass123` - change in production
2. **Password Hashing**: All passwords must be hashed using bcrypt
3. **Token Expiration**: JWT tokens expire after 3 hours
4. **Role Validation**: Each endpoint validates user role before allowing access
5. **Active Status**: Only active users can login (isActive: true)

## 🔄 Token Refresh

Tokens are valid for 3 hours. Users need to re-login after expiration.

## 🛠️ Development Setup

1. Ensure bcryptjs is installed: `npm install bcryptjs`
2. Set JWT_SECRET in environment variables
3. Hash passwords before storing in database
4. Test all authentication endpoints before deployment 