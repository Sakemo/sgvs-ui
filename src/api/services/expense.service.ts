import apiClient from "../../lib/apiClient";
import type { ExpenseRequest, ExpenseResponse, Page } from "../types/domain";

export interface GetExpensesParams {
    name?: string;
    expenseType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}

export const getExpenses = async (params: GetExpensesParams): Promise<Page<ExpenseResponse>> => {
    const response = await apiClient.get<Page<ExpenseResponse>>('/expenses', { params });
    console.log(response.data);
    return response.data;
};

export const getTotalExpenses = async (params: { startDate?: string | null; endDate?: string | null }): Promise<number> => {
    try {
        const response = await apiClient.get<number>('/expenses/total', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching total expenses: ", error);
        return 0;
    }
}

export const createExpense = async (data: ExpenseRequest): Promise<ExpenseResponse> => {
    const response = await apiClient.post<ExpenseResponse>('/expenses', data);
    console.log(response.data);
    return response.data;
};

export const updateExpense = async (id: number, data: ExpenseRequest): Promise<ExpenseResponse> => {
    const response = await apiClient.put<ExpenseResponse>(`/expenses/${id}`, data);
    return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
};