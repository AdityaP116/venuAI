# 🎯 SentraAI Features Overview

Complete guide to all SentraAI features organized by user role.

---

## 📋 Table of Contents

- [Admin Features](#admin-features)
- [Guard Features](#guard-features)
- [Resident Features](#resident-features)
- [System Features](#system-features)

---

## 👨‍💼 Admin Features

### 1. Dashboard Analytics

**What it does**: Provides real-time overview of system activity and metrics.

**Key Metrics**:
- Total visitors (today, this week, this month)
- Pending approvals count
- Active alerts count
- Risk distribution (Low/Medium/High/Critical)
- Hourly visitor traffic chart
- Recent activity feed

**Use Cases**:
- Monitor facility security status
- Identify peak visitor times
- Spot unusual patterns
- Make data-driven decisions

```
📊 Dashboard
├─ Today's Visitors: 24
├─ Pending Approvals: 3
├─ Critical Alerts: 1
├─ Risk Distribution Chart
└─ Recent Activity
```

---

### 2. User Management

**What it does**: Create, edit, and manage Guard and Resident accounts.

**Capabilities**:
- Create new user account
- Assign role (Guard or Resident)
- Set initial password
- Activate/deactivate users
- View all users with status
- Edit user information
- Delete user account
- Send account notifications

**User Types**:
- **Guard** - Can check in visitors, view approvals, access logs
- **Resident** - Can approve visitor entries, view history, manage settings

```
👥 User Management
├─ Create User
├─ View All Users
├─ Edit User Details
├─ Reset Password
├─ Deactivate/Delete
└─ View User Activity
```

---

### 3. Analytical Insights

**What it does**: Deep analytics on visitor patterns, security trends, and system performance.

**Metrics Tracked**:
- Visitor frequency by hour/day/week/month
- Most visited units
- Top visitor purposes
- Risk level trends
- Alert frequency by type
- System response time analytics
- User activity tracking
- Approval rate statistics

**Export Options**:
- Generate PDF reports
- Export to CSV
- Schedule automatic reports
- Email reports to stakeholders

```
📈 Analytics
├─ Visitor Trends
├─ Risk Analysis
├─ Alert History
├─ Performance Metrics
└─ Custom Reports
```

---

### 4. Alert Management

**What it does**: Configure and manage system-wide alert rules and monitoring.

**Alert Types**:
- Suspicious visitor detected
- Multiple failed approvals
- Blacklisted person arrival
- Unusual entry time
- System anomaly detected
- Failed authentication attempts

**Management Options**:
- Create alert rules
- Set severity levels (Critical/High/Medium/Low)
- Configure alert actions (Email/SMS/In-app)
- View alert history
- Resolve/dismiss alerts
- Create custom alerts

```
🚨 Alert Rules
├─ Rule Name
├─ Trigger Condition
├─ Severity Level
├─ Notification Method
└─ Action on Trigger
```

---

### 5. System Logs & Audit Trail

**What it does**: Complete audit trail of all system actions for compliance and troubleshooting.

**Logged Events**:
- User logins/logouts
- Visitor entries/exits
- Approval actions (approve/deny)
- User account changes
- Alert triggers
- Settings modifications
- Admin actions
- API access

**Features**:
- Search and filter logs
- Export audit records
- View user action history
- Track data changes
- Compliance reporting

```
📝 Logs
├─ Activity Type
├─ User
├─ Timestamp
├─ Details
└─ Status
```

---

### 6. System Configuration

**What it does**: Customize system behavior and workflows.

**Configurable Items**:
- Default approval timeout
- Alert notification preferences
- Email template customization
- OTP validity period
- Session timeout duration
- Rate limiting rules
- CORS allowed origins
- Feature flags

---

## 🚨 Guard Features

### 1. Visitor Check-In

**What it does**: Register new visitor arrival at the facility.

**Check-In Process**:

```
1. Guard opens Visitor Entry page
   ↓
2. Guard fills visitor information:
   - Full name
   - Email address
   - Phone number
   - Purpose of visit
   - Target unit number
   
3. Photo Capture:
   - Camera/upload photo
   - Face verification (optional)
   - AI trust score calculation
   
4. Submission:
   - System stores visitor record
   - Calculates risk level
   - Triggers resident notification
   - Returns visitor ID & QR code
```

**Captured Information**:
- Name, email, phone
- Purpose, duration
- Unit/floor information
- Photo (for identification)
- Entry timestamp
- Assigned Guard

---

### 2. Visitor Pass with QR Code

**What it does**: Generate and manage digital visitor passes.

**QR Code Includes**:
- Unique visitor ID
- Entry timestamp
- Expiration time
- Visitor name
- Guard name
- Approval status

**Features**:
- Print QR code
- Display on mobile device
- Scan for entry/exit
- Generate new pass
- Revoke pass

```
📱 Visitor Pass
├─ QR Code (Scannable)
├─ Visitor Name
├─ Unit Number
├─ Entry Time
├─ Pass Status
└─ Guard Name
```

---

### 3. Approval Inbox

**What it does**: View and manage pending visitor approvals.

**Approval Workflow**:

```
1. Visitor registered by Guard
   ↓
2. System notifies Resident via OTP/SMS
   ↓
3. Resident approves/denies
   ↓
4. Guard sees approval status
   ↓
5. Guard grants/denies facility access
```

**Approval Status**:
- ⏳ Pending (awaiting resident response)
- ✅ Approved (can proceed)
- ❌ Denied (entry refused)
- ⏰ Timeout (no response)

**Guard Actions**:
- View pending approvals
- Check approval status
- Contact resident (if needed)
- Override approval (admin privilege)
- Log additional notes

---

### 4. Alerts & Notifications

**What it does**: Real-time alerts for security events and visitor information.

**Alert Types**:
- 🚨 Critical: Blacklisted person, multiple failures
- ⚠️ High: Suspicious behavior, anomalies
- ℹ️ Medium: Unusual entry time, new visitor
- 📝 Low: System events, routine activities

**Guard Actions**:
- View active alerts
- Filter by severity
- Mark as read
- Resolve alert
- Escalate to admin

---

### 5. Mobile Navigation

**What it does**: Optimized mobile interface for on-the-go guards.

**Mobile Features**:
- Touch-optimized buttons
- One-handed operation
- Fast response times
- Offline functionality (limited)
- Mobile-first design
- Voice-based check-in (future)

---

### 6. Contact Resident

**What it does**: Direct messaging with resident for approval verification.

**Usage**:
- Send approval request reminder
- Ask clarification questions
- Get immediate response
- Speed up approval process

**Features**:
- Quick chat interface
- Message history
- Automatic escalation
- Timeout handling

---

## 👨‍🏠 Resident Features

### 1. Approval Dashboard

**What it does**: Manage visitor approval requests in real-time.

**Dashboard Shows**:
- Pending visitor approvals
- Visitor details (name, purpose, photo)
- Time received
- Target unit
- Guard information

**Actions Available**:
- ✅ Approve visitor
- ❌ Deny visitor
- ❓ Ask questions (via chat)
- ⏱️ Set conditional approval
- 📝 Add notes

```
📋 Pending Approvals
├─ Visitor Name
├─ Purpose
├─ Entry Time
├─ Unit Number
├─ Guard Name
└─ Actions (Approve/Deny/Chat)
```

---

### 2. Visitor History

**What it does**: Track all historical visitor visits.

**History Information**:
- Visitor name and contact
- Visit date and time
- Entry/exit duration
- Purpose of visit
- Approval status
- Guard who processed
- Notes/comments

**Features**:
- Search by visitor name
- Filter by date range
- View visitor details
- Export history
- Block/report visitor

---

### 3. Notifications & Alerts

**What it does**: Get notified of visitor arrivals and security events.

**Notification Types**:
- 📬 Visitor Arrival - New visitor check-in
- ✅ Approval Request - Immediate action needed
- 🚨 Security Alert - Suspicious activity
- 📝 System Notification - Maintenance, updates
- ✋ Blocked Visitor - Rejected entry attempt

**Notification Methods**:
- In-app notification
- Email notification
- SMS notification
- Push notification (mobile app)

**Settings**:
- Choose notification channels
- Set quiet hours
- Enable/disable by type
- Priority alerts only

---

### 4. Settings & Preferences

**What it does**: Customize personal preferences and security settings.

**Customizable Settings**:

```
👤 Account
├─ Name
├─ Email
├─ Phone
└─ Password

🔔 Notifications
├─ In-app: On/Off
├─ Email: On/Off
├─ SMS: On/Off
└─ Quiet Hours: 10 PM - 8 AM

🔐 Security
├─ 2FA: Enable/Disable
├─ Login alerts: On/Off
└─ Session timeout: 30 min

🏠 Residence
├─ Unit Number
├─ Building
└─ Authorized Guests
```

---

### 5. Guest Pass Management

**What it does**: Pre-approve regular or frequent visitors.

**Guest Pass Features**:
- Add regular visitors (family, friends, service providers)
- Set visit frequency (daily, weekly, monthly)
- Auto-approve matching visitors
- Set time-based restrictions
- Revoke access anytime

**Use Cases**:
- Family members visiting frequently
- Regular service providers (cleaning, maintenance)
- Business associates with recurring visits

---

### 6. Activity Feed

**What it does**: Real-time feed of facility activity affecting user.

**Feed Shows**:
- Visitor arrival notifications
- Approval requests
- Entry/exit events
- Security alerts
- System announcements
- Neighbor activities (if enabled)

---

## ⚙️ System Features

### 1. Authentication & Security

**Authentication Methods**:
- Email/Password
- Google OAuth
- 2FA (Two-Factor Authentication)
- Session management
- Token expiry

**Security Features**:
- JWT token-based API security
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens

---

### 2. Real-Time Updates

**Technology**: Supabase Real-time Subscriptions

**Real-Time Events**:
- Visitor status changes
- New approvals
- Alerts triggered
- User notifications
- System events

**Benefits**:
- Instant updates without refresh
- Live dashboards
- Immediate notifications
- Reduced server load

---

### 3. Mobile Responsiveness

**Features**:
- Responsive design (mobile, tablet, desktop)
- Touch-optimized interface
- Fast loading times
- Offline capability (limited)
- Mobile-first design philosophy

---

### 4. Notifications System

**Delivery Channels**:
- In-app notifications
- Email notifications
- SMS notifications (future)
- Push notifications (future)

**Features**:
- Message queuing
- Retry logic
- Delivery confirmation
- Unsubscribe options

---

### 5. Role-Based Access Control

**Roles Included**:
- **Admin** - Full system access
- **Guard** - Visitor check-in rights
- **Resident** - Approval rights

**Access Control**:
- Route protection
- API endpoint authorization
- Feature flagging
- Resource ownership checks

---

### 6. Data Export & Reporting

**Export Formats**:
- PDF reports
- CSV spreadsheets
- JSON data
- XML format (future)

**Report Types**:
- Daily/Weekly/Monthly summaries
- Visitor analytics
- Alert history
- System performance
- Compliance reports

---

## 🔮 Planned Features

### Phase 2 (Q2 2025)
- AI-powered face recognition
- Advanced anomaly detection
- SMS notifications
- Mobile app (React Native)
- Biometric authentication

### Phase 3 (Q3 2025)
- Machine learning risk predictions
- Building access system integration
- Multi-facility management
- Premium analytics suite
- Voice-based interactions

---

## 📊 Feature Comparison Matrix

| Feature | Admin | Guard | Resident |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Visitor Entry | ✅ | ✅ | ❌ |
| QR Pass | ✅ | ✅ | ✅ |
| Approvals | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ |
| Analytics | ✅ | ❌ | ❌ |
| Logs | ✅ | ✅ | ❌ |
| Alerts | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |

---

**Last Updated**: November 2024
