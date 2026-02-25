-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS ai_chats (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS ai_chats;
-- +goose StatementEnd