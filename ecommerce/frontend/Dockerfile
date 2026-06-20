# /workspaces/codespaces-blank/ecommerce/frontend/Dockerfile
# but the OUTPUT is just static HTML/CSS/JS files.
# We don't need Node in the final image — just Nginx to serve the files.

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build the Vite app — outputs to /app/dist
RUN npm run build


# ─── STAGE 2: Serve with Nginx ──────────────────────────────────────────────
# Nginx is a lightweight web server — perfect for serving static files.
# This final image is ~25MB vs ~600MB if we kept Node.

FROM nginx:alpine AS production

# Copy Vite's build output into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles React Router / client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]