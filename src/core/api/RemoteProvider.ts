import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { RemoteException } from '../error/Exception';

export interface RemoteProvider {
  get<T>(url: string): Promise<AxiosResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>>;
  put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>>;
  delete<T>(url: string): Promise<AxiosResponse<T>>;
}

export class AxiosRemoteProvider implements RemoteProvider {
  private readonly instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      return await this.instance.get<T>(url);
    } catch (error) {
      throw new RemoteException(error);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    try {
      return await this.instance.post<T>(url, data);
    } catch (error) {
      throw new RemoteException(error);
    }
  }

  async put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    try {
      return await this.instance.put<T>(url, data);
    } catch (error) {
      throw new RemoteException(error);
    }
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    try {
      return await this.instance.delete<T>(url);
    } catch (error) {
      throw new RemoteException(error);
    }
  }
}
