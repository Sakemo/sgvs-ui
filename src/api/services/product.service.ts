// src/api/services/product.service.ts

import apiClient from "../../lib/apiClient";
import type { Page, ProductRequest, ProductResponse } from "../types/domain";

export interface GetProductsParams {
    name?: string;
    categoryId?: number;
    orderBy?: string;
    page?: number;
    size?: number;
}

/**
 * Parâmetros para a busca e filtragem de produtos.
 */
export interface GetProductsParams {
  name?: string;
  categoryId?: number;
  orderBy?: string;
  page?: number;
  size?: number;
}

/**
 * Busca uma lista paginada de produtos com base nos filtros fornecidos.
 */
export const getProducts = async (
  params: GetProductsParams
): Promise<Page<ProductResponse>> => {
  const response = await apiClient.get<Page<ProductResponse>>("/products", {
    params,
  });
  return response.data;
};

/**
 * Busca um único produto pelo seu ID.
 */
export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await apiClient.get<ProductResponse>(`/products/${id}`);
  return response.data;
};

/**
 * Cria um novo produto.
 */
export const createProduct = async (
  data: ProductRequest
): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>("/products", data);
  return response.data;
};

/**
 * Atualiza um produto existente.
 */
export const updateProduct = async (
  id: number,
  data: ProductRequest
): Promise<ProductResponse> => {
  const response = await apiClient.put<ProductResponse>(`/products/${id}`, data);
  return response.data;
};

/**
 * Cria uma cópia de um produto existente.
 */
export const copyProduct = async (id: number): Promise<ProductResponse> => {
  const response = await apiClient.post<ProductResponse>(`/products/${id}/copy`);
  return response.data;
};

/**
 * Alterna o status (ativo/inativo) de um produto.
 * Nota: No backend, isso corresponde ao DELETE lógico do projeto antigo.
 */
export const toggleProductStatus = async (id: number): Promise<void> => {
  await apiClient.patch(`/products/${id}/status`);
};

/**
 * Deleta um produto permanentemente do banco de dados.
 */
export const deleteProductPermanently = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}/permanent`);
};