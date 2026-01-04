package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Philip-Machar/clario/internal/middleware"
	"github.com/Philip-Machar/clario/internal/models"
	"github.com/Philip-Machar/clario/internal/service"
)

type AIHandler struct {
	AIService *service.AIService
}

func NewAIHandler(service *service.AIService) *AIHandler {
	return &AIHandler{AIService: service}
}

func (h *AIHandler) ChatWithMentor(w http.ResponseWriter, r *http.Request) {
	//user id from context
	userID := r.Context().Value(middleware.UserIDKey).(int64)

	var userRequest models.ChatRequest

	if err := json.NewDecoder(r.Body).Decode(&userRequest); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	mentorResponse, err := h.AIService.GetMentorResponse(r.Context(), int(userID), userRequest.Message)

	if err != nil {
		http.Error(w, "Failed to get AI response: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(models.ChatResponse{Response: mentorResponse})
}
