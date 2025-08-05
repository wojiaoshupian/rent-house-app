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
import { EstimatedBill, EstimatedBillStatus, ESTIMATED_BILL_STATUS_OPTIONS } from '../../types/bill';
import { useUser } from '../../contexts/UserContext';
import { catchError, of } from 'rxjs';
import { EstimatedBillEditForm } from '../../components/EstimatedBillEditForm';

interface EstimatedBillListScreenProps {}

const EstimatedBillListScreen: React.FC<EstimatedBillListScreenProps> = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [bills, setBills] = useState<EstimatedBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EstimatedBillStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 编辑表单状态
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<EstimatedBill | null>(null);

  // 加载预估账单列表
  const loadEstimatedBills = async (showLoading = true, page = 0) => {
    try {
      if (showLoading) setLoading(true);

      const params: any = {
        page,
        size: 10,
      };
      if (selectedStatus !== 'ALL') params.billStatus = selectedStatus;

      const response = await billService.getEstimatedBills(params).toPromise();
      
      if (page === 0) {
        setBills(response.data);
      } else {
        setBills(prev => [...prev, ...response.data]);
      }
      
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('加载预估账单列表失败:', error);
      Alert.alert('错误', error.message || '加载预估账单列表失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    loadEstimatedBills(false, 0);
  };

  // 加载更多
  const loadMore = () => {
    if (currentPage + 1 < totalPages) {
      loadEstimatedBills(false, currentPage + 1);
    }
  };

  // 初始加载
  useEffect(() => {
    loadEstimatedBills();
  }, [selectedStatus]);

  // 获取状态颜色
  const getStatusColor = (status: EstimatedBillStatus) => {
    const option = ESTIMATED_BILL_STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.color || '#6b7280';
  };

  // 获取状态标签
  const getStatusLabel = (status: EstimatedBillStatus) => {
    const option = ESTIMATED_BILL_STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || status;
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 验证费用计算是否正确
  const validateBillCalculation = (bill: EstimatedBill) => {
    const calculatedElectricityAmount = bill.electricityUsage * bill.electricityUnitPrice;
    const calculatedWaterAmount = bill.waterUsage * bill.waterUnitPrice;
    const calculatedHotWaterAmount = bill.hotWaterUsage * bill.hotWaterUnitPrice;

    const electricityDiff = Math.abs(calculatedElectricityAmount - bill.electricityAmount);
    const waterDiff = Math.abs(calculatedWaterAmount - bill.waterAmount);
    const hotWaterDiff = Math.abs(calculatedHotWaterAmount - bill.hotWaterAmount);

    // 允许小数点精度误差
    const tolerance = 0.01;

    return {
      electricityCorrect: electricityDiff < tolerance,
      waterCorrect: waterDiff < tolerance,
      hotWaterCorrect: hotWaterDiff < tolerance,
      calculatedElectricityAmount,
      calculatedWaterAmount,
      calculatedHotWaterAmount
    };
  };

  // 处理账单点击
  const handleBillPress = (bill: EstimatedBill) => {
    navigation.navigate('BillDetail' as never, { billId: bill.id } as never);
  };

  // 处理删除预估账单
  const handleDeleteBill = (bill: EstimatedBill) => {
    Alert.alert(
      '确认删除',
      `确定要删除房间"${bill.roomNumber}"的${bill.billMonth}预估账单吗？\n\n总金额：¥${bill.totalAmount.toFixed(2)}\n\n⚠️ 此操作不可恢复，请谨慎操作！`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            billService.deleteEstimatedBill(bill.id).pipe(
              catchError((error) => {
                console.error('删除预估账单失败:', error);
                Alert.alert('删除失败', error.message || '删除预估账单失败，请重试');
                return of(null);
              })
            ).subscribe({
              next: (result) => {
                if (result !== null) {
                  console.log('✅ 预估账单删除成功:', bill.id);
                  Alert.alert('删除成功', `房间"${bill.roomNumber}"的${bill.billMonth}预估账单已删除`);
                  // 刷新账单列表
                  loadEstimatedBills(false, 0);
                }
                setLoading(false);
              },
              error: (error) => {
                console.error('RxJS错误:', error);
                setLoading(false);
                Alert.alert('删除失败', '网络请求失败，请检查网络连接');
              }
            });
          }
        }
      ]
    );
  };

  // 处理编辑预估账单 - 导航到编辑页面
  const handleEditBill = (bill: EstimatedBill) => {
    navigation.navigate('EstimatedBillEdit', { billId: bill.id });
  };

  // 处理表单保存
  const handleFormSave = (updateData: any) => {
    if (!editingBill) return;

    setLoading(true);
    billService.updateEstimatedBill(editingBill.id, updateData).pipe(
      catchError((error) => {
        console.error('更新预估账单失败:', error);
        Alert.alert('更新失败', error.message || '更新预估账单失败，请重试');
        return of(null);
      })
    ).subscribe({
      next: (updatedBill) => {
        if (updatedBill) {
          console.log('✅ 预估账单更新成功:', updatedBill);
          Alert.alert('更新成功', '预估账单已更新');
          // 关闭表单
          setEditFormVisible(false);
          setEditingBill(null);
          // 刷新账单列表
          loadEstimatedBills(false, currentPage);
        }
        setLoading(false);
      },
      error: (error) => {
        console.error('RxJS错误:', error);
        setLoading(false);
        Alert.alert('更新失败', '网络请求失败，请检查网络连接');
      }
    });
  };

  // 处理表单关闭
  const handleFormClose = () => {
    setEditFormVisible(false);
    setEditingBill(null);
  };

  // 编辑房租
  const editRent = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑房租',
      `当前房租：¥${bill.rent.toFixed(2)}\n\n请输入新的房租金额：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newRent) => {
            if (newRent && !isNaN(parseFloat(newRent))) {
              const rent = parseFloat(newRent);
              if (rent >= 0) {
                updateBillField(bill, { rent }, `房租已更新为¥${rent.toFixed(2)}`);
              } else {
                Alert.alert('输入错误', '房租金额不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      bill.rent.toString()
    );
  };

  // 编辑押金
  const editDeposit = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑押金',
      `当前押金：¥${bill.deposit?.toFixed(2) || '0.00'}\n\n请输入新的押金金额：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newDeposit) => {
            if (newDeposit && !isNaN(parseFloat(newDeposit))) {
              const deposit = parseFloat(newDeposit);
              if (deposit >= 0) {
                updateBillField(bill, { deposit }, `押金已更新为¥${deposit.toFixed(2)}`);
              } else {
                Alert.alert('输入错误', '押金金额不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      (bill.deposit || 0).toString()
    );
  };

  // 编辑用量
  const editUsage = (bill: EstimatedBill) => {
    Alert.alert(
      '编辑用量',
      '选择要编辑的用量类型：',
      [
        { text: '取消', style: 'cancel' },
        { text: '电费用量', onPress: () => editElectricityUsage(bill) },
        { text: '水费用量', onPress: () => editWaterUsage(bill) },
        { text: '热水用量', onPress: () => editHotWaterUsage(bill) }
      ]
    );
  };

  // 编辑电费用量
  const editElectricityUsage = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑电费用量',
      `当前用量：${bill.electricityUsage}度\n单价：¥${bill.electricityUnitPrice.toFixed(2)}/度\n\n请输入新的用量：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newUsage) => {
            if (newUsage && !isNaN(parseFloat(newUsage))) {
              const usage = parseFloat(newUsage);
              if (usage >= 0) {
                updateBillField(bill, { electricityUsage: usage }, `电费用量已更新为${usage}度`);
              } else {
                Alert.alert('输入错误', '用量不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      bill.electricityUsage.toString()
    );
  };

  // 编辑水费用量
  const editWaterUsage = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑水费用量',
      `当前用量：${bill.waterUsage}吨\n单价：¥${bill.waterUnitPrice.toFixed(2)}/吨\n\n请输入新的用量：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newUsage) => {
            if (newUsage && !isNaN(parseFloat(newUsage))) {
              const usage = parseFloat(newUsage);
              if (usage >= 0) {
                updateBillField(bill, { waterUsage: usage }, `水费用量已更新为${usage}吨`);
              } else {
                Alert.alert('输入错误', '用量不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      bill.waterUsage.toString()
    );
  };

  // 编辑热水用量
  const editHotWaterUsage = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑热水用量',
      `当前用量：${bill.hotWaterUsage}吨\n单价：¥${bill.hotWaterUnitPrice.toFixed(2)}/吨\n\n请输入新的用量：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newUsage) => {
            if (newUsage && !isNaN(parseFloat(newUsage))) {
              const usage = parseFloat(newUsage);
              if (usage >= 0) {
                updateBillField(bill, { hotWaterUsage: usage }, `热水用量已更新为${usage}吨`);
              } else {
                Alert.alert('输入错误', '用量不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      bill.hotWaterUsage.toString()
    );
  };

  // 编辑杂项费用
  const editOtherFees = (bill: EstimatedBill) => {
    Alert.alert(
      '编辑杂项费用',
      '选择编辑操作：',
      [
        { text: '取消', style: 'cancel' },
        { text: '编辑金额', onPress: () => editOtherFeesAmount(bill) },
        { text: '编辑说明', onPress: () => editOtherFeesDescription(bill) }
      ]
    );
  };

  // 编辑杂项费用金额
  const editOtherFeesAmount = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑杂项费用金额',
      `当前杂项费用：¥${bill.otherFees?.toFixed(2) || '0.00'}\n\n请输入新的杂项费用金额：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newAmount) => {
            if (newAmount && !isNaN(parseFloat(newAmount))) {
              const amount = parseFloat(newAmount);
              if (amount >= 0) {
                updateBillField(bill, { otherFees: amount }, `杂项费用已更新为¥${amount.toFixed(2)}`);
              } else {
                Alert.alert('输入错误', '杂项费用不能为负数');
              }
            } else {
              Alert.alert('输入错误', '请输入有效的数字');
            }
          }
        }
      ],
      'plain-text',
      (bill.otherFees || 0).toString()
    );
  };

  // 编辑杂项费用说明
  const editOtherFeesDescription = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑杂项费用说明',
      `当前说明：${bill.otherFeesDescription || '无'}\n\n请输入新的费用说明：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newDescription) => {
            const description = newDescription?.trim() || '';
            updateBillField(bill, { otherFeesDescription: description }, '杂项费用说明已更新');
          }
        }
      ],
      'plain-text',
      bill.otherFeesDescription || ''
    );
  };

  // 编辑账单状态
  const editStatus = (bill: EstimatedBill) => {
    const statusOptions = [
      { label: '已生成', value: 'GENERATED' },
      { label: '已确认', value: 'CONFIRMED' },
      { label: '已发送', value: 'SENT' },
      { label: '已支付', value: 'PAID' },
      { label: '已逾期', value: 'OVERDUE' },
      { label: '已取消', value: 'CANCELLED' }
    ];

    const buttons = statusOptions
      .filter(option => option.value !== bill.billStatus)
      .map(option => ({
        text: option.label,
        onPress: () => updateBillField(bill, { billStatus: option.value }, `账单状态已更新为"${option.label}"`)
      }));

    buttons.push({ text: '取消', onPress: () => {}, style: 'cancel' });

    Alert.alert(
      '编辑账单状态',
      `当前状态：${bill.billStatusDescription}\n\n选择新的状态：`,
      buttons
    );
  };

  // 编辑备注
  const editNotes = (bill: EstimatedBill) => {
    Alert.prompt(
      '编辑备注',
      `当前备注：${bill.notes || '无'}\n\n请输入新的备注信息：`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '更新',
          onPress: (newNotes) => {
            const notes = newNotes?.trim() || '';
            updateBillField(bill, { notes }, '备注信息已更新');
          }
        }
      ],
      'plain-text',
      bill.notes || ''
    );
  };

  // 通用的字段更新方法
  const updateBillField = (bill: EstimatedBill, updateData: any, successMessage: string) => {
    setLoading(true);

    billService.updateEstimatedBill(bill.id, updateData).pipe(
      catchError((error) => {
        console.error('更新预估账单失败:', error);
        Alert.alert('更新失败', error.message || '更新预估账单失败，请重试');
        return of(null);
      })
    ).subscribe({
      next: (updatedBill) => {
        if (updatedBill) {
          console.log('✅ 预估账单更新成功:', updatedBill);
          Alert.alert('更新成功', successMessage);
          // 刷新账单列表
          loadEstimatedBills(false, 0);
        }
        setLoading(false);
      },
      error: (error) => {
        console.error('RxJS错误:', error);
        setLoading(false);
        Alert.alert('更新失败', '网络请求失败，请检查网络连接');
      }
    });
  };

  // 更新账单金额（保留原有方法，用于向后兼容）
  const updateBillAmount = (bill: EstimatedBill, newAmount: number) => {
    setLoading(true);

    // 计算比例调整各项费用
    const ratio = newAmount / bill.totalAmount;
    const updateData = {
      rent: bill.rent * ratio,
      electricityUsage: bill.electricityUsage,
      waterUsage: bill.waterUsage,
      hotWaterUsage: bill.hotWaterUsage,
      otherFees: bill.otherFees * ratio,
      notes: `${bill.notes || ''} [金额已调整为¥${newAmount.toFixed(2)}]`.trim()
    };

    billService.updateEstimatedBill(bill.id, updateData).pipe(
      catchError((error) => {
        console.error('更新预估账单失败:', error);
        Alert.alert('更新失败', error.message || '更新预估账单失败，请重试');
        return of(null);
      })
    ).subscribe({
      next: (updatedBill) => {
        if (updatedBill) {
          console.log('✅ 预估账单更新成功:', updatedBill);
          Alert.alert('更新成功', `账单金额已更新为¥${newAmount.toFixed(2)}`);
          // 刷新账单列表
          loadEstimatedBills(false, 0);
        }
        setLoading(false);
      },
      error: (error) => {
        console.error('RxJS错误:', error);
        setLoading(false);
        Alert.alert('更新失败', '网络请求失败，请检查网络连接');
      }
    });
  };

  // 确认账单
  const confirmBill = (bill: EstimatedBill) => {
    if (bill.billStatus !== 'GENERATED') {
      Alert.alert('提示', '只有已生成状态的账单才能确认');
      return;
    }

    Alert.alert(
      '确认账单',
      `确定要确认房间"${bill.roomNumber}"的${bill.billMonth}预估账单吗？\n\n总金额：¥${bill.totalAmount.toFixed(2)}\n\n确认后账单状态将变为"已确认"`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => {
            setLoading(true);
            billService.updateEstimatedBill(bill.id, {
              billStatus: 'CONFIRMED',
              notes: `${bill.notes || ''} [账单已确认]`.trim()
            }).pipe(
              catchError((error) => {
                console.error('确认预估账单失败:', error);
                Alert.alert('确认失败', error.message || '确认预估账单失败，请重试');
                return of(null);
              })
            ).subscribe({
              next: (updatedBill) => {
                if (updatedBill) {
                  console.log('✅ 预估账单确认成功:', updatedBill);
                  Alert.alert('确认成功', `房间"${bill.roomNumber}"的${bill.billMonth}预估账单已确认`);
                  // 刷新账单列表
                  loadEstimatedBills(false, 0);
                }
                setLoading(false);
              },
              error: (error) => {
                console.error('RxJS错误:', error);
                setLoading(false);
                Alert.alert('确认失败', '网络请求失败，请检查网络连接');
              }
            });
          }
        }
      ]
    );
  };

  // 渲染筛选器
  const renderFilters = () => (
    <View className="bg-white p-4 border-b border-gray-200">
      <Text className="text-sm font-medium text-gray-700 mb-2">账单状态</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        {ESTIMATED_BILL_STATUS_OPTIONS.map((option) => (
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
    </View>
  );

  // 渲染预估账单项
  const renderBillItem = (bill: EstimatedBill) => (
    <TouchableOpacity
      key={bill.id}
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
      onPress={() => handleBillPress(bill)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg mr-2">📊</Text>
            <Text className="text-lg font-semibold text-gray-800 flex-1">
              {bill.billMonth} 预估账单
            </Text>
          </View>
          <Text className="text-sm text-gray-600">
            房间 {bill.roomNumber} · {bill.buildingName}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {formatAmount(bill.totalAmount)}
          </Text>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(bill.billStatus) + '20' }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: getStatusColor(bill.billStatus) }}
            >
              {getStatusLabel(bill.billStatus)}
            </Text>
          </View>
        </View>
      </View>

      {/* 费用明细 */}
      <View className="bg-gray-50 p-3 rounded-lg mb-3">
        <Text className="text-sm font-medium text-gray-700 mb-2">费用明细</Text>
        <View className="space-y-1">
          {bill.rent > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">房租</Text>
              <Text className="text-sm text-gray-800">{formatAmount(bill.rent)}</Text>
            </View>
          )}
          {bill.electricityAmount > 0 && (
            <View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">
                  电费 ({bill.electricityUsage}度 × ¥{bill.electricityUnitPrice.toFixed(2)})
                </Text>
                <Text className="text-sm text-gray-800">{formatAmount(bill.electricityAmount)}</Text>
              </View>
              {/* 开发模式下显示计算验证 */}
              {__DEV__ && (() => {
                const validation = validateBillCalculation(bill);
                if (!validation.electricityCorrect) {
                  return (
                    <Text className="text-xs text-red-500 mt-1">
                      ⚠️ 计算异常: 应为¥{validation.calculatedElectricityAmount.toFixed(2)}
                    </Text>
                  );
                }
                return null;
              })()}
            </View>
          )}
          {bill.waterAmount > 0 && (
            <View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">
                  水费 ({bill.waterUsage}吨 × ¥{bill.waterUnitPrice.toFixed(2)})
                </Text>
                <Text className="text-sm text-gray-800">{formatAmount(bill.waterAmount)}</Text>
              </View>
              {/* 开发模式下显示计算验证 */}
              {__DEV__ && (() => {
                const validation = validateBillCalculation(bill);
                if (!validation.waterCorrect) {
                  return (
                    <Text className="text-xs text-red-500 mt-1">
                      ⚠️ 计算异常: 应为¥{validation.calculatedWaterAmount.toFixed(2)}
                    </Text>
                  );
                }
                return null;
              })()}
            </View>
          )}
          {bill.hotWaterAmount > 0 && (
            <View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">
                  热水费 ({bill.hotWaterUsage}吨 × ¥{bill.hotWaterUnitPrice.toFixed(2)})
                </Text>
                <Text className="text-sm text-gray-800">{formatAmount(bill.hotWaterAmount)}</Text>
              </View>
              {/* 开发模式下显示计算验证 */}
              {__DEV__ && (() => {
                const validation = validateBillCalculation(bill);
                if (!validation.hotWaterCorrect) {
                  return (
                    <Text className="text-xs text-red-500 mt-1">
                      ⚠️ 计算异常: 应为¥{validation.calculatedHotWaterAmount.toFixed(2)}
                    </Text>
                  );
                }
                return null;
              })()}
            </View>
          )}
          {bill.otherFees > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">其他费用</Text>
              <Text className="text-sm text-gray-800">{formatAmount(bill.otherFees)}</Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">
          账单日期：{formatDate(bill.billDate)}
        </Text>

        <View className="flex-row space-x-2">
          {/* 编辑按钮 - 所有状态都可以编辑 */}
          <TouchableOpacity
            className="bg-blue-500 px-3 py-2 rounded-lg"
            onPress={(e) => {
              e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
              handleEditBill(bill);
            }}
          >
            <Text className="text-white text-xs font-medium">✏️ 编辑</Text>
          </TouchableOpacity>

          {/* 删除按钮 - 所有状态都可以删除 */}
          <TouchableOpacity
            className="bg-red-500 px-3 py-2 rounded-lg"
            onPress={(e) => {
              e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
              handleDeleteBill(bill);
            }}
          >
            <Text className="text-white text-xs font-medium">🗑️ 删除</Text>
          </TouchableOpacity>

          {/* 确认按钮 - 只有已生成状态才显示 */}
          {bill.billStatus === EstimatedBillStatus.GENERATED && (
            <TouchableOpacity
              className="bg-green-500 px-3 py-2 rounded-lg"
              onPress={(e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
                confirmBill(bill);
              }}
            >
              <Text className="text-white text-xs font-medium">✅ 确认</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && bills.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">加载预估账单中...</Text>
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
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && !loading && currentPage + 1 < totalPages) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View className="py-4">
          {bills.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📊</Text>
              <Text className="text-lg font-medium text-gray-800 mb-2">暂无预估账单</Text>
              <Text className="text-gray-600 text-center px-8">
                当前筛选条件下没有找到预估账单记录
              </Text>
            </View>
          ) : (
            <>
              {bills.map(renderBillItem)}
              
              {/* 加载更多指示器 */}
              {loading && bills.length > 0 && (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text className="mt-2 text-gray-600">加载更多...</Text>
                </View>
              )}
              
              {/* 没有更多数据提示 */}
              {currentPage + 1 >= totalPages && bills.length > 0 && (
                <View className="py-4 items-center">
                  <Text className="text-gray-500">没有更多数据了</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* 编辑表单 */}
      {editingBill && (
        <EstimatedBillEditForm
          bill={editingBill}
          visible={editFormVisible}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </View>
  );
};

export default EstimatedBillListScreen;
