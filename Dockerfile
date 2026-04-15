# --- Stage 1: Build the Frontend ---
FROM node:20-slim AS build-stage

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Install all dependencies (dev + prod) for building
RUN npm install

# Copy all code
COPY . .

# Build the frontend (Vite generates the 'dist' folder)
RUN npm run build

# --- Stage 2: Production Server ---
FROM node:20-slim AS production-stage

WORKDIR /app

# Copy server code and its package files
COPY server/package.json server/package-lock.json* ./server/
COPY server/ ./server/

# Install ONLY production dependencies for the server
RUN cd server && npm install --production

# Copy the built frontend from the build stage
COPY --from=build-stage /app/dist ./dist

# The server serves the 'dist' folder from '../dist' relative to server/index.js
# This matches the internal structure:
# /app/server/index.js
# /app/dist/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Cloud Run expects the container to listen on $PORT
EXPOSE 8080

# Start the server
CMD ["node", "server/index.js"]
