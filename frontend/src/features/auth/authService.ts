import api from '../../services/api';
import { AuthResponse, RegisterRequest, LoginRequest } from '../../types';

// We define the shape of the data needed to register/login
export const registerUser = async (userData: RegisterRequest) => {
    const response = await api.post('/register', userData);
    return response.data;
};

export const loginUser = async (userData: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', userData);
    return response.data;
};