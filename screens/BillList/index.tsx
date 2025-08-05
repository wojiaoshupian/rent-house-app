import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { billService } from '../../services/billService';
import { Bill, BillStatus, BillType, BILL_STATUS_OPTIONS, BILL_TYPE_OPTIONS } from '../../types/bill';
import { useUser } from '../../contexts/UserContext';

interface BillListScreenProps {}

const BillListScreen: React.FC<BillListScreenProps> = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<BillType | 'ALL'>('ALL');

  // 加载账单列表
  const loadBills = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const params: any = {};
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (selectedType !== 'ALL') params.billType = selectedType;

      const billList = await billService.getBillList(params).toPromise();
      setBills(billList || []);
    } catch (error: any) {
      console.error('加载账单列表失败:', error);
      Alert.alert('错误', error.message || '加载账单列表失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    loadBills(false);
  };

  // 初始加载
  useEffect(() => {
    loadBills();
  }, [selectedStatus, selectedType]);

  // 获取状态颜色
  const getStatusColor = (status: BillStatus) => {
    const option = BILL_STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.color || '#6b7280';
  };

  // 获取状态标签
  const getStatusLabel = (status: BillStatus) => {
    const option = BILL_STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || status;
  };

  // 获取类型图标
  const getTypeIcon = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.icon || '📄';
  };

  // 获取类型标签
  const getTypeLabel = (type: BillType) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return option?.label || type;
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 处理账单点击
  const handleBillPress = (bill: Bill) => {
    navigation.navigate('BillDetail' as never, { billId: bill.id } as never);
  };

  // 处理支付
  const handlePayBill = async (bill: Bill) => {
    Alert.alert(
      '确认支付',
      `确定要支付账单"${bill.title}"吗？\n金额：${formatAmount(bill.amount)}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认支付',
          onPress: async () => {
            try {
              await billService.payBill(bill.id, {
                amount: bill.amount,
                paymentMethod: 'CASH',
                notes: '现金支付'
              }).toPromise();
              
              Alert.alert('成功', '账单支付成功！');
              loadBills(false);
            } catch (error: any) {
              Alert.alert('错误', error.message || '支付失败');
            }
          }
        }
      ]
    );
  };

  // 渲染筛选器
  const renderFilters = () => (
    <View className="bg-white p-4 border-b border-gray-200">
      {/* 状态筛选 */}
      <Text className="text-sm font-medium text-gray-700 mb-2">账单状态</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <TouchableOpacity
          className={`mr-2 px-3 py-1 rounded-full ${
            selectedStatus === 'ALL' ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedStatus('ALL')}
        >
          <Text className={`text-sm ${selectedStatus === 'ALL' ? 'text-white' : 'text-gray-700'}`}>
            全部
          </Text>
        </TouchableOpacity>
        {BILL_STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`mr-2 px-3 py-1 rounded-full ${
              selectedStatus === option.value ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedStatus(option.value)}
          >
            <Text className={`text-sm ${selectedStatus === option.value ? 'text-white' : 'text-gray-700'}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 类型筛选 */}
      <Text className="text-sm font-medium text-gray-700 mb-2">账单类型</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          className={`mr-2 px-3 py-1 rounded-full ${
            selectedType === 'ALL' ? 'bg-green-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedType('ALL')}
        >
          <Text className={`text-sm ${selectedType === 'ALL' ? 'text-white' : 'text-gray-700'}`}>
            全部
          </Text>
        </TouchableOpacity>
        {BILL_TYPE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`mr-2 px-3 py-1 rounded-full ${
              selectedType === option.value ? 'bg-green-500' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedType(option.value)}
          >
            <Text className={`text-sm ${selectedType === option.value ? 'text-white' : 'text-gray-700'}`}>
              {option.icon} {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 渲染账单项
  const renderBillItem = (bill: Bill) => (
    <TouchableOpacity
      key={bill.id}
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
      onPress={() => handleBillPress(bill)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg mr-2">{getTypeIcon(bill.billType)}</Text>
            <Text className="text-lg font-semibold text-gray-800 flex-1">
              {bill.title}
            </Text>
          </View>
          <Text className="text-sm text-gray-600">
            {bill.roomNumber ? `房间 ${bill.roomNumber}` : ''}
            {bill.buildingName ? ` · ${bill.buildingName}` : ''}
          </Text>
          {bill.tenantName && (
            <Text className="text-sm text-gray-600">租户：{bill.tenantName}</Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {formatAmount(bill.amount)}
          </Text>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(bill.status) + '20' }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: getStatusColor(bill.status) }}
            >
              {getStatusLabel(bill.status)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-gray-500">
            账单周期：{bill.billPeriod}
          </Text>
          <Text className="text-sm text-gray-500">
            到期日期：{formatDate(bill.dueDate)}
          </Text>
        </View>
        
        {bill.status === BillStatus.PENDING && (
          <TouchableOpacity
            className="bg-green-500 px-4 py-2 rounded-lg"
            onPress={() => handlePayBill(bill)}
          >
            <Text className="text-white text-sm font-medium">立即支付</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">加载账单列表中...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderFilters()}
      
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="py-4">
          {bills.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">💰</Text>
              <Text className="text-lg font-medium text-gray-800 mb-2">暂无账单</Text>
              <Text className="text-gray-600 text-center px-8">
                当前筛选条件下没有找到账单记录
              </Text>
            </View>
          ) : (
            bills.map(renderBillItem)
          )}
        </View>
      </ScrollView>

      {/* 浮动操作按钮 */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('CreateBill' as never)}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillListScreen;
