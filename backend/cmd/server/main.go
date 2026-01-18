package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Philip-Machar/clario/internal/db"
	"github.com/Philip-Machar/clario/internal/handlers"
	authMiddleware "github.com/Philip-Machar/clario/internal/middleware"
	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/Philip-Machar/clario/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	//loads env file to system variables to allow os.Getenv ot read its variables
	err := godotenv.Load()

	if err != nil {
		log.Println("No .env file found")
	}

	//connect to db
	database := db.Connect()
	defer database.Close()

	//Repositories
	taskRepo := repository.NewTaskRepository(database)
	userRepo := repository.NewUserRepository(database)
	chatRepo := repository.NewChatRepository(database)

	//services
	aiService := service.NewAIService(chatRepo, taskRepo)

	//Handlers
	taskHandler := handlers.NewTaskHandler(taskRepo)
	authHandler := handlers.NewAuthHandler(userRepo)
	aiHandler := handlers.NewAIHandler(aiService)

	//create a new router
	r := chi.NewRouter()

	//cors middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	//Global Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	//PUBLIC ROUTES
	r.Post("/register", authHandler.RegisterUser)
	r.Post("/login", authHandler.Login)

	//PROCTECTED ROUTES (token required)
	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.AuthMiddleware)

		r.Post("/create/task", taskHandler.Create)
		r.Get("/tasks", taskHandler.GetAll)
		r.Delete("/task/{id}", taskHandler.Delete)
		r.Put("/task/{id}", taskHandler.Update)
		r.Put("/task/{id}/status", taskHandler.UpdateStatus)
		r.Get("/streak", taskHandler.GetCurrentStreaks)
		r.Get("/heatmap", taskHandler.GetMonthlyHeatmap)
		r.Post("/chat", aiHandler.ChatWithMentor)
	})

	//starting server and listening ap port 8080
	fmt.Println("Server running on http://localhost:8080...")
	http.ListenAndServe(":8080", r)

}
