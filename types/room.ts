/**
 * 房间相关类型定义
 */

// 房间基础信息
export interface Room {
  id: number;
  roomNumber: string;
  rent: number;
  defaultDeposit: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  buildingId: number;
  buildingName?: string;
  status?: RoomStatus;
  currentTenantId?: number;
  currentTenantName?: string;
  createdBy?: number;
  createdByUsername?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 房间状态枚举
export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',     // 可租
  OCCUPIED = 'OCCUPIED',       // 已租
  MAINTENANCE = 'MAINTENANCE', // 维修中
  RESERVED = 'RESERVED'        // 预定
}

// 创建房间请求
export interface CreateRoomRequest {
  roomNumber: string;
  rent: number;
  defaultDeposit: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  buildingId: number;
}

// 更新房间请求
export interface UpdateRoomRequest {
  id: number;
  roomNumber?: string;
  rent?: number;
  defaultDeposit?: number;
  electricityUnitPrice?: number;
  waterUnitPrice?: number;
  hotWaterUnitPrice?: number;
  status?: RoomStatus;
}

// 房间列表查询参数
export interface RoomListParams {
  buildingId?: number;
  status?: RoomStatus;
  page?: number;
  size?: number;
  search?: string;
}

// 房间统计信息
export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  reserved: number;
  occupancyRate: number; // 入住率
}

// 房间详细信息（包含租户信息）
export interface RoomDetail extends Room {
  building?: {
    id: number;
    buildingName: string;
    landlordName: string;
  };
  currentTenant?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    checkInDate?: string;
  };
  rentHistory?: RentRecord[];
}

// 租金记录
export interface RentRecord {
  id: number;
  roomId: number;
  tenantId: number;
  tenantName: string;
  amount: number;
  period: string; // 租金周期，如 "2024-01"
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  paidAt?: string;
  createdAt: string;
}

// 房间搜索结果
export interface RoomSearchResult {
  rooms: Room[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// 房间表单验证规则
export interface RoomFormValidation {
  roomNumber: {
    required: boolean;
    pattern?: RegExp;
    message: string;
  };
  rent: {
    required: boolean;
    min: number;
    max: number;
    message: string;
  };
  defaultDeposit: {
    required: boolean;
    min: number;
    message: string;
  };
  electricityUnitPrice: {
    required: boolean;
    min: number;
    max: number;
    message: string;
  };
  waterUnitPrice: {
    required: boolean;
    min: number;
    max: number;
    message: string;
  };
  hotWaterUnitPrice: {
    required: boolean;
    min: number;
    max: number;
    message: string;
  };
  buildingId: {
    required: boolean;
    message: string;
  };
}

// 房间操作权限
export interface RoomPermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canViewDetails: boolean;
  canManageTenants: boolean;
}

// 房间批量操作
export interface RoomBatchOperation {
  roomIds: number[];
  operation: 'DELETE' | 'UPDATE_STATUS' | 'UPDATE_PRICES';
  data?: {
    status?: RoomStatus;
    electricityUnitPrice?: number;
    waterUnitPrice?: number;
    hotWaterUnitPrice?: number;
  };
}

// 房间导入数据
export interface RoomImportData {
  roomNumber: string;
  rent: string | number;
  defaultDeposit: string | number;
  electricityUnitPrice: string | number;
  waterUnitPrice: string | number;
  hotWaterUnitPrice?: string | number;
  buildingName: string;
}

// 房间导出配置
export interface RoomExportConfig {
  format: 'CSV' | 'EXCEL' | 'PDF';
  fields: string[];
  filters?: RoomListParams;
  includeStats?: boolean;
}

// 房间模板配置
export interface RoomTemplate {
  id: number;
  name: string;
  description?: string;
  defaultRent: number;
  defaultDeposit: number;
  defaultElectricityPrice: number;
  defaultWaterPrice: number;
  defaultHotWaterPrice?: number;
  createdBy: number;
  createdAt: string;
}

// 房间价格历史
export interface RoomPriceHistory {
  id: number;
  roomId: number;
  rent: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  effectiveDate: string;
  reason?: string;
  createdBy: number;
  createdAt: string;
}

// 房间状态变更记录
export interface RoomStatusHistory {
  id: number;
  roomId: number;
  fromStatus: RoomStatus;
  toStatus: RoomStatus;
  reason?: string;
  changedBy: number;
  changedByUsername: string;
  changedAt: string;
}

export default Room;
