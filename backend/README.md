# Grand Palace Hotel CRM — Backend

Node.js + Express + MongoDB (Mongoose) REST API for the Grand Palace Hotel CRM frontend.

## Stack

- **Express** — HTTP server
- **Mongoose** — MongoDB ODM
- **JWT** + **bcryptjs** — auth
- **morgan** — request logging
- **cors** — frontend CORS
- **dotenv** — environment config

## Folder layout

```
backend/
  config/db.js                 # Mongo connection
  middleware/
    auth.js                    # JWT protect + role authorize
    errorHandler.js            # 404 + unified error JSON
  models/                      # Mongoose schemas (16 files)
  controllers/                 # Per-module CRUD (16 files)
  routes/                      # Per-module routers (16 files)
  utils/
    asyncHandler.js
    generateToken.js
    crudController.js          # generic list/get/create/update/delete
    crudRouter.js              # generic GET/POST/GET-id/PUT/DELETE wiring
    seed.js                    # populate demo data
  server.js                    # entry — mounts all routes under /api
  .env.example
```

## Setup

```bash
cd backend
cp .env.example .env           # then edit values
npm install
npm run seed                   # optional: load demo data (clears DB first)
npm run dev                    # http://localhost:5000
```

Requires MongoDB running locally (or set `MONGO_URI` to a remote cluster like Atlas).

## Environment variables

| Var              | Description                                          |
|------------------|------------------------------------------------------|
| `PORT`           | API port (default `5000`)                            |
| `MONGO_URI`      | MongoDB connection string                            |
| `JWT_SECRET`     | Long random string for token signing                 |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                            |
| `CORS_ORIGIN`    | Allowed origin, e.g. `http://localhost:5173`         |

## API surface

All non-auth endpoints require `Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Method | Path              | Body                       | Description           |
|--------|-------------------|----------------------------|-----------------------|
| POST   | `/register`       | `{name,email,password,role}` | Create a user       |
| POST   | `/login`          | `{email,password}`         | Returns JWT          |
| GET    | `/me`             | —                          | Current user (auth)  |

### Resource modules

Each resource exposes the same CRUD shape:

| Method | Path               | Notes                                                         |
|--------|--------------------|---------------------------------------------------------------|
| GET    | `/api/<resource>`  | List. Query: `?search=...&page=1&limit=50&<field>=<value>`    |
| GET    | `/api/<resource>/:id` | Read one                                                   |
| POST   | `/api/<resource>`  | Create                                                        |
| PUT    | `/api/<resource>/:id` | Update                                                     |
| DELETE | `/api/<resource>/:id` | Delete                                                     |

Resources mounted in `server.js`:

| Resource          | Path                       | Model            |
|-------------------|----------------------------|------------------|
| Bookings          | `/api/bookings`            | `Booking`        |
| Guests            | `/api/guests`              | `Guest`          |
| Invoices          | `/api/invoices`            | `Invoice`        |
| Employees         | `/api/employees`           | `Employee`       |
| Tickets           | `/api/tickets`             | `Ticket`         |
| Events            | `/api/events`              | `Event`          |
| Purchase Orders   | `/api/purchase-orders`     | `PurchaseOrder`  |
| Campaigns         | `/api/campaigns`           | `Campaign`       |
| Contracts         | `/api/contracts`           | `Contract`       |
| Rate Plans        | `/api/rate-plans`          | `RatePlan`       |
| KOTs              | `/api/kots`                | `Kot`            |
| Announcements     | `/api/announcements`       | `Announcement`   |
| Shifts            | `/api/shifts`              | `Shift`          |
| Templates         | `/api/templates`           | `Template`       |
| Spa Bookings      | `/api/spa-bookings`        | `SpaBooking`     |

### Auto-generated codes

Models with a `code` field auto-increment via a `Counter` collection on first save:

| Model | Prefix |
|-------|--------|
| Booking | `BK-` |
| Invoice | `INV-` |
| Employee | `EMP-` (zero-padded to 3 digits) |
| Ticket | `MT-` |
| PurchaseOrder | `PO-` |
| Kot | `KOT-` |

## Quick smoke test

```bash
# Register or login
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"aarav@grandpalace.in","password":"demo-password"}'

# Use the returned token
TOKEN=...
curl http://localhost:5000/api/bookings -H "Authorization: Bearer $TOKEN"

# Create a guest
curl -X POST http://localhost:5000/api/guests \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Anita Verma","city":"Mumbai","loyalty":"Gold"}'
```

## Wiring the frontend

In the React app set the API base in an `.env`:

```
VITE_API_BASE=http://localhost:5000/api
```

Then replace the in-memory `addItem` calls in `src/store/AppStore.jsx` with `fetch(${BASE}/<resource>, ...)` calls and store the JWT from `/api/auth/login` in localStorage. The route paths above match the form keys used in `src/store/formSchemas.js`.

## Error format

```json
{ "message": "...", "errors": { "field": "...", ... } }
```

- `400` validation errors
- `401` missing / invalid JWT
- `403` role not permitted (when using `authorize(...)`)
- `404` resource not found
- `409` duplicate key (e.g. email already exists)
- `500` server error
