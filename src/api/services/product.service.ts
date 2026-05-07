import apiClient from "../../lib/apiClient";
import { dispatchLowStockUpdatedEvent } from "../../lib/lowStockEvents";
import type { LowStockProduct, Page, ProductRequest, ProductResponse } from "../types/domain";

export interface GetProductsParams {
  name?: string;
  categoryId?: number;
  providerId?: number;
  orderBy?: string;
  page?: number;
  size?: number;
}

export const getProducts = async (
  params: GetProductsParams
): Promise<Page<ProductResponse>> => {
  const response = await apiClient.get<Page<ProductResponse>>("/products", {
    params,
  });
  return response.data;
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await apiClient.get<ProductResponse>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ProductRequest
): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>("/products", data);
  const product = response.data;
  dispatchLowStockUpdatedEvent();
  return product;
};

export const updateProduct = async (
  id: number,
  data: ProductRequest
): Promise<ProductResponse> => {
  const response = await apiClient.put<ProductResponse>(`/products/${id}`, data);
  const product = response.data;
  dispatchLowStockUpdatedEvent();
  return product;
};

export const copyProduct = async (id: number): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>(`/products/${id}/copy`);
  return response.data;
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const response = await apiClient.get<LowStockProduct[]>("/products/low-stock");
  return response.data;
};

export const getProductSuggestions = async (): Promise<ProductResponse[]> => {
  const response = await apiClient.get<ProductResponse[]>("/products/suggestions");
  return response.data;
};

export const toggleProductStatus = async (id: number): Promise<void> => {
  await apiClient.patch(`/products/${id}/status`);
};

export const deleteProductPermanently = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}/permanent`);
};

export const calculateSuggestedPrice = async (
  costPrice: number,
  margin: number
): Promise<number> => {
  const response = await apiClient.get<number>("/products/calculate-price", {
    params: {
      costPrice,
      desiredProfitMargin: margin,
    },
  });
  return response.data;
};
