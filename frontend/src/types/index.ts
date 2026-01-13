// 1. The User Contract
export interface User {
    id: number;
    username: string;
    email: string;
}

// 2. The Task Contract (aligned with backend JSON)
export type TaskStatus = 'todo' | 'in_progress' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string | null;
    created_at?: string;
    completed_at?: string | null;

    // Not actually returned by the backend (UserID is json:"-"), so keep optional
    user_id?: number;
}

// 3. The API Response Contracts
// response when you log in
export interface AuthResponse {
    token: string;
    user: User;
}

// response during chat
export interface ChatResponse {
    response: string;
}

// register and login contracts (what we send to the backend)
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// 4. Dashboard helper types
export interface StreakResponse {
    streak: number;
}

export interface ChatRequestPayload {
    message: string;
}