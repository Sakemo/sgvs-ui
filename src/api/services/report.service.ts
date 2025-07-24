import apiClient from "../../lib/apiClient";
import type { AbcAnalysisRow } from "../types/domain";

export interface GetReportParams {
    startDate: string;
    endDate: string;
}

export const getAbcAnalysisReport = async (params: GetReportParams): Promise<AbcAnalysisRow[]> => {
    const response = await apiClient.get<AbcAnalysisRow[]>('/reports/abc-analysis', { params });
    return response.data;
};