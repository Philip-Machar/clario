package repository

import (
	"database/sql"

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
