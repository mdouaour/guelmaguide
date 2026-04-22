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

### Backend dependencies

- PostgreSQL (required)
- Redis (optional, enables caching and distributed rate limiting)

## SEO

Sitemap and robots are generated from the App Router metadata files:

- `src/app/sitemap.ts`
- `src/app/robots.ts`
