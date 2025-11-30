package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/Philip-Machar/clario/internal/models"
)

type TaskRepository struct {
	DB *sql.DB
}

// A function to instantiate TaskRepository struct
func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{DB: db}
}

// method to insert a new row into postgreSQL
func (r *TaskRepository) Create(task *models.Task) error {
	query := `
		INSERT INTO tasks (title, description, status, priority, due_date)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.DB.QueryRow(query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.DueDate,
	).Scan(&task.ID, &task.CreatedAt, &task.UpdatedAt)
}

// method to get data of all the rows in our tasks table
func (r *TaskRepository) GetAll() ([]models.Task, error) {
	rows, err := r.DB.Query(`SELECT id, title, description, status, priority, due_date, completed_at, created_at, updated_at FROM tasks ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var t models.Task
		var due sql.NullTime
		var completed sql.NullTime

		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Status, &t.Priority, &due, &completed, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}

		if due.Valid {
			t.DueDate = &due.Time
		}

		if completed.Valid {
			t.CompletedAt = &completed.Time
		}

		tasks = append(tasks, t)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *TaskRepository) Delete(id int) error {
	query := `DELETE FROM tasks WHERE id = $1`

	_, err := r.DB.Exec(query, id)

	if err != nil {
		return err
	}

	return nil
}

func (r *TaskRepository) Update(task *models.Task) error {
	query := `
		UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING updated_at
	`
	return r.DB.QueryRow(query,
		task.Title,
		task.Description,
		task.Status,
		task.Priority,
		task.DueDate,
		task.ID,
	).Scan(&task.UpdatedAt)
}

func (r *TaskRepository) UpdateStatus(id int, status string) error {
	var query string

	if status == "complete" {
		query = `UPDATE tasks SET status = $1, updated_at = NOW(), completed_at = NOW() WHERE id = $2`
	} else {
		query = `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2`
	}

	_, err := r.DB.Exec(query, status, id)

	return err
}

func (r *TaskRepository) GetCurrentStreaks() (int, error) {
	query := `
		SELECT DATE(completed_at), COUNT(*)
		FROM tasks
		WHERE completed_at IS NOT NULL AND completed_at <= due_date
		GROUP BY DATE(completed_at)
		ORDER BY DATE(completed_at) DESC;
	`

	rows, err := r.DB.Query(query)

	if err != nil {
		return 0, err
	}

	defer rows.Close()

	var streak int
	var lastDay time.Time

	for rows.Next() {
		var day time.Time
		var count int

		fmt.Println("Rows: ", rows)

		if err := rows.Scan(&day, &count); err != nil {
			return 0, err
		}

		if streak == 0 {
			streak = 1
			lastDay = day
			continue
		}

		if day.Equal(lastDay.AddDate(0, 0, -1)) {
			streak++
			lastDay = day
		} else {
			break
		}
	}

	return streak, nil
}
