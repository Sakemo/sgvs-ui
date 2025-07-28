import apiClient from "../../lib/apiClient";
import type { CategoryResponse, CategoryRequest } from "../types/domain";


export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await apiClient.get<CategoryResponse[]>('/categories');
  return response.data;
};

export const createCategory = async (data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.post<CategoryResponse>('/categories', data);
  return response.data;
};

export const updateCategory = async (id: number, data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.put<CategoryResponse>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};