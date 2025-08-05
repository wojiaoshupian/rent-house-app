/**
 * 账单相关类型定义
 */

// 账单状态枚举
export enum BillStatus {
  PENDING = 'PENDING',         // 待支付
  PAID = 'PAID',              // 已支付
  OVERDUE = 'OVERDUE',        // 逾期
  CANCELLED = 'CANCELLED',     // 已取消
  DISPUTED = 'DISPUTED'        // 有争议
}

// 账单类型枚举
export enum BillType {
  RENT = 'RENT',              // 房租
  ELECTRICITY = 'ELECTRICITY', // 电费
  WATER = 'WATER',            // 水费
  HOT_WATER = 'HOT_WATER',    // 热水费
  UTILITY = 'UTILITY',        // 水电费（综合）
  DEPOSIT = 'DEPOSIT',        // 押金
  OTHER = 'OTHER'             // 其他费用
}

// 支付方式枚举
export enum PaymentMethod {
  CASH = 'CASH',              // 现金
  BANK_TRANSFER = 'BANK_TRANSFER', // 银行转账
  ALIPAY = 'ALIPAY',          // 支付宝
  WECHAT = 'WECHAT',          // 微信支付
  OTHER = 'OTHER'             // 其他方式
}

// 账单基础信息
export interface Bill {
  id: number;
  billNumber: string;         // 账单编号
  roomId: number;
  roomNumber?: string;
  buildingId?: number;
  buildingName?: string;
  tenantId?: number;
  tenantName?: string;
  
  // 账单基本信息
  billType: BillType;
  billTypeDescription?: string;
  title: string;              // 账单标题
  description?: string;       // 账单描述
  
  // 金额信息
  amount: number;             // 账单金额
  paidAmount?: number;        // 已支付金额
  remainingAmount?: number;   // 剩余金额
  
  // 时间信息
  billPeriod: string;         // 账单周期，如 "2024-01"
  dueDate: string;           // 到期日期 yyyy-MM-dd
  paidAt?: string;           // 支付时间
  
  // 状态信息
  status: BillStatus;
  statusDescription?: string;
  paymentMethod?: PaymentMethod;
  paymentMethodDescription?: string;
  
  // 备注和附件
  notes?: string;
  attachments?: string[];     // 附件URL列表
  
  // 审计字段
  createdBy?: number;
  createdByUsername?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 创建账单请求
export interface CreateBillRequest {
  roomId: number;
  tenantId?: number;
  billType: BillType;
  title: string;
  description?: string;
  amount: number;
  billPeriod: string;         // yyyy-MM 格式
  dueDate: string;           // yyyy-MM-dd 格式
  notes?: string;
  attachments?: string[];
}

// 更新账单请求
export interface UpdateBillRequest {
  id: number;
  title?: string;
  description?: string;
  amount?: number;
  billPeriod?: string;
  dueDate?: string;
  status?: BillStatus;
  paymentMethod?: PaymentMethod;
  paidAmount?: number;
  paidAt?: string;
  notes?: string;
  attachments?: string[];

  // 详细费用字段
  rent?: number;                    // 房租金额
  deposit?: number;                 // 押金金额
  electricityUsage?: number;        // 电费用量
  waterUsage?: number;              // 水费用量
  hotWaterUsage?: number;           // 热水费用量
  otherFees?: number;               // 其他费用金额
  otherFeesDescription?: string;    // 其他费用说明
  billStatus?: string;              // 账单状态（字符串格式）
}

// 账单查询参数
export interface BillListParams {
  roomId?: number;
  buildingId?: number;
  tenantId?: number;
  billType?: BillType;
  status?: BillStatus;
  billPeriod?: string;        // yyyy-MM 格式
  startDate?: string;         // yyyy-MM-dd
  endDate?: string;           // yyyy-MM-dd
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  size?: number;
  sortBy?: 'dueDate' | 'amount' | 'createdAt' | 'billPeriod';
  sortOrder?: 'ASC' | 'DESC';
}

// 账单详情（包含房间和租户信息）
export interface BillDetail extends Bill {
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
  tenant?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    checkInDate?: string;
  };
  utilityReading?: {
    id: number;
    readingDate: string;
    electricityUsage?: number;
    waterUsage?: number;
    hotWaterUsage?: number;
    electricityCost?: number;
    waterCost?: number;
    hotWaterCost?: number;
  };

