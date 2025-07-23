import apiClient from "../../lib/apiClient";
import { type DashboardResponse } from "../types/domain";

export interface GetDashboardParams {
    startDate: string;
    endDate: string;
}

export const getDashboardSummary = async (params: GetDashboardParams): Promise<DashboardResponse> => {
    const response = await apiClient.get('/dashboard/summary', { params });
    return response.data;
}