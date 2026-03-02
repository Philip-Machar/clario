# Clario

A next-generation productivity and accountability platform designed to help individuals and teams achieve their goals

## Key Features

- **AI Mentor Chat** — Get real-time advice, motivation, and accountability from an intelligent AI-powered mentor.
- **Task Management** — Create, edit, organize, and track tasks with intuitive drag-and-drop boards.
- **Streak & Heatmap Analytics** — Visualize your consistency with GitHub-style streak heatmaps and monthly progress charts.
- **Focus Timer** — Built-in Pomodoro-style timer to boost your productivity on selected tasks.
- **User Authentication** — Secure registration and login with JWT-based sessions.
- **Responsive Design** — Beautiful, accessible UI optimized for both desktop and mobile devices.
- **Production-Ready** — Containerized with Docker, scalable infrastructure with AWS support.

---

[Live Demo](https://clario-weld.vercel.app)

## Screenshots

### Dashboard Overview
![Dashboard](docs/screenshots/clario-dashboard.png)
*Main dashboard with task overview, focus timer, and daily statistics*

---

### Technology Mapping
- **Frontend Hosting**: Vercel (auto-deploys from Git, global CDN, serverless functions)
- **Backend Hosting**: AWS EC2 (t3.micro or larger Ubuntu instance with Docker)
- **Database**: Amazon RDS PostgreSQL (managed database with automated backups)
- **DNS**: Route 53 (domain management and routing)
- **Monitoring**: CloudWatch (logs, metrics, alerts)

---

## Architecture

```
                AWS EC2 (Linux Server)
              ┌─────────────────────────┐
Internet ───▶ │ Nginx (HTTPS Gateway)   │
              │        ↓                │
              │ Docker Compose          │
              │   ├─ Backend Container  │
              │   └─ Postgres Container │
              └─────────────────────────┘
                         ↑
                 Persistent Volume (DB data)

Frontend (Vercel) talks securely to Nginx

```

---

**Prerequisites**: AWS EC2 instance running Ubuntu 22.04 LTS

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Install Docker and Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker

# Clone repository
git clone https://github.com/Philip-Machar/clario.git
cd clario/backend

# Create .env file with production values
nano .env
# DATABASE_URL=postgres://user:password@your-rds-endpoint:5432/clario
# JWT_SECRET=your_strong_jwt_secret
# GOOGLE_API_KEY=your_google_api_key
# ENVIRONMENT=production

# Build and run with Docker
docker build -t clario-backend:latest .
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --restart unless-stopped \
  --name clario-api \
  clario-backend:latest

# Verify service is running
curl http://localhost:8000/health
```

Set up reverse proxy (Nginx) for SSL:
```bash
sudo apt install -y nginx
# Configure nginx as reverse proxy to localhost:8000
# Point your domain to the Elastic IP in Route 53
```

#### 5. Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel (automatically builds and deploys)
vercel

# Set up environment variables in Vercel dashboard
# VITE_API_URL=https://your-backend-domain.com

# Enable automatic deployments from Git
# (Vercel integrates directly with GitHub)
```

Frontend will be live at: **https://clario-weld.vercel.app**

---

### Project Structure

```
clario/
├── backend/          # Go-based REST API, business logic, and database migrations
│   ├── internal/     # Core services and repositories
│   ├── migrations/   # SQL migrations for PostgreSQL
│   ├── go.mod        # Backend dependencies
│   └── ...
├── frontend/         # React + TypeScript web client
│   ├── src/
│   │   ├── components/   # Reusable UI components (Dashboard, MentorChat, ControlHub, etc.)
│   │   ├── pages/        # Main pages (Dashboard, Login, SignUp)
│   │   ├── context/      # React context (Auth, etc.)
│   │   └── ...
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── ...
├── README.md         # Project documentation
└── ...
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **Go** v1.24 or higher
- **PostgreSQL** v14 or higher
- **Docker** and **Docker Compose** (for containerized development)
- **Git** for version control

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Philip-Machar/clario.git
cd clario
```

#### 2. Backend Setup

```bash
cd backend

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgres://user:password@localhost:5432/clario
# JWT_SECRET=your_jwt_secret_key
# GOOGLE_API_KEY=your_google_generative_ai_key

# Install dependencies
go mod download

# Run database migrations
go run ./cmd/server.go migrate

# Start the development server
go run ./cmd/server.go
```

The backend API will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server with Vite
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The frontend will be available at `http://localhost:5173`

### Docker Development

For a completely containerized development environment:

```bash
cd backend

# Build and run all services with Docker Compose
docker-compose up --build

# Migrations will run automatically
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```


---

## Deployment

### Deploy to AWS with Docker

#### 1. Build Docker Image
```bash
cd backend
docker build -t clario-backend:latest .
```

Clario implements industry-standard security practices:

- **Authentication**: JWT (JSON Web Tokens) for stateless API authentication
- **Authorization**: Role-based access control (RBAC) for user endpoints
- **Encryption**: HTTPS/TLS for all communications in production
- **Environment Secrets**: Sensitive data managed through environment variables
- **CORS**: Configured origin-based access control
- **SQL Injection Prevention**: Parameterized queries using Go's database drivers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Session Security**: Secure, HTTP-only cookies for session tokens

---

## AI & Productivity Features

### AI Mentor Chat
Clario leverages **Google Generative AI** to provide:
- Personalized productivity tips and strategies
- Real-time motivation and accountability
- Intelligent task suggestions based on user behavior
- Context-aware responses using chat history

### Analytics & Insights
- **GitHub-style Heatmap**: Visualize streak patterns
- **Monthly Progress**: Track daily task completion for the current month
- **Current Streak**: Monitor consecutive days with completed tasks
- **Productivity Trends**: Visual insights into work patterns and consistency

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/refresh` — Refresh access token

### Task Endpoints
- `GET /api/tasks` — Retrieve all user tasks
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update an existing task
- `DELETE /api/tasks/:id` — Delete a task
- `PUT /api/tasks/:id/complete` — Mark task as complete

### Chat Endpoints
- `GET /api/chat/history` — Retrieve chat history
- `POST /api/chat/message` — Send a message to AI mentor
- `GET /api/chat/analytics` — Get chat-based productivity insights

---

## Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) 18+ with TypeScript for type-safe UI development
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and optimized builds
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [PostCSS](https://postcss.org/) for modern, responsive design
- **State Management**: React Context API for auth and global state
- **HTTP Client**: Custom API service with axios integration

### Backend
- **Language**: [Go](https://golang.org/) 1.24+ for high-performance server logic
- **Web Framework**: [Chi](https://github.com/go-chi/chi) for lightweight HTTP routing
- **Database**: [PostgreSQL](https://www.postgresql.org/) 14+ for reliable data persistence
- **Authentication**: JWT-based authentication with secure token generation
- **AI Integration**: Google Generative AI API for intelligent mentor chat functionality

### Infrastructure & DevOps
- **Frontend Hosting**: [Vercel](https://vercel.com/) for fast, global frontend deployment
  - Automatic Git-based deployments
  - Global CDN with edge functions
  - Zero-config HTTPS and security
  - Built-in analytics and performance monitoring
  
- **Backend Hosting**: [AWS EC2](https://aws.amazon.com/ec2/) (Ubuntu instance)
  - Go application running in Docker containers
  - Elastic IP for static IP address
  - Security groups for network access control
  
- **Containerization**: [Docker](https://www.docker.com/)
  - Consistent development and production environments
  - Docker Compose for local multi-container setup
  - Container orchestration on EC2

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

You are free to use, modify, and distribute this project, provided you include the original license notice.

---

<div align="center">

**Clario** — Built with ❤️ to help you achieve your best self

</div>
