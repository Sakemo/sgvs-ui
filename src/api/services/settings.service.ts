import apiClient from "../../lib/apiClient";
import type { GeneralSettingsRequest, GeneralSettingsResponse } from "../types/domain";

/**
 * GET /api/settings
 * @returns general settings
 */
export const getGeneralSettings = async ():Promise<GeneralSettingsResponse> => {
    const response = await apiClient.get<GeneralSettingsResponse>('/settings');
    return response.data;
}

/**
 * Update general settings
 * PUT /api/settings
 * @param data
 * @returns general settings updated
 */
export const updateGeneralSettings = async (data: GeneralSettingsRequest): Promise<GeneralSettingsResponse> => {
    const response = await apiClient.put<GeneralSettingsResponse>('/api/settings', data);
    return response.data;
}