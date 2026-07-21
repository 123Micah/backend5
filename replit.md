# Examination System — Backend API

## Project Overview
A Node.js/Express REST API for an online examination system. Pure backend — no frontend (frontend lives in a separate GitHub repository).

## Stack
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **File Uploads:** Multer + Cloudinary
- **Dev server:** Nodemon

## How to Run
The workflow is named **"Backend API"** and runs `npm start` (which calls `nodemon server.js`) on port 5000.

Required secrets (set in Replit Secrets):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWTs
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret

## API Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/admin/login | None | Admin login |
| POST | /api/auth/student/register | None | Student registration |
| POST | /api/auth/student/login | None | Student login |
| GET | /api/admin/tests | Admin | List all tests |
| PUT | /api/admin/tests/:id | Admin | Edit a test |
| DELETE | /api/admin/tests/:id | Admin | Delete a test |
| GET | /api/admin/submissions | Admin | All student submissions |
| DELETE | /api/admin/submissions/:id | Admin | Delete a submission |
| POST | /api/tests/create-test | Admin | Create test with questions |
| POST | /api/tests/add-question | Admin | Add question (with image) |
| POST | /api/tests/submit/:id | Auth | Submit test (legacy route) |
| GET | /api/tests/:id | Auth | Get test by ID |
| GET | /api/student/tests | Student | Browse available tests |
| GET | /api/student/tests/:testId/questions | Student | Get questions (no answers) |
| POST | /api/student/tests/submit | Student | Submit answers |
| GET | /api/student/submissions | Student | Own submission history |

## Notes
- Admin accounts must be seeded directly in MongoDB (no admin register endpoint)
- Frontend is in a separate GitHub repository
