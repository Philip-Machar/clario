# -------- STAGE 1: Build --------
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app ./cmd/server


# -------- STAGE 2: Run --------
FROM alpine:latest

WORKDIR /app

# copy binary
COPY --from=builder /app/app .

# copy migrations (THIS WAS MISSING)
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./app"]