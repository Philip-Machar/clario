package main

import (
	"fmt"
	"net/http"

	"github.com/Philip-Machar/clario/internal/db"
	"github.com/Philip-Machar/clario/internal/handlers"
	authMiddleware "github.com/Philip-Machar/clario/internal/middleware"
	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {

	//connect to db
	database := db.Connect()
	defer database.Close()

	//Repositories
	taskRepo := repository.NewTaskRepository(database)
	userRepo := repository.NewUserRepository(database)

	//Handlers
	taskHandler := handlers.NewTaskHandler(taskRepo)
	authHandler := handlers.NewAuthHandler(userRepo)

	//create a new router
	r := chi.NewRouter()

	//Global Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	//PUBLIC ROUTES
	r.Post("/register", authHandler.RegisterUser)
	r.Post("/login", authHandler.Login)

	//PROCTECTED ROUTES (token required)
	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.AuthMiddleware)

		r.Post("/register", taskHandler.Create)
		r.Get("/tasks", taskHandler.GetAll)
		r.Delete("/task/{id}", taskHandler.Delete)
		r.Put("/task/{id}", taskHandler.Update)
		r.Put("/task/{id}/status", taskHandler.UpdateStatus)
		r.Get("/streak", taskHandler.GetCurrentStreaks)
	})

	//starting server and listening ap port 8080
	fmt.Println("Server running on http://localhost:8080...")
	http.ListenAndServe(":8080", r)

}
