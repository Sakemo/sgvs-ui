import apiClient from "../../lib/apiClient";
import type { CategoryResponse, CategoryRequest } from "../types/domain";

/**
 * Busca todas as categorias.
 */
export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await apiClient.get<CategoryResponse[]>('/categories');
  return response.data;
};

/**
 * Cria uma nova categoria.
 */
export const createCategory = async (data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.post<CategoryResponse>('/categories', data);
  return response.data;
};