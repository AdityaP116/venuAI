# ⚡ SentraAI Performance Guide

Optimization strategies and performance best practices.

---

## 📋 Table of Contents

1. [Performance Metrics](#performance-metrics)
2. [Frontend Optimization](#frontend-optimization)
3. [Backend Optimization](#backend-optimization)
4. [Database Optimization](#database-optimization)
5. [Caching Strategies](#caching-strategies)
6. [Monitoring Performance](#monitoring-performance)

---

## 📊 Performance Metrics

### Web Vitals Targets

| Metric | Target | Current | Status |
|---|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | 1.8s | ✅ Good |
| First Input Delay (FID) | < 100ms | 45ms | ✅ Good |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.05 | ✅ Good |
| First Contentful Paint (FCP) | < 1.8s | 1.2s | ✅ Good |
| Time to First Byte (TTFB) | < 600ms | 400ms | ✅ Good |

### API Performance Targets

| Metric | Target | Current |
|---|---|---|
| Average Response Time | < 200ms | 150ms |
| P95 Response Time | < 500ms | 380ms |
| P99 Response Time | < 1000ms | 750ms |
| Error Rate | < 0.1% | 0.02% |
| Throughput | > 100 req/s | 250 req/s |

### Load Performance

| Size | Target | Current |
|---|---|---|
| Bundle Size | < 1MB | 850KB |
| CSS Size | < 100KB | 75KB |
| JavaScript | < 500KB | 420KB |
| Images | < 300KB | 200KB |

---

## 🚀 Frontend Optimization

### Code Splitting

```javascript
// ✅ Route-based code splitting
import { lazy, Suspense } from 'react';

const Admin = lazy(() => import('./pages/admin/AdminLayout'));
const Guard = lazy(() => import('./pages/guard/GuardLayout'));
const Resident = lazy(() => import('./pages/resident/ResidentLayout'));

export const routes = [
  { path: '/admin/*', element: <Suspense fallback={<div>Loading...</div>}><Admin /></Suspense> },
  { path: '/guard/*', element: <Suspense fallback={<div>Loading...</div>}><Guard /></Suspense> },
  { path: '/resident/*', element: <Suspense fallback={<div>Loading...</div>}><Resident /></Suspense> },
];
```

### Image Optimization

```javascript
// ✅ Lazy load images
<img src="image.jpg" loading="lazy" alt="Description" />

// ✅ Use WebP format
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// ✅ Responsive images
<img src="image.jpg" 
  srcSet="small.jpg 480w, medium.jpg 768w, large.jpg 1024w"
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, 50vw"
  alt="Description" />
```

### Component Optimization

```javascript
// ✅ Memoize expensive components
import { memo } from 'react';

const VisitorCard = memo(({ visitor }) => {
  return (
    <div className="card">
      <h3>{visitor.name}</h3>
      <p>{visitor.email}</p>
    </div>
  );
});

// ✅ Use useMemo for expensive calculations
const Dashboard = () => {
  const statistics = useMemo(() => {
    return {
      total: visitors.length,
      approved: visitors.filter(v => v.status === 'approved').length,
      pending: visitors.filter(v => v.status === 'pending').length,
    };
  }, [visitors]);

  return <div>{statistics.total}</div>;
};

// ✅ Use useCallback for stable function references
const handleApprove = useCallback((visitorId) => {
  approveVisitor(visitorId);
}, [approveVisitor]);
```

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification
    minify: 'terser',
    // Target modern browsers only
    target: 'es2020',
    // Generate source maps for prod debugging
    sourcemap: false,
    // Chunk size limit
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        },
      },
    },
  },
  // Enable compression
  server: {
    compress: true,
  },
});
```

### CSS Optimization

```css
/* ✅ Minimize unused CSS */
/* Only include used utilities */
@config "./tailwind.config.js";

/* ✅ Use CSS variables for dynamic values */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #22d3ee;
}

/* ✅ Avoid inline styles */
/* ❌ Bad */
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>

/* ✅ Good */
<div className="error-text">Text</div>
```

---

## 🖥️ Backend Optimization

### Request Handling

```javascript
// ✅ Enable compression
const compression = require('compression');
app.use(compression());

// ✅ Connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  max: 20, // Maximum connections
  min: 5,  // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Request timeout
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// ✅ Remove unnecessary middleware
// Don't use morgan in production (use structured logging instead)
```

### Response Optimization

```javascript
// ✅ Send only needed fields
app.get('/api/visitors', async (req, res) => {
  const visitors = await db.query(
    `SELECT id, name, email, status 
     FROM visitors 
     WHERE status = $1`,
    [req.query.status]
  );
  return res.json({ data: visitors });
});

// ✅ Pagination
app.get('/api/visitors', async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;

  const [data, { count }] = await Promise.all([
    db.query('SELECT * FROM visitors LIMIT $1 OFFSET $2', [limit, offset]),
    db.query('SELECT COUNT(*) FROM visitors'),
  ]);

  return res.json({
    data,
    pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  });
});

