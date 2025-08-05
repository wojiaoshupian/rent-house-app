import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { apiService } from './apiService';
import { AuthGuard } from '../utils/authGuard';
import {
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  BillListParams,
  BillDetail,
  BillStats,
  PaymentRecord,
  BillBatchOperation,
  GenerateBillRequest,
  BillStatus,
  BillType,
  EstimatedBill,
  EstimatedBillListParams,
  EstimatedBillPageResponse,
  EstimatedBillStatus
} from '../types/bill';

/**
 * 账单管理服务类
 */
class BillService {
  private readonly baseUrl = '/api/bills';

  /**
   * 创建账单（需要认证）
   */
  createBill(data: CreateBillRequest): Observable<Bill> {
    console.log('💰 尝试创建账单:', data.title, '房间ID:', data.roomId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法创建账单');
          subscriber.error(new Error('用户未登录，请先登录后再创建账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<Bill>(this.baseUrl, data).pipe(
          map((response) => {
            console.log('✅ 创建账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 创建账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法创建账单';
            } else if (error.status === 400) {
              // 保持原有的错误信息，通常是业务逻辑错误
              console.log('💡 业务逻辑错误:', error.message);
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
   * 获取账单列表（需要认证）
   */
  getBillList(params: BillListParams = {}): Observable<Bill[]> {
    console.log('💰 获取账单列表，参数:', params);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取账单列表');
          subscriber.error(new Error('用户未登录，请先登录后再获取账单列表'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<Bill[]>(this.baseUrl, { params }).pipe(
          map((response) => {
            console.log('✅ 获取账单列表成功:', response);
            console.log('💰 账单数量:', response.data.length);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取账单列表失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取账单列表';
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
   * 根据房间ID获取账单列表（需要认证）
   */
  getBillsByRoomId(roomId: number): Observable<Bill[]> {
    console.log('💰 根据房间ID获取账单:', roomId);
    return this.getBillList({ roomId });
  }

  /**
   * 根据租户ID获取账单列表（需要认证）
   */
  getBillsByTenantId(tenantId: number): Observable<Bill[]> {
    console.log('💰 根据租户ID获取账单:', tenantId);
    return this.getBillList({ tenantId });
  }

  /**
   * 获取账单详情（需要认证）
   */
  getBillDetail(billId: number): Observable<BillDetail> {
    console.log('💰 获取账单详情:', billId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取账单详情');
          subscriber.error(new Error('用户未登录，请先登录后再获取账单详情'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<BillDetail>(`${this.baseUrl}/${billId}`).pipe(
          map((response) => {
            console.log('✅ 获取账单详情成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取账单详情失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取账单详情';
            } else if (error.status === 404) {
              error.message = '账单不存在';
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
   * 更新账单信息（需要认证）
   */
  updateBill(data: UpdateBillRequest): Observable<Bill> {
    const { id, ...updateData } = data;
    console.log('🔄 尝试更新账单:', id, updateData);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法更新账单');
          subscriber.error(new Error('用户未登录，请先登录后再更新账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.put<Bill>(`${this.baseUrl}/${id}`, updateData).pipe(
          map((response) => {
            console.log('✅ 更新账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 更新账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法更新账单';
            } else if (error.status === 404) {
              error.message = '账单不存在';
            } else if (error.status === 400) {
              console.log('💡 业务逻辑错误:', error.message);
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
   * 删除账单（需要认证）
   */
  deleteBill(billId: number): Observable<void> {
    console.log('🗑️ 尝试删除账单:', billId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法删除账单');
          subscriber.error(new Error('用户未登录，请先登录后再删除账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.delete(`${this.baseUrl}/${billId}`).pipe(
          map((response) => {
            console.log('✅ 删除账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 删除账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法删除账单';
            } else if (error.status === 404) {
              error.message = '账单不存在';
            } else if (error.status === 409) {
              error.message = '账单已支付，无法删除';
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
   * 支付账单（需要认证）
   */
  payBill(billId: number, paymentData: {
    amount: number;
    paymentMethod: string;
    notes?: string;
  }): Observable<Bill> {
    console.log('💳 尝试支付账单:', billId, paymentData);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法支付账单');
          subscriber.error(new Error('用户未登录，请先登录后再支付账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<Bill>(`${this.baseUrl}/${billId}/pay`, paymentData).pipe(
          map((response) => {
            console.log('✅ 支付账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 支付账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法支付账单';
            } else if (error.status === 404) {
              error.message = '账单不存在';
            } else if (error.status === 400) {
              console.log('💡 业务逻辑错误:', error.message);
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
   * 获取账单统计信息（需要认证）
   */
  getBillStats(roomId?: number, buildingId?: number): Observable<BillStats> {
    console.log('📊 获取账单统计信息，房间ID:', roomId, '楼宇ID:', buildingId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取账单统计');
          subscriber.error(new Error('用户未登录，请先登录后再获取账单统计'));
          return;
        }

        const params = { roomId, buildingId };

        // 认证通过，执行API调用
        apiService.get<BillStats>(`${this.baseUrl}/stats`, { params }).pipe(
          map((response) => {
            console.log('✅ 获取账单统计成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取账单统计失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取账单统计';
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
   * 搜索账单（需要认证）
   */
  searchBills(query: string, filters?: Partial<BillListParams>): Observable<Bill[]> {
    console.log('🔍 搜索账单:', query, '过滤条件:', filters);

    const params: any = { search: query, ...filters };
    return this.getBillList(params);
  }

  /**
   * 批量操作账单（需要认证）
   */
  batchOperateBills(operation: BillBatchOperation): Observable<{ success: number; failed: number }> {
    console.log('📦 批量操作账单:', operation);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法批量操作账单');
          subscriber.error(new Error('用户未登录，请先登录后再批量操作账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<{ success: number; failed: number }>(`${this.baseUrl}/batch`, operation).pipe(
          map((response) => {
            console.log('✅ 批量操作账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 批量操作账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法批量操作账单';
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
   * 生成账单（需要认证）
   */
  generateBills(request: GenerateBillRequest): Observable<{ generated: number; failed: number }> {
    console.log('🏭 生成账单:', request);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法生成账单');
          subscriber.error(new Error('用户未登录，请先登录后再生成账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.post<{ generated: number; failed: number }>(`${this.baseUrl}/generate`, request).pipe(
          map((response) => {
            console.log('✅ 生成账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 生成账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法生成账单';
            } else if (error.status === 400) {
              console.log('💡 业务逻辑错误:', error.message);
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
   * 获取支付记录（需要认证）
   */
  getPaymentRecords(billId: number): Observable<PaymentRecord[]> {
    console.log('💳 获取支付记录:', billId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取支付记录');
          subscriber.error(new Error('用户未登录，请先登录后再获取支付记录'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<PaymentRecord[]>(`${this.baseUrl}/${billId}/payments`).pipe(
          map((response) => {
            console.log('✅ 获取支付记录成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 获取支付记录失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取支付记录';
            } else if (error.status === 404) {
              error.message = '账单不存在';
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
   * 获取逾期账单（需要认证）
   */
  getOverdueBills(roomId?: number, buildingId?: number): Observable<Bill[]> {
    console.log('⏰ 获取逾期账单，房间ID:', roomId, '楼宇ID:', buildingId);

    return this.getBillList({
      status: BillStatus.OVERDUE,
      roomId,
      buildingId,
      sortBy: 'dueDate',
      sortOrder: 'ASC'
    });
  }

  /**
   * 获取待支付账单（需要认证）
   */
  getPendingBills(roomId?: number, buildingId?: number): Observable<Bill[]> {
    console.log('⏳ 获取待支付账单，房间ID:', roomId, '楼宇ID:', buildingId);

    return this.getBillList({
      status: BillStatus.PENDING,
      roomId,
      buildingId,
      sortBy: 'dueDate',
      sortOrder: 'ASC'
    });
  }

  /**
   * 获取预估账单（需要认证）
   */
  getEstimatedBills(params: EstimatedBillListParams = {}): Observable<EstimatedBillPageResponse> {
    console.log('📊 获取预估账单，参数:', params);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法获取预估账单');
          subscriber.error(new Error('用户未登录，请先登录后再获取预估账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.get<EstimatedBill[]>('/api/bills', { params }).pipe(
          map((response: any) => {
            console.log('✅ 获取预估账单成功:', response);
            console.log('📊 预估账单数量:', response.data.length);

            // 构造分页响应
            const pageResponse: EstimatedBillPageResponse = {
              data: response.data,
              pagination: response.pagination || {
                page: params.page || 0,
                size: params.size || 10,
                totalElements: response.data.length,
                totalPages: Math.ceil(response.data.length / (params.size || 10)),
                first: (params.page || 0) === 0,
                last: true
              }
            };

            return pageResponse;
          }),
          catchError((error) => {
            console.error('❌ 获取预估账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法获取预估账单';
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
   * 根据房间ID获取预估账单（需要认证）
   */
  getEstimatedBillsByRoomId(roomId: number, billMonth?: string): Observable<EstimatedBill[]> {
    console.log('📊 根据房间ID获取预估账单:', roomId, '账单月份:', billMonth);

    return this.getEstimatedBills({ roomId, billMonth }).pipe(
      map(response => response.data)
    );
  }

  /**
   * 根据状态获取预估账单（需要认证）
   */
  getEstimatedBillsByStatus(status: EstimatedBillStatus, roomId?: number): Observable<EstimatedBill[]> {
    console.log('📊 根据状态获取预估账单:', status, '房间ID:', roomId);

    return this.getEstimatedBills({ billStatus: status, roomId }).pipe(
      map(response => response.data)
    );
  }

  /**
   * 生成预估账单（需要认证）
   */
  generateEstimatedBill(roomId: number, billMonth: string): Observable<EstimatedBill> {
    console.log('🏭 生成预估账单:', `房间ID: ${roomId}, 账单月份: ${billMonth}`);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法生成预估账单');
          subscriber.error(new Error('用户未登录，请先登录后再生成预估账单'));
          return;
        }

        // 构造请求参数
        const params = { roomId, billMonth };

        // 认证通过，执行API调用
        apiService.post<EstimatedBill>('/api/bills/generate', null, { params }).pipe(
          map((response) => {
            console.log('✅ 生成预估账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 生成预估账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法生成预估账单';
            } else if (error.status === 400) {
              error.message = error.message || '请求参数错误，请检查房间ID和账单月份';
            } else if (error.status === 404) {
              error.message = '房间不存在或没有相关数据';
            } else if (error.status === 409) {
              error.message = '该房间该月份的预估账单已存在';
            } else if (!error.message) {
              error.message = '生成预估账单失败，请重试';
            }

            return throwError(() => error);
          })
        ).subscribe({
          next: (bill) => subscriber.next(bill),
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
   * 删除预估账单（需要认证）
   */
  deleteEstimatedBill(billId: number): Observable<void> {
    console.log('🗑️ 删除预估账单:', billId);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法删除预估账单');
          subscriber.error(new Error('用户未登录，请先登录后再删除预估账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.delete<void>(`/api/bills/${billId}`).pipe(
          map(() => {
            console.log('✅ 删除预估账单成功');
            return undefined;
          }),
          catchError((error) => {
            console.error('❌ 删除预估账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法删除预估账单';
            } else if (error.status === 404) {
              error.message = '预估账单不存在或已被删除';
            } else if (error.status === 409) {
              error.message = '预估账单已确认，无法删除';
            } else if (!error.message) {
              error.message = '删除预估账单失败，请重试';
            }

            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => subscriber.next(result),
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
   * 更新预估账单（需要认证）
   */
  updateEstimatedBill(billId: number, updateData: {
    rent?: number;
    deposit?: number;
    electricityUsage?: number;
    waterUsage?: number;
    hotWaterUsage?: number;
    otherFees?: number;
    otherFeesDescription?: string;
    billStatus?: string;
    notes?: string;
  }): Observable<EstimatedBill> {
    console.log('✏️ 更新预估账单:', billId, updateData);

    // 先检查认证状态
    return new Observable(subscriber => {
      AuthGuard.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          console.error('🚫 用户未认证，无法更新预估账单');
          subscriber.error(new Error('用户未登录，请先登录后再更新预估账单'));
          return;
        }

        // 认证通过，执行API调用
        apiService.put<EstimatedBill>(`/api/bills/${billId}`, updateData).pipe(
          map((response) => {
            console.log('✅ 更新预估账单成功:', response);
            return response.data;
          }),
          catchError((error) => {
            console.error('❌ 更新预估账单失败:', error);

            if (error.status === 401) {
              error.message = '登录已过期，请重新登录后再试';
            } else if (error.status === 403) {
              error.message = '权限不足，无法更新预估账单';
            } else if (error.status === 404) {
              error.message = '预估账单不存在或已被删除';
            } else if (error.status === 400) {
              error.message = error.message || '请求参数错误，请检查输入数据';
            } else if (error.status === 409) {
              error.message = '账单状态冲突，无法更新';
            } else if (!error.message) {
              error.message = '更新预估账单失败，请重试';
            }

            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => subscriber.next(result),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete()
        });
      }).catch(error => {
        console.error('❌ 认证检查失败:', error);
        subscriber.error(new Error('认证检查失败，请重试'));
      });
    });
  }
}

// 导出单例实例
export const billService = new BillService();
export default billService;
