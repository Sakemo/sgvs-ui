import apiClient from "../../lib/apiClient";
import type { LoginRequest, RegisterRequest, AuthResponse, UpdateRequest } from "../types/domain"

export const loginUser = async (data: LoginRequest):Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
};

export const updateProfile = async (data: UpdateRequest): Promise<void> => {
    await apiClient.put('/users/me', data);
};

export const deleteProfile = async (): Promise<void> => {
    await apiClient.delete('/users/me');
};
