# Dockerized CRUD with github actions

![CI](https://github.com/citenbox/simple_books_crude/actions/workflows/ci.yml/badge.svg)

Super simple book CRUD. React + Vite frontend, C++ (Crow) backend.
Docker compositions for development and production. GitHub CI builds and pushes images.

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
# everything on http://localhost:8080
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





