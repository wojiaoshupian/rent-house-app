import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { apiService } from './apiService';
import { AuthGuard } from '../utils/authGuard';
import {
  UtilityReading,
  CreateUtilityReadingRequest,
  UpdateUtilityReadingRequest,
  UtilityReadingListParams,
  UtilityReadingDetail,
  UtilityReadingStats,
  ReadingStatus
} from '../types/utilityReading';

/**
 * 抄水电表服务类
 */
class UtilityReadingService {
  private readonly baseUrl = '/api/utility-readings';

  /**
   * 创建抄表记录（需要认证）
   */
  createUtilityReading(data: CreateUtilityReadingRequest): Observable<UtilityReading> {
    console.log('📊 尝试创建抄表记录:', data.roomId, '日期:', data.readingDate);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法创建抄表记录');
          subscriber.error(new Error('用户未登录，请先登录后再创建抄表记录'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<UtilityReading>(this.baseUrl, data).pipe(
          map((response) => {
            console.log('✅ 抄表记录创建成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 创建抄表记录失败:', error);

            // 只在没有具体错误信息时才设置通用错误信息
            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法创建抄表记录';
            } else if (error.status === 400) {
              // 400错误优先使用接口返回的具体错误信息
              if (!error.message || error.message === 'Request failed with status code 400') {
                error.message = '抄表数据有误，请检查输入信息';
              }
            } else if (error.status === 409) {
              // 409错误优先使用接口返回的具体错误信息
              if (!error.message || error.message === 'Request failed with status code 409') {
                error.message = '该房间在此日期已有抄表记录';
              }
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 获取抄表记录列表（需要认证）
   */
  getUtilityReadingList(params?: UtilityReadingListParams): Observable<UtilityReading[]> {
    console.log('📊 获取抄表记录列表，参数:', params);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取抄表记录列表');
          subscriber.error(new Error('用户未登录，请先登录后再获取抄表记录列表'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<UtilityReading[]>(this.baseUrl, { params }).pipe(
          map((response) => {
            console.log('✅ 获取抄表记录列表成功:', response);
            console.log('📊 记录数量:', response.data.length);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取抄表记录列表失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取抄表记录列表';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 根据房间ID获取抄表记录列表（需要认证）
   */
  getUtilityReadingsByRoomId(roomId: number): Observable<UtilityReading[]> {
    console.log('📊 根据房间ID获取抄表记录:', roomId);

    return this.getUtilityReadingList({ roomId });
  }

  /**
   * 获取抄表记录详情（需要认证）
   */
  getUtilityReadingDetail(readingId: number): Observable<UtilityReadingDetail> {
    console.log('📊 获取抄表记录详情:', readingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取抄表记录详情');
          subscriber.error(new Error('用户未登录，请先登录后再获取抄表记录详情'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<UtilityReadingDetail>(`${this.baseUrl}/${readingId}`).pipe(
          map((response) => {
            console.log('✅ 获取抄表记录详情成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取抄表记录详情失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取抄表记录详情';
            } else if (error.status === 404) {
              error.message = '抄表记录不存在或已被删除';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 更新抄表记录信息（需要认证）
   */
  updateUtilityReading(data: UpdateUtilityReadingRequest): Observable<UtilityReading> {
    const { id, ...updateData } = data;
    console.log('🔄 尝试更新抄表记录:', id, updateData);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法更新抄表记录');
          subscriber.error(new Error('用户未登录，请先登录后再更新抄表记录'));
          return;
        }

        // 认证通过，执行API调用
        apiService.put<UtilityReading>(`${this.baseUrl}/${id}`, updateData).pipe(
          map((response) => {
            console.log('✅ 抄表记录更新成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 更新抄表记录失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法更新抄表记录';
            } else if (error.status === 404) {
              error.message = '抄表记录不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '该房间在此日期已有其他抄表记录';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 删除抄表记录（需要认证）
   */
  deleteUtilityReading(readingId: number): Observable<void> {
    console.log('🗑️ 尝试删除抄表记录:', readingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法删除抄表记录');
          subscriber.error(new Error('用户未登录，请先登录后再删除抄表记录'));
          return;
        }

        // 认证通过，执行API调用
        apiService.delete<void>(`${this.baseUrl}/${readingId}`).pipe(
          map(() => {
            console.log('✅ 抄表记录删除成功');
            return undefined;
          }),
          catchError((error) => {
            console.error('❌ 删除抄表记录失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法删除抄表记录';
            } else if (error.status === 404) {
              error.message = '抄表记录不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '抄表记录正在使用中，无法删除';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 搜索抄表记录（需要认证）
   */
  searchUtilityReadings(query: string, roomId?: number): Observable<UtilityReading[]> {
    console.log('🔍 搜索抄表记录:', query, '房间ID:', roomId);

    const params: any = { search: query };
    if (roomId) {
      params.roomId = roomId;
    }

    return this.getUtilityReadingList(params);
  }

  /**
   * 获取抄表统计信息（需要认证）
   */
  getUtilityReadingStats(roomId?: number, buildingId?: number): Observable<UtilityReadingStats> {
    console.log('📊 获取抄表统计信息，房间ID:', roomId, '楼宇ID:', buildingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取抄表统计');
          subscriber.error(new Error('用户未登录，请先登录后再获取抄表统计'));
          return;
        }

        const params: any = {};
        if (roomId) params.roomId = roomId;
        if (buildingId) params.buildingId = buildingId;
        
        // 认证通过，执行API调用
        apiService.get<UtilityReadingStats>(`${this.baseUrl}/stats`, { params }).pipe(
          map((response) => {
            console.log('✅ 获取抄表统计成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取抄表统计失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取抄表统计';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 获取房间最新的抄表记录（需要认证）
   */
  getLatestUtilityReading(roomId: number): Observable<UtilityReading | null> {
    console.log('📊 获取房间最新抄表记录:', roomId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取最新抄表记录');
          subscriber.error(new Error('用户未登录，请先登录后再获取最新抄表记录'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<UtilityReading | null>(`${this.baseUrl}/room/${roomId}/latest`).pipe(
          map((response) => {
            console.log('✅ 获取最新抄表记录成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取最新抄表记录失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取最新抄表记录';
            } else if (error.status === 404) {
              error.message = '房间不存在或暂无抄表记录';
            }

            throw error;
          })
        ).subscribe({
          next: (data) => subscriber.next(data),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }

  /**
   * 更新抄表记录状态（需要认证）
   */
  updateUtilityReadingStatus(readingId: number, status: ReadingStatus): Observable<UtilityReading> {
    console.log('🔄 更新抄表记录状态:', readingId, '→', status);

    return this.updateUtilityReading({ id: readingId, readingStatus: status });
  }

  /**
   * 确认抄表记录（需要认证）
   */
  confirmUtilityReading(readingId: number): Observable<UtilityReading> {
    console.log('✅ 确认抄表记录:', readingId);

    return this.updateUtilityReadingStatus(readingId, ReadingStatus.CONFIRMED);
  }

  /**
   * 争议抄表记录（需要认证）
   */
  disputeUtilityReading(readingId: number, notes?: string): Observable<UtilityReading> {
    console.log('⚠️ 争议抄表记录:', readingId, '备注:', notes);

    return this.updateUtilityReading({ 
      id: readingId, 
      readingStatus: ReadingStatus.DISPUTED,
      notes: notes 
    });
  }
}

// 导出抄表服务实例
export const utilityReadingService = new UtilityReadingService();
export default utilityReadingService;
