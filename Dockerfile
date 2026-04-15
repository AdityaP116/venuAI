# ─── Stage 1: Build Frontend ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ─── Stage 2: Production Server ────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy the server directory and set up backend dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy the rest of the backend files
COPY server ./server

# Expose standard Cloud Run environment variables
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server/index.js"]
