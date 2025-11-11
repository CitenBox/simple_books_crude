#!/usr/bin/env bash
set -euo pipefail

# Simple Kubernetes smoke test for the Books API
# - Applies base manifests (namespace, config, secrets, postgres, api, services)
# - Waits for Deployments to become ready
# - Runs a Job that curls the API via the ClusterIP Service
#
# Usage:
#   ./k8s/test-smoke.sh            # uses default namespace 'books'
#   NAMESPACE=myspace ./k8s/test-smoke.sh

NAMESPACE="${NAMESPACE:-books}"

echo "[INFO] Using namespace: ${NAMESPACE}"

# Ensure namespace exists
kubectl get ns "${NAMESPACE}" >/dev/null 2>&1 || kubectl create ns "${NAMESPACE}"

echo "[INFO] Applying ConfigMaps and Secrets"
kubectl apply -f k8s/05-config.yml
kubectl apply -f k8s/06-secrets.yml

echo "[INFO] Deploying Postgres"
kubectl apply -f k8s/10-postgres.yml
echo "[INFO] Waiting for Postgres to be ready"
kubectl -n "${NAMESPACE}" rollout status deploy/postgres --timeout=120s

echo "[INFO] Deploying API"
kubectl apply -f k8s/20-api.yml
echo "[INFO] Waiting for API to be ready"
kubectl -n "${NAMESPACE}" rollout status deploy/api --timeout=180s

echo "[INFO] Applying Services"
kubectl apply -f k8s/30-services.yml

echo "[INFO] Running API smoke test job"
kubectl -n "${NAMESPACE}" delete job/api-smoke --ignore-not-found
kubectl apply -f k8s/99-smoke-job.yml

echo "[INFO] Waiting for Job to complete"
kubectl -n "${NAMESPACE}" wait --for=condition=complete job/api-smoke --timeout=60s

echo "[INFO] Job completed. Logs:"
POD=$(kubectl -n "${NAMESPACE}" get pods -l job-name=api-smoke -o jsonpath='{.items[0].metadata.name}')
kubectl -n "${NAMESPACE}" logs "$POD"

echo "[SUCCESS] Kubernetes smoke test passed."
