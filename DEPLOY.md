# Deployment Guide — Smart-Ride

Smart-Ride is a MERN + Socket.IO app:

- **Frontend** — React (Vite) → deploy to **Netlify** (static site)
- **Backend** — Express + Socket.IO → deploy to **Render** (persistent web service; needed for websockets)
- **Database** — MongoDB → **MongoDB Atlas**

Deploy order: **Database → Backend → Frontend** (the frontend needs the backend URL).

---

## 1. Database — MongoDB Atlas

1. Create a free **M0** cluster at <https://www.mongodb.com/atlas>.
2. **Database Access** → add a user (username + password).
3. **Network Access** → allow `0.0.0.0/0` (any IP) so Render can connect.
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smartride?retryWrites=true&w=majority
   ```
   Replace `<user>` / `<password>` and keep it for the backend's `DB_CONNECT`.

---

## 2. Backend — Render

**Option A — Blueprint (uses `render.yaml`):**
1. Push this repo to GitHub.
2. Render → **New + → Blueprint** → pick this repo. It reads `render.yaml`.
3. When prompted, fill the secret env vars (see below).

**Option B — Manual Web Service:**
1. Render → **New + → Web Service** → connect the repo.
2. Settings:
   - **Root Directory:** `Backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add the env vars below.

**Backend env vars** (from `Backend/.env.example`):

| Key | Value |
|---|---|
| `DB_CONNECT` | your Atlas connection string |
| `JWT_SECRET` | a long random string |
| `GOOGLE_MAPS_API` | Google Maps **server** key |
| `GEMINI_API_KEY` | Gemini API key for voice booking (from https://aistudio.google.com) |
| `NODE_ENV` | `production` |

> Optional: set `GEMINI_MODEL` to override the default voice model (`gemini-3.1-flash-lite`).

> `PORT` is injected by Render automatically — don't set it.

After deploy you'll get a URL like `https://smart-ride-backend.onrender.com`.
Verify it: opening that URL should show **"Hello World"**.

> ⚠️ Render's free tier sleeps after inactivity, so the first request (and the
> first socket connection) can take ~30–50s to wake. Fine for a demo.

---

## 3. Frontend — Netlify

`frontend/netlify.toml` already sets the build command, publish dir, and the
SPA redirect (so refreshing `/home` doesn't 404).

1. Netlify → **Add new site → Import from GitHub** → pick this repo.
2. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. **Environment variables** (from `frontend/.env.example`):

   | Key | Value |
   |---|---|
   | `VITE_BASE_URL` | your Render backend URL (e.g. `https://smart-ride-backend.onrender.com`) |
   | `VITE_GOOGLE_MAPS_API_KEY` | Google Maps **browser** key |

4. Deploy. You'll get a URL like `https://smart-ride.netlify.app`.

> `VITE_BASE_URL` powers both the REST calls **and** the Socket.IO connection.

---

## 4. Google Maps keys

In Google Cloud Console enable: **Maps JavaScript API, Places API, Geocoding API, Distance Matrix API**.

Use two keys and restrict them:
- **Browser key** (`VITE_GOOGLE_MAPS_API_KEY`) → restrict by **HTTP referrer** to your Netlify domain. It's visible in the client bundle, so the referrer restriction is what protects it.
- **Server key** (`GOOGLE_MAPS_API`) → restrict by **IP** (or leave unrestricted for a demo) — never expose it client-side.

---

## 5. Verify the live app

1. Open the Netlify URL, sign up as a user.
2. Enter pickup + destination → pick a vehicle → confirm.
3. In another browser/incognito, sign up as a captain (`/captain-signup`) → you should receive the ride request in real time (confirms Socket.IO works across the two hosts).

---

## Troubleshooting

- **Frontend loads but API/socket calls fail** → `VITE_BASE_URL` is wrong or missing. It must be the full `https://` Render URL with no trailing slash. Re-deploy after changing env vars (Vite bakes them in at build time).
- **Refreshing a route 404s** → the SPA redirect isn't active; confirm `netlify.toml` is in `frontend/` and the base directory is `frontend`.
- **CORS errors** → the backend already uses `cors()` (all origins) and socket CORS `*`, so this usually means the backend URL is wrong, not a CORS rule.
- **First request hangs ~30s** → Render free tier cold start; retry.
- **Map is blank** → Maps key missing/unrestricted-wrong, or the required APIs aren't enabled.