  // 详细费用字段
  rent?: number;                    // 房租金额
  deposit?: number;                 // 押金金额
  electricityUsage?: number;        // 电费用量
  waterUsage?: number;              // 水费用量
  hotWaterUsage?: number;           // 热水费用量
  otherFees?: number;               // 其他费用金额
  otherFeesDescription?: string;    // 其他费用说明
  billStatus?: string;              // 账单状态（字符串格式）
}

// 账单统计信息
export interface BillStats {
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  overdueAmount: number;
  
  // 按状态统计
  statusStats: {
    [key in BillStatus]: {
      count: number;
      amount: number;
    };
  };
  
  // 按类型统计
  typeStats: {
    [key in BillType]: {
      count: number;
      amount: number;
    };
  };
  
  // 按月份统计
  monthlyStats: {
    month: string;          // yyyy-MM
    totalAmount: number;
    paidAmount: number;
    billCount: number;
  }[];
}

// 支付记录
export interface PaymentRecord {
  id: number;
  billId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;      // yyyy-MM-dd HH:mm:ss
  transactionId?: string;   // 交易流水号
  notes?: string;
  createdBy?: number;
  createdAt?: string;
}

// 批量操作
export interface BillBatchOperation {
  billIds: number[];
  operation: 'PAY' | 'CANCEL' | 'MARK_OVERDUE' | 'DELETE' | 'UPDATE_STATUS';
  data?: {
    status?: BillStatus;
    paymentMethod?: PaymentMethod;
    paidAmount?: number;
    paidAt?: string;
    notes?: string;
  };
}

// 账单模板
export interface BillTemplate {
  id: number;
  name: string;
  description?: string;
  billType: BillType;
  title: string;
  amount?: number;          // 固定金额，可选
  isRecurring: boolean;     // 是否循环账单
  recurringInterval?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'; // 循环间隔
  autoGenerate: boolean;    // 是否自动生成
  createdBy: number;
  createdAt: string;
}

// 账单生成请求
export interface GenerateBillRequest {
  templateId?: number;      // 使用模板
  roomIds: number[];        // 房间ID列表
  billType: BillType;
  title: string;
  billPeriod: string;       // yyyy-MM
  dueDate: string;         // yyyy-MM-dd
  amount?: number;         // 固定金额
  calculateFromUtility?: boolean; // 是否从抄表记录计算
  notes?: string;
}

// 账单导出配置
export interface BillExportConfig {
  format: 'CSV' | 'EXCEL' | 'PDF';
  fields: string[];
  filters?: BillListParams;
  includeStats?: boolean;
  groupBy?: 'room' | 'tenant' | 'billType' | 'month';
}

// 预估账单状态枚举
export enum EstimatedBillStatus {
  GENERATED = 'GENERATED',   // 已生成
  CONFIRMED = 'CONFIRMED',   // 已确认
  SENT = 'SENT',            // 已发送
  PAID = 'PAID',            // 已支付
  OVERDUE = 'OVERDUE',      // 已逾期
  CANCELLED = 'CANCELLED'    // 已取消
}

// 预估账单类型
export interface EstimatedBill {
  id: number;
  roomId: number;
  roomNumber: string;
  buildingName: string;
  billMonth: string;          // YYYY-MM 格式
  billDate: string;           // YYYY-MM-DD 格式

  // 费用明细
  rent: number;               // 房租
  deposit: number;            // 押金
  electricityUnitPrice: number; // 电费单价
  electricityUsage: number;   // 用电量
  electricityAmount: number;  // 电费金额
  waterUnitPrice: number;     // 水费单价
  waterUsage: number;         // 用水量
  waterAmount: number;        // 水费金额
  hotWaterUnitPrice: number;  // 热水单价
  hotWaterUsage: number;      // 热水用量
  hotWaterAmount: number;     // 热水费金额
  otherFees: number;          // 其他费用
  otherFeesDescription: string; // 其他费用说明
  totalAmount: number;        // 总金额

  // 状态信息
  billStatus: EstimatedBillStatus;
  billStatusDescription: string;
  notes?: string;

  // 审计字段
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
}

