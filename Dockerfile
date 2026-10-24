FROM node:20-alpine AS build

WORKDIR /app

# Install client and build
COPY client/package*.json ./client/
RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

# Setup Server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

COPY server ./
COPY --from=build /app/client/dist /app/client/dist

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
