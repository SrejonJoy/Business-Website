# Business-Website

## Deployment guide

This repository contains a Laravel API backend (`my-api-backend`). Below are clear, step-by-step instructions to deploy your full stack:

- Database: Managed MySQL on Railway (easy and free to start). Alternatives: PlanetScale (MySQL), Aiven (MySQL), Neon/Supabase (Postgres).
- Backend (Laravel): Railway using the provided `Procfile`. Alternatives: Render, Fly.io, Forge (VPS).
- Frontend: If your frontend lives in a separate folder/repo (e.g., `my-social-login-app`), deploy it on Vercel or Netlify.

The steps assume Windows PowerShell.

### 1) Host the database (Railway MySQL)

1. Create a Railway account: https://railway.app/
2. New Project → Provision a MySQL database.
3. Copy the connection details from the Railway MySQL plugin (host, port, database, username, password).
4. Keep these values handy for the backend step.

Notes
- If you prefer PlanetScale (MySQL), create a database and a password-protected branch, then use its host/username/password. Set `DB_CONNECTION=mysql` and enable SSL if required.
- If you prefer Neon or Supabase (Postgres), set `DB_CONNECTION=pgsql` and update host/port/username/password accordingly.

### 2) Deploy the Laravel backend to Railway

We’ve added a `Procfile` so Railway (and similar platforms) can start the web process correctly. Railway detects PHP projects and runs Composer automatically.

1. Push your repo to GitHub (or make sure it’s up to date).
2. In Railway, create a new “Service” from your GitHub repo and choose the `my-api-backend` folder as the root (set it as the service root or point Railway to it during setup).
3. Configure variables in Railway → Variables (env).

	Option A — Public Proxy (chosen)
	- `APP_ENV=production`
	- `APP_DEBUG=false`
	- `APP_KEY` → Generate locally once and paste (see below)
	- `APP_URL` → Your Railway service URL (once deployed)
	- `DB_CONNECTION=mysql`
	- `DB_HOST=metro.proxy.rlwy.net`
	- `DB_PORT=35869`
	- `DB_DATABASE=railway`
	- `DB_USERNAME=root`
	- `DB_PASSWORD=<your Railway password>`
	- (Alternative single var) `DATABASE_URL=mysql://root:<password>@metro.proxy.rlwy.net:35869/railway`

	Option B — Private Network (if backend + DB both on Railway, recommended long-term)
	- `DB_CONNECTION=mysql`
	- `DB_HOST=mysql.railway.internal`
	- `DB_PORT=3306`
	- `DB_DATABASE=railway`
	- `DB_USERNAME=root`
	- `DB_PASSWORD=<your Railway password>`

4. Generate an `APP_KEY` locally and copy it to Railway:

	- Option A (local dev): run `php -r "echo base64_encode(random_bytes(32));"` and prefix with `base64:` → paste into `APP_KEY`.
	- Option B (from a local Laravel env): `php artisan key:generate --show` and paste the result.

5. Set the service Start Command to use the `Procfile` (Railway will detect it) or explicitly set:
	- `php artisan serve --host 0.0.0.0 --port $PORT`

6. Add a Deploy Hook (optional): after successful build, run migrations. You can do this via Railway “Deploy” → “Actions” → “Run” with command:
	- `php artisan migrate --force`

7. Health check: the app now exposes `/health` returning `OK`.

That’s it — the API should be reachable at your Railway domain.

Tips
- Laravel’s storage is ephemeral on most PaaS providers. If you handle file uploads, use S3/Cloud Storage and configure `FILESYSTEM_DISK=s3` and credentials.
- Cache/Queue: consider Redis add-ons and set `CACHE_DRIVER=redis`, `QUEUE_CONNECTION=redis` if needed.
 - CORS: set `CORS_ALLOWED_ORIGINS` to your frontend origin(s); defaults include localhost.

### 3) Deploy the frontend (Vercel or Netlify)

Since the frontend code isn’t in this repo, connect its repository to Vercel or Netlify and configure:

- Build Command: depends on framework (e.g., `npm run build`)
- Output Directory: e.g., `dist` for Vite, `build` for CRA
- Environment variables:
  - `VITE_API_BASE_URL` (or similar), pointing to your deployed backend URL (e.g., `https://your-api.up.railway.app`)

After deploy, test your login and API calls against the backend domain.

## Frontend on Vercel (step-by-step)

Assumption: your frontend is a Vite/React app (common for apps named like `my-social-login-app`). If you use CRA/Next.js, see notes below.

1. Prepare your frontend repo
	- Ensure it builds locally: `npm ci && npm run build` (Vite outputs to `dist/` by default)
	- Confirm API base URL is read from an env like `VITE_API_BASE_URL`

2. Import into Vercel
	- Go to https://vercel.com/new → Import your GitHub repo
	- Vercel auto-detects Vite. If not, choose Framework Preset: `Vite`
	- Build Command: `npm run build`
	- Output Directory: `dist`
	- Install Command: `npm ci` (recommended)

3. Set environment variables (Vercel → Project → Settings → Environment Variables)
	- `VITE_API_BASE_URL` = `https://<your-backend>.up.railway.app`
	- Add any other frontend secrets you use (e.g., public keys)

4. Configure CORS on backend
	- On Railway → your Laravel service → Variables, set:
	  - `CORS_ALLOWED_ORIGINS=https://<your-project>.vercel.app,https://<your-custom-domain>`
	- Redeploy backend or clear config cache if needed

5. First deploy
	- Push to the default branch → Vercel builds and deploys a Preview
	- Open the Vercel Preview URL and test API requests to the backend

6. Optional: Custom domain
	- Add your domain in Vercel (Project → Settings → Domains)
	- Add the domain to `CORS_ALLOWED_ORIGINS` on the backend

7. SPA routing (if needed)
	- Most Vite templates work out-of-the-box. If you need client-side routing fallback, add this `vercel.json` to your frontend repo:

	{
	  "version": 2,
	  "builds": [{ "src": "dist/**", "use": "@vercel/static" }],
	  "routes": [
		 { "handle": "filesystem" },
		 { "src": "/(.*)", "dest": "/index.html" }
	  ]
	}

Notes for other frameworks
- CRA: Output is `build/`; build with `npm run build`.
- Next.js: Set `NEXT_PUBLIC_API_BASE_URL` and use Next.js fetch from server/client appropriately. No SPA fallback needed.

### Running migrations and seeders

- One-time schema setup: `php artisan migrate --force`
- Optional: `php artisan db:seed --force`

You can run these as Railway “Actions” against your deployed service.

### Production env template

Update `my-api-backend/.env.example` for production usage:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://your-api-domain`
- Set DB variables to your managed DB values.

### Alternatives

- Render: Create a PHP Web Service. Build Command: `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache`. Start Command (simple): `php -S 0.0.0.0:$PORT public/index.php`. Add a post-deploy hook `php artisan migrate --force`.
- Fly.io: Use a Dockerfile with PHP-FPM + Nginx or FrankenPHP; run `php artisan migrate --force` during release.
- Forge (VPS): Provision a server, point your domain, and deploy the repo; configure env and queues. Great for long-term control.

### Troubleshooting

- 502/Timeout: check `APP_KEY` is set and `APP_ENV=production`, `APP_DEBUG=false`.
- DB connection errors: verify host/port/user/password match your provider and DB is publicly reachable or available in the same provider’s network.
- CORS issues from frontend: set proper CORS in `my-api-backend/config/cors.php` and ensure your frontend origin is allowed in production.

