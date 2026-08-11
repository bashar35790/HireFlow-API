# HireFlow API

Backend REST API for **HireFlow**, a job & recruitment platform. Built with **Express 5 + TypeScript + Prisma 7 (PostgreSQL)**.

Job seekers can browse jobs, apply, save jobs and review companies. Employers manage their company, post jobs and update applications. Admins manage users, companies, jobs, applications and reviews.

## Tech Stack

- [Express 5](https://expressjs.com/) + TypeScript
- [Prisma 7](https://www.prisma.io/) ORM with PostgreSQL (pg driver adapter)
- [Zod](https://zod.dev/) for request validation
- JWT authentication via HTTP-only cookies
- bcrypt password hashing

## Repo Layout

```
server/
├── prisma/
│   ├── schema.prisma      # Models: User, Company, Category, Job, Application, Review, SavedJob
│   ├── migrations/        # SQL migrations (init)
│   └── seed.ts            # Demo data (5 users, 4 categories, 2 companies, 6 jobs, ...)
├── docs/API.md            # Full endpoint documentation
├── src/
│   ├── app.ts             # Express app wiring (cors, json, routes, error handlers)
│   ├── server.ts          # Bootstrap / listen
│   ├── config/            # env, cors
│   ├── lib/prisma.ts      # Prisma client instance
│   ├── middleware/        # auth, role, error, validate
│   ├── routes/            # per-module routers
│   ├── services/          # per-module (schema + service + controller)
│   ├── types/             # shared request/DTO types
│   └── utils/             # response, asyncHandler, pagination, token, sanitize
└── render.yaml            # Render blueprint (web service + Postgres)
```

## Getting Started

### 1. Prerequisites

- Node.js >= 20
- A PostgreSQL database (local or hosted)

### 2. Install and configure

```bash
npm install
cp .env.example .env   # then fill in the values
```

`.env` variables:

| Variable          | Example                                              | Description                          |
| ----------------- | ---------------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`    | `postgresql://user:pass@localhost:5432/hireflow`     | Prisma connection string             |
| `PORT`            | `5000`                                               | Server port                          |
| `JWT_SECRET`      | `a-long-random-string`                               | Secret used to sign JWTs             |
| `JWT_EXPIRES_IN`  | `7d`                                                 | Token lifetime                       |
| `CLIENT_URL`      | `http://localhost:3000`                              | Allowed CORS origin(s), comma-separated |

### 3. Migrate the database

```bash
npm run db:generate   # generate the Prisma client
npm run db:migrate    # apply migrations
# or deploy-only: npm run db:deploy
npm run db:seed       # optional: load demo data
```

### 4. Run

```bash
npm run dev        # tsx watch on src/server.ts
# production:
npm run build      # prisma generate + tsc → dist/
npm start          # node dist/server.js
```

Server starts at `http://localhost:5000`. Health check: `GET /`. API base: `/api/v1`.

## Demo Accounts (after seeding)

Password for all accounts: `Pass@123`

| Role       | Email                   |
| ---------- | ----------------------- |
| Admin      | admin@hireflow.io       |
| Employer   | sarah@acmecorp.com      |
| Employer   | omar@globex.io          |
| Seeker     | alice@example.com       |
| Seeker     | bob@example.com         |

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Run dev server with hot reload           |
| `npm run build`     | Generate Prisma client + compile to dist |
| `npm start`         | Run compiled server                      |
| `npm run db:generate` | Generate Prisma client                 |
| `npm run db:migrate`  | Create/apply dev migrations            |
| `npm run db:deploy`   | Apply migrations (production-safe)     |
| `npm run db:push`     | Push schema without migrations         |
| `npm run db:studio`   | Open Prisma Studio                     |
| `npm run db:seed`     | Load demo data                         |

## API Documentation

See [docs/API.md](docs/API.md) for every endpoint: methods, request bodies, responses, auth/role requirements.

All responses use the consistent shape `{ success, message, data, meta? }`. Authentication is cookie-based (HTTP-only JWT cookie).

## Deployment (Render)

A `render.yaml` blueprint is included — it provisions a free Postgres database and web service:

1. Push this repo to GitHub (`bashar35790/HireFlow-API`).
2. On Render → New → Blueprint, point at the repo.
3. Render creates `hireflow-db` and `hireflow-api`, sets `DATABASE_URL`, `JWT_SECRET` and runs `db:deploy` on start.

Alternatively deploy manually: create a Postgres DB, set the `.env` vars on the host, run `npm run build && npm start`.

## License

ISC