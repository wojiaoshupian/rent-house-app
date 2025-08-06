/**
 * 抄水电表相关类型定义
 */

// 抄表类型枚举
export enum ReadingType {
  MANUAL = 'MANUAL',     // 手动抄表
  AUTO = 'AUTO',         // 自动抄表
  ESTIMATED = 'ESTIMATED' // 估算读数
}

// 读数状态枚举
export enum ReadingStatus {
  PENDING = 'PENDING',     // 待确认
  CONFIRMED = 'CONFIRMED'  // 已确认
}

// 抄表记录基础信息
export interface UtilityReading {
  id: number;
  roomId: number;
  roomNumber?: string;
  buildingName?: string;
  readingDate: string; // yyyy-MM-dd
  readingTime: string; // yyyy-MM-dd HH:mm:ss
  
  // 电表相关
  electricityReading: number;
  electricityPreviousReading?: number;
  electricityUsage?: number;
  
  // 水表相关
  waterReading: number;
  waterPreviousReading?: number;
  waterUsage?: number;
  
  // 热水表相关
  hotWaterReading?: number;
  hotWaterPreviousReading?: number;
  hotWaterUsage?: number;
  
  // 抄表信息
  meterReader: string;
  readingType: ReadingType;
  readingTypeDescription?: string;
  readingStatus: ReadingStatus;
  readingStatusDescription?: string;
  notes?: string;
  photos?: string[];
  
  // 审计字段
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 创建抄表记录请求
export interface CreateUtilityReadingRequest {
  roomId: number;
  readingDate: string; // yyyy-MM-dd
  readingTime?: string; // yyyy-MM-dd HH:mm:ss，可选，默认当前时间
  electricityReading: number;
  waterReading: number;
  hotWaterReading?: number;
  meterReader: string;
  readingType: ReadingType;
  notes?: string;
  photos?: string[];
}

// 更新抄表记录请求
export interface UpdateUtilityReadingRequest {
  id: number;
  readingDate?: string;
  readingTime?: string;
  electricityReading?: number;
  waterReading?: number;
  hotWaterReading?: number;
  meterReader?: string;
  readingType?: ReadingType;
  readingStatus?: ReadingStatus;
  notes?: string;
  photos?: string[];
}

// 抄表记录查询参数
export interface UtilityReadingListParams {
  roomId?: number;
  buildingId?: number;
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  readingType?: ReadingType;
  readingStatus?: ReadingStatus;
  meterReader?: string;
  page?: number;
  size?: number;
}

// 抄表记录详情（包含房间和楼宇信息）
export interface UtilityReadingDetail extends UtilityReading {
  room?: {
    id: number;
    roomNumber: string;
    buildingId: number;
    buildingName: string;
    rent: number;
    electricityUnitPrice: number;
    waterUnitPrice: number;
    hotWaterUnitPrice?: number;
  };
  
  // 费用计算
  electricityCost?: number; // 本期电费
  waterCost?: number; // 本期水费
  hotWaterCost?: number; // 本期热水费
  totalCost?: number; // 本期总费用
}

// 抄表统计信息
export interface UtilityReadingStats {
  totalReadings: number;
  pendingReadings: number;
  confirmedReadings: number;
  disputedReadings: number;
  
  // 本月统计
  monthlyElectricityUsage: number;
  monthlyWaterUsage: number;
  monthlyHotWaterUsage: number;
  monthlyTotalCost: number;
  
  // 平均用量
  avgElectricityUsage: number;
  avgWaterUsage: number;
  avgHotWaterUsage: number;
}

// 抄表记录搜索结果
export interface UtilityReadingSearchResult {
  readings: UtilityReading[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// 抄表表单验证规则
export interface UtilityReadingFormValidation {
  roomId: {
    required: boolean;
    message: string;
  };
  readingDate: {
    required: boolean;
    message: string;
  };
  electricityReading: {
    required: boolean;
    min: number;
    message: string;
  };
  waterReading: {
    required: boolean;
    min: number;
    message: string;
  };
  hotWaterReading: {
    required: boolean;
    min: number;
    message: string;
  };
  meterReader: {
    required: boolean;
    maxLength: number;
    message: string;
  };
  readingType: {
    required: boolean;
    message: string;
  };
}

// 抄表批量操作
export interface UtilityReadingBatchOperation {
  readingIds: number[];
  operation: 'CONFIRM' | 'DISPUTE' | 'DELETE' | 'UPDATE_STATUS';
  data?: {
    readingStatus?: ReadingStatus;
    notes?: string;
  };
}

// 抄表导入数据
export interface UtilityReadingImportData {
  roomNumber: string;
  readingDate: string;
  electricityReading: string | number;
  waterReading: string | number;
  hotWaterReading?: string | number;
  meterReader: string;
  readingType: string;
  notes?: string;
}

// 抄表导出配置
export interface UtilityReadingExportConfig {
  format: 'CSV' | 'EXCEL' | 'PDF';
  fields: string[];
  filters?: UtilityReadingListParams;
  includeStats?: boolean;
  includeCosts?: boolean;
}

// 抄表提醒配置
export interface UtilityReadingReminder {
  id: number;
  roomId: number;
  reminderDay: number; // 每月提醒日期
  isEnabled: boolean;
  lastReminderDate?: string;
  nextReminderDate?: string;
}

// 抄表历史对比
export interface UtilityReadingComparison {
  currentReading: UtilityReading;
  previousReading?: UtilityReading;
  
  // 用量对比
  electricityUsageChange: number; // 用电量变化
  waterUsageChange: number; // 用水量变化
  hotWaterUsageChange?: number; // 热水用量变化
  
  // 费用对比
  electricityCostChange: number; // 电费变化
  waterCostChange: number; // 水费变化
  hotWaterCostChange?: number; // 热水费变化
  totalCostChange: number; // 总费用变化
  
  // 变化百分比
  electricityUsageChangePercent: number;
  waterUsageChangePercent: number;
  hotWaterUsageChangePercent?: number;
  totalCostChangePercent: number;
}

// 抄表照片信息
export interface UtilityReadingPhoto {
  id: string;
  url: string;
  type: 'ELECTRICITY' | 'WATER' | 'HOT_WATER' | 'OTHER';
  description?: string;
  uploadTime: string;
}

// 抄表模板配置
export interface UtilityReadingTemplate {
  id: number;
  name: string;
  description?: string;
  roomIds: number[];
  readingType: ReadingType;
  reminderEnabled: boolean;
  reminderDay: number;
  autoCalculateCosts: boolean;
  requiredPhotos: boolean;
  createdBy: number;
  createdAt: string;
}

export default UtilityReading;
