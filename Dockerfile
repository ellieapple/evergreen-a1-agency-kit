FROM node:20-alpine
WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3100
CMD ["node", "dist/server-http.js"]
