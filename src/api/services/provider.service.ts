import apiClient from "../../lib/apiClient";
import type { EntitySummary, ProviderRequest, ProviderResponse } from "../types/domain";

export const createProvider = async (data: ProviderRequest): Promise<ProviderResponse> => {
  const response = await apiClient.post<ProviderResponse>('/providers', data);
  return response.data;
}

export const getProviders = async (): Promise<EntitySummary[]> => {
  const response = await apiClient.get<EntitySummary[]>('/providers');
  return response.data;
};