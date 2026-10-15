# ==========================================
# 1. Build Stage
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build the Angular application
COPY . .
RUN npm run build -- --configuration production

# ==========================================
# 2. Production Stage (Nginx)
# ==========================================
FROM nginx:alpine

# Copy built Angular files to Nginx default html directory
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
