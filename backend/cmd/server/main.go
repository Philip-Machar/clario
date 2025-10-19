package main

import (
	"fmt"
	"net/http"

	"github.com/Philip-Machar/clario/internal/db"
	"github.com/Philip-Machar/clario/internal/handlers"
	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/go-chi/chi/v5"
)

func main() {

	//connect to db
	database := db.Connect()
	defer database.Close()

	//create a new router
	r := chi.NewRouter()

	//create a get test route
	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK it works"))
	})

	repo := repository.NewTaskRepository(database)
	handler := handlers.NewTaskHandler(repo)

	r.Post("/task", handler.Create)
	r.Get("/tasks", handler.GetAll)
	r.Delete("/task/{id}", handler.Delete)
	r.Put("/task/{id}", handler.Update)
	r.Put("/task/{id}/in_progress", handler.MarkAsInProgress)
	r.Put("/task/{id}/complete", handler.MarkAsComplete)

	//starting server and listening ap port 8080
	fmt.Println("Server running on http://localhost:8080...")
	http.ListenAndServe(":8080", r)

}
