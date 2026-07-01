import {
  defineRailway,
  github,
  group,
  postgres,
  preserve,
  project,
  redis,
  service,
} from "railway/iac";

export default defineRailway(() => {
  // --- Databases ---
  const db = postgres("db");
  const cache = redis("cache");

  // --- Django web service ---
  const web = service("django-web", {
    source: github("Swayam0555/fullstack-swc", { branch: "master" }),
    build: "cd django-app && pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput",
    start: "cd django-app && gunicorn gamekey_platform.wsgi:application --bind 0.0.0.0:$PORT",
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      CELERY_BROKER_URL: cache.env.REDIS_URL,
      CELERY_RESULT_BACKEND: cache.env.REDIS_URL,
      SECRET_KEY: preserve(),
      DEBUG: "False",
      CELERY_TASK_ALWAYS_EAGER: "False",
      ALLOWED_HOSTS: ".railway.app,localhost",
      CORS_ALLOWED_ORIGINS: preserve(),
    },
  });

  // --- Celery worker ---
  const worker = service("celery-worker", {
    source: github("Swayam0555/fullstack-swc", { branch: "master" }),
    build: "cd django-app && pip install -r requirements.txt",
    start: "cd django-app && celery -A gamekey_platform worker --loglevel=info",
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      CELERY_BROKER_URL: cache.env.REDIS_URL,
      CELERY_RESULT_BACKEND: cache.env.REDIS_URL,
      SECRET_KEY: preserve(),
      DEBUG: "False",
      CELERY_TASK_ALWAYS_EAGER: "False",
    },
  });

  // --- Organize on canvas ---
  const backend = group("Backend", [db, cache, web, worker]);

  return project("fullstack", {
    resources: [backend],
  });
});
