import apiClient from "../../lib/apiClient";
import type { Page, PaymentMethod, SaleRequest, SaleResponse } from "../types/domain";

export interface GetSalesParams {
    startDate?: string;
    endDate?: string;
    customerId?: number;
    paymentMethod?: string;
    productId?: number;
    orderBy?: string;
    page?: number;
    size?: number;
};

export interface GroupSummary {
    groupKey: string;
    groupTitle: string;
    totalValue: number;
};

export interface TotalByPaymentMethod {
    paymentMethod: PaymentMethod;
    total: number;
};

export const getSales = async (params: GetSalesParams): Promise<Page<SaleResponse>> => {
    const response = await apiClient.get('/sales', { params });
    return response.data;
};

export const getSaleById = async (id: number): Promise<SaleResponse> => {
    const response = await apiClient.get<SaleResponse>(`/sales/${id}`);
    return response.data;
}

export const registerSale = async (data: SaleRequest): Promise<SaleResponse> => {
    const response = await apiClient.post<SaleResponse>('/sales', data);
    return response.data;
};

export const deleteSalePermanently = async (id: number):Promise<void> => {
    await apiClient.delete(`/sales/${id}/permanent`);
};

export const getSalesGrossTotal = async (params:GetSalesParams): Promise<number> => {
    const queryParams = { ...params };
    delete (queryParams as any).orderBy;
    delete (queryParams as any).page;
    delete (queryParams as any).size;

    const response = await apiClient.get<number>('/sales/gross-total', { params: queryParams });
    return response.data ?? 0;
};

export const getSalesTotalByPaymentMethod = async (params: {
    startDate?: string | null;
    endDate?: string | null;
}): Promise<TotalByPaymentMethod[]> => {
    const response = await apiClient.get<TotalByPaymentMethod[]>('/sales/total-by-payment-method', { params });
    return response.data ?? [];
};

export const getSalesSummary = async (params: GetSalesParams):Promise<GroupSummary[]> => {
    const groupBy = params.orderBy?.split(',')[0];
    if (groupBy !== 'saleDate' && groupBy !== 'customer.name'){
        return [];
    }

    const queryParams = { ...params, groupBy };
    delete (queryParams as any).orderBy;
    delete (queryParams as any).page;
    delete (queryParams as any).size;

    const response = await apiClient
    .get<GroupSummary[]>('/sales/summary-by-group', { params: queryParams });
    return response.data ?? [];
};