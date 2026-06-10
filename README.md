# CareerBridge — MERN Stack Project

## 📁 Project Structure

```
careerbridge/
├── frontend/          ← React.js (Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── ...
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/           ← Node.js + Express + MongoDB
    ├── config/        ← MongoDB connection
    ├── models/        ← Mongoose schemas
    ├── controllers/   ← Business logic
    ├── routes/        ← API endpoints
    ├── middleware/    ← Auth, upload, error handler
    ├── uploads/       ← Resume files stored here
    ├── .env           ← Environment variables
    └── server.js      ← Entry point
```

---

## 🚀 How to Run

### Step 1 — Start Backend
```bash
cd careerbridge/backend
npm run dev
```
Backend runs on: http://localhost:5000

### Step 2 — Start Frontend (new terminal)
```bash
cd careerbridge/frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## ⚙️ Backend API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/logout | Private | Logout |
| POST | /api/auth/forgot-password | Public | Forgot password |
| GET | /api/jobs | Public | Get all jobs |
| POST | /api/jobs | Recruiter | Post a job |
| POST | /api/applications/apply/:jobId | Student | Apply for job |
| GET | /api/applications | Private | Get applications |
| PUT | /api/applications/:id/status | Recruiter | Update status |
| GET | /api/interviews | Private | Get interviews |
| POST | /api/interviews/:applicationId | Recruiter | Schedule interview |
| GET | /api/admin/pending-companies | Admin | Pending approvals |
| POST | /api/admin/approve-company | Admin | Approve/reject company |
| DELETE | /api/admin/delete-user/:userId | Admin | Delete user |
| GET | /api/notifications | Private | Get notifications |

---

## 🔧 Requirements

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer |
| Dev Server | Nodemon |
