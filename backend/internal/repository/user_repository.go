package repository

import (
	"database/sql"
	"errors"

	"github.com/Philip-Machar/clario/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at`

	return r.DB.QueryRow(query,
		user.Email,
		user.PasswordHash,
		user.Name,
	).Scan(&user.ID, &user.CreatedAt, user.UpdatedAt)
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `SELECT id, email, password_hash, name, created_at, updated_at FROM users WHERE email = $1`

	row := r.DB.QueryRow(query, email)

	var user models.User

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}

		return nil, err
	}

	return &user, nil

}
