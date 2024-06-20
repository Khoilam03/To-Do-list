# Stage 1: Build the React application
FROM node:14-alpine AS build-frontend

WORKDIR /frontend

# Copy the package.json and package-lock.json (if available)
COPY frontend/package.json ./
COPY frontend/package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Stage 2: Set up the Python myapp
FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy the myapp requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the myapp application code
COPY . .

EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
