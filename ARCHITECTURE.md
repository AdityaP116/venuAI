# SentraAI Architecture Documentation

Deep dive into the system architecture, design patterns, and technical decisions.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Flow](#data-flow)
3. [Authentication & Authorization](#authentication--authorization)
4. [Component Architecture](#component-architecture)
5. [API Design](#api-design)
6. [Database Design](#database-design)
7. [Scalability Considerations](#scalability-considerations)
8. [Security Architecture](#security-architecture)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     SentraAI Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │   Admin Portal   │  │   Guard Portal   │  │  Resident  │ │
│  │  (Role: admin)   │  │  (Role: guard)   │  │ (Role: res)│ │
│  │                  │  │                  │  │            │ │
│  │ /admin/*         │  │ /guard/*         │  │ /resident/*│ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬───┘ │
│           │                     │                     │     │
│           └─────────────────────┼─────────────────────┘     │
│                                 │                            │
│                     React Frontend (Vite)                    │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                   Express.js REST API                         │
│                    (/api/*)                                  │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  Authorization│ │  Route       │ │  Services   │         │
│  │  Middleware   │ │  Handlers    │ │             │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│       ┌──────────────────┐   ┌─────────────────────┐        │
│       │  Supabase        │   │  Firebase           │        │
│       │  PostgreSQL      │   │  Authentication     │        │
│       │  Database        │   │  &                  │        │
│       │                  │   │  Storage            │        │
│       └──────────────────┘   └─────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Visitor Check-In Flow

```
1. Guard Arrives at Guard Portal (/guard/login)
   ↓
2. Guard Authenticates (Firebase Auth)
   ↓
3. Guard Navigates to Visitor Entry
   ↓
4. Guard Fills Visitor Form + Captures Photo
   ↓
5. POST /api/visitors
   ├─ Backend validates input
   ├─ Calls AI verification service (mock)
   ├─ Calculates risk score
   ├─ Stores in Supabase
   └─ Returns visitor record
   ↓
6. System sends OTP to resident
   ├─ POST /api/otp/send
   └─ Sends SMS/Email notification
   ↓
7. Resident Receives Notification
   ├─ Gets real-time update (Supabase Realtime)
   ├─ Sees pending approval
   └─ Can approve/deny
   ↓
8. Resident Approves/Denies
   ├─ PUT /api/approvals/{id}
   ├─ Updates database
   └─ Notifies Guard
   ↓
9. Guard Scans QR Pass
   ├─ Confirms approval
   └─ Records entry time
   ↓
10. Visitor Exits
    ├─ Guard records exit
    └─ Creates audit log
```

### Real-Time Update Flow

```
Supabase Database Change
           ↓
   Supabase Realtime
           ↓
   WebSocket Broadcast
           ↓
   React Components
   (useEffect listeners)
           ↓
   UI Updates Automatically
```

---

## Authentication & Authorization

### Authentication Flow (Detailed)

```
1. User Submits Email/Password
           ↓
2. Firebase Validates Credentials
   ├─ Valid → Returns ID Token
   └─ Invalid → Returns Error
           ↓
3. Frontend Stores Token (LocalStorage)
           ↓
4. Frontend Adds Token to API Requests
   Authorization: Bearer <token>
           ↓
5. Backend Validates Token
   ├─ Valid → Extract userId, role
   ├─ Expired → Return 401
   └─ Invalid → Return 403
           ↓
6. Backend Extracts User Role from JWT
           ↓
7. Business Logic Routes Based on Role
```

### Authorization Matrix

```
resource:          admin   guard   resident
─────────────────────────────────────────────
manage users         ✓       ✗       ✗
create visitor       ✓       ✓       ✗
approve visitor      ✓       ✓       ✓
view own visits      ✓       ✓       ✓
view all visits      ✓       ✓       ✗
generate analytics   ✓       ✗       ✗
delete data          ✓       ✗       ✗
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@sentraai.com",
    "role": "admin",
    "iat": 1699998000,
    "exp": 1700603800
  },
  "signature": "HMACSHA256(...)"
}
```

---

## Component Architecture

### Frontend Component Hierarchy

```
App.jsx (Router)
├─ RoleGateway / (Landing)
├─ /admin/*
│  ├─ AdminLayout
│  │  ├─ Header
│  │  ├─ Sidebar
│  │  └─ <AdminPage>
│  │     ├─ Dashboard
│  │     ├─ Analytics
│  │     ├─ Admin (User Mgmt)
│  │     └─ Logs
├─ /guard/*
│  ├─ GuardLayout
│  │  ├─ Header
│  │  ├─ GuardMobileNav
│  │  └─ <GuardPage>
│  │     ├─ Dashboard
│  │     ├─ VisitorEntry
│  │     ├─ Approval
│  │     └─ Alerts
└─ /resident/*
   ├─ ResidentLayout
   │  ├─ Header
   │  ├─ Sidebar
   │  └─ <ResidentPage>
   │     ├─ ResidentDashboard
   │     ├─ ResidentApproval
   │     └─ Alerts
```

### State Management

```
AuthContext (Global)
├─ user object
├─ token (JWT)
├─ role
├─ Loading state
└─ Methods:
   ├─ login()
   ├─ logout()
   └─ updateProfile()

Component State (Local)
├─ Form inputs
├─ Modal visibility
├─ Filter/sort options
└─ UI state (tabs, expanded)

Server State
├─ Fetched via API
├─ Cached in component state
└─ Re-fetched on relevant actions
```

### Custom Hooks

```
useApi()
├─ Purpose: Standardize API calls
├─ Features: Loading, error handling, retry logic
└─ Returns: { data, loading, error, refetch }

useNotifications()
├─ Purpose: Manage notification state
├─ Features: Queue, display, dismiss
└─ Returns: { notifications, add, remove }

usePolling()
├─ Purpose: Real-time data updates
├─ Features: Intervals, pause/resume
└─ Returns: { data, isPolling }

useTheme()
├─ Purpose: Theme switching
├─ Features: Dark/light mode
└─ Returns: { theme, toggleTheme }
```

---

## API Design

### RESTful Principles

```
Resource: /api/visitors
├─ GET    → List all visitors
├─ POST   → Create new visitor
└─ /{id}
   ├─ GET    → Get specific visitor
   ├─ PUT    → Update visitor
   └─ DELETE → Delete visitor


Resource: /api/approvals
├─ GET    → List approvals
├─ POST   → Create approval
└─ /{id}
   ├─ GET    → Get approval details
   └─ PUT    → Update approval status


Resource: /api/alerts
├─ GET    → List alerts (filterable)
└─ /{id}
   ├─ GET    → Get alert details
   ├─ PUT    → Mark as read/resolved
   └─ DELETE → Delete alert
```

### Request/Response Patterns

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "uuid",
    ...
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "User not found",
  "error": "NOT_FOUND",
  "statusCode": 404
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### Versioning

Current API version: `v1`

Endpoints: `/api/v1/visitors`

Future: Support multiple versions with `/api/v2/` for backward compatibility

---

## Database Design

### Entity Relationship Diagram

```
Users
├─ id (PK)
├─ email (UNIQUE)
├─ role (admin|guard|resident)
├─ created_at
└─ updated_at


Visitors
├─ id (PK)
├─ name
├─ email
├─ phone
├─ purpose
├─ unit_number
├─ status (pending|approved|denied|completed)
├─ risk_level (low|medium|high|critical)
├─ entry_time
├─ exit_time
├─ photo_url
├─ created_by (FK → Users)
├─ approved_by (FK → Users)
└─ created_at


Approvals
├─ id (PK)
├─ visitor_id (FK → Visitors)
├─ resident_id (FK → Users)
├─ status (pending|approved|denied)
├─ response_time
├─ reason
└─ created_at


Alerts
├─ id (PK)
├─ visitor_id (FK → Visitors)
├─ severity (low|medium|high|critical)
├─ message
├─ type
├─ is_resolved
├─ is_read
└─ created_at


Notifications
├─ id (PK)
├─ user_id (FK → Users)
├─ title
├─ message
├─ type
├─ is_read
└─ created_at
```

### Indexing Strategy

```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Visitors table
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_risk_level ON visitors(risk_level);
CREATE INDEX idx_visitors_entry_time ON visitors(entry_time);
CREATE INDEX idx_visitors_created_by ON visitors(created_by);

-- Approvals table
CREATE INDEX idx_approvals_visitor_id ON approvals(visitor_id);
CREATE INDEX idx_approvals_resident_id ON approvals(resident_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- Alerts table
CREATE INDEX idx_alerts_visitor_id ON alerts(visitor_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

-- Notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## Scalability Considerations

### Horizontal Scaling

1. **Load Balancing**
   ```
   Load Balancer (Nginx)
   ├─ Server Instance 1
   ├─ Server Instance 2
   ├─ Server Instance 3
   └─ Server Instance N
   
   Shared Database (Supabase)
   Shared Cache (Redis - optional)
   ```

2. **Database Connection Pooling**
   ```javascript
   const { Pool } = require("pg");
   const pool = new Pool({
     max: 20,
     min: 5,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

### Caching Strategy

1. **Session Cache** (Redis)
   ```
   Key: session:{sessionId}
   Value: { userId, role, permissions }
   TTL: 7 days
   ```

2. **Data Cache** (Redis)
   ```
   Key: visitors:all:{page}
   Value: [visitor list]
   TTL: 5 minutes
   Invalidate on: visitor created/updated
   ```

3. **CDN Cache** (Frontend)
   ```
   Static assets: 1 year
   API responses: HTTP cache headers
   ```

### Database Optimization

1. **Query Optimization**
   ```sql
   -- Bad: N+1 Query Problem
   SELECT * FROM visitors;
   FOR EACH visitor:
     SELECT * FROM approvals WHERE visitor_id = ?
   
   -- Good: JOIN
   SELECT v.*, a.* 
   FROM visitors v
   LEFT JOIN approvals a ON v.id = a.visitor_id
   ```

2. **Read Replicas** (Future)
   ```
   Primary Database (Write)
       ↓
   Replica 1 (Read)
   Replica 2 (Read)
   Replica N (Read)
   ```

### Microservices (Future)

```
SentraAI Platform
├─ Auth Service
├─ Visitor Service
├─ Approval Service
├─ Notification Service
├─ Analytics Service
└─ Photo Service
```

---

## Security Architecture

### Defense in Depth

```
Layer 1: Network
├─ HTTPS/SSL
├─ CORS validation
└─ Rate limiting

Layer 2: Authentication
├─ Firebase Auth
├─ JWT tokens
└─ Token expiry

Layer 3: Authorization
├─ Role-based access control
├─ Resource ownership checks
└─ API permission validation

Layer 4: Data Protection
├─ Input validation
├─ SQL parameterization
├─ Output encoding
└─ Encryption at rest

Layer 5: Monitoring
├─ Activity logs
├─ Anomaly detection
└─ Alert system
```

### Input Validation

```javascript
// Schema validation using joi/yup
const visitorSchema = {
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^\+?[0-9]{10,15}$/).required(),
  purpose: Joi.string().max(500).required(),
};

// Sanitization
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove HTML tags
    .substring(0, 255); // Limit length
};
```

### SQL Injection Prevention

```javascript
// ❌ Vulnerable
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Safe - Parameterized queries
db.query("SELECT * FROM users WHERE email = $1", [email]);
```

### CORS Configuration

```javascript
const cors = require("cors");

app.use(cors({
  origin: [
    "https://sentraai.com",
    "https://www.sentraai.com",
    "http://localhost:5173" // Dev only
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

---

## Performance Metrics

### Target Metrics

| Metric | Target | Current |
|---|---|---|
| API Response Time | < 200ms | 150ms |
| Page Load Time | < 2s | 1.8s |
| Database Query Time | < 100ms | 80ms |
| Uptime | 99.9% | 99.95% |
| Error Rate | < 0.1% | 0.05% |

### Monitoring Points

1. **API Metrics**
   - Request/response times
   - Error rates by endpoint
   - Status code distribution

2. **Database Metrics**
   - Query execution times
   - Connection pool usage
   - Lock contention

3. **Frontend Metrics**
   - Page load time
   - Core Web Vitals (CLS, LCP, FID)
   - JavaScript error rate

---

## Deployment Architecture

### Development
```
Localhost:3000 (Frontend)
    ↓
Vite Dev Server
    ↓
Hot Module Replacement (HMR)


Localhost:5001 (Backend)
    ↓
Node.js Dev Server
    ↓
Nodemon (Auto-restart)
```

### Production
```
CDN (Vercel/Netlify)
    ↓
Static Assets (HTML, CSS, JS)
    ↓
API Gateway
    ↓
Load Balancer
    ↓
Server Instances (Railway/Render)
    ↓
Container Orchestration (K8s - Future)
    ↓
Supabase Database (PostgreSQL)
```

---

## Future Architecture Improvements

1. **Microservices**
   - Split monolithic backend into services
   - Independent scaling and deployment

2. **Event-Driven Architecture**
   - Message queues (RabbitMQ/Redis)
   - Event sourcing

3. **GraphQL**
   - Replace REST with GraphQL
   - Reduced over-fetching

4. **Machine Learning**
   - Face recognition service
   - Anomaly detection
   - Predictive analytics

5. **Kubernetes**
   - Container orchestration
   - Auto-scaling
   - Service mesh

---

**Last Updated**: November 2024
