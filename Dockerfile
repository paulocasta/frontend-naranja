# Use a specific Node.js version as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend listens on (e.g., 3000)
EXPOSE 3000

# Command to start the backend server
CMD ["npm", "start"]