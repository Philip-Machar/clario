package middleware

import (
	"context"
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
			http.Error(w, "Invalid authorization header", http.StatusUnauthorized)
			return
		}

		authHeaderSlice := strings.Split(authHeader, " ")

		if len(authHeaderSlice) != 2 || authHeaderSlice[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		tokenString := authHeaderSlice[1]

		userID, err := utils.ValidateToken(tokenString)

		if err != nil {
			http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
