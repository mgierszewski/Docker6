FROM node:20-alpine
WORKDIR /app

# ARG for image version
ARG IMAGE_VERSION
LABEL version=$IMAGE_VERSION

# Set environment variables
ENV NODE_ENV=production \
	PORT=3000

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the app
COPY . .

# Run as non-root user
USER node

CMD ["node", "server.js"]
