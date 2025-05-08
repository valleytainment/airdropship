# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (if any - e.g., for Playwright browsers)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     # Add any system packages needed by your dependencies
#     && rm -rf /var/lib/apt/lists/*

# Install Playwright browsers (important for scraper_service)
# Note: This adds significant size to the image
RUN python -m playwright install --with-deps chromium

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/

# Install any needed packages specified in requirements.txt
# Use --no-cache-dir to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code into the container at /app
COPY ./src /app/src

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable defaults (can be overridden at runtime)
# ENV OLLAMA_ENDPOINT="http://host.docker.internal:11434" # Example if Ollama runs on host
# ENV DATABASE_URL="mysql+pymysql://user:password@host:port/db"

# Run uvicorn server when the container launches
# Use --host 0.0.0.0 to make it accessible externally
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

