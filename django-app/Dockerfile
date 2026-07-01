FROM python:3.12-slim

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files for WhiteNoise
RUN python manage.py collectstatic --noinput

# Railway injects PORT; default to 8000
ENV PORT=8000
EXPOSE ${PORT}

CMD gunicorn gamekey_platform.wsgi:application --bind 0.0.0.0:${PORT}
