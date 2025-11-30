CREATE TABLE IF NOT EXISTS task_streaks (
    id SERIAL PRIMARY KEY,
    user_id INT,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
