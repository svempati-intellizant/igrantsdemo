# Use the official Node.js 14 image as a base
FROM node:14 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
# COPY package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the app code
COPY ./src ./src
COPY ./public ./public

ENV REACT_APP_IGRANT_BACKEND_BASEURL=/api

# Build the app
RUN npm run build

# Define a volume to map the build output to the host filesystem
VOLUME /data

# Start Container
CMD ["cp", "-r", "./build", "/data"]
