package repository

import (
	"database/sql"

	"github.com/Philip-Machar/clario/internal/models"
)

type ChatRepository struct {
	DB *sql.DB
}

func NewChatRepository(db *sql.DB) *ChatRepository {
	return &ChatRepository{DB: db}
}

func (r *ChatRepository) SaveMessage(UserID int, role string, message string) error {
	query := `INSERT INTO ai_chats (user_id, role, message) VALUES ($1, $2, $3)`

	_, err := r.DB.Exec(query, UserID, role, message)

	return err
}

func (r *ChatRepository) GetRecentHistory(UserID int) ([]models.ChatMessage, error) {
	query := `SELECT role, message FROM ai_chats WHERE id = $1 ORDERED BY created_at ASC LIMIT 20`

	rows, err := r.DB.Query(query, UserID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var history []models.ChatMessage

	for rows.Next() {
		var message models.ChatMessage

		if err := rows.Scan(&message.Role, &message.Message); err != nil {
			return nil, err
		}

		history = append(history, message)
	}

	return history, nil
}
