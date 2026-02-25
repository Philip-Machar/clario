package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
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

	// --- Retry connection (Docker/Postgres may not be ready yet) ---
	var db *sql.DB
	var err error

	for i := 0; i < 10; i++ {
		db, err = sql.Open("postgres", connStr)
		if err == nil {
			err = db.Ping()
			if err == nil {
				break
			}
		}

		log.Println("Waiting for Postgres to be ready...")
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("Database not reachable:", err)
	}

	fmt.Println("Connected to Postgres successfully ✅")

	// --- Run migrations automatically ---
	runMigrations(db)

	return db
}

func runMigrations(db *sql.DB) {
	fmt.Println("Running migrations...")

	goose.SetDialect("postgres")

	// IMPORTANT: this path must match Dockerfile copy location
	migrationsDir := "/app/migrations"

	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		log.Fatalf("Migrations folder not found at %s", migrationsDir)
	}

	if err := goose.Up(db, migrationsDir); err != nil {
		log.Fatal("Migration error:", err)
	}

	fmt.Println("Migrations applied successfully ✅")
}
