# 🔥 Phoenix Forge

NFT studio that generates unique elemental phoenixes with Gemini 2.5 and animates them with Kling Video O1 via OpenRouter.

## Stack
- **Frontend**: React + Vite
- **Backend**: Express.js + SQLite (via better-sqlite3)
- **Deploy**: Fly.io with persistent volume for SQLite

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/phoenixes` | List all phoenixes |
| PUT | `/api/phoenixes/:id` | Upsert a phoenix |
| DELETE | `/api/phoenixes/:id` | Delete a phoenix |

## Deploy on Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (first time)
fly launch

# Deploy updates
fly deploy

# Create persistent volume
fly volumes create phoenix_data --size 1
```

## Local dev

```bash
# Backend
npm install
npm start

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```
