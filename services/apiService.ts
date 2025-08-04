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
  tokenExpiresAt?: string; // 后端返回的token过期时间
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

  // 检查接口是否需要认证
  private requiresAuthentication(url: string): boolean {
    // 不需要认证的接口列表
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/public'
    ];

    // 检查是否是公开接口
    return !publicEndpoints.some(endpoint => url.includes(endpoint));
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 检查是否需要认证的接口
        const requiresAuth = this.requiresAuthentication(config.url || '');

        if (requiresAuth) {
          // 检查用户是否已登录
          const isLoggedIn = await TokenManager.isUserLoggedIn();
          if (!isLoggedIn) {
            console.error('🚫 用户未登录，拒绝请求:', config.url);
            throw new Error('用户未登录，请先登录后再试');
          }

          // 自动添加 token
          const token = await TokenManager.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.error('🚫 未找到有效Token，拒绝请求:', config.url);
            throw new Error('认证失败，请重新登录');
          }
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
        const status = error.response?.status;
        const url = error.config?.url;

        if (status === 401) {
          // token 过期或无效，清除本地 token
          await TokenManager.forceLogout();
          console.log('🔑 Token 已过期，已强制登出');

          // 修改错误信息，让用户知道需要重新登录
          error.message = '登录已过期，请重新登录';
        } else if (status === 403) {
          // 权限不足
          error.message = '权限不足，无法执行此操作';
        } else if (status >= 500) {
          // 服务器错误
          error.message = '服务器错误，请稍后重试';
        }

        console.error('❌ Response Error:', status, url, error.message);
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
          tokenExpiresAt: response.data.tokenExpiresAt, // 传递后端返回的过期时间
        };
      }),
      catchError((error) => {
        // 详细记录原始错误信息
        console.error('❌ 原始错误对象:', error);
        console.error('❌ error.response:', error.response);
        console.error('❌ error.response?.data:', error.response?.data);
        console.error('❌ error.message:', error.message);

        // 优先使用接口返回的具体错误信息
        let errorMessage = '网络请求失败';

        if (error.response?.data?.message) {
          // 接口返回的具体错误信息（最高优先级）
          errorMessage = error.response.data.message;
          console.log('💡 使用接口返回的错误信息:', errorMessage);
        } else if (error.message && error.message !== `Request failed with status code ${error.response?.status}`) {
          // axios的错误信息（排除通用的状态码错误信息）
          errorMessage = error.message;
          console.log('💡 使用axios错误信息:', errorMessage);
        }

        const apiError: ApiError = {
          message: errorMessage,
          status: error.response?.status,
          code: error.code,
        };

        // 保留原始响应数据以便调试
        if (error.response?.data) {
          (apiError as any).response = {
            data: error.response.data
          };
        }

        console.error('❌ 处理后的 API Error:', apiError);
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

  // 设置token（使用后端过期时间）
  setTokenWithBackendExpiry(token: string, tokenExpiresAt?: string): Promise<void> {
    return TokenManager.setTokenWithBackendExpiry(token, tokenExpiresAt);
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
