# GuelmaGuide Backend

## 1) Setup

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
```

## 2) Database migrations (Alembic)

```bash
cd backend
alembic upgrade head
```

Create a new migration after model changes:

```bash
cd backend
alembic revision --autogenerate -m "describe change"
```

## 3) Run API locally

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: `GET /health`

## 4) Seed sample data

```bash
cd backend
PYTHONPATH=. python scripts/seed_data.py
```

## 5) Run tests

```bash
cd backend
pytest
```

## 6) Deployment (free-tier compatible)

### Common requirements
Set these env vars on any platform:

- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `API_V1_PREFIX` (default `/api/v1`)
- `PROJECT_NAME`
- `PROJECT_VERSION`
- `LOG_LEVEL`

### Render (recommended)
1. Create a new **Web Service** from this repository.
2. Set **Root Directory** to `backend`.
3. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add environment variables from `.env.example`.
6. Run `alembic upgrade head` once against the production DB.

`render.yaml` is included for one-click service setup.

### Railway
1. Create a new Railway project from this repository.
2. Set service root to `backend`.
3. Railway uses `Procfile` automatically.
4. Add environment variables from `.env.example`.
5. Run `alembic upgrade head` (Railway shell or release command).

### Vercel
1. Create a Vercel project and set root directory to `backend`.
2. Vercel uses `vercel.json` and `api/index.py`.
3. Add environment variables from `.env.example`.
4. Use a managed Postgres and run migrations externally (`alembic upgrade head`).

