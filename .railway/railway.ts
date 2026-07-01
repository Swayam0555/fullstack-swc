import { defineRailway, github, postgres, project, redis, service, volume } from "railway/iac";

export default defineRailway(() => {
  const fullstackSwc = github("Swayam0555/fullstack-swc", { branch: "master" });

  const Redis = redis("Redis");
  const Postgres = postgres("Postgres");
  const postgresVolume = volume("postgres-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "sfo", sizeMB: 500 });
  const redisVolume = volume("redis-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "sfo", sizeMB: 500 });

  const celeryWorker = service("celery-worker", {
    source: fullstackSwc,
    rootDirectory: "django-app",
    replicas: 1,
    start: "celery -A gamekey_platform worker --loglevel=info",
    env: {
      DATABASE_URL: Postgres.env.DATABASE_URL,
      CELERY_BROKER_URL: Redis.env.REDIS_URL,
      CELERY_RESULT_BACKEND: Redis.env.REDIS_URL,
      SECRET_KEY: "django-insecure-i@@tbg96g8^3@st%-1)s76^()t=#5nu29!#(_d2io@thp&c)wi",
      DEBUG: "False",
      CELERY_TASK_ALWAYS_EAGER: "False",
    }
  });

  const djangoApi = service("django-api", {
    source: fullstackSwc,
    rootDirectory: "django-app",
    replicas: 1,
    env: {
      DATABASE_URL: Postgres.env.DATABASE_URL,
      CELERY_BROKER_URL: Redis.env.REDIS_URL,
      CELERY_RESULT_BACKEND: Redis.env.REDIS_URL,
      SECRET_KEY: "django-insecure-i@@tbg96g8^3@st%-1)s76^()t=#5nu29!#(_d2io@thp&c)wi",
      DEBUG: "False",
      CELERY_TASK_ALWAYS_EAGER: "False",
      ALLOWED_HOSTS: ".railway.app,localhost",
      CORS_ALLOWED_ORIGINS: "https://angular-app-psi-eight.vercel.app",
    }
  });

  return project("fullstack-swc", {
    resources: [celeryWorker, djangoApi, Redis, Postgres, postgresVolume, redisVolume],
  });
});
