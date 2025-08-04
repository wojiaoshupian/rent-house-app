import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { apiService } from './apiService';
import { AuthGuard } from '../utils/authGuard';
import {
  Room,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomListParams,
  RoomStats,
  RoomDetail,
  RoomSearchResult,
  RoomStatus
} from '../types/room';

/**
 * 房间服务类
 */
class RoomService {
  private readonly baseUrl = '/api/rooms';

  /**
   * 创建房间（需要认证）
   */
  createRoom(data: CreateRoomRequest): Observable<Room> {
    console.log('🏠 尝试创建房间:', data.roomNumber, '楼宇ID:', data.buildingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法创建房间');
          subscriber.error(new Error('用户未登录，请先登录后再创建房间'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<Room>(this.baseUrl, data).pipe(
          map((response) => {
            console.log('✅ 房间创建成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 创建房间失败:', error);

            // 如果是认证错误，提供更明确的错误信息
            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法创建房间';
            } else if (error.status === 400) {
              error.message = '房间信息有误，请检查输入数据';
            } else if (error.status === 409) {
              error.message = '房间号已存在，请使用其他房间号';
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

  /**
   * 获取房间列表（需要认证）
   */
  getRoomList(params?: RoomListParams): Observable<Room[]> {
    console.log('🏠 获取房间列表，参数:', params);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取房间列表');
          subscriber.error(new Error('用户未登录，请先登录后再获取房间列表'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<Room[]>(this.baseUrl, { params }).pipe(
          map((response) => {
            console.log('✅ 获取房间列表成功:', response);
            console.log('📊 房间数量:', response.data.length);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取房间列表失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取房间列表';
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

  /**
   * 根据楼宇ID获取房间列表（需要认证）
   */
  getRoomsByBuildingId(buildingId: number): Observable<Room[]> {
    console.log('🏠 根据楼宇ID获取房间:', buildingId);

    return this.getRoomList({ buildingId });
  }

  /**
   * 获取房间详情（需要认证）
   */
  getRoomDetail(roomId: number): Observable<RoomDetail> {
    console.log('🏠 获取房间详情:', roomId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取房间详情');
          subscriber.error(new Error('用户未登录，请先登录后再获取房间详情'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<RoomDetail>(`${this.baseUrl}/${roomId}`).pipe(
          map((response) => {
            console.log('✅ 获取房间详情成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取房间详情失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取房间详情';
            } else if (error.status === 404) {
              error.message = '房间不存在或已被删除';
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

  /**
   * 更新房间信息（需要认证）
   */
  updateRoom(data: UpdateRoomRequest): Observable<Room> {
    const { id, ...updateData } = data;
    console.log('🔄 尝试更新房间:', id, updateData);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法更新房间');
          subscriber.error(new Error('用户未登录，请先登录后再更新房间'));
          return;
        }

        // 认证通过，执行API调用
        apiService.put<Room>(`${this.baseUrl}/${id}`, updateData).pipe(
          map((response) => {
            console.log('✅ 房间更新成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 更新房间失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法更新房间';
            } else if (error.status === 404) {
              error.message = '房间不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '房间号已存在，请使用其他房间号';
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

  /**
   * 删除房间（需要认证）
   */
  deleteRoom(roomId: number): Observable<void> {
    console.log('🗑️ 尝试删除房间:', roomId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法删除房间');
          subscriber.error(new Error('用户未登录，请先登录后再删除房间'));
          return;
        }

        // 认证通过，执行API调用
        apiService.delete<void>(`${this.baseUrl}/${roomId}`).pipe(
          map(() => {
            console.log('✅ 房间删除成功');
            return undefined;
          }),
          catchError((error) => {
            console.error('❌ 删除房间失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法删除房间';
            } else if (error.status === 404) {
              error.message = '房间不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '房间正在使用中，无法删除';
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

  /**
   * 搜索房间（需要认证）
   */
  searchRooms(query: string, buildingId?: number): Observable<Room[]> {
    console.log('🔍 搜索房间:', query, '楼宇ID:', buildingId);

    const params: any = { search: query };
    if (buildingId) {
      params.buildingId = buildingId;
    }

    return this.getRoomList(params);
  }

  /**
   * 获取房间统计信息（需要认证）
   */
  getRoomStats(buildingId?: number): Observable<RoomStats> {
    console.log('📊 获取房间统计信息，楼宇ID:', buildingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取房间统计');
          subscriber.error(new Error('用户未登录，请先登录后再获取房间统计'));
          return;
        }

        const params = buildingId ? { buildingId } : {};
        
        // 认证通过，执行API调用
        apiService.get<RoomStats>(`${this.baseUrl}/stats`, { params }).pipe(
          map((response) => {
            console.log('✅ 获取房间统计成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取房间统计失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取房间统计';
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

  /**
   * 更新房间状态（需要认证）
   */
  updateRoomStatus(roomId: number, status: RoomStatus): Observable<Room> {
    console.log('🔄 更新房间状态:', roomId, '→', status);

    return this.updateRoom({ id: roomId, status });
  }
}

// 导出房间服务实例
export const roomService = new RoomService();
export default roomService;
