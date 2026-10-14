# Application Tracker

A small web app for students to track job and internship applications.

## Features
- Add, edit and delete applications (company, role, date, status, job link, follow-up date, notes)
- Move applications through stages: Applied, Interview, Offer, Rejected
- Search by company or role, filter by status, sort
- Summary cards with counts per status and response rate
- Highlights applications with no update in 14+ days
- CSV export of the current filtered view
- Data persists in a local SQLite file

## Run it

Requires Node.js 18+.

Terminal 1 (API, port 3001):

    cd server
    npm install
    npm run dev

Terminal 2 (frontend, port 5173):

    cd client
    npm install
    npm run dev

Open http://localhost:5173

## Tech decisions
- **React + Vite** frontend, **Express** REST API, **SQLite** (better-sqlite3) database.
- **SQLite** because it is a single file: no setup, data survives restarts, and anyone can clone and run it.
- **Filtering and sorting happen in SQL** on the server, using parameterized queries. Sort options come from a whitelist, since placeholders cannot be used in ORDER BY.
- **Validation on the server** (and a `CHECK` constraint in the database), because the API can be called without the UI.
- **Vite proxy** forwards `/api` to Express in development, avoiding CORS setup.
- **State lives in `App`** and flows down as props. Simple enough that Context or Redux would be overkill.
- Dates are stored as ISO text (`YYYY-MM-DD`), so they sort correctly. Timestamps are UTC.
- **Response rate** = (Interview + Offer + Rejected) / total, since a rejection is still a response.
- The summary always counts all applications, not only the filtered ones.
- Job links without `http(s)://` get `https://` added by the server.

## Known limitations
- Single user, no authentication.
- Search sends a request on every keystroke (a debounce would help).
- Delete uses the browser's confirm dialog.
- A lint rule about setting state inside an effect is disabled for the initial data load. A library like React Query would be cleaner.

## What I'd change for 1000 users
- Add accounts and a `user_id` column on applications
- Move to PostgreSQL
- Add pagination and an index on search columns
- Serve the built client from Express and deploy
- Add automated tests