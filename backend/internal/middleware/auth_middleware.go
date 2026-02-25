package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/Philip-Machar/clario/internal/utils"
)

type contextKey string

const UserIDKey contextKey = "user_id"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			log.Println("ERROR: Missing authorization header")
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		authHeaderSlice := strings.Split(authHeader, " ")

		if len(authHeaderSlice) != 2 || authHeaderSlice[0] != "Bearer" {
			log.Printf("ERROR: Invalid authorization format: %v\n", authHeaderSlice)
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := authHeaderSlice[1]
		log.Printf("Validating token: %s...\n", tokenString[:20])

		userID, err := utils.ValidateToken(tokenString)

		if err != nil {
			log.Printf("ERROR: Token validation failed: %v\n", err)
			http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		log.Printf("Token validated successfully for user ID: %d\n", userID)
		ctx := context.WithValue(r.Context(), UserIDKey, userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
