import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { billService } from '../../services/billService';
import { BillDetail, BillStatus, PaymentRecord, BILL_STATUS_OPTIONS, BILL_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../types/bill';

type BillDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BillDetail'>;

interface BillDetailScreenProps {}

const BillDetailScreen: React.FC<BillDetailScreenProps> = () => {
  const navigation = useNavigation<BillDetailNavigationProp>();
  const route = useRoute();
  const { billId } = route.params as { billId: number };
  
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载账单详情
  const loadBillDetail = async () => {
    try {
      setLoading(true);
      const [billDetail, payments] = await Promise.all([
        billService.getBillDetail(billId).toPromise(),
        billService.getPaymentRecords(billId).toPromise()
      ]);
      
      setBill(billDetail || null);
      setPaymentRecords(payments || []);
    } catch (error: any) {
      console.error('加载账单详情失败:', error);
      Alert.alert('错误', error.message || '加载账单详情失败');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillDetail();
  }, [billId]);

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

  // 获取类型图标和标签
  const getTypeInfo = (type: string) => {
    const option = BILL_TYPE_OPTIONS.find(opt => opt.value === type);
    return { icon: option?.icon || '📄', label: option?.label || type };
  };

  // 获取支付方式标签
  const getPaymentMethodLabel = (method: string) => {
    const option = PAYMENT_METHOD_OPTIONS.find(opt => opt.value === method);
    return option?.label || method;
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 条件渲染辅助函数
  const renderIfExists = (condition: any, component: React.ReactNode) => {
    return condition ? component : null;
  };

  // 渲染费用项目
  const renderFeeItem = (amount: number | undefined, label: string, usage?: number, unit?: string) => {
    if (!amount || amount <= 0) return null;

    const usageText = usage && unit ? ` (${usage} ${unit})` : '';
    return (
      <View className="flex-row justify-between">
        <Text className="text-gray-600">{label}{usageText}</Text>
        <Text className="text-gray-800 font-medium">{formatAmount(amount)}</Text>
      </View>
    );
  };

  // 渲染信息项目
  const renderInfoItem = (value: any, label: string, formatter?: (value: any) => string) => {
    if (!value) return null;

    const displayValue = formatter ? formatter(value) : value;
    return (
      <View className="flex-row justify-between">
        <Text className="text-gray-600">{label}</Text>
        <Text className="text-gray-800 font-medium">{displayValue}</Text>
      </View>
    );
  };

  // 渲染描述项目
  const renderDescriptionItem = (value: string | undefined, label: string) => {
    if (!value) return null;

    return (
      <View>
        <Text className="text-gray-600 mb-1">{label}</Text>
        <Text className="text-gray-800">{value}</Text>
      </View>
    );
  };



  // 处理编辑
  const handleEditBill = () => {
    if (!bill) return;
    navigation.navigate('EditBill', { billId: bill.id });
  };

  // 处理生成电子账单
  const handleGenerateCanvas = () => {
    if (!bill) return;
    navigation.navigate('BillCanvas', { billId: bill.id });
  };

  // 处理删除
  const handleDeleteBill = () => {
    if (!bill) return;

    Alert.alert(
      '确认删除',
      `确定要删除账单"${bill.title}"吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await billService.deleteBill(bill.id).toPromise();
              Alert.alert('成功', '账单删除成功！');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('错误', error.message || '删除失败');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">加载账单详情中...</Text>
      </View>
    );
  }

  if (!bill) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">账单不存在</Text>
      </View>
    );
  }

  const typeInfo = getTypeInfo(bill.billType);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 账单基本信息 */}
        <View className="bg-white m-4 p-6 rounded-xl shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <Text className="text-2xl mr-3">{typeInfo.icon}</Text>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">{bill.title}</Text>
                <Text className="text-sm text-gray-600">{typeInfo.label}</Text>
              </View>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(bill.status) + '20' }}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: getStatusColor(bill.status) }}
              >
                {getStatusLabel(bill.status)}
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              {formatAmount(bill.amount)}
            </Text>
            {renderIfExists(bill.paidAmount && bill.paidAmount > 0, (
              <Text className="text-center text-gray-600">
                已支付：{formatAmount(bill.paidAmount || 0)} |
                剩余：{formatAmount(bill.remainingAmount || (bill.amount - (bill.paidAmount || 0)))}
              </Text>
            ))}
          </View>
        </View>

        {/* 费用明细 */}
        <View className="bg-white m-4 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">费用明细</Text>

          {/* 调试信息 - 开发环境显示 */}
          {renderIfExists(__DEV__, (
            <View className="bg-yellow-100 p-2 mb-4 rounded">
              <Text className="text-xs text-gray-600">调试信息:</Text>
              <Text className="text-xs text-gray-600">rent: {bill.rent}</Text>
              <Text className="text-xs text-gray-600">deposit: {bill.deposit}</Text>
              <Text className="text-xs text-gray-600">electricityUsage: {bill.electricityUsage}</Text>
              <Text className="text-xs text-gray-600">waterUsage: {bill.waterUsage}</Text>
            </View>
          ))}

          <View className="space-y-3">
            {renderFeeItem(bill.rent, '房租')}
            {renderFeeItem(bill.deposit, '押金')}
            {renderFeeItem(
              bill.electricityAmount || ((bill.electricityUsage || 0) * (bill.room?.electricityUnitPrice || 0)),
              '电费',
              bill.electricityUsage,
              '度'
            )}
            {renderFeeItem(
              bill.waterAmount || ((bill.waterUsage || 0) * (bill.room?.waterUnitPrice || 0)),
              '水费',
              bill.waterUsage,
              '吨'
            )}
            {renderFeeItem(
              bill.hotWaterAmount || ((bill.hotWaterUsage || 0) * (bill.room?.hotWaterUnitPrice || 0)),
              '热水费',
              bill.hotWaterUsage,
              '吨'
            )}
            {renderFeeItem(
              bill.otherFees,
              `其他费用${bill.otherFeesDescription ? ` (${bill.otherFeesDescription})` : ''}`
            )}

            <View className="border-t border-gray-200 pt-3 mt-3">
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-gray-800">总计</Text>
                <Text className="text-lg font-bold text-blue-600">{formatAmount(bill.amount)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 账单详情 */}
        <View className="bg-white m-4 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">账单详情</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">账单编号</Text>
              <Text className="text-gray-800 font-medium">{bill.billNumber}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">账单周期</Text>
              <Text className="text-gray-800 font-medium">{bill.billPeriod}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">到期日期</Text>
              <Text className="text-gray-800 font-medium">{formatDate(bill.dueDate)}</Text>
            </View>

            {renderInfoItem(
              bill.room ? `${bill.room.roomNumber} · ${bill.room.buildingName}` : null,
              '房间信息'
            )}
            {renderInfoItem(bill.tenant?.name, '租户信息')}
            {renderInfoItem(bill.paymentMethod, '支付方式', getPaymentMethodLabel)}
            {renderInfoItem(bill.paidAt, '支付时间', formatDateTime)}
            {renderDescriptionItem(bill.description, '账单描述')}
            {renderDescriptionItem(bill.notes, '备注')}
          </View>
        </View>

        {/* 支付记录 */}
        {renderIfExists(paymentRecords.length > 0, (
          <View className="bg-white m-4 p-4 rounded-xl shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">支付记录</Text>
            {paymentRecords.map((record, index) => (
              <View key={record.id} className={`${index > 0 ? 'border-t border-gray-200 pt-3' : ''} pb-3`}>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-medium text-gray-800">
                      {formatAmount(record.amount)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {getPaymentMethodLabel(record.paymentMethod)}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600">
                    {formatDateTime(record.paymentDate)}
                  </Text>
                </View>
                {renderIfExists(record.notes, (
                  <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* 底部操作按钮 */}
      <View className="bg-white border-t border-gray-200 p-4">
        {/* 第一行按钮 */}
        <View className="flex-row space-x-3 mb-3 gap-2">
        

          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-lg"
            onPress={handleEditBill}
          >
            <Text className="text-white text-center font-semibold">编辑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-red-500 py-3 rounded-lg"
            onPress={handleDeleteBill}
          >
            <Text className="text-white text-center font-semibold">删除</Text>
          </TouchableOpacity>
        </View>

        {/* 第二行按钮 */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-purple-500 py-3 rounded-lg"
            onPress={handleGenerateCanvas}
          >
            <Text className="text-white text-center font-semibold">🎨 生成电子账单</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BillDetailScreen;
