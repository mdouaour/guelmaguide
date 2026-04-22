# GuelmaGuide MVP

Smart discovery platform for Guelma, Algeria.

## Product scope

- Discover places (`/discover`)
- Browse activities (`/activities`)
- Use a lightweight deterministic AI guide (`/ai`)
- View place details with map (`/place/[slug]`)

## Tech

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Leaflet + OpenStreetMap

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
cp .env.example .env
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

### Database migrations (Alembic)

```bash
cd backend
alembic upgrade head
```

Create a new migration when schema changes:

```bash
cd backend
alembic revision --autogenerate -m "describe change"
```

### Backend dependencies

- PostgreSQL (required)
- Redis (optional, enables caching and distributed rate limiting)

## SEO

Sitemap and robots are generated from the App Router metadata files:

- `src/app/sitemap.ts`
- `src/app/robots.ts`

## Deployment

### Backend (Render / Railway)

1. Set environment variables from `.env.example` (`JWT_SECRET_KEY`, `DATABASE_URL`, optional `REDIS_URL`).
2. Install dependencies with `pip install -r backend/requirements.txt`.
3. Start command:
   ```bash
   uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
   ```
4. Run migrations on deploy:
   ```bash
   cd backend && alembic upgrade head
   ```

### Frontend (Vercel)

1. Import repository in Vercel.
2. Set `NEXT_PUBLIC_API_BASE_URL` to your backend API base URL (for example `https://api.example.com/api/v1`).
3. Build command: `npm run build`
4. Output: default Next.js output (no custom config required).