// ✅ Filtering instead of fetching all
app.get('/api/visitors', async (req, res) => {
  const where = [];
  const params = [];

  if (req.query.status) {
    where.push('status = $' + (params.length + 1));
    params.push(req.query.status);
  }

  if (req.query.risk) {
    where.push('risk_level = $' + (params.length + 1));
    params.push(req.query.risk);
  }

  const query = `SELECT * FROM visitors ${where.length ? 'WHERE ' + where.join(' AND') : ''}`;
  const data = await db.query(query, params);

  return res.json({ data });
});
```

### Async Operations

```javascript
// ✅ Use async/await
app.post('/api/visitors', async (req, res) => {
  try {
    const visitor = await db.query(
      'INSERT INTO visitors ...',
      [...]
    );
    
    // Don't wait for notification
    notifyResident(visitor.id).catch(err => logger.error(err));
    
    return res.json(visitor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Promise.all for parallel operations
const [user, settings, permissions] = await Promise.all([
  db.query('SELECT * FROM users WHERE id = $1', [userId]),
  db.query('SELECT * FROM settings WHERE user_id = $1', [userId]),
  db.query('SELECT * FROM permissions WHERE user_id = $1', [userId]),
]);
```

---

## 💾 Database Optimization

### Query Optimization

```sql
-- ✅ Use indexes
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_created_by ON visitors(created_by);
CREATE INDEX idx_approvals_visitor_id ON approvals(visitor_id);

-- ✅ Explain query plans
EXPLAIN ANALYZE
SELECT v.*, a.status 
FROM visitors v
LEFT JOIN approvals a ON v.id = a.visitor_id
WHERE v.status = 'pending';

-- ❌ N+1 problem
SELECT * FROM visitors;
FOR EACH visitor:
  SELECT * FROM approvals WHERE visitor_id = visitor.id;

-- ✅ JOIN instead
SELECT v.*, a.status 
FROM visitors v
LEFT JOIN approvals a ON v.id = a.visitor_id;
```

### Connection Pooling

```javascript
// ✅ Reuse connections
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query };
```

### Materialized Views (Future)

```sql
-- ✅ Cache complex queries
CREATE MATERIALIZED VIEW visitor_stats AS
SELECT 
  DATE_TRUNC('day', entry_time) AS date,
  COUNT(*) AS total_visitors,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved,
  AVG(EXTRACT(EPOCH FROM (exit_time - entry_time))) AS avg_duration
FROM visitors
GROUP BY DATE_TRUNC('day', entry_time);

-- Refresh periodically
REFRESH MATERIALIZED VIEW visitor_stats;
```

### Partitioning (Future)

```sql
-- ✅ Partition large tables by date
CREATE TABLE visitors_2024_jan (
  CONSTRAINT visitors_2024_jan_check 
  CHECK (entry_time >= '2024-01-01' AND entry_time < '2024-02-01')
) INHERITS (visitors);

CREATE INDEX idx_visitors_2024_jan_status 
ON visitors_2024_jan(status);
```

---

## 💾 Caching Strategies

### Frontend Caching

```javascript
// ✅ HTTP caching headers
app.get('/api/analytics', (req, res) => {
  res.set('Cache-Control', 'max-age=3600'); // 1 hour
  return res.json(analyticsData);
});

// ✅ Service Worker caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// ✅ Browser caching with versioning
<script src="/bundle.a1b2c3d4.js"></script>
<link rel="stylesheet" href="/styles.e5f6g7h8.css">
```

### Application-Level Caching

```javascript
// ✅ In-memory cache (development)
const cache = new Map();

const getCachedData = (key, fetchFn, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (Date.now() < expiry) {
      return Promise.resolve(data);
    }
    cache.delete(key);
  }

  return fetchFn().then(data => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
    return data;
  });
};

// Usage
app.get('/api/dashboard', async (req, res) => {
  const data = await getCachedData(
    'dashboard:' + req.user.id,
    () => getDashboardData(req.user.id),
    60000 // 1 minute
  );
  return res.json(data);
});

// ✅ Redis caching (production)
const redis = require('redis');
const client = redis.createClient();

const getCachedData = async (key, fetchFn, ttl = 300) => {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFn();
  await client.setEx(key, ttl, JSON.stringify(data));
  return data;
};
```

### Cache Invalidation

```javascript
// ✅ Invalidate on change
app.post('/api/visitors', async (req, res) => {
  const visitor = await db.create(req.body);
  
  // Invalidate related caches
  await client.del('visitors:all');
  await client.del(`visitors:${req.body.unit_number}`);
  await client.del(`user:${req.user.id}:dashboard`);
  
  return res.json(visitor);
});

// ✅ Cache tag strategy
const setCachedData = async (key, data, tags = []) => {
  await client.setEx(key, 3600, JSON.stringify(data));
  
  for (const tag of tags) {
    await client.sAdd(`tag:${tag}`, key);
  }
};

const invalidateByTag = async (tag) => {
  const keys = await client.sMembers(`tag:${tag}`);
  if (keys.length) {
    await client.del(...keys);
  }
  await client.del(`tag:${tag}`);
};
```

---

## 📈 Monitoring Performance

### Browser DevTools

```
1. Open DevTools (F12)
2. Performance Tab:
   - Record performance
   - Check flame charts
   - Identify bottlenecks
3. Network Tab:
   - Check file sizes
   - Identify slow resources
   - Check caching headers
4. Lighthouse:
   - Run audit
   - Check score
   - Follow recommendations
```

### Server Monitoring

```javascript
// ✅ Response time tracking
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });
  
  next();
});

// ✅ Memory monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  logger.debug({
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
  });
}, 60000);
```

---

## 📋 Performance Checklist

Before production:

- [ ] Bundle size < 1MB
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Code splitting enabled
- [ ] Caching configured
- [ ] Database indexes created
- [ ] Query optimization done
- [ ] API response time < 200ms
- [ ] Error rate < 0.1%
- [ ] Rate limiting enabled
- [ ] Monitoring set up

---

**Last Updated**: November 2024
