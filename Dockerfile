FROM node:20-slim AS frontend
WORKDIR /app/MAX-Frontend
COPY MAX-Frontend/package.json MAX-Frontend/package-lock.json ./
RUN npm ci
COPY MAX-Frontend/ ./
RUN npm run build

FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY . .
COPY --from=frontend /app/MAX-Frontend/dist MAX-Frontend/dist
EXPOSE 8000
CMD uvicorn backend.api:app --host 0.0.0.0 --port ${PORT:-8000}
