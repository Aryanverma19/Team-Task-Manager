# Team Task Manager

A full-stack task management app for projects, teams, and role-based task tracking.

## Features

- User authentication with signup/login
- Role-based access control: `ADMIN` and `MEMBER`
- Project creation and team member management
- Task creation, assignment, status tracking, and overdue detection
- Dashboard with active tasks, status breakdown, and overdue tasks
- REST API backend powered by Express + Prisma
- React + Vite frontend

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in `server/` with:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=supersecretkey
PORT=4000
```

3. Run Prisma migrate and seed data

```bash
cd server
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Start the server and client

```bash
npm run dev
```

5. Open the app at `http://localhost:5173`

## Deployment

This project is ready for deployment on Railway or any Node + static frontend hosting provider.

- Backend reads `DATABASE_URL`, `JWT_SECRET`, and `PORT` from environment variables
- Frontend can be built with `npm run build` in `client/`

## Project Structure

- `server/` — Express API server, Prisma schema, validation and auth middleware
- `client/` — React frontend built with Vite

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/projects`
- `POST /api/projects/:id/members`
- `GET /api/projects/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`

## Notes

- Create an admin user with the seed script
- Use role `ADMIN` to manage projects and team members
