import api from '../../services/api';
import type { ChatResponse } from '../../types';

export const sendMentorMessage = async (message: string): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat', { message });
  return response.data;
};

