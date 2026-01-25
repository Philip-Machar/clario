# Clario

**Clario** is a next-generation productivity and accountability platform designed to help individuals and teams achieve their goals, build habits, and stay on track with daily tasks. Combining a modern, visually rich interface with AI-powered mentorship and advanced streak tracking, Clario empowers users to maximize their potential every day.

---

## 🚀 Features

- **AI Mentor Chat**: Get real-time advice, motivation, and accountability from an AI-powered mentor.
- **Task Management**: Create, edit, organize, and track tasks with intuitive drag-and-drop boards.
- **Streak & Heatmap Analytics**: Visualize your consistency with GitHub-style streak heatmaps and monthly progress charts.
- **Focus Timer**: Built-in Pomodoro-style timer to boost your productivity on selected tasks.
- **User Authentication**: Secure registration and login with JWT-based sessions.
- **Responsive Design**: Beautiful, accessible UI for both desktop and mobile.
- **Modern Tech Stack**: Built with React, TypeScript, Go, PostgreSQL, and Tailwind CSS.

---

## 🏗️ Project Structure

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

## ⚡️ Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Go** (v1.24+)
- **PostgreSQL** (v14+)

### 1. Clone the repository
```bash
git clone https://github.com/Philip-Machar/clario.git
cd clario
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env   # Set environment variables
# Edit .env with your DB credentials and secrets

# Run migrations
# (ensure PostgreSQL is running and accessible)
go run ./cmd/migrate.go

# Start the API server
go run ./cmd/server.go
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as configured).

---

## 🧩 Key Components

- **Dashboard**: Central hub for daily tasks, progress, and AI mentor chat.
- **MentorChat**: Real-time chat with your AI mentor for motivation and accountability.
- **ControlHub**: Streak heatmaps, focus timer, and productivity analytics.
- **Authentication**: Secure login and registration flows.

---

## 🗄️ Database Schema

- **Tasks**: Stores all user tasks, status, and metadata.
- **Task Streaks**: Tracks daily completion streaks for analytics.
- **Users**: User accounts and authentication.
- **AI Chats**: Stores mentor chat history for each user.

---

## 🛡️ Security
- JWT authentication for API endpoints
- CORS and secure session management
- Environment-based configuration

---

## 🧠 AI & Productivity
Clario leverages advanced AI to:
- Provide personalized tips and accountability
- Motivate users to maintain streaks
- Suggest productivity improvements

---

## 📈 Streak & Heatmap Analytics
- **Streak Matrix**: GitHub-style heatmap showing all completed days in the last 32 days.
- **Monthly Heatmap**: Visualizes daily task completion for the current month.
- **Current Streak**: Number of consecutive days with at least one completed task.

---

## 💻 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Go, Chi, PostgreSQL
- **AI**: Google Generative AI API

---

## 🤝 Contributing
We welcome contributions! Please:
1. Fork the repo and create your branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add some feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

> Clario — Your AI-powered accountability partner for a better you.
