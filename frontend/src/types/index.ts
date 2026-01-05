// 1. The User Contract
export interface User {
    id: number;
    username: string;
    email: string;
}

// 2. The Task Contract
export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'complete';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    created_at?: string;
    
    user_id: number;
}

// 3. The API Response Contracts
// This helps Axios know what to expect when we log in or chat.
export interface AuthResponse {
    token: string;
    user: User;
}

export interface ChatResponse {
    response: string;
}