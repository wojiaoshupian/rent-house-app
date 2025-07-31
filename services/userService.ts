import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { apiService } from './apiService';
import TokenManager from 'utils/tokenManager';

// 用户相关接口定义
export interface User {
  id: number;
  username: string;
  phone?: string;
  email?: string;
  fullName?: string;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  token?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// 用户服务类
class UserService {
  private readonly baseUrl = '/api';

  // 用户注册
  register(data: RegisterRequest): Observable<User> {
    return apiService.post<User>(`${this.baseUrl}/auth/register`, data).pipe(
      map((response) =>{
        console.log('注册成功:', response);
        if (response.token) {
          TokenManager.setToken(response.token);
        }
        return response.data;
      } ),
     
      catchError((error) => {
        console.error('注册失败:', error);
        throw error;
      })
    );
  }

  // 用户登录
  login(data: LoginRequest): Observable<LoginResponse> {
    return apiService.post<User>(`${this.baseUrl}/auth/login`, data).pipe(
      map((response) => {
        console.log('登录成功:', response);

        // 自动保存 token
        if (response.token) {
          TokenManager.setToken(response.token);
        }

        // 构造 LoginResponse 格式
        const loginResponse: LoginResponse = {
          token: response.token || '',
          user: response.data
        };

        return loginResponse;
      }),
      catchError((error) => {
        console.error('登录失败:', error);
        throw error;
      })
    );
  }

  // 获取用户信息
  getUserById(id: number): Observable<User> {
    return apiService.get<User>(`${this.baseUrl}/users/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('获取用户信息失败:', error);
        throw error;
      })
    );
  }

  // 更新用户信息
  updateUser(id: number, data: Partial<User>): Observable<User> {
    return apiService.put<User>(`${this.baseUrl}/users/${id}`, data).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('更新用户信息失败:', error);
        throw error;
      })
    );
  }

  // 删除用户
  deleteUser(id: number): Observable<void> {
    return apiService.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
      map(() => {}),
      catchError((error) => {
        console.error('删除用户失败:', error);
        throw error;
      })
    );
  }

  // 搜索用户
  searchUsers(query: string): Observable<User[]> {
    return apiService
      .get<User[]>(`${this.baseUrl}/users/search`, {
        params: { q: query },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('搜索用户失败:', error);
          throw error;
        })
      );
  }

  // 获取活跃用户
  getActiveUsers(): Observable<User[]> {
    return apiService.get<User[]>(`${this.baseUrl}/users/active`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('获取活跃用户失败:', error);
        throw error;
      })
    );
  }

  // 统计活跃用户数量
  getActiveUserCount(): Observable<number> {
    return apiService.get<{ count: number }>(`${this.baseUrl}/users/count/active`).pipe(
      map((response) => response.data.count),
      catchError((error) => {
        console.error('统计活跃用户失败:', error);
        throw error;
      })
    );
  }
}

// 导出单例实例
export const userService = new UserService();
