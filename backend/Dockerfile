# Stage 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production environment
FROM node:18-alpine
WORKDIR /app
# Copy only necessary files from builder
COPY --from=builder /app .
# Remove development dependencies to reduce image size
RUN npm prune --production 

EXPOSE 5000
CMD ["npm", "start"]