# Local Setup and Docker

This document describes how to run the project locally and with Docker.

## Development (manual)

1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

2. Frontend

```bash
cd client
npm install
npm run dev -- --port 3000
```

## Docker (full stack)

```bash
docker-compose up --build
```

- Client available at `http://localhost:3000`
- Server API at `http://localhost:5000`
- MongoDB at `mongodb://localhost:27017`

## Notes
- Update `server/.env` for production secrets; never commit real secrets to git.
- To stop containers: `docker-compose down`
