# Pokodex Backend (TypeScript)

A small Node.js + TypeScript backend for your Pokodex app.

Features:

- Endpoints for `/wishlist` and `/caught` (GET/POST/PUT/DELETE)
- DB abstraction (`DBAdapter`) with two example adapters: RedisAdapter and FileAdapter
- Dummy middleware you can replace with auth or validation later
- Snapshot-to-disk on shutdown + restore on startup (snapshot path configurable via `SNAPSHOT_PATH`)

Quick start:

1. copy files into a directory
2. `npm install`
3. start a Redis server if you want to use Redis (or skip to use local file db)
4. `npm run dev` to start in dev mode (requires `ts-node-dev`)

Environment variables:

- `REDIS_URL` - URL for Redis (defaults to `redis://localhost:6379`)
- `SNAPSHOT_PATH` - path where snapshot will be saved/loaded (defaults to `./pokodex-snapshot.json`)
- `PORT` - port to listen on (defaults to 3000)

Notes:

- The RedisAdapter writes a JSON snapshot of the app data on process shutdown by reading all items and writing them to `SNAPSHOT_PATH`. On startup it will attempt to read that file and restore the hashes in Redis.
- If Redis can't be reached at startup this code falls back to a local file adapter (`pokodex-filedb.json`).
