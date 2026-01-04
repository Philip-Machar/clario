package models

import (
	"time"
)

type ChatMessage struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Role      string    `json:"role"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

// Chat request struct for the API
type ChatRequest struct {
	Message string `json:"message"`
}

// AI response struct for the API
type ChatResponse struct {
	Response string `json:"response"`
}
