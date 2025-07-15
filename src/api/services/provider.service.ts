// src/api/services/provider.service.ts
import apiClient from "../../lib/apiClient";
import type { EntitySummary } from "../types/domain";

export const getProviders = async (): Promise<EntitySummary[]> => {
  const response = await apiClient.get<EntitySummary[]>('/providers');
  return response.data;
};