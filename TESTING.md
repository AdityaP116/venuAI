# 🧪 SentraAI Testing Guide

Complete guide to testing SentraAI - automated, manual, and integration tests.

---

## 📋 Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Manual Testing](#manual-testing)
3. [API Testing](#api-testing)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)
6. [Automated Testing](#automated-testing)

---

## Testing Strategy

### Test Pyramid

```
         /\
        /  \
       / E2E \
      /______\
      /      \
     / Integ. \
    /________\
    /        \
   /  Units  \
  /________\
```

### Coverage Goals

| Test Type | Coverage Target | Priority |
|---|---|---|
| Unit Tests | 80% | High |
| Integration Tests | 60% | High |
| E2E Tests | 40% | Medium |
| Manual Tests | 100% | High |

---

## 🔍 Manual Testing

### Test User Accounts

Create these test accounts in Firebase:

```
Admin Account
├─ Email: admin@sentraai.com
├─ Password: TestPassword123!
└─ Role: admin

Guard Account
├─ Email: guard@sentraai.com
├─ Password: TestPassword123!
└─ Role: guard

Resident Account
├─ Email: resident@sentraai.com
├─ Password: TestPassword123!
└─ Role: resident
```

### Admin Role Testing

#### Test: User Management

```
Steps:
1. Login as Admin
2. Navigate to Admin Panel
3. Click "Create User"
4. Fill form:
   - Name: "Test Guard"
   - Email: "testguard@sentraai.com"
   - Role: Guard
5. Click Create
6. Verify user appears in user list
7. Delete test user
8. Verify user is removed

Expected Result: ✅ User created and deleted successfully
```

#### Test: Analytics Dashboard

```
Steps:
1. Login as Admin
2. Navigate to Analytics
3. Verify metrics appear:
   - Visitor count
   - Alert count
   - Risk distribution
4. Check charts load correctly
5. Filter by date range
6. Verify data updates

Expected Result: ✅ All metrics display and update
```

#### Test: Alert Management

```
Steps:
1. Login as Admin
2. Go to Alerts section
3. View all alerts
4. Filter by severity (Critical, High, Medium, Low)
5. Click alert to view details
6. Click "Resolve"
7. Verify alert moved to resolved

Expected Result: ✅ Alerts filter and resolve correctly
```

### Guard Role Testing

#### Test: Visitor Check-In

```
Steps:
1. Login as Guard
2. Navigate to "Visitor Entry"
3. Fill visitor form:
   - Name: "John Smith"
   - Email: "john@example.com"
   - Phone: "+1234567890"
   - Purpose: "Meeting"
   - Unit: "101"
4. Click "Capture Photo" (or skip in dev)
5. Click "Register Visitor"
6. Verify:
   - Visitor record created
   - QR code displayed
   - Success message shown

Expected Result: ✅ Visitor registered and QR generated
```

#### Test: Approval Workflow

```
Steps:
1. As Guard: Register visitor
2. As Resident: Receive notification, approve
3. As Guard: See approval status updated
4. Verify approval timestamp recorded
5. Verify audit log entry created

Expected Result: ✅ Complete workflow functions
```

#### Test: QR Code Scanning

```
Steps:
1. Generate visitor pass
2. Display QR code
3. Use QR scanner app to scan
4. Verify data extracted:
   - Visitor ID
   - Entry time
   - Approval status
5. Test QR code print

Expected Result: ✅ QR code generates and scans correctly
```

### Resident Role Testing

#### Test: Approval Notifications

```
Steps:
1. As Guard: Register new visitor
2. As Resident (new instance/incognito):
   - Check for in-app notification
   - Verify email received (if configured)
3. Click notification
4. View approval request details
5. Click "Approve"
6. Verify approval recorded
7. Check audit log

Expected Result: ✅ Notifications sent and approvals processed
```

#### Test: Visitor History

```
Steps:
1. Login as Resident
2. Navigate to "Visitor History"
3. Verify past visitors displayed
4. Search by visitor name
5. Filter by date range
6. View visitor details
7. Verify visitor can be viewed

Expected Result: ✅ History displays accurately
```

### Cross-Role Testing

#### Test: Role Isolation

```
Steps:
1. Login as Admin
2. Note available features
3. Logout, login as Guard
4. Verify Guard cannot access:
   - User Management
   - Analytics
   - Admin Panel
5. Logout, login as Resident
6. Verify Resident cannot access:
   - Visitor check-in
   - User management
   - Logs

Expected Result: ✅ Role-based access control works
```

---

## 🔗 API Testing

### Prerequisites

- Postman installed
- Valid JWT token for authentication

### Getting JWT Token

```bash
# 1. Login
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "admin@sentraai.com",
  "password": "TestPassword123!"
}

# Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

### API Test Cases

#### Test: Get All Visitors

```http
GET http://localhost:5001/api/visitors
Authorization: Bearer <jwt_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "status": "pending",
      "risk_level": "low"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

#### Test: Create Visitor

```http
POST http://localhost:5001/api/visitors
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Test Visitor",
  "email": "visitor@test.com",
  "phone": "+1234567890",
  "purpose": "Testing",
  "unit_number": "101"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "Test Visitor",
    "status": "pending",
    "risk_level": "low"
  }
}
```

#### Test: Approve Visitor

```http
PUT http://localhost:5001/api/visitors/{visitor_id}/approve
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "approved_by": "user_uuid"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "visitor_uuid",
    "status": "approved",
    "approved_at": "2024-11-15T10:35:00Z"
  }
}
```

#### Test: Authentication Errors

```
Test Case: Missing Token
GET http://localhost:5001/api/visitors

Expected: 401 Unauthorized

Test Case: Expired Token
GET http://localhost:5001/api/visitors
Authorization: Bearer expired_token

Expected: 401 Token Expired

Test Case: Invalid Token
GET http://localhost:5001/api/visitors
Authorization: Bearer invalid_token

Expected: 403 Invalid Token
```

### Postman Collection

Import this collection template:

```json
{
  "info": {
    "name": "SentraAI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login"
          }
        }
      ]
    },
    {
      "name": "Visitors",
      "item": [
        {
          "name": "Get All",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/visitors"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5001/api"
    }
  ]
}
```

---

## ⚡ Performance Testing

### Load Testing Scenario

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5173/

# Using wrk
wrk -t4 -c100 -d30s http://localhost:5173/

# Using Apache JMeter
jmeter -n -t test_plan.jmx
```

### Metrics to Monitor

| Metric | Target | Tool |
|---|---|---|
| Response Time | < 200ms | DevTools |
| Throughput | > 100 req/s | Apache Bench |
| Error Rate | < 0.1% | Monitoring |
| P95 Latency | < 500ms | Grafana |
| P99 Latency | < 1000ms | Grafana |

### Browser DevTools Testing

```
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (e.g., navigate page)
4. Check metrics:
   - Time to First Byte (TTFB)
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)
5. Check for large files
6. Verify cache headers
```

---

## 🔐 Security Testing

### Input Validation Tests

#### SQL Injection Test

```
Field: Email
Input: ' OR '1'='1
Expected: Validation error, no SQL injection
Status: ✅ Safe (parameterized queries)
```

#### XSS Test

```
Field: Name
Input: <script>alert('xss')</script>
Expected: Sanitized/escaped
Status: ✅ Safe (output encoding)
```

#### CSRF Test

```
Check for CSRF tokens in forms
Verify token validation on POST/PUT/DELETE
Test missing token handling
Status: ✅ Protected
```

### Authentication Tests

```
Test: Expired Token
Expected: 401 Unauthorized
Status: ✅ Pass

Test: Invalid Token
Expected: 403 Forbidden
Status: ✅ Pass

Test: Missing Authorization Header
Expected: 401 Unauthorized
Status: ✅ Pass

Test: Cross-Origin Request
Expected: CORS validation
Status: ✅ Pass
```

### Authorization Tests

```
Test: Guard accessing admin endpoint
Expected: 403 Forbidden
Status: ✅ Pass

Test: Resident viewing other resident's data
Expected: 403 Forbidden
Status: ✅ Pass

Test: Admin can access all endpoints
Expected: 200 OK
Status: ✅ Pass
```

---

## 🤖 Automated Testing

### Unit Tests (Jest/Vitest)

```javascript
describe('User Authentication', () => {
  test('should login with valid credentials', () => {
    const result = authenticate('admin@test.com', 'password');
    expect(result.token).toBeDefined();
  });

  test('should reject invalid credentials', () => {
    const result = authenticate('admin@test.com', 'wrong');
    expect(result.error).toBe('INVALID_CREDENTIALS');
  });
});
```

### Integration Tests

```javascript
describe('Visitor Registration', () => {
  test('complete visitor workflow', async () => {
    // Register visitor
    const visitor = await registerVisitor({
      name: 'John',
      email: 'john@test.com'
    });

    // Notify resident
    await notifyResident(visitor.id);

    // Resident approves
    const approval = await approveVisitor(visitor.id);

    // Verify complete
    expect(approval.status).toBe('approved');
  });
});
```

### E2E Tests (Cypress/Playwright)

```javascript
describe('Guard Visitor Check-In', () => {
  it('should check in visitor successfully', () => {
    cy.visit('http://localhost:5173/guard/login');
    cy.get('[data-testid="email"]').type('guard@test.com');
    cy.get('[data-testid="password"]').type('password');
    cy.get('[data-testid="login-btn"]').click();
    
    cy.get('[data-testid="visitor-entry"]').click();
    cy.get('[data-testid="visitor-name"]').type('John Doe');
    cy.get('[data-testid="visitor-email"]').type('john@test.com');
    cy.get('[data-testid="submit"]').click();
    
    cy.contains('Visitor registered successfully').should('be.visible');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/auth.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# E2E tests
npm run test:e2e

# Performance tests
npm run test:perf
```

---

## 📋 Test Checklist

Before release, verify:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Code coverage > 80%
- [ ] No console errors
- [ ] No security vulnerabilities
- [ ] Performance metrics met
- [ ] Cross-browser testing complete
- [ ] Mobile responsive tested
- [ ] Accessibility compliance checked
- [ ] Manual user flow testing done
- [ ] API rate limiting works
- [ ] CORS properly configured
- [ ] Error handling complete
- [ ] Logging working correctly

---

## 🐛 Bug Reporting Template

When reporting bugs, include:

```markdown
**Title:** Brief description

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 90.0
- OS: Windows 10
- Device: Desktop

**Screenshots:**
[Attach if applicable]

**Logs:**
[Paste console/server logs]

**Severity:**
- [ ] Critical (system down)
- [ ] High (major feature broken)
- [ ] Medium (feature partially works)
- [ ] Low (cosmetic issue)
```

---

## 📞 Testing Support

**Need help testing?**
- Check test documentation
- Review existing test examples
- Open GitHub issue
- Email: qa@sentraai.com

---

**Last Updated**: November 2024
