package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Philip-Machar/clario/internal/models"
	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/go-chi/chi/v5"
)

type TaskHandler struct {
	Repo *repository.TaskRepository
}

func NewTaskHandler(repo *repository.TaskRepository) *TaskHandler {
	return &TaskHandler{Repo: repo}
}

func (h *TaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Title       string     `json:"title"`
		Description string     `json:"description"`
		Status      string     `json:"status"`
		Priority    string     `json:"priority"`
		DueDate     *time.Time `json:"due_date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if payload.Status == "" {
		payload.Status = "todo"
	}

	if payload.Priority == "" {
		payload.Priority = "medium"
	}

	task := models.Task{
		Title:       payload.Title,
		Description: payload.Description,
		Status:      payload.Status,
		Priority:    payload.Priority,
		DueDate:     payload.DueDate,
	}

	if err := h.Repo.Create(&task); err != nil {
		http.Error(w, "Failed to create a task: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func (h *TaskHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.Repo.GetAll()

	if err != nil {
		http.Error(w, "Failed to get tasks: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

func (h *TaskHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	err = h.Repo.Delete(id)

	if err != nil {
		http.Error(w, "Failed to Delete task: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]string{"message": "Task deleted successfully"}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
