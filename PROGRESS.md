# Progress Tracking

This document tracks the progress of the day-wise coding exercises for Angular and Django.

## Projects Status
- **Angular App**: Scaffolded successfully (Angular 19+)
- **Django App**: Scaffolded successfully (Django 6.0+)

---

## Angular Progress

| Day | Status | Details / Assumptions / Blockers |
|-----|--------|----------------------------------|
| Day 1 | Completed | Scaffolded application and integrated Tailwind CSS. |
| Day 2 | Completed | Created standalone GameListComponent and Tailwind UI with dynamic control flow. |
| Day 3 | Completed | Implemented GameService for business logic and consumed via RxJS Observables in component. |
| Day 4 | Completed | Implemented client-side routing, router-outlet, and dynamic GameDetailComponent details page view. |
| Day 5 | Completed | Integrated Reactive Forms, added custom validation, and validation error status messages for new games. |
| Day 6 | Completed | Integrated HttpClient to fetch game catalog list from Django REST endpoint. |
| Day 7 | Completed | Created AuthService, authInterceptor to append Token headers, and functional authGuard. |
| Day 8 | Pending | |
| Day 9 | Pending | |
| Day 10| Pending | |

---

## Django Progress

| Day | Status | Details / Assumptions / Blockers |
|-----|--------|----------------------------------|
| Day 1 | Completed | Scaffolded application and integrated python-decouple. |
| Day 2 | Completed | Created core database schema (Publisher, Game, GameKey models) and ran migrations. |
| Day 3 | Completed | Built Game & Publisher API endpoints using DRF Serializers, ViewSets, and Router. |
| Day 4 | Completed | Enabled Token Authentication, implemented custom IsOwnerOrReadOnly permissions, and added registration API. |
| Day 5 | Completed | Implemented transactional Orders API with pessimistic locking select_for_update() to prevent double allocations. |
| Day 6 | Completed | Installed django-cors-headers, configured CORS middleware, and allowed origins. |
| Day 7 | Completed | Implemented HMAC-SHA256 signed webhooks for key expiration notifications. |
| Day 8 | Pending | |
| Day 9 | Pending | |
| Day 10| Pending | |
