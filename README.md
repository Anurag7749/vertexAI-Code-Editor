# VertexAI Code Editor 🚀

VertexAI Code Editor is an AI-powered, full-stack cloud code editor with live execution, containerized microservices, and AI coding assistant capabilities.

---

## 🏗️ Architecture Overview

The project is structured as a full-stack microservices architecture:

```
vertexAI/
├── .gitignore
├── README.md
├── backend/
│   ├── docker-compose.yml
│   ├── package.json
│   ├── gateway/                  # API Gateway & Reverse Proxy
│   ├── shared/                   # Shared libraries (Redis, etc.)
│   └── services/
│       ├── ai/                   # AI code intelligence & LangGraph workflows
│       ├── auth/                 # Authentication & Firebase user management
│       ├── file/                 # File system & project tree management
│       ├── payment/              # Razorpay payments & credit allocation
│       ├── project/              # Project workspace lifecycle
│       └── terminal/             # Web terminal & container watchdog
└── frontend/                     # React + Vite Client Application
    ├── src/
    │   ├── components/           # Editor, Explorer, Terminal, AI Chat, etc.
    │   ├── features/             # Redux / API service handlers
    │   ├── pages/                # Dashboard, ProjectPage, Plans
    │   └── redux/                # Redux Toolkit state stores
    ├── index.html
    └── vite.config.js
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **State Management**: Redux Toolkit
- **Components**: Editor (Code Editor), Explorer (File Tree), Interactive Terminal, AI Chat Panel, Live Preview
- **Authentication**: Firebase Authentication
- **Payments**: Razorpay Integration

### Backend & Microservices
- **Runtime**: Node.js (ES Modules)
- **Architecture**: Microservices orchestrated via an API Gateway
- **AI Engine**: LangGraph / LLMs
- **Database & Cache**: MongoDB, Redis
- **Containerization**: Docker & Docker Compose

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for Redis and containerized services)
- MongoDB instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Anurag7749/vertexAI-Code-Editor.git
cd vertexAI-Code-Editor
```

### 2. Configure Environment Variables
Copy and populate `.env` files in each service directory (see respective `.env.example` templates):
- `backend/services/ai/.env`
- `backend/services/auth/.env`
- `backend/services/file/.env`
- `backend/services/payment/.env`
- `backend/services/project/.env`
- `backend/services/terminal/.env`
- `backend/gateway/.env`
- `frontend/.env`

*(For Firebase Admin in `backend/services/auth`, supply your `serviceAccountKey.json` following `serviceAccountKey.example.json`)*.

### 3. Start Redis & Shared Services
```bash
cd backend
docker compose up -d
```

### 4. Install Dependencies & Run Microservices
In individual service directories or using process managers:
```bash
# Gateway
cd backend/gateway && npm install && npm start

# Services (Auth, File, Project, AI, Terminal, Payment)
cd backend/services/auth && npm install && npm start
# (Repeat for each service)

# Frontend
cd frontend && npm install && npm run dev
```

---

## 🔒 Security & Best Practices

- Environment files (`.env`, `.env.*`) and private service account keys (`serviceAccountKey.json`) are ignored by `.gitignore`.
- Always configure secrets via environment variables in production.
