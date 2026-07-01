# Use lightweight slim python base image to minimize final image footprint
FROM python:3.12-slim

# Copy the uv binary tool directly from its official container image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set the active working directory inside the container's virtual filesystem
WORKDIR /app

# Copy all local project files into the container's /app directory
COPY . .

# Sync dependencies. --no-dev excludes testing tools like pytest to optimize size
RUN uv sync --no-dev

# Define startup command. Binding to 0.0.0.0 allows host routing
CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
