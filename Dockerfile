# Stage 1: Build the React application
FROM node:14 AS build-frontend

WORKDIR /frontend

# Copy the package.json and package-lock.json (if available)
COPY frontend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Stage 2: Set up the Python backend
FROM python:3.10-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy the backend requirements and install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the backend application code
COPY backend/ /app/
COPY manage.py /app/

# Copy the built frontend application to the backend static directory
COPY --from=build-frontend /frontend/build /app/static

EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
