# SentraAI API Documentation

Complete reference for all API endpoints, request/response formats, and authentication.

---

## 📋 Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Visitors](#visitor-endpoints)
   - [Approvals](#approval-endpoints)
   - [Alerts](#alert-endpoints)
   - [Notifications](#notification-endpoints)
   - [Admin](#admin-endpoints)
   - [OTP](#otp-endpoints)
   - [Photos](#photo-endpoints)

---

## Base URL

```
Development: http://localhost:5001/api
Production: https://api.sentraai.com/api
```

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Token Format

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "admin|guard|resident",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Token Expiry

Tokens expire after **7 days**. Clients must handle token refresh or re-authentication.

---

## Request/Response Format

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    ...
  }
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "Visitor 1" },
    { "id": "2", "name": "Visitor 2" }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Explanation |
|---|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Missing or invalid authentication token |
| `403` | Forbidden | User lacks required permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `500` | Server Error | Internal server error |

### Error Codes

| Code | Meaning |
|---|---|
| `INVALID_CREDENTIALS` | Login credentials incorrect |
| `TOKEN_EXPIRED` | JWT token has expired |
| `UNAUTHORIZED` | User not authenticated |
| `PERMISSION_DENIED` | User lacks role permissions |
| `NOT_FOUND` | Resource doesn't exist |
| `VALIDATION_ERROR` | Request data validation failed |
| `DUPLICATE_EMAIL` | Email already registered |
| `DATABASE_ERROR` | Database query failed |

---

## Endpoints

### Authentication Endpoints

#### Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sentraai.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "admin@sentraai.com",
      "role": "admin",
      "name": "Admin User"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect"
}
```

---

#### Register

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "resident"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "resident",
      "name": "John Doe"
    }
  }
}
```

---

#### Verify Token

**Request:**
```http
GET /api/auth/verify
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "uuid",
      "email": "admin@sentraai.com",
      "role": "admin"
    }
  }
}
```

---

### Visitor Endpoints

#### Get All Visitors

**Request:**
```http
GET /api/visitors?status=pending&risk=high&page=1&limit=10&search=john
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` - Filter by status: `pending`, `approved`, `denied`, `completed`
- `risk` - Filter by risk level: `low`, `medium`, `high`, `critical`
- `search` - Search by name, email, or phone
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "purpose": "Meeting",
      "unit_number": "101",
      "status": "pending",
      "risk_level": "low",
      "entry_time": "2024-11-15T10:30:00Z",
      "exit_time": null,
      "photo_url": "https://...",
      "created_at": "2024-11-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

#### Register Visitor

**Request:**
```http
POST /api/visitors
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "purpose": "Meeting with resident",
  "unit_number": "101",
  "photo_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "status": "pending",
    "risk_level": "low",
    "trust_score": 85,
    "entry_time": "2024-11-15T10:30:00Z",
    "verification_result": {
      "face_verified": true,
      "confidence": 0.92,
      "anomalies": []
    }
  }
}
```

---

#### Get Visitor by ID

**Request:**
```http
GET /api/visitors/{visitor_id}
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "approved",
    "risk_level": "low",
    "approval": {
      "approved_by": "resident_uuid",
      "approved_at": "2024-11-15T10:35:00Z",
      "reason": ""
    }
  }
}
```

---

#### Approve Visitor

**Request:**
```http
PUT /api/visitors/{visitor_id}/approve
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "approved_by": "resident_uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2024-11-15T10:35:00Z"
  }
}
```

---

#### Deny Visitor

**Request:**
```http
PUT /api/visitors/{visitor_id}/deny
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "Not authorized to visit at this time"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "denied",
    "reason": "Not authorized to visit at this time",
    "denied_at": "2024-11-15T10:35:00Z"
  }
}
```

---

#### Record Visitor Exit

**Request:**
```http
PUT /api/visitors/{visitor_id}/exit
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "exit_time": "2024-11-15T11:30:00Z",
    "duration_minutes": 60
  }
}
```

---

### Approval Endpoints

#### Get Pending Approvals

**Request:**
```http
GET /api/approvals/pending
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "visitor": {
        "id": "uuid",
        "name": "John Doe",
        "purpose": "Meeting",
        "unit": "101"
      },
      "status": "pending",
      "created_at": "2024-11-15T10:30:00Z"
    }
  ]
}
```

---

#### Approve Visitor Entry

**Request:**
```http
POST /api/approvals/{approval_id}/approve
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2024-11-15T10:35:00Z"
  }
}
```

---

### Alert Endpoints

#### Get All Alerts

**Request:**
```http
GET /api/alerts?severity=high&resolved=false&page=1&limit=20
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `severity` - Filter: `low`, `medium`, `high`, `critical`
- `resolved` - Filter: `true` or `false`
- `page` - Pagination
- `limit` - Results per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "severity": "critical",
      "title": "Suspicious Activity Detected",
      "message": "Multiple failed approval attempts",
      "visitor_id": "uuid",
      "is_resolved": false,
      "is_read": false,
      "created_at": "2024-11-15T10:30:00Z"
    }
  ]
}
```

---

#### Mark Alert as Resolved

**Request:**
```http
PUT /api/alerts/{alert_id}/resolve
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_resolved": true,
    "resolved_at": "2024-11-15T10:35:00Z"
  }
}
```

---

### Notification Endpoints

#### Send Notification

**Request:**
```http
POST /api/notifications/send
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "resident_uuid",
  "title": "New Visitor Arrival",
  "message": "John Doe is here to visit you",
  "type": "visitor_arrival",
  "visitor_id": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sent_at": "2024-11-15T10:30:00Z"
  }
}
```

---

### Admin Endpoints

#### Get All Users

**Request:**
```http
GET /api/admin/users?role=guard&page=1&limit=10
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Guard User",
      "email": "guard@sentraai.com",
      "role": "guard",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### Create User Account

**Request:**
```http
POST /api/admin/users
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Guard",
  "email": "newguard@sentraai.com",
  "role": "guard",
  "password": "temporarypassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Guard",
    "email": "newguard@sentraai.com",
    "role": "guard",
    "password_sent": true
  }
}
```

---

### OTP Endpoints

#### Send OTP

**Request:**
```http
POST /api/otp/send
Content-Type: application/json

{
  "phone": "+1234567890",
  "visitor_name": "John Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "expires_in": 300
  }
}
```

---

#### Verify OTP

**Request:**
```http
POST /api/otp/verify
Content-Type: application/json

{
  "session_id": "uuid",
  "otp_code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "token": "verification_token"
  }
}
```

---

### Photo Endpoints

#### Upload Visitor Photo

**Request:**
```http
POST /api/photos/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <binary_image_file>
visitor_id: uuid
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "photo_id": "uuid",
    "url": "https://cdn.sentraai.com/photos/...",
    "uploaded_at": "2024-11-15T10:30:00Z"
  }
}
```

---

## Rate Limiting

API requests are rate-limited to **1000 per hour** per user.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Webhooks (Future)

Webhooks support planned for:
- Visitor arrival events
- Approval events
- Alert triggered events
- System events

---

## SDK/Library Support

Official SDKs available for:
- JavaScript/Node.js
- Python
- Java
- Go (Community)

---

## Support

For API issues or questions:
- **Documentation**: [API Docs](https://docs.sentraai.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/SentraAI/issues)
- **Email**: api-support@sentraai.com

---

**Last Updated**: November 2024  
**API Version**: v1.0
