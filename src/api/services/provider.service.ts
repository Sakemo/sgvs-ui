import apiClient from "../../lib/apiClient";
import type { ProviderRequest, ProviderResponse } from "../types/domain";

export interface GetProvidersParams {
  name?: string;
  orderBy?: string;
}

export const createProvider = async (
  data: ProviderRequest
): Promise<ProviderResponse> => {
  const response = await apiClient.post<ProviderResponse>("/providers", data);
  return response.data;
};

export const getProviders = async (
  params: GetProvidersParams = {}
): Promise<ProviderResponse[]> => {
  const response = await apiClient.get<ProviderResponse[]>("/providers", { params });
  return response.data;
};

export const getProviderById = async (id: number): Promise<ProviderResponse> => {
  const response = await apiClient.get<ProviderResponse>(`/providers/${id}`);
  return response.data;
};

export const updateProvider = async (
  id: number,
  data: ProviderRequest
): Promise<ProviderResponse> => {
  const response = await apiClient.put<ProviderResponse>(`/providers/${id}`, data);
  return response.data;
};

export const deleteProvider = async (id: number): Promise<void> => {
  await apiClient.delete(`/providers/${id}`);
};

export const copyProvider = async (id: number): Promise<ProviderResponse> => {
  const response = await apiClient.post<ProviderResponse>(`/providers/${id}/copy`);
  return response.data;
};
