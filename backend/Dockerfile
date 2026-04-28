FROM node:22-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app/backend
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen
COPY backend/ ./

EXPOSE 5000

ENV PYTHONUNBUFFERED=1
CMD sh -c "uv run flask --app main run --host 0.0.0.0"
