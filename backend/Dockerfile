FROM node:22-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app/backend
COPY ./pyproject.toml ./uv.lock ./
RUN uv sync --frozen
COPY ./ ./

EXPOSE 5000

ENV PYTHONUNBUFFERED=1
CMD sh -c "uv run quart --app app run --host 0.0.0.0"
