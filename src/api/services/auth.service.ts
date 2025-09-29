// src/api/services/auth.service.ts
import apiClient from '../../lib/apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/domain';

/**
 * Registers a new user.
 * @param data - The user's registration details (username, password).
 * @returns A promise that resolves to an object containing the auth token.
 */
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Logs in an existing user.
 * @param data - The user's login credentials (username, password).
 * @returns A promise that resolves to an object containing the auth token.
 */
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};