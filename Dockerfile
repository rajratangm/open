# Use a Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install server dependencies
RUN npm install

# Copy the server application files to the container
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the server application
CMD ["node", "server.js"]
