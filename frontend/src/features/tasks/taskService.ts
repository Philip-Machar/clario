import api from '../../services/api';
import type { Task, StreakResponse } from '../../types';

// Fetch all tasks for the authenticated user
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

// Create a new task
interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string | null;
}

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<Task>('/create/task', payload);
  return response.data;
};

// Update an existing task (full update)
interface UpdateTaskPayload {
  id: number;
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  due_date?: string | null;
}

export const updateTask = async (payload: UpdateTaskPayload): Promise<Task> => {
  const { id, ...body } = payload;
  const response = await api.put<Task>(`/task/${id}`, body);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/task/${id}`);
};

// Update only the status of a task
export const updateTaskStatus = async (id: number, status: Task['status']): Promise<void> => {
  await api.put(`/task/${id}/status`, { status });
};

// Get current streak
export const fetchCurrentStreak = async (): Promise<number> => {
  const response = await api.get<StreakResponse>('/streak');
  return response.data.streak;
};

