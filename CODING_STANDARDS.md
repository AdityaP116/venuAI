# 📝 SentraAI Coding Standards

Code style guide, naming conventions, and best practices.

---

## 📋 Table of Contents

1. [General Principles](#general-principles)
2. [JavaScript/React Standards](#javascriptreact-standards)
3. [CSS Standards](#css-standards)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [Code Comments](#code-comments)
7. [Error Handling](#error-handling)

---

## 🎯 General Principles

### Core Principles

1. **Readability** - Code is read more than written
2. **Consistency** - Follow same patterns throughout codebase
3. **Maintainability** - Make it easy to modify and extend
4. **Performance** - Don't sacrifice for premature optimization
5. **Simplicity** - Prefer simple solutions over complex
6. **DRY** - Don't Repeat Yourself

### Code Review Checklist

Before submitting PR:

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] No console.log statements (except for logging service)
- [ ] No commented-out code
- [ ] Error handling included
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 🔤 JavaScript/React Standards

### ES6+ Features

```javascript
// ✅ Use const by default, let if needed, avoid var
const MAX_RETRIES = 3;
let currentRetry = 0;

// ✅ Use arrow functions
const handleClick = () => {
  console.log('clicked');
};

// ✅ Use template literals
const message = `Hello, ${userName}!`;

// ✅ Use destructuring
const { name, email, role } = user;
const [first, second] = array;

// ✅ Use spread operator
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newKey: newValue };

// ✅ Use Promise.all for parallel operations
const [users, settings] = await Promise.all([
  fetchUsers(),
  fetchSettings(),
]);

// ❌ Avoid var
var oldVariable = 'bad practice';

// ❌ Avoid function keyword
function oldStyleFunction() {}

// ❌ Avoid string concatenation
const message = 'Hello, ' + userName + '!';
```

### React Component Style

```javascript
// ✅ Functional components with hooks
const VisitorCard = ({ visitor, onApprove, onDeny }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useContext(NotificationContext);

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await onApprove(visitor.id);
      toast.success('Visitor approved');
    } catch (error) {
      toast.error('Failed to approve visitor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="visitor-card">
      <h3>{visitor.name}</h3>
      <button onClick={handleApprove} disabled={isLoading}>
        {isLoading ? 'Approving...' : 'Approve'}
      </button>
    </div>
  );
};

// ✅ Export component
export default VisitorCard;

// ❌ Avoid class components
class OldVisitorCard extends React.Component {
  // ...
}

// ❌ Avoid inline components
const MyComponent = () => {
  const InlineComponent = () => <div>Bad</div>; // Creates new component on every render
  return <InlineComponent />;
};
```

### Props & State

```javascript
// ✅ Define prop types
import PropTypes from 'prop-types';

const VisitorList = ({ visitors, onSelect }) => {
  return (
    <div>
      {visitors.map(visitor => (
        <div key={visitor.id} onClick={() => onSelect(visitor)}>
          {visitor.name}
        </div>
      ))}
    </div>
  );
};

VisitorList.propTypes = {
  visitors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.required,
      name: PropTypes.string.required,
    })
  ).required,
  onSelect: PropTypes.func.required,
};

// ✅ Use custom hooks for state logic
const useVisitorFilter = (visitors) => {
  const [filter, setFilter] = useState('');
  
  const filtered = useMemo(() => {
    return visitors.filter(v => 
      v.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [visitors, filter]);

  return { filtered, filter, setFilter };
};

// ❌ Don't overload props
<Component 
  label="Name" 
  placeholder="Enter name"
  type="text"
  onChange={handleChange}
  onBlur={handleBlur}
  value={formData.name}
  error={errors.name}
  helperText={errors.name}
  variant="outlined"
  size="small"
  // ... too many props!
/>

// ✅ Group related props
<TextField 
  {...getTextFieldProps('name')}
  label="Name"
  placeholder="Enter name"
/>
```

### Async Operations

```javascript
// ✅ Use async/await
const loadVisitors = async () => {
  setLoading(true);
  try {
    const data = await api.get('/visitors');
    setVisitors(data);
  } catch (error) {
    console.error('Failed to load:', error);
    toast.error('Failed to load visitors');
  } finally {
    setLoading(false);
  }
};

// ✅ Handle promises properly
useEffect(() => {
  loadVisitors();
}, []);

// ✅ Use AbortController for cleanup
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      setData(response.json());
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    }
  };

  fetchData();

  return () => controller.abort();
}, [url]);

// ❌ Avoid deeply nested promises
fetch(url)
  .then(res => res.json())
  .then(data => {
    fetch(url2, { body: data })
      .then(res => res.json())
      .then(data2 => {
        // Pyramid of doom
      });
  });
```

---

## 🎨 CSS Standards

### CSS Class Naming (BEM)

```css
/* ✅ Block-Element-Modifier (BEM) */
.visitor-card { /* Block */
  padding: 16px;
  border: 1px solid #ddd;
}

.visitor-card__header { /* Element */
  display: flex;
  margin-bottom: 12px;
}

.visitor-card__name { /* Element */
  font-size: 18px;
  font-weight: bold;
}

.visitor-card--approved { /* Modifier */
  border-color: green;
}

.visitor-card--pending { /* Modifier */
  border-color: orange;
}

/* ✅ Use CSS variables */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #22d3ee;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

.visitor-card {
  padding: var(--spacing-md);
  color: var(--primary-color);
}

/* ❌ Avoid inline styles */
<div style={{ color: 'red', padding: '16px' }}>Bad</div>

/* ❌ Avoid ID selectors */
#visitor-form { /* Bad specificity */
  ...
}

/* ❌ Avoid generic class names */
.content { /* Too vague */
.title { /* Could conflict */
.red { /* Not semantic */
```

### Responsive Design

```css
/* ✅ Mobile-first approach */
.visitor-card {
  /* Mobile styles (default) */
  display: block;
  width: 100%;
}

@media (min-width: 768px) {
  .visitor-card {
    /* Tablet */
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .visitor-card {
    /* Desktop */
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* ✅ Use flexbox and grid */
.layout {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}
```

---

## 📛 Naming Conventions

### Variables & Functions

```javascript
// ✅ camelCase for variables and functions
const isLoading = true;
const maxRetries = 3;
const getCurrentUser = () => {};
const handleButtonClick = () => {};

// ✅ UPPER_CASE for constants
const MAX_ITEMS = 100;
const API_TIMEOUT = 30000;
const ROLE_ADMIN = 'admin';

// ✅ Descriptive names
const visitorCount = 10; // Good
const v = 10; // Bad
const getUsersWithRole = (role) => {}; // Good
const getU = (r) => {}; // Bad

// ✅ Boolean names start with is/has
const isLoading = true;
const hasError = false;
const isApproved = true;
const canApprove = true;
```

### Components

```javascript
// ✅ PascalCase for components
const VisitorCard = () => {};
const ApprovalForm = () => {};
const NotificationPanel = () => {};

// ❌ camelCase for components (wrong)
const visitorCard = () => {};
const approvalForm = () => {};
```

### CSS Classes

```css
/* ✅ kebab-case for CSS */
.visitor-card { }
.approval-form { }
.notification-panel { }

/* ❌ camelCase (wrong) */
.visitorCard { }
.approvalForm { }
```

### Constants/Enums

```javascript
// ✅ UPPER_SNAKE_CASE for module constants
const USER_ROLES = {
  ADMIN: 'admin',
  GUARD: 'guard',
  RESIDENT: 'resident',
};

const VISITOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
  COMPLETED: 'completed',
};

const API_ENDPOINTS = {
  BASE: '/api',
  VISITORS: '/api/visitors',
  APPROVALS: '/api/approvals',
};

// Usage
if (user.role === USER_ROLES.ADMIN) {
  // ...
}
```

---

## 📁 File Organization

### React Component File

```
components/
├── VisitorCard/
│   ├── VisitorCard.jsx (component logic)
│   ├── VisitorCard.css (styles)
│   ├── VisitorCard.test.js (tests)
│   └── index.js (export)
```

### File Structure

```javascript
// VisitorCard.jsx

// 1. Imports
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './VisitorCard.css';

// 2. Constants
const APPROVAL_TIMEOUT = 5000;

// 3. Component
const VisitorCard = ({ visitor, onApprove, onDeny }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = useCallback(async () => {
    // Implementation
  }, []);

  return (
    // JSX
  );
};

// 4. PropTypes
VisitorCard.propTypes = {
  visitor: PropTypes.object.required,
  onApprove: PropTypes.func.required,
  onDeny: PropTypes.func.required,
};

// 5. Export
export default VisitorCard;
```

---

## 💬 Code Comments

### Comment Guidelines

```javascript
// ✅ Explain WHY, not WHAT
// Retry logic for transient network failures
let retries = 0;
while (retries < MAX_RETRIES) {
  try {
    return await fetchData();
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      retries++;
      await sleep(exponentialBackoff(retries));
    } else {
      throw error;
    }
  }
}

// ✅ Use TODO/FIXME for known issues
// TODO: Implement caching for frequently accessed visitors
const getVisitors = async () => {
  return await api.get('/visitors');
};

// FIXME: This doesn't handle case sensitivity correctly
const searchVisitors = (query) => {
  return visitors.filter(v => v.name.includes(query));
};

// ✅ Document complex logic
// Calculate trust score based on:
// - Historical approval rate (40%)
// - Face verification confidence (35%)
// - Risk indicators (25%)
const trustScore = calculateTrustScore(visitor);

// ❌ Don't comment obvious code
// Set count to 0
let count = 0;

// ❌ Don't leave commented-out code
// const oldFunction = () => { ... };
// const temp = fetchData();
// dispatcher.send(data);

// ❌ Don't write misleading comments
// This function returns the user - WRONG, it returns data
const getUserData = async (id) => {
  return await fetch(`/api/visitors/${id}`);
};
```

### JSDoc Documentation

```javascript
/**
 * Approves a visitor entry and sends notification to guard.
 * 
 * @param {string} visitorId - The unique identifier of the visitor
 * @param {string} approvedBy - User ID of the approver (usually resident)
 * @returns {Promise<Object>} Approval record with timestamp
 * @throws {Error} If visitor not found or already approved
 * 
 * @example
 * const approval = await approveVisitor('uuid', 'resident-id');
 * console.log(approval.approvedAt);
 */
const approveVisitor = async (visitorId, approvedBy) => {
  // Implementation
};
```

---

## 🚨 Error Handling

### Error Handling Pattern

```javascript
// ✅ Comprehensive error handling
const loadVisitors = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/visitors');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    setVisitors(data);
    
  } catch (error) {
    // Log error for debugging
    console.error('Load visitors failed:', error);
    
    // Set user-friendly error message
    if (error.message.includes('HTTP 403')) {
      setError('You do not have permission to view visitors');
    } else if (error.message.includes('HTTP 404')) {
      setError('Visitors not found');
    } else {
      setError('Failed to load visitors. Please try again.');
    }
    
    // Also emit to error tracking service
    Sentry.captureException(error);
    
  } finally {
    setLoading(false);
  }
};

// ✅ Error boundaries for React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}
```

---

## 📋 Standards Checklist

Before committing:

- [ ] Follows naming conventions
- [ ] Clear variable/function names
- [ ] Uses const/let appropriately
- [ ] Proper error handling
- [ ] Comments explain WHY
- [ ] No console.log in production code
- [ ] No commented-out code
- [ ] Props validated with PropTypes
- [ ] Responsive CSS (mobile-first)
- [ ] No inline styles
- [ ] Tests included
- [ ] No security issues
- [ ] Performance acceptable

---

**Last Updated**: November 2024
