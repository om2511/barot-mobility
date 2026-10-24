# Barot Mobility

Barot Mobility is a private fleet, driver payroll, daily transaction, and personal-finance dashboard for Harsh Barot's taxi business in Kalol, Gandhinagar, Gujarat.

## Features

- **Dashboard:** Monthly income, fleet expenses, business profit, vehicle/driver counts, and recent entries.
- **Vehicles:** Add, edit, delete, and review fleet vehicles and their assigned drivers.
- **Drivers:** Maintain driver names, contact details, salaries, and vehicle assignments.
- **Daily entries:** Record taxi income, CNG, servicing, tolls, and other vehicle transactions. The `વિગત / કારણ` field accepts custom text, and the driver is selected from registered drivers.
- **Vehicle analytics:** Review monthly vehicle-level income, expenses, and profit.
- **Driver salaries:** Create salary vouchers, record advances and bonuses, mark payments as paid, and track payment details.
- **Harsh's personal finance:** Track income and expenses separately from fleet transactions. Entry types and details can be entered as custom text, with cash or Online payment methods.
- **Admin profile:** Update the administrator's profile and password.
- **User guide:** Gujarati in-app guidance for the main workflows.

All application data is stored as JSON files under `server/data`. The application currently uses Express and file-based persistence; MongoDB is not required for local development.

## Technology

- React 18 with Vite
- Node.js with Express
- JWT authentication
- bcryptjs password hashing
- JSON file persistence
- Lucide React, Chart.js, and react-chartjs-2

## Project structure

```text
client/          React/Vite frontend
  src/
    components/  Shared UI components
    pages/       Dashboard and application pages
server/          Express API and JSON persistence
  data/          Runtime application data (not committed)
  db.js          File-based data access helpers
  server.js      API routes and authentication
build.sh         Production client build script
docker-compose.yml
render.yaml
```

## Requirements

- Node.js 18 or newer
- npm

## Local development

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Start the API:

```bash
cd server
node server.js
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. The API listens on port `5000` by default.

## Production build and start

From the repository root:

```bash
./build.sh
node server/server.js
```

On Windows, run the equivalent commands from `server` and `client` separately if the shell does not support `build.sh`:

```powershell
Set-Location server
npm install
Set-Location ..\client
npm install
npm run build
Set-Location ..\server
node server.js
```

The Express server serves the built frontend from `client/dist` when that directory exists.

## Configuration and security

Set production configuration through environment variables rather than committing secrets:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_INITIAL_PASSWORD=replace-with-a-strong-initial-password
CLIENT_ORIGIN=https://your-frontend.example.com
```

`JWT_SECRET` must contain at least 32 characters. `ADMIN_INITIAL_PASSWORD` is required only when the server creates the first administrator and must contain at least 8 characters. The `.env` file is ignored by Git. Do not commit credentials, JWT secrets, or files containing private business data. Protect and back up `server/data` in production, and restrict access to the deployed application to authorized administrators.

## API overview

All data and analytics endpoints require a valid `Authorization: Bearer <token>` header.

- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `/api/cars`
- `/api/drivers`
- `/api/car-entries`
- `/api/salaries`
- `/api/personal-finance`
- `GET /api/analytics/car-monthly`
- `GET /api/analytics/business-summary`

The resource endpoints support the CRUD operations exposed by the UI.

## Data and deployment notes

- The server creates missing JSON data files in `server/data` at startup.
- `server/data` is excluded from future source-control changes; treat it as private application data. If data files were previously committed, remove them from repository history using your approved credential/data-retention process.
- `render.yaml` describes a Node web service deployment and generates `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD`. If the Render service was created manually, add or rotate these variables in the service's Environment settings because an existing service may not automatically import later Blueprint changes.
- `docker-compose.yml` binds port `5000` to localhost only and requires `JWT_SECRET` and `ADMIN_INITIAL_PASSWORD` from the deployment environment. Put the service behind an HTTPS reverse proxy before remote access.
