import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { utilityReadingService } from '../../services/utilityReadingService';
import { UtilityReadingDetail, ReadingStatus, ReadingType } from '../../types/utilityReading';

type UtilityReadingDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UtilityReadingDetail'>;

interface UtilityReadingDetailRouteParams {
  readingId: number;
}

export default function UtilityReadingDetailScreen() {
  const navigation = useNavigation<UtilityReadingDetailNavigationProp>();
  const route = useRoute();
  const params = route.params as UtilityReadingDetailRouteParams;

  // 状态管理
  const [reading, setReading] = useState<UtilityReadingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 组件挂载时获取抄表记录详情
  useEffect(() => {
    if (params.readingId) {
      fetchReadingDetail();
    }
  }, [params.readingId]);

  const fetchReadingDetail = () => {
    setLoading(true);
    setError(null);

    utilityReadingService.getUtilityReadingDetail(params.readingId).subscribe({
      next: (readingDetail) => {
        setReading(readingDetail);
        console.log('✅ 获取抄表记录详情成功:', readingDetail);
      },
      error: (error) => {
        console.error('❌ 获取抄表记录详情失败:', error);
        setError(error.message || '获取抄表记录详情失败');
      },
      complete: () => {
        setLoading(false);
      }
    });
  };

  // 删除抄表记录
  const handleDeleteReading = () => {
    if (!reading) return;

    Alert.alert(
      '确认删除',
      `确定要删除房间"${reading.roomNumber}"在${reading.readingDate}的抄表记录吗？此操作不可恢复。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            utilityReadingService.deleteUtilityReading(reading.id).subscribe({
              next: () => {
                console.log('✅ 删除抄表记录成功');
                Alert.alert('删除成功', '抄表记录已删除', [
                  {
                    text: '确定',
                    onPress: () => navigation.goBack()
                  }
                ]);
              },
              error: (error) => {
                console.error('❌ 删除抄表记录失败:', error);

                // 优先显示接口返回的错误信息
                let errorMessage = '删除抄表记录时发生错误';

                if (error.message) {
                  errorMessage = error.message;
                } else if (error.data?.message) {
                  errorMessage = error.data.message;
                } else if (error.response?.data?.message) {
                  errorMessage = error.response.data.message;
                }

                Alert.alert('删除失败', errorMessage);
              }
            });
          }
        }
      ]
    );
  };

  // 确认抄表记录
  const handleConfirmReading = () => {
    if (!reading) return;

    utilityReadingService.confirmUtilityReading(reading.id).subscribe({
      next: (confirmedReading) => {
        console.log('✅ 确认抄表记录成功');
        setReading({ ...reading, readingStatus: confirmedReading.readingStatus });
        Alert.alert('确认成功', '抄表记录已确认');
      },
      error: (error) => {
        console.error('❌ 确认抄表记录失败:', error);

        // 优先显示接口返回的错误信息
        let errorMessage = '确认抄表记录时发生错误';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Alert.alert('确认失败', errorMessage);
      }
    });
  };

  // 争议标记功能已移除

  // 获取读数状态显示文本和颜色
  const getReadingStatusDisplay = (status?: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.PENDING:
        return { text: '待确认', color: '#F59E0B' };
      case ReadingStatus.CONFIRMED:
        return { text: '已确认', color: '#10B981' };
      default:
        return { text: '未知', color: '#6B7280' };
    }
  };

  // 获取抄表类型显示文本
  const getReadingTypeText = (type?: ReadingType) => {
    switch (type) {
      case ReadingType.MANUAL:
        return '手动抄表';
      case ReadingType.AUTO:
        return '自动抄表';
      case ReadingType.ESTIMATED:
        return '估算读数';
      default:
        return '未知类型';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#06B6D4" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>加载抄表记录详情中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>❌</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#dc2626', marginBottom: 8, textAlign: 'center' }}>
          获取抄表记录详情失败
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#6b7280',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>返回</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={fetchReadingDetail}
            style={{
              backgroundColor: '#06B6D4',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>重试</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!reading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📊</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151' }}>
          抄表记录不存在
        </Text>
      </View>
    );
  }

  const statusDisplay = getReadingStatusDisplay(reading.readingStatus);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
              抄表记录详情
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              房间 {reading.roomNumber} - {reading.readingDate}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#6b7280',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>返回</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* 基本信息卡片 */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
              基本信息
            </Text>
            <View style={{
              backgroundColor: statusDisplay.color,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16
            }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                {statusDisplay.text}
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>抄表日期</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.readingDate}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>抄表类型</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{getReadingTypeText(reading.readingType)}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>抄表人</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.meterReader}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>创建时间</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                {reading.createdAt ? new Date(reading.createdAt).toLocaleString() : '未知'}
              </Text>
            </View>

            {reading.updatedAt && reading.updatedAt !== reading.createdAt && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>更新时间</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                  {new Date(reading.updatedAt).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 读数信息卡片 */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
            读数信息
          </Text>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>⚡ 电表读数</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.electricityReading} 度</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#6b7280' }}>💧 水表读数</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.waterReading} 吨</Text>
            </View>

            {reading.hotWaterReading && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>🔥 热水读数</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.hotWaterReading} 吨</Text>
              </View>
            )}

            {/* 用量信息 */}
            {(reading.electricityUsage || reading.waterUsage || reading.hotWaterUsage) && (
              <>
                <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 }} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  本期用量
                </Text>

                {reading.electricityUsage && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#6b7280' }}>⚡ 用电量</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.electricityUsage} 度</Text>
                  </View>
                )}

                {reading.waterUsage && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#6b7280' }}>💧 用水量</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.waterUsage} 吨</Text>
                  </View>
                )}

                {reading.hotWaterUsage && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#6b7280' }}>🔥 热水用量</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.hotWaterUsage} 吨</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* 房间信息卡片 */}
        {reading.room && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
              房间信息
            </Text>

            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>房间号</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.room.roomNumber}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>楼宇名称</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>{reading.room.buildingName}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>月租金</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{reading.room.rent}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>电费单价</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{reading.room.electricityUnitPrice}/度</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: '#6b7280' }}>水费单价</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{reading.room.waterUnitPrice}/吨</Text>
              </View>

              {reading.room.hotWaterUnitPrice && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, color: '#6b7280' }}>热水单价</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>¥{reading.room.hotWaterUnitPrice}/吨</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 备注信息 */}
        {reading.notes && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
              备注信息
            </Text>
            <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>
              {reading.notes}
            </Text>
          </View>
        )}

        {/* 操作按钮 */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
            操作
          </Text>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#10b981',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={() => navigation.navigate('EditUtilityReading', { readingId: reading.id })}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                编辑抄表记录
              </Text>
            </TouchableOpacity>

            {reading.readingStatus === ReadingStatus.PENDING && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#f59e0b',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={handleConfirmReading}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  确认抄表记录
                </Text>
              </TouchableOpacity>
            )}

            {/* 争议标记功能已移除 */}

            <TouchableOpacity
              style={{
                backgroundColor: '#ef4444',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={handleDeleteReading}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                删除抄表记录
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
