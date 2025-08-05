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
import { billService } from '../../services/billService';
import { BillDetail, BillStatus, PaymentRecord, BILL_STATUS_OPTIONS, BILL_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../types/bill';

interface BillDetailScreenProps {}

const BillDetailScreen: React.FC<BillDetailScreenProps> = () => {
  const navigation = useNavigation();
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
      
      setBill(billDetail);
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

  // 处理支付
  const handlePayBill = () => {
    if (!bill) return;

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
              loadBillDetail();
            } catch (error: any) {
              Alert.alert('错误', error.message || '支付失败');
            }
          }
        }
      ]
    );
  };

  // 处理编辑
  const handleEditBill = () => {
    if (!bill) return;
    navigation.navigate('EditBill' as never, { billId: bill.id } as never);
  };

  // 处理生成电子账单
  const handleGenerateCanvas = () => {
    if (!bill) return;
    navigation.navigate('BillCanvas' as never, { billId: bill.id } as never);
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
            {bill.paidAmount && bill.paidAmount > 0 && (
              <Text className="text-center text-gray-600">
                已支付：{formatAmount(bill.paidAmount)} | 
                剩余：{formatAmount(bill.remainingAmount || (bill.amount - bill.paidAmount))}
              </Text>
            )}
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

            {bill.room && (
              <>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">房间信息</Text>
                  <Text className="text-gray-800 font-medium">
                    {bill.room.roomNumber} · {bill.room.buildingName}
                  </Text>
                </View>
              </>
            )}

            {bill.tenant && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">租户信息</Text>
                <Text className="text-gray-800 font-medium">{bill.tenant.name}</Text>
              </View>
            )}

            {bill.paymentMethod && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">支付方式</Text>
                <Text className="text-gray-800 font-medium">
                  {getPaymentMethodLabel(bill.paymentMethod)}
                </Text>
              </View>
            )}

            {bill.paidAt && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">支付时间</Text>
                <Text className="text-gray-800 font-medium">{formatDateTime(bill.paidAt)}</Text>
              </View>
            )}

            {bill.description && (
              <View>
                <Text className="text-gray-600 mb-1">账单描述</Text>
                <Text className="text-gray-800">{bill.description}</Text>
              </View>
            )}

            {bill.notes && (
              <View>
                <Text className="text-gray-600 mb-1">备注</Text>
                <Text className="text-gray-800">{bill.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 支付记录 */}
        {paymentRecords.length > 0 && (
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
                {record.notes && (
                  <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 底部操作按钮 */}
      <View className="bg-white border-t border-gray-200 p-4">
        {/* 第一行按钮 */}
        <View className="flex-row space-x-3 mb-3">
          {bill.status === BillStatus.PENDING && (
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-lg"
              onPress={handlePayBill}
            >
              <Text className="text-white text-center font-semibold">立即支付</Text>
            </TouchableOpacity>
          )}

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
