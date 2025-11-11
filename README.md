# Dockerized CRUD with GitHub Actions

![CI](https://github.com/citenbox/simple_books_crude/actions/workflows/ci.yml/badge.svg)

Super simple book CRUD. React + Vite frontend, C++ (Crow) backend.
Docker compositions for development and production. GitHub CI builds and pushes images.

## Environment variables

This project uses a small, consistent set of environment variables across Compose, Kubernetes, and CI.

- Backend (API)
	- PORT: API listen port (default 3001). Set in Compose and K8s ConfigMap. The server reads it at runtime.
	- HOST: Bind address (default 0.0.0.0). Currently hard-coded in the server, but carried in K8s ConfigMap for future use.

- Frontend (Vite)
	- VITE_API_BASE_URL: Base URL used by the client to call the API. Required at build/dev time.
		- Development: http://localhost:3001 (set in compose.dev.yml)
		- Production: /api (baked into client/Dockerfile.nginx so nginx can proxy to the API service)

- Database (K8s only, future use by API):
	- DB_HOST, DB_PORT, DB_NAME, DB_USER: In K8s ConfigMap (api-config/db-config)
	- DB_PASSWORD / POSTGRES_PASSWORD: In K8s Secret (db-secret)

Notes:
- The current API uses a JSON file, not the Postgres database. DB variables are provided and wired in K8s for future use.
- GitHub Actions uses a small override file to test different published ports. The images themselves don’t need extra env injection.

## Run it

**Development** (hot reload):
```bash
./updev.sh
# frontend: http://localhost:5173
# backend: http://localhost:3001
```

**Production** (nginx + optimized builds):
```bash
./upprod.sh
# http://localhost:8080
```

**Manual backend** (if you want):
```bash
cd server
./b.sh   # build
./r.sh   # run
./rb.sh  # clean rebuild
```

**Manual frontend**:
```bash
cd client
npm install
npm run dev
```

## Kubernetes deploy (optional)

Apply in order (namespace -> config -> secrets -> postgres -> api -> services):

```bash
kubectl apply -f k8s/00-namespace.yml
kubectl apply -f k8s/05-config.yml
kubectl apply -f k8s/06-secrets.yml
kubectl apply -f k8s/10-postgres.yml
kubectl apply -f k8s/20-api.yml
kubectl apply -f k8s/30-services.yml
```

Checks:
- API Deployment listens on 3001 and exposes Service port 80 -> targetPort 3001
- Liveness/readiness probes hit /health

## CI matrix and ports

The workflow accepts optional inputs to change published ports during smoke tests:
- web_port (default 8080)
- api_port (default 3001)

It generates a one-off Compose override and runs smoke checks against the resolved ports.







