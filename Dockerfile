FROM node:20-slim

WORKDIR /app

# Install backend deps
COPY package.json ./
RUN npm install

# Build frontend
COPY frontend/package.json frontend/
RUN cd frontend && npm install

COPY frontend/ frontend/
RUN cd frontend && npm run build

# Copy server
COPY server.js ./

# Data directory for SQLite
RUN mkdir -p /data

ENV DATA_DIR=/data
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