// 预估账单查询参数
export interface EstimatedBillListParams {
  roomId?: number;
  billMonth?: string;         // YYYY-MM 格式
  billStatus?: EstimatedBillStatus;
  page?: number;
  size?: number;
}

// 预估账单分页响应
export interface EstimatedBillPageResponse {
  data: EstimatedBill[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

// 预估账单相关类型
export interface EstimatedBill extends Bill {
  isEstimated: true;
  estimatedAt: string;        // 预估时间
  basedOnReadingId?: number;  // 基于的抄表记录ID
  estimationMethod: 'READING_BASED' | 'HISTORICAL_AVERAGE' | 'FIXED_AMOUNT'; // 预估方法
  confidence: number;         // 预估置信度 0-1
}

// 预估账单查询参数
export interface EstimatedBillParams {
  roomId?: number;
  buildingId?: number;
  billPeriod?: string;        // yyyy-MM
  billTypes?: BillType[];
  estimationMethod?: 'READING_BASED' | 'HISTORICAL_AVERAGE' | 'FIXED_AMOUNT';
  minConfidence?: number;     // 最小置信度
}

// 生成预估账单请求
export interface GenerateEstimatedBillRequest {
  roomIds?: number[];
  buildingId?: number;
  billPeriod: string;         // yyyy-MM
  includeRent?: boolean;      // 是否包含房租
  includeUtilities?: boolean; // 是否包含水电费
  estimationMethod?: 'READING_BASED' | 'HISTORICAL_AVERAGE' | 'FIXED_AMOUNT';
  useLatestReading?: boolean; // 是否使用最新抄表记录
}

// 确认预估账单请求
export interface ConfirmEstimatedBillRequest {
  estimatedBillIds: number[];
  adjustments?: {             // 可选的调整
    billId: number;
    newAmount?: number;
    newDueDate?: string;
    notes?: string;
  }[];
}

// 账单状态选项
export const BILL_STATUS_OPTIONS = [
  { value: BillStatus.PENDING, label: '待支付', color: '#f59e0b' },
  { value: BillStatus.PAID, label: '已支付', color: '#10b981' },
  { value: BillStatus.OVERDUE, label: '逾期', color: '#ef4444' },
  { value: BillStatus.CANCELLED, label: '已取消', color: '#6b7280' },
  { value: BillStatus.DISPUTED, label: '有争议', color: '#8b5cf6' },
] as const;

// 账单类型选项
export const BILL_TYPE_OPTIONS = [
  { value: BillType.RENT, label: '房租', icon: '🏠' },
  { value: BillType.ELECTRICITY, label: '电费', icon: '⚡' },
  { value: BillType.WATER, label: '水费', icon: '💧' },
  { value: BillType.HOT_WATER, label: '热水费', icon: '🔥' },
  { value: BillType.UTILITY, label: '水电费', icon: '🔌' },
  { value: BillType.DEPOSIT, label: '押金', icon: '💰' },
  { value: BillType.OTHER, label: '其他费用', icon: '📄' },
] as const;

// 支付方式选项
export const PAYMENT_METHOD_OPTIONS = [
  { value: PaymentMethod.CASH, label: '现金', icon: '💵' },
  { value: PaymentMethod.BANK_TRANSFER, label: '银行转账', icon: '🏦' },
  { value: PaymentMethod.ALIPAY, label: '支付宝', icon: '📱' },
  { value: PaymentMethod.WECHAT, label: '微信支付', icon: '💬' },
  { value: PaymentMethod.OTHER, label: '其他方式', icon: '💳' },
] as const;

// 预估账单状态选项
export const ESTIMATED_BILL_STATUS_OPTIONS = [
  { value: EstimatedBillStatus.GENERATED, label: '已生成', color: '#3b82f6' },
  { value: EstimatedBillStatus.CONFIRMED, label: '已确认', color: '#10b981' },
  { value: EstimatedBillStatus.SENT, label: '已发送', color: '#8b5cf6' },
  { value: EstimatedBillStatus.PAID, label: '已支付', color: '#10b981' },
  { value: EstimatedBillStatus.OVERDUE, label: '已逾期', color: '#ef4444' },
  { value: EstimatedBillStatus.CANCELLED, label: '已取消', color: '#6b7280' },
] as const;

export default Bill;
