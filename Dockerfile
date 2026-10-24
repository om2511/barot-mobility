# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS production
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server source code
COPY server ./server

# Copy built frontend from Stage 1
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server

EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
