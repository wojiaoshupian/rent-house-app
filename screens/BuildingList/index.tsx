import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { buildingService } from '../../services/buildingService';
import { Building, UpdateBuildingRequest } from '../../types/building';
import { catchError, of, Subscription } from 'rxjs';
import { showToast } from '../../utils/toastUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BuildingListScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // 订阅管理
  const subscriptionRef = useRef<Subscription | null>(null);

  // 状态管理
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOperationGuide, setShowOperationGuide] = useState(false);
  const [editForm, setEditForm] = useState({
    buildingName: '',
    landlordName: '',
    electricityUnitPrice: '',
    waterUnitPrice: '',
    hotWaterUnitPrice: ''
  });

  // 获取楼宇列表
  const fetchBuildings = (isRefresh = false) => {
    // 取消之前的订阅
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    subscriptionRef.current = buildingService.getBuildingList()
      .pipe(
        catchError((error) => {
          console.error('获取楼宇列表失败:', error);
          const errorMessage = error.message || '获取楼宇列表失败，请重试';
          setError(errorMessage);
          if (!isRefresh) {
            showToast.error('获取失败', errorMessage);
          }
          return of([]);
        })
      )
      .subscribe({
        next: (buildingList) => {
          setBuildings(buildingList);
          console.log('✅ 成功获取楼宇列表:', buildingList);

          if (isRefresh) {
            showToast.success('刷新成功', `获取到 ${buildingList.length} 个楼宇`);
            
          }
        },
        error: (error) => {
          console.error('RxJS错误:', error);
          setLoading(false);
          setRefreshing(false);
          setError('网络请求失败，请检查网络连接');
          showToast.error('错误', '网络请求失败，请检查网络连接');
        },
        complete: () => {
          setLoading(false);
          setRefreshing(false);
        }
      });
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchBuildings();

    // 组件卸载时清理订阅
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // 下拉刷新
  const onRefresh = () => {
    fetchBuildings(true);
  };

  // 删除楼宇
  const handleDeleteBuilding = (building: Building) => {
    Alert.alert(
      '确认删除',
      `确定要删除楼宇"${building.buildingName}"吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            console.log('🗑️ 开始删除楼宇:', building.id, building.buildingName);

            // 立即从UI中移除该楼宇（乐观更新）
            const originalBuildings = [...buildings];
            const updatedBuildings = buildings.filter(b => b.id !== building.id);
            setBuildings(updatedBuildings);
            console.log('🔄 乐观更新：已从UI中移除楼宇');

            buildingService.deleteBuilding(building.id).subscribe({
              next: () => {
                console.log('✅ 楼宇删除成功，服务器确认');
                showToast.success('删除成功', `楼宇"${building.buildingName}"已删除`);

                // 重新获取最新数据确保同步
                setTimeout(() => {
                  console.log('🔄 重新获取最新楼宇列表');
                  fetchBuildings(true); // 使用刷新模式
                }, 1000);
              },
              error: (error) => {
                console.error('❌ 删除楼宇失败:', error);

                // 删除失败，恢复原来的列表
                setBuildings(originalBuildings);
                console.log('🔄 删除失败，已恢复原列表');

                showToast.error('删除失败', error.message || '删除楼宇时发生错误，请重试');
              }
            });
          }
        }
      ]
    );
  };

  // 开始编辑楼宇
  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setEditForm({
      buildingName: building.buildingName,
      landlordName: building.landlordName,
      electricityUnitPrice: building.electricityUnitPrice.toString(),
      waterUnitPrice: building.waterUnitPrice.toString(),
      hotWaterUnitPrice: building.hotWaterUnitPrice?.toString() || ''
    });
    setShowEditModal(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingBuilding) return;

    const updateData: UpdateBuildingRequest = {
      id: editingBuilding.id,
      buildingName: editForm.buildingName,
      landlordName: editForm.landlordName,
      electricityUnitPrice: parseFloat(editForm.electricityUnitPrice),
      waterUnitPrice: parseFloat(editForm.waterUnitPrice),
      hotWaterUnitPrice: editForm.hotWaterUnitPrice ? parseFloat(editForm.hotWaterUnitPrice) : undefined,
      rentCollectionMethod: editingBuilding.rentCollectionMethod
    };

    console.log('🔄 开始更新楼宇:', updateData);

    buildingService.updateBuilding(updateData).subscribe({
      next: (updatedBuilding) => {
        console.log('✅ 楼宇更新成功:', updatedBuilding);
        showToast.success('更新成功', `楼宇"${updatedBuilding.buildingName}"已更新`);

        // 立即更新UI中的楼宇信息（乐观更新）
        const updatedBuildings = buildings.map(building =>
          building.id === updatedBuilding.id ? updatedBuilding : building
        );
        setBuildings(updatedBuildings);
        console.log('🔄 乐观更新：已更新UI中的楼宇信息');

        setShowEditModal(false);
        setEditingBuilding(null);

        // 延迟刷新确保数据同步
        setTimeout(() => {
          console.log('🔄 重新获取最新楼宇列表');
          fetchBuildings(true); // 使用刷新模式
        }, 1000);
      },
      error: (error) => {
        console.error('❌ 更新楼宇失败:', error);
        showToast.error('更新失败', error.message || '更新楼宇时发生错误，请重试');
      }
    });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingBuilding(null);
    setEditForm({
      buildingName: '',
      landlordName: '',
      electricityUnitPrice: '',
      waterUnitPrice: '',
      hotWaterUnitPrice: ''
    });
  };

  // 渲染楼宇卡片
  const renderBuildingCard = (building: Building, index: number) => (
    <View key={building.id || index} className="bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100">
      {/* 楼宇标题 */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-bold text-gray-800">{building.buildingName}</Text>
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-800 text-sm font-medium">ID: {building.id}</Text>
        </View>
      </View>
      
      {/* 房东信息 */}
      <View className="mb-3">
        <Text className="text-gray-600 mb-1">👤 房东: {building.landlordName}</Text>
      </View>
      
      {/* 费用信息 */}
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <Text className="text-gray-700 font-medium mb-2">💰 费用标准</Text>
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-green-100 px-2 py-1 rounded">
            <Text className="text-green-800 text-sm">⚡ 电费: ¥{building.electricityUnitPrice}/度</Text>
          </View>
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-800 text-sm">💧 水费: ¥{building.waterUnitPrice}/吨</Text>
          </View>
          {building.hotWaterUnitPrice && (
            <View className="bg-orange-100 px-2 py-1 rounded">
              <Text className="text-orange-800 text-sm">🔥 热水: ¥{building.hotWaterUnitPrice}/吨</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 成本信息（如果有） */}
      {(building.electricityCost || building.waterCost || building.hotWaterCost) && (
        <View className="bg-yellow-50 rounded-lg p-3 mb-3">
          <Text className="text-yellow-700 font-medium mb-2">📊 成本信息</Text>
          <View className="flex-row flex-wrap gap-2">
            {building.electricityCost && (
              <Text className="text-yellow-800 text-sm">⚡ 电费成本: ¥{building.electricityCost}/度</Text>
            )}
            {building.waterCost && (
              <Text className="text-yellow-800 text-sm">💧 水费成本: ¥{building.waterCost}/吨</Text>
            )}
            {building.hotWaterCost && (
              <Text className="text-yellow-800 text-sm">🔥 热水成本: ¥{building.hotWaterCost}/吨</Text>
            )}
          </View>
        </View>
      )}
      
      {/* 收租方式和操作按钮 */}
      <View className="mb-3">
        <Text className="text-gray-600">
          📅 收租方式: {building.rentCollectionMethod === 'FIXED_MONTH_START' ? '固定月初' : '其他方式'}
        </Text>
      </View>

      {/* 操作按钮 */}
      <View className="flex-row justify-between items-center gap-4">
        {/* <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg flex-1 mr-2">
          <Text className="text-white text-sm font-medium text-center">查看详情</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-lg flex-1 mr-2"
          onPress={() => handleEditBuilding(building)}
        >
          <Text className="text-white text-sm font-medium text-center">编辑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded-lg flex-1"
          onPress={() => handleDeleteBuilding(building)}
        >
          <Text className="text-white text-sm font-medium text-center">删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">楼宇管理</Text>
            <Text className="text-gray-500">共 {buildings.length} 个楼宇</Text>
          </View>
          <View className="flex-row space-x-2 gap-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('Main')}
              className="bg-gray-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">返回</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fetchBuildings(true)}
              disabled={refreshing}
              className={`px-3 py-2 rounded-lg ${refreshing ? 'bg-gray-400' : 'bg-green-500'}`}
            >
              <Text className="text-white font-medium text-sm">
                {refreshing ? '刷新中...' : '🔄 刷新'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateBuilding')}
              className="bg-blue-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">+ 新建</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 操作说明 */}
      <View className="bg-blue-50 px-6 py-3 border-b border-blue-100">
        <TouchableOpacity
          onPress={() => setShowOperationGuide(!showOperationGuide)}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-blue-700 mr-2">
              📖 操作说明
            </Text>
          </View>
          <Text className="text-base text-blue-600">
            {showOperationGuide ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {showOperationGuide && (
          <View className="mt-3 bg-white rounded-lg p-4 border border-blue-200">
            <Text className="text-sm font-semibold text-gray-800 mb-2">🏢 楼宇管理操作指南</Text>

            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">➕ 新建楼宇：</Text>
              <Text className="text-xs text-gray-600 leading-4 ml-2">
                • 点击右上角"+ 新建"按钮创建新楼宇{'\n'}
                • 填写楼宇名称、房东信息和费用标准{'\n'}
                • 设置电费、水费、热水费单价
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">✏️ 编辑楼宇：</Text>
              <Text className="text-xs text-gray-600 leading-4 ml-2">
                • 点击楼宇卡片中的"编辑"按钮{'\n'}
                • 修改楼宇基本信息和费用标准{'\n'}
                • 保存后立即生效
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm font-medium text-gray-700 mb-1">🏠 管理房间：</Text>
              <Text className="text-xs text-gray-600 leading-4 ml-2">
                • 点击"查看房间"按钮进入房间管理{'\n'}
                • 可查看该楼宇下的所有房间{'\n'}
                • 支持新建、编辑房间信息
              </Text>
            </View>

            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-1">🗑️ 删除楼宇：</Text>
              <Text className="text-xs text-gray-600 leading-4 ml-2">
                • 点击"删除"按钮移除楼宇{'\n'}
                • 删除前会确认操作{'\n'}
                • 注意：删除楼宇会同时删除其下所有房间
              </Text>
            </View>

            <View className="bg-yellow-50 p-2 rounded border border-yellow-200 mt-2">
              <Text className="text-xs text-yellow-800">
                💡 提示：建议先创建楼宇，再添加房间，最后进行抄表管理
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 内容区域 */}
      <ScrollView 
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* 加载状态 */}
        {loading && (
          <View className="flex-row items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="ml-3 text-gray-600 text-lg">正在获取楼宇列表...</Text>
          </View>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
            <Text className="text-red-800 font-bold text-lg mb-2">❌ 获取失败</Text>
            <Text className="text-red-600 mb-4">{error}</Text>
            <TouchableOpacity 
              onPress={() => fetchBuildings()}
              className="bg-red-500 px-6 py-3 rounded-lg self-start"
            >
              <Text className="text-white font-medium">重新获取</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 楼宇列表 */}
        {!loading && !error && buildings.length > 0 && (
          <>
            {buildings.map(renderBuildingCard)}
          </>
        )}

        {/* 空状态 */}
        {!loading && !error && buildings.length === 0 && (
          <View className="py-16 items-center">
            <Text className="text-8xl mb-6">🏢</Text>
            <Text className="text-gray-600 text-xl font-bold mb-2">暂无楼宇数据</Text>
            <Text className="text-gray-500 text-center mb-6 px-8">
              还没有创建任何楼宇，点击下方按钮创建您的第一个楼宇吧！
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('CreateBuilding')}
              className="bg-blue-500 px-8 py-4 rounded-xl"
            >
              <Text className="text-white font-bold text-lg">🏗️ 创建第一个楼宇</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 底部间距 */}
        <View className="h-8" />
      </ScrollView>

      {/* 编辑楼宇Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl p-5 w-full max-w-sm max-h-4/5">
            <Text className="text-xl font-bold mb-5 text-center">
              编辑楼宇信息
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 楼宇名称 */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-1 text-gray-700">
                  楼宇名称 *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  value={editForm.buildingName}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, buildingName: text }))}
                  placeholder="请输入楼宇名称"
                />
              </View>

              {/* 房东姓名 */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-1 text-gray-700">
                  房东姓名 *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  value={editForm.landlordName}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, landlordName: text }))}
                  placeholder="请输入房东姓名"
                />
              </View>

              {/* 电费单价 */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-1 text-gray-700">
                  电费单价 (元/度) *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  value={editForm.electricityUnitPrice}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, electricityUnitPrice: text }))}
                  placeholder="请输入电费单价"
                  keyboardType="numeric"
                />
              </View>

              {/* 水费单价 */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-1 text-gray-700">
                  水费单价 (元/吨) *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  value={editForm.waterUnitPrice}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, waterUnitPrice: text }))}
                  placeholder="请输入水费单价"
                  keyboardType="numeric"
                />
              </View>

              {/* 热水单价 */}
              <View className="mb-5">
                <Text className="text-base font-semibold mb-1 text-gray-700">
                  热水单价 (元/吨)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  value={editForm.hotWaterUnitPrice}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, hotWaterUnitPrice: text }))}
                  placeholder="请输入热水单价（可选）"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            {/* 操作按钮 */}
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className="flex-1 bg-gray-500 p-4 rounded-lg items-center"
                onPress={handleCancelEdit}
              >
                <Text className="text-white text-base font-semibold">
                  取消
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-blue-500 p-4 rounded-lg items-center"
                onPress={handleSaveEdit}
              >
                <Text className="text-white text-base font-semibold">
                  保存
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
