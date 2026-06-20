# ecommerce/backend/Dockerfile
FROM node:20-alpine AS builder

# Set working directory inside the container.
# Every command after this runs from /app.
WORKDIR /app

# Copy ONLY package files first.
# Why? Docker caches each step (called a "layer").
# If your code changes but package.json didn't,
# Docker reuses the cached npm install — much faster rebuilds.
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Now copy the rest of your source code
COPY . .


# ─── STAGE 2: Production ────────────────────────────────────────────────────
# Fresh minimal image — only production code, no dev tools

FROM node:20-alpine AS production

WORKDIR /app

# Copy package files again
COPY package*.json ./

# Install ONLY production dependencies (no nodemon, no dev tools)
# This keeps the image lean
RUN npm install --omit=dev --legacy-peer-deps

# Copy the built app from Stage 1
COPY --from=builder /app .

# Create uploads directory (your app likely writes files here)
RUN mkdir -p uploads

# Tell Docker this container listens on port 5000
# (This is documentation — the actual port mapping is in docker-compose)
EXPOSE 5000

# Run as non-root user for security
# Never run production containers as root
USER node

# Start command — uses "start" script (node server.js), NOT nodemon
# nodemon is for development only — it restarts on file changes
# In a container, files don't change, so nodemon is wasteful
CMD ["npm", "start"]