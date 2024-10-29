# Dockerfile for Next.js app with Node.js
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
