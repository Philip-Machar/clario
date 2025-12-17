package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Philip-Machar/clario/internal/models"
	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/Philip-Machar/clario/internal/utils"
)

type AuthHandler struct {
	UserRepo *repository.UserRepository
}

func NewAuthHandler(userRepo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{UserRepo: userRepo}
}

func (h *AuthHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Email == "" || payload.Password == "" {
		http.Error(w, "Email and Password are required: ", http.StatusBadRequest)
		return
	}

	user, err := models.NewUser(payload.Email, payload.Password, payload.Name)

	if err != nil {
		http.Error(w, "Faild to create user type with hashed password: "+err.Error(), http.StatusBadRequest)
		return
	}

	err = h.UserRepo.Create(user)

	if err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	user, err := h.UserRepo.GetByEmail(payload.Email)

	if err != nil {
		if err.Error() == "user not found" {
			http.Error(w, "Invalid email or password: "+err.Error(), http.StatusUnauthorized)
			return
		}

		http.Error(w, "Failed to get user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err := user.CheckPassword(payload.Password); err != nil {
		http.Error(w, "Invalid email or password"+err.Error(), http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateToken(int64(user.ID))

	if err != nil {
		http.Error(w, "Failed to generate token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"token": token,
		"name":  user.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
