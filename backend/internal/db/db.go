package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")

	if host == "" {
		log.Fatal("DB_HOST not set")
	}

	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		user, password, host, port, name,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Database not reachable:", err)
	}

	fmt.Println("Connected to Postgres successfully ✅")
	return db
}
