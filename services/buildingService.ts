import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { apiService } from './apiService';
import { AuthGuard } from '../utils/authGuard';
import { userService } from './userService';
import {
  Building,
  CreateBuildingRequest,
  UpdateBuildingRequest,
  BuildingListParams
} from '../types/building';

// 楼宇服务类
class BuildingService {
  private readonly baseUrl = '/api/buildings';

  // 创建楼宇（需要认证）
  createBuilding(data: CreateBuildingRequest): Observable<Building> {
    console.log('🏗️ 尝试创建楼宇:', data.buildingName);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法创建楼宇');
          subscriber.error(new Error('用户未登录，请先登录后再创建楼宇'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<Building>(this.baseUrl, data).pipe(
          map((response) => {
            console.log('✅ 楼宇创建成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 创建楼宇失败:', error);

            // 如果是认证错误，提供更明确的错误信息
            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法创建楼宇';
            }

            throw error;
          })
        ).subscribe(subscriber);
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  // 获取用户拥有的楼宇列表（需要认证）
  getBuildingList(params?: BuildingListParams): Observable<Building[]> {
    console.log('🏢 获取用户拥有的楼宇列表...');

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取楼宇列表');
          subscriber.error(new Error('用户未登录，请先登录后再获取楼宇列表'));
          return;
        }

        // 认证通过，先获取当前用户信息
        userService.getCurrentUser().subscribe({
          next: (currentUser) => {
            console.log('👤 当前用户:', currentUser.username, 'ID:', currentUser.id);

            // 使用用户ID获取拥有的楼宇
            const url = `${this.baseUrl}/owned/${currentUser.id}`;
            console.log('🔗 调用接口:', url);

            apiService.get<Building[]>(url, { params }).pipe(
              map((response) => {
                console.log('✅ 获取用户楼宇列表成功:', response);
                console.log('📊 楼宇数量:', response.data.length);
                return response.data;
              }),
              catchError((error) => {
                console.error('❌ 获取用户楼宇列表失败:', error);

                // 如果是认证错误，提供更明确的错误信息
                if (error.status === 401) {
                  error.message = '登录已过期，请重新登录后再试';
                } else if (error.status === 403) {
                  error.message = '权限不足，无法获取楼宇列表';
                } else if (error.status === 404) {
                  error.message = '用户不存在或没有楼宇数据';
                }

                throw error;
              })
            ).subscribe(subscriber);
          },
          error: (userError) => {
            console.error('❌ 获取当前用户信息失败:', userError);
            subscriber.error(new Error('获取用户信息失败，请重新登录'));
          }
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  // 根据ID获取楼宇详情
  getBuildingById(id: number): Observable<Building> {
    return apiService.get<Building>(`${this.baseUrl}/${id}`).pipe(
      map((response) => {
        console.log('✅ 获取楼宇详情成功:', response);
        return response.data;
      }),
      catchError((error) => {
        console.error('❌ 获取楼宇详情失败:', error);
        throw error;
      })
    );
  }

  // 更新楼宇信息（需要认证）
  updateBuilding(data: UpdateBuildingRequest): Observable<Building> {
    const { id, ...updateData } = data;
    console.log('🔄 尝试更新楼宇:', id, updateData.buildingName);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法更新楼宇');
          subscriber.error(new Error('用户未登录，请先登录后再更新楼宇'));
          return;
        }

        // 认证通过，执行API调用
        apiService.put<Building>(`${this.baseUrl}/${id}`, updateData).pipe(
          map((response) => {
            console.log('✅ 楼宇更新成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 更新楼宇失败:', error);

            // 如果是认证错误，提供更明确的错误信息
            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法更新楼宇';
            } else if (error.status === 404) {
              error.message = '楼宇不存在或已被删除';
            }

            throw error;
          })
        ).subscribe(subscriber);
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  // 删除楼宇（需要认证）
  deleteBuilding(id: number): Observable<void> {
    console.log('🗑️ 尝试删除楼宇:', id);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法删除楼宇');
          subscriber.error(new Error('用户未登录，请先登录后再删除楼宇'));
          return;
        }

        // 认证通过，执行API调用
        apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(
          map(() => {
            console.log('✅ 楼宇删除成功');
            return undefined; // 返回void类型
          }),
          catchError((error) => {
            console.error('❌ 删除楼宇失败:', error);

            // 如果是认证错误，提供更明确的错误信息
            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法删除楼宇';
            } else if (error.status === 404) {
              error.message = '楼宇不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '楼宇正在使用中，无法删除';
            }

            throw error;
          })
        ).subscribe(subscriber);
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  // 根据用户ID获取拥有的楼宇（需要认证）
  getBuildingsByUserId(userId: number): Observable<Building[]> {
    console.log('🏢 根据用户ID获取楼宇:', userId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取楼宇列表');
          subscriber.error(new Error('用户未登录，请先登录后再获取楼宇列表'));
          return;
        }

        // 认证通过，直接调用接口
        const url = `${this.baseUrl}/owned/${userId}`;
        console.log('🔗 调用接口:', url);

        apiService.get<Building[]>(url).pipe(
          map((response) => {
            console.log('✅ 获取用户楼宇成功:', response);
            console.log('📊 楼宇数量:', response.data.length);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取用户楼宇失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取楼宇列表';
            } else if (error.status === 404) {
              error.message = '用户不存在或没有楼宇数据';
            }

            throw error;
          })
        ).subscribe(subscriber);
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  // 搜索楼宇
  searchBuildings(query: string): Observable<Building[]> {
    return apiService.get<Building[]>(`${this.baseUrl}/search`, {
      params: { q: query }
    }).pipe(
      map((response) => {
        console.log('✅ 搜索楼宇成功:', response);
        return response.data;
      }),
      catchError((error) => {
        console.error('❌ 搜索楼宇失败:', error);
        throw error;
      })
    );
  }
}

// 导出单例实例
export const buildingService = new BuildingService();
