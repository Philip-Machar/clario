package service

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Philip-Machar/clario/internal/repository"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type AIService struct {
	Client   *genai.Client
	Model    *genai.GenerativeModel
	ChatRepo *repository.ChatRepository
	TaskRepo *repository.TaskRepository
}

func NewAIService(chatRepo *repository.ChatRepository, taskRepo *repository.TaskRepository) *AIService {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))

	if err != nil {
		log.Fatal(err)
	}

	model := client.GenerativeModel("gemini-1.5-flash")

	return &AIService{
		Client:   client,
		Model:    model,
		ChatRepo: chatRepo,
		TaskRepo: taskRepo,
	}
}

func (s *AIService) GetMentorResponse(ctx context.Context, userID int, userMessage string) (string, error) {
	//get all user tasks for context
	allTasks, _ := s.TaskRepo.GetAll(userID)

	todayTotalTasks := 0
	todayDoneTasks := 0
	overdueTasks := 0

	taskReport := ""

	now := time.Now()
	todayDateStr := now.Format("2006-01-02")

	for _, task := range allTasks {
		if task.DueDate == nil {
			continue
		}

		taskDateStr := task.DueDate.Format("2006-01-02")

		// Case A: Due Today
		if taskDateStr == todayDateStr {
			todayTotalTasks++
			status := "PENDING"
			if task.Status == "complete" {
				todayDoneTasks++
				status = "DONE"
			}

			taskReport += fmt.Sprintf("- Status: %s, Title: %s, Description: %s, Priority: %s\n", status, task.Title, task.Description, task.Priority)
		}

		// Case B: Overdue
		if task.DueDate.Before(now) && taskDateStr != todayDateStr && task.Status != "complete" {
			overdueTasks++
			taskReport += fmt.Sprintf("- OVERDUE: %s Due: %s\n", task.Title, taskDateStr)
		}
	}

	// system prompt
	systemPrompt := fmt.Sprintf(`
	You are Clario, a wise, empathetic, but firm accountability mentor.
	
	USER STATS:
	- Tasks Due Today: %d
	- Completed Today: %d
	- Overdue: %d
	
	SPECIFIC TASKS ON THEIR PLATE:
	%s
	
	INSTRUCTIONS:
	- Look at the specific tasks in the list above.
	- If they finished a hard task (High Priority), mention it specifically ("Great job on waking up at 6am!").
	- If they missed a specific task, ask about it ("Why didn't you get to the Leetcode problems?").
	- Keep responses short (2-3 sentences).
	`, todayTotalTasks, todayDoneTasks, overdueTasks, taskReport)

	chatHistory, _ := s.ChatRepo.GetRecentHistory(userID)

	//start chat session
	chatSession := s.Model.StartChat()

	for _, message := range chatHistory {
		role := "user"

		if message.Role == "assistant" {
			role = "model"
		}

		chatSession.History = append(chatSession.History, &genai.Content{Role: role, Parts: []genai.Part{genai.Text(message.Message)}})
	}

	//send message
	finalPrompt := systemPrompt + "\n\nUser: " + userMessage

	response, err := chatSession.SendMessage(ctx, genai.Text(finalPrompt))

	if err != nil {
		return "", err
	}

	//extract ai reply
	aiResponse := ""
	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		aiResponse = fmt.Sprintf("%s", response.Candidates[0].Content.Parts[0])
	}

	//save current chat to db
	s.ChatRepo.SaveMessage(userID, "user", userMessage)
	s.ChatRepo.SaveMessage(userID, "assistant", aiResponse)

	return aiResponse, nil
}
