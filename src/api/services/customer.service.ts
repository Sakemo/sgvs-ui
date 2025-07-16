import apiClient from "../../lib/apiClient";
import type { CustomerRequest, CustomerResponse } from "../types/domain";

export interface GetCustomersParams {
    name?: string;
    isActive?: boolean;
    hasDebt?: boolean;
    orderBy?: string;
}

export const getCustomers = async (params: GetCustomersParams):Promise<CustomerResponse[]> =>
{
    const response = await apiClient.get<CustomerResponse[]>('/customers', { params });
    return response.data;
};

export const createCustomer = async (data: CustomerRequest):Promise<CustomerResponse> => {
    const response = await apiClient.post<CustomerResponse>('/customers', data);
    return response.data;
};

export const updateCustomer = async (id: number, data: CustomerRequest): Promise<CustomerResponse> => {
    const response = await apiClient.put<CustomerResponse>(`/customers/${id}`, data);
    return response.data;
};

export const toggleCustomerStatus = async (id: number, active: boolean): Promise<void> => {
    await apiClient.patch(`/customers/${id}/status`, { active });
}

export const deleteCustomerPermanently = async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
};