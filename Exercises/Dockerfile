# Use the official Python lightweight image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Expose port 8080
EXPOSE 8080

# Run a simple HTTP server on port 8080
CMD ["python3", "-m", "http.server", "8080"]
