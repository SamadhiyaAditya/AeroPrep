---
description: How to run and test the AI Interview Coach application
---

# AI Interview Coach - Run Workflow

## Prerequisites
- Node.js v18+ installed
- Neon PostgreSQL database configured
- OpenRouter API key

## Environment Setup

1. Configure `.env` in `/backend`:
```
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
OPENROUTER_API_KEY="your-openrouter-key"
JWT_SECRET="your-jwt-secret"
```

---

## Starting the Application

// turbo-all

### 1. Start Backend Server
```bash
cd backend
node index.js
```
Server runs on http://localhost:3000

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3001

---

## Application Routes

### Frontend Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard/Home |
| `/sign-up` | Create account |
| `/sign-in` | Login |
| `/interview/create` | Start new interview |
| `/interview/session` | Q&A session |
| `/interview/coding` | Coding round |
| `/interview/feedback` | View feedback |
| `/interview/history` | Past interviews |
| `/interview/history/[id]` | Interview detail |

### Backend API
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| POST | `/interviews` | Create interview (auth) |
| PUT | `/interviews/:id/answers` | Save answers |
| PUT | `/interviews/:id/coding` | Save coding result |
| PUT | `/interviews/:id/feedback` | Save feedback |
| GET | `/interviews` | User's history |
| GET | `/interviews/:id` | Interview detail |

---

## Testing Workflow

### 1. User Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### 3. Generate Questions
```bash
curl -X POST http://localhost:3000/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"resumeURL":"https://example.com/resume.pdf"}'
```

---

## Database Commands

### Reset database
```bash
cd backend
npx prisma db push --force-reset
```

### View database
```bash
npx prisma studio
```
