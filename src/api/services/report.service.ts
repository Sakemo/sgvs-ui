import apiClient from "../../lib/apiClient";
import type { AbcAnalysisRow, FinancialSummaryResponse } from "../types/domain";

export interface GetReportParams {
    startDate: string;
    endDate: string;
}

export const getFinancialSummaryReport = async (params: GetReportParams): Promise<FinancialSummaryResponse> => {
    const response = await apiClient.get<FinancialSummaryResponse>('/reports/financial-summary', { params });
    return response.data;
}

export const getAbcAnalysisReport = async (params: GetReportParams): Promise<AbcAnalysisRow[]> => {
    const response = await apiClient.get<AbcAnalysisRow[]>('/reports/abc-analysis', { params });
    return response.data;
};