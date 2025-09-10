CREATE TABLE IF NOT EXISTs tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN('todo', 'in_progress', 'complete')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN('low', 'medium', 'high')),
    due_date TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);