# Use official Node.js runtime as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
