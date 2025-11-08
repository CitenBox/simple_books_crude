#!/bin/bash
docker compose -f compose.base.yml -f compose.prod.yml up -d --build --wait
curl -I http://localhost:8080/               
curl -I http://localhost:8080/api/health
curl -I http://localhost:3001/ || echo "api not published (good)"