import { ProductDB } from "./productDB.model";

export interface Product extends Omit<ProductDB, 'createdAt'|'updatedAt'> {
  createdAt: number;
  updatedAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}
