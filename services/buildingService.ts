import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { apiService } from './apiService';
import { 
  Building, 
  CreateBuildingRequest, 
  UpdateBuildingRequest, 
  BuildingListParams 
} from '../types/building';

// 楼宇服务类
class BuildingService {
  private readonly baseUrl = '/api/buildings';

  // 创建楼宇
  createBuilding(data: CreateBuildingRequest): Observable<Building> {
    return apiService.post<Building>(this.baseUrl, data).pipe(
      map((response) => {
        console.log('✅ 楼宇创建成功:', response);
        return response.data;
      }),
      catchError((error) => {
        console.error('❌ 创建楼宇失败:', error);
        throw error;
      })
    );
  }

  // 获取楼宇列表
  getBuildingList(params?: BuildingListParams): Observable<Building[]> {
    return apiService.get<Building[]>(this.baseUrl, { params }).pipe(
      map((response) => {
        console.log('✅ 获取楼宇列表成功:', response);
        return response.data;
      }),
      catchError((error) => {
        console.error('❌ 获取楼宇列表失败:', error);
        throw error;
      })
    );
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

  // 更新楼宇信息
  updateBuilding(data: UpdateBuildingRequest): Observable<Building> {
    const { id, ...updateData } = data;
    return apiService.put<Building>(`${this.baseUrl}/${id}`, updateData).pipe(
      map((response) => {
        console.log('✅ 楼宇更新成功:', response);
        return response.data;
      }),
      catchError((error) => {
        console.error('❌ 更新楼宇失败:', error);
        throw error;
      })
    );
  }

  // 删除楼宇
  deleteBuilding(id: number): Observable<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        console.log('✅ 楼宇删除成功');
      }),
      catchError((error) => {
        console.error('❌ 删除楼宇失败:', error);
        throw error;
      })
    );
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
