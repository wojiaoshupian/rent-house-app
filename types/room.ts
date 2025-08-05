/**
 * 房间相关类型定义
 */

// 出租状态枚举
export enum RentalStatus {
  VACANT = 'VACANT',           // 空置
  RENTED = 'RENTED',          // 已出租
  MAINTENANCE = 'MAINTENANCE', // 维修中
  RESERVED = 'RESERVED'        // 已预订
}

// 房间基础信息
export interface Room {
  id: number;
  roomNumber: string;
  rent: number;
  defaultDeposit: number;
  electricityUnitPrice?: number | null;
  waterUnitPrice?: number | null;
  hotWaterUnitPrice?: number | null;
  buildingId: number;
  buildingName: string;
  landlordName: string;
  rentalStatus: RentalStatus;
  rentalStatusDescription: string;
  effectiveElectricityUnitPrice: number;
  effectiveWaterUnitPrice: number;
  effectiveHotWaterUnitPrice: number;
  createdBy: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt?: string | null;
}

// 更新房间出租状态请求
export interface UpdateRoomRentalStatusRequest {
  id: number;
  rentalStatus: RentalStatus;
  reason?: string;
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
  rentalStatus?: RentalStatus;
}

// 房间列表查询参数
export interface RoomListParams {
  buildingId?: number;
  rentalStatus?: RentalStatus;
  page?: number;
  size?: number;
  search?: string;
}

// 房间统计信息
export interface RoomStats {
  total: number;
  vacant: number;        // 空置
  rented: number;        // 已出租
  maintenance: number;   // 维修中
  reserved: number;      // 已预订
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
  operation: 'DELETE' | 'UPDATE_RENTAL_STATUS' | 'UPDATE_PRICES';
  data?: {
    rentalStatus?: RentalStatus;
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

// 房间出租状态变更记录
export interface RoomRentalStatusHistory {
  id: number;
  roomId: number;
  fromStatus: RentalStatus;
  toStatus: RentalStatus;
  reason?: string;
  changedBy: number;
  changedByUsername: string;
  changedAt: string;
}

// 出租状态选项
// export const RENTAL_STATUS_OPTIONS = [
//   { value: 'VACANT' as const, label: '空置', color: '#6b7280', icon: '🏠' },
//   { value: 'RENTED' as const, label: '已出租', color: '#10b981', icon: '🏡' },
//   { value: 'MAINTENANCE' as const, label: '维修中', color: '#f59e0b', icon: '🔧' },
//   { value: 'RESERVED' as const, label: '已预订', color: '#3b82f6', icon: '📝' },
// ] as const;

export default Room;
