/**
 * 错误处理工具
 * 用于统一处理API错误响应，优先显示接口返回的错误信息
 */

export interface ApiError {
  message?: string;
  status?: number;
  code?: number;
  data?: {
    message?: string;
    code?: number;
  };
  response?: {
    data?: {
      message?: string;
      code?: number;
    };
    status?: number;
  };
  url?: string;
}

/**
 * 从错误对象中提取错误信息
 * @param error 错误对象
 * @param defaultMessage 默认错误信息
 * @returns 错误信息字符串
 */
export function extractErrorMessage(error: ApiError, defaultMessage: string = '操作失败，请重试'): string {
  // 1. 优先使用 error.message
  if (error.message) {
    return error.message;
  }
  
  // 2. 尝试从 error.data.message 获取
  if (error.data?.message) {
    return error.data.message;
  }
  
  // 3. 尝试从 error.response.data.message 获取
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // 4. 根据状态码提供通用错误信息
  if (error.status || error.response?.status) {
    const status = error.status || error.response?.status;
    switch (status) {
      case 400:
        return '请求参数有误，请检查输入信息';
      case 401:
        return '登录已过期，请重新登录后再试';
      case 403:
        return '权限不足，无法执行此操作';
      case 404:
        return '请求的资源不存在';
      case 409:
        return '数据冲突，请检查是否重复操作';
      case 422:
        return '数据验证失败，请检查输入信息';
      case 500:
        return '服务器内部错误，请稍后重试';
      case 502:
        return '网关错误，请检查网络连接';
      case 503:
        return '服务暂时不可用，请稍后重试';
      default:
        return defaultMessage;
    }
  }
  
  // 5. 返回默认错误信息
  return defaultMessage;
}

/**
 * 处理抄表相关的错误
 * @param error 错误对象
 * @param operation 操作类型
 * @returns 错误信息字符串
 */
export function handleUtilityReadingError(error: ApiError, operation: 'create' | 'update' | 'delete' | 'confirm' | 'dispute' | 'get'): string {
  const baseMessage = extractErrorMessage(error);
  
  // 如果已经有具体的错误信息，直接返回
  if (baseMessage !== '操作失败，请重试') {
    return baseMessage;
  }
  
  // 根据操作类型提供默认错误信息
  const operationMessages = {
    create: '创建抄表记录失败',
    update: '更新抄表记录失败',
    delete: '删除抄表记录失败',
    confirm: '确认抄表记录失败',
    dispute: '标记争议失败',
    get: '获取抄表记录失败'
  };
  
  return operationMessages[operation] || '抄表操作失败';
}

/**
 * 处理房间相关的错误
 * @param error 错误对象
 * @param operation 操作类型
 * @returns 错误信息字符串
 */
export function handleRoomError(error: ApiError, operation: 'create' | 'update' | 'delete' | 'get'): string {
  const baseMessage = extractErrorMessage(error);
  
  // 如果已经有具体的错误信息，直接返回
  if (baseMessage !== '操作失败，请重试') {
    return baseMessage;
  }
  
  // 根据操作类型提供默认错误信息
  const operationMessages = {
    create: '创建房间失败',
    update: '更新房间信息失败',
    delete: '删除房间失败',
    get: '获取房间信息失败'
  };
  
  return operationMessages[operation] || '房间操作失败';
}

/**
 * 处理楼宇相关的错误
 * @param error 错误对象
 * @param operation 操作类型
 * @returns 错误信息字符串
 */
export function handleBuildingError(error: ApiError, operation: 'create' | 'update' | 'delete' | 'get'): string {
  const baseMessage = extractErrorMessage(error);
  
  // 如果已经有具体的错误信息，直接返回
  if (baseMessage !== '操作失败，请重试') {
    return baseMessage;
  }
  
  // 根据操作类型提供默认错误信息
  const operationMessages = {
    create: '创建楼宇失败',
    update: '更新楼宇信息失败',
    delete: '删除楼宇失败',
    get: '获取楼宇信息失败'
  };
  
  return operationMessages[operation] || '楼宇操作失败';
}

/**
 * 处理认证相关的错误
 * @param error 错误对象
 * @returns 错误信息字符串
 */
export function handleAuthError(error: ApiError): string {
  const baseMessage = extractErrorMessage(error);
  
  // 认证错误的特殊处理
  if (error.status === 401 || error.response?.status === 401) {
    return '登录已过期，请重新登录';
  }
  
  if (error.status === 403 || error.response?.status === 403) {
    return '权限不足，无法执行此操作';
  }
  
  return baseMessage;
}

/**
 * 记录错误信息到控制台
 * @param error 错误对象
 * @param context 错误上下文
 */
export function logError(error: ApiError, context: string): void {
  console.error(`❌ ${context}:`, error);
  
  // 记录详细的错误信息
  const errorDetails = {
    message: error.message,
    status: error.status || error.response?.status,
    code: error.code || error.data?.code || error.response?.data?.code,
    url: error.url,
    timestamp: new Date().toISOString()
  };
  
  console.error('错误详情:', errorDetails);
}

/**
 * 检查是否为网络错误
 * @param error 错误对象
 * @returns 是否为网络错误
 */
export function isNetworkError(error: ApiError): boolean {
  return !error.status && !error.response?.status && (error.message?.includes('Network') || false);
}

/**
 * 检查是否为认证错误
 * @param error 错误对象
 * @returns 是否为认证错误
 */
export function isAuthError(error: ApiError): boolean {
  const status = error.status || error.response?.status;
  return status === 401 || status === 403;
}

/**
 * 检查是否为业务逻辑错误
 * @param error 错误对象
 * @returns 是否为业务逻辑错误
 */
export function isBusinessError(error: ApiError): boolean {
  const status = error.status || error.response?.status;
  return status === 400 || status === 409 || status === 422;
}

/**
 * 统一的错误处理函数
 * @param error 错误对象
 * @param context 错误上下文
 * @param defaultMessage 默认错误信息
 * @returns 处理后的错误信息
 */
export function handleError(error: ApiError, context: string, defaultMessage?: string): string {
  // 记录错误
  logError(error, context);
  
  // 提取错误信息
  const errorMessage = extractErrorMessage(error, defaultMessage);
  
  // 根据错误类型提供额外的处理建议
  if (isNetworkError(error)) {
    return '网络连接失败，请检查网络后重试';
  }
  
  if (isAuthError(error)) {
    return handleAuthError(error);
  }
  
  return errorMessage;
}

// 导出便捷的错误处理函数
export const ErrorHandler = {
  extract: extractErrorMessage,
  utilityReading: handleUtilityReadingError,
  room: handleRoomError,
  building: handleBuildingError,
  auth: handleAuthError,
  handle: handleError,
  log: logError,
  isNetwork: isNetworkError,
  isAuth: isAuthError,
  isBusiness: isBusinessError
};
