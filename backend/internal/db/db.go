package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	connStr := "postgres://postgres:blackfire788@localhost:5432/clario?sslmode=disable"

	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}

	err = db.Ping()

	if err != nil {
		log.Fatal("Database not reachable: ", err)
	}

	fmt.Println("Connected to Postgres successfully ✅")

	return db
}
