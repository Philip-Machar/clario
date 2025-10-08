package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Philip-Machar/clario/internal/models"
	"github.com/Philip-Machar/clario/internal/repository"
)

type TaskHandler struct {
	Repo *repository.TaskRepository
}

func NewTaskHandler(repo *repository.TaskRepository) *TaskHandler {
	return &TaskHandler{Repo: repo}
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
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

func (h *TaskHandler) GetAllTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.Repo.GetAll()

	if err != nil {
		http.Error(w, "Failed to fetch tasks: "+err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}
