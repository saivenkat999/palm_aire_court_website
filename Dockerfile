FROM node:18-alpine

WORKDIR /app

# Install OS dependencies required for health checks and builds
RUN apk add --no-cache curl

# Copy package manifests
COPY package*.json ./

# Install dependencies (include dev deps for build step)
RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the frontend and bundle the server
RUN npm run build

# Remove dev dependencies after build to keep the image lean
RUN npm prune --omit=dev

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
