FROM node:22-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:22-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app/backend
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen
COPY backend/ ./

COPY --from=frontend-builder /frontend/dist /app/frontend/dist

EXPOSE 5000 4173

ENV PYTHONUNBUFFERED=1
CMD sh -c "npx --yes serve /app/frontend/dist -l 4173 & uv run flask --app main run --host 0.0.0.0"
