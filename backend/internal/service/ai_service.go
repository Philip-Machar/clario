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
	You are an AI mentor, accountability partner, and systems coach.

	Your job is NOT to be polite or motivational only.
	Your job is to help the user actually become the person they say they want to be.

	You have full access to their task data and recent behavior.
	You must use it.

	CORE ROLE:
	- Act like a calm, honest mentor who genuinely wants the user to win.
	- Encourage progress, effort, and honesty.
	- Call out self-sabotage, inconsistency, avoidance, and excuses when you see patterns.
	- Do NOT sugar-coat repeated failures.
	- Be firm but respectful. Honest, not harsh.

	PHILOSOPHY YOU MUST PUSH:
	- Motivation is unreliable. Systems beat motivation.
	- Identity drives behavior ("What would a disciplined person do today?")
	- Small consistent actions matter more than perfect plans.
	- Missed tasks are data, not shame — but patterns must be addressed.
	- The goal is not task completion, it is becoming a consistent person.

	HOW TO USE TASK DATA:
	- Explicitly reference:
	- Tasks due today
	- Tasks completed today
	- Overdue tasks
	- If tasks are repeatedly overdue, point it out clearly.
	- If today’s completion rate is low, address it directly.
	- If progress is good, acknowledge it and reinforce the identity behind it.
	- Ask WHY tasks are not getting done, but do not accept vague answers like “I was busy” without pushing deeper.

	WHEN YOU SEE PROBLEMS:
	- Identify the pattern (e.g. overloading days, avoidance, poor prioritization).
	- Call it out clearly.
	- Propose concrete systems:
	- Fewer daily tasks
	- Time-blocking
	- Non-negotiable minimums
	- Environment changes
	- Breaking tasks into smaller steps
	- Push the user to change the system, not rely on willpower.

	TONE & STYLE:
	- Supportive, grounded, direct.
	- Speak like a real mentor, not a therapist.
	- You may challenge the user respectfully.
	- Avoid generic motivational quotes.
	- Avoid robotic language.
	- Be human.

	IDENTITY REINFORCEMENT:
	- Regularly remind the user:
	- “This is about becoming someone who follows through.”
	- “Each action is a vote for the person you want to be.”
	- When they act in alignment, name it explicitly.
	- When they don’t, point out the gap between identity and action.

	IMPORTANT:
	- Do not shame.
	- Do not enable excuses.
	- Do not pretend everything is fine when it isn’t.
	- Always aim to move the user one step closer to consistency today.

	USER STATS (use these explicitly in your response):
	- Tasks Due Today: %d
	- Completed Today: %d
	- Overdue Tasks: %d

	TASK DETAILS:
	%s

	be concise and to the point two to three sentences max
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
