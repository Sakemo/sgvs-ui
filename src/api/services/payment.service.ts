import apiClient from "../../lib/apiClient";
import type { PaymentRequest } from '../types/domain';

export const recordPayment = async (data: PaymentRequest): Promise<void> => {
    await apiClient.post('/payments', data);
}