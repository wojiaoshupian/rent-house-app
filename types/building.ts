// 楼宇相关类型定义
export interface Building {
  id: number;
  buildingName: string;
  landlordName: string;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  electricityCost?: number;
  waterCost?: number;
  hotWaterCost?: number;
  rentCollectionMethod: 'FIXED_MONTH_START' | 'RENTAL_START_DATE';
  createdBy: number;
  createdByUsername?: string;
  createdAt: string;
  updatedAt?: string;
}

// 创建楼宇请求接口
export interface CreateBuildingRequest {
  buildingName: string;
  landlordName: string;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  hotWaterUnitPrice?: number;
  electricityCost?: number;
  waterCost?: number;
  hotWaterCost?: number;
  rentCollectionMethod: 'FIXED_MONTH_START' | 'RENTAL_START_DATE';
}

// 更新楼宇请求接口
export interface UpdateBuildingRequest extends Partial<CreateBuildingRequest> {
  id: number;
}

// 楼宇列表查询参数
export interface BuildingListParams {
  page?: number;
  size?: number;
  buildingName?: string;
  landlordName?: string;
}

// 收租方式选项
export const RENT_COLLECTION_METHODS = [
  { value: 'FIXED_MONTH_START', label: '固定月初收租' },
  { value: 'RENTAL_START_DATE', label: '按租赁开始日期收租' },
] as const;
