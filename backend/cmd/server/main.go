package main

import (
	"fmt"
	"net/http"

	"github.com/Philip-Machar/clario/internal/db"
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

	//starting server and listening ap port 8080
	fmt.Println("Server running on http://localhost:8080...")
	http.ListenAndServe(":8080", r)

}
