# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source from the src directory
COPY ./src ./src

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NODE_ENV production

# Run the application
CMD ["npm", "start"]
