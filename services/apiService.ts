import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import TokenManager from '../utils/tokenManager';

// API 配置
const API_CONFIG = {
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 响应数据接口
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  token?: string;
}

// 错误响应接口
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// 创建axios实例
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 自动添加 token
        const token = await TokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error: any) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理 401 未授权
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      async (error: any) => {
        if (error.response?.status === 401) {
          // token 过期或无效，清除本地 token
          await TokenManager.removeToken();
          console.log('🔑 Token 已过期，已清除本地存储');
        }
        console.error('❌ Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  private request<T>(config: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return from(this.axiosInstance.request<ApiResponse<T>>(config)).pipe(
      map((response: AxiosResponse<ApiResponse<T>>) => {
        // response.data is already ApiResponse<T>
        return {
          data: response.data.data,
          message: response.data.message || '请求成功',
          success: true,
          token: response.data.token,
        };
      }),
      catchError((error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || '网络请求失败',
          status: error.response?.status,
          code: error.code,
        };
        console.error('❌ API Error:', apiError);
        throw apiError;
      })
    );
  }

  // GET请求
  get<T>(url: string, config?: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST请求
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT请求
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // DELETE请求
  delete<T>(url: string, config?: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // PATCH请求
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // 添加 token 管理方法
  setToken(token: string): Promise<void> {
    return TokenManager.setToken(token);
  }

  getToken(): Promise<string | null> {
    return TokenManager.getToken();
  }

  removeToken(): Promise<void> {
    return TokenManager.removeToken();
  }
}

// 导出单例实例
export const apiService = new ApiService();
