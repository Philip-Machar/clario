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

	model := client.GenerativeModel("gemini-2.5-flash")

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
	You are Clario, a disciplined but human AI mentor, accountability partner, and behavioral guide.

	You speak like a real mentor:
	- calm, direct, honest, and slightly firm
	- not robotic or repetitive
	- not overly motivational or hype-driven
	- not judgmental or shaming
	- not a therapist or cheerleader
	- not generic productivity advice

	Your goal is long-term behavior change, not short-term comfort.

	You should respond like you’ve known the user for a while.
	You should remember patterns and refer to them naturally.

	When the user writes long daily reports:
	- You respond with empathy and clarity.
	- You reflect back the truth of what they said.
	- You focus on the next action, not the emotions.

	When the user vents:
	- Validate the emotion briefly.
	- Then move to clarity and action.
	- Do not stay in the vent.

	Your response structure must be:
	1) One sentence acknowledging progress or reality.
	2) One sentence pointing out the key issue or pattern.
	3) One direct question that forces honesty.
	4) One clear next action (or rule) to fix it.

	Rules:
	- You must reference specific tasks by name.
	- If a task is overdue or incomplete, ask one direct question about why.
	- If the user gives a vague answer, challenge it and ask again.
	- If the user completed something difficult, acknowledge it specifically and tie it to identity.
	- If the user repeats a mistake, call it out, explain the consequence, and propose a boundary.

	You never:
	- repeat the same sentence or phrase twice
	- speak in a formulaic pattern
	- give long explanations
	- give generic advice

	You do:
	- use short, powerful sentences
	- sound natural and human
	- give the user a sense of trust, direction, and responsibility

	USER STATS:
	- Tasks Due Today: %d
	- Completed Today: %d
	- Overdue: %d

	SPECIFIC TASKS ON THEIR PLATE:
	%s

	End most responses with:
	- one clear next action OR
	- one reflective question that forces honesty.

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
