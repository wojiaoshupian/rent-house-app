import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { billService } from '../../services/billService';
import { BillDetail } from '../../types/bill';
import { BillCanvasGenerator } from '../../components/BillCanvasGenerator';

interface BillCanvasRouteParams {
  billId: number;
}

const BillCanvasScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { billId } = route.params as BillCanvasRouteParams;
  const canvasRef = useRef<View>(null);

  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [generatedImageUri, setGeneratedImageUri] = useState<string | null>(null);

  // 加载账单详情
  const loadBillDetail = async () => {
    try {
      setLoading(true);
      const billDetail = await billService.getBillDetail(billId).toPromise();
      setBill(billDetail);
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

  // 处理图片生成完成
  const handleImageGenerated = (imageUri: string) => {
    setGeneratedImageUri(imageUri);
    Alert.alert(
      '生成成功',
      '电子账单已生成完成！',
      [
        { text: '确定', style: 'default' },
        { text: '立即分享', onPress: handleShare }
      ]
    );
  };

  // 生成电子账单
  const handleGenerate = async () => {
    if (!bill) {
      Alert.alert('错误', '账单信息不存在');
      return;
    }

    if (!canvasRef.current) {
      Alert.alert('错误', '账单预览组件未准备就绪，请稍后重试');
      return;
    }

    setGenerating(true);
    try {
      // 添加短暂延迟确保组件完全渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      setGeneratedImageUri(uri);
      console.log('电子账单生成成功:', uri);

      Alert.alert(
        '生成成功',
        '电子账单已生成完成！',
        [
          { text: '确定', style: 'default' },
          { text: '立即分享', onPress: () => handleShare(uri) }
        ]
      );
    } catch (error) {
      console.error('生成电子账单失败:', error);
      Alert.alert('错误', `生成电子账单失败: ${error.message || '未知错误'}`);
    } finally {
      setGenerating(false);
    }
  };

  // 分享电子账单
  const handleShare = async (imageUri?: string) => {
    const uri = imageUri || generatedImageUri;
    if (!uri || !bill) {
      Alert.alert('提示', '请先生成电子账单');
      return;
    }

    try {
      setSharing(true);

      // 检查是否支持分享
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `账单编号：${bill.billNumber} - ¥${bill.amount.toFixed(2)}`,
        });
      } else {
        Alert.alert('分享不可用', '当前设备不支持分享功能');
      }
    } catch (error: any) {
      console.error('分享账单失败:', error);
      Alert.alert('错误', '分享账单失败');
    } finally {
      setSharing(false);
    }
  };

  // 保存到相册
  const handleSaveToAlbum = () => {
    if (!generatedImageUri) {
      Alert.alert('提示', '请先生成电子账单');
      return;
    }

    Alert.alert(
      '保存成功',
      '电子账单图片已生成，您可以通过分享功能保存到相册。',
      [
        { text: '确定', style: 'default' },
        { text: '立即分享', onPress: handleShare }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">加载账单信息中...</Text>
      </View>
    );
  }

  if (!bill) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">账单不存在</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-medium">返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* 账单预览 */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">账单预览</Text>

          <View
            ref={canvasRef}
            style={{ backgroundColor: 'white' }}
            collapsable={false}
          >
            <BillCanvasGenerator
              bill={bill}
              onGenerated={handleImageGenerated}
            />
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="p-4 space-y-3">
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl flex-row justify-center items-center"
            onPress={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white text-lg font-semibold mr-2">🎨</Text>
                <Text className="text-white text-lg font-semibold">生成电子账单</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 py-4 rounded-xl flex-row justify-center items-center"
            onPress={handleShare}
            disabled={sharing || !generatedImageUri}
          >
            {sharing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white text-lg font-semibold mr-2">📤</Text>
                <Text className="text-white text-lg font-semibold">分享账单</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-500 py-4 rounded-xl flex-row justify-center items-center"
            onPress={handleSaveToAlbum}
            disabled={!generatedImageUri}
          >
            <Text className="text-white text-lg font-semibold mr-2">💾</Text>
            <Text className="text-white text-lg font-semibold">保存图片</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-500 py-4 rounded-xl flex-row justify-center items-center"
            onPress={() => navigation.navigate('BillList' as never, {} as never)}
          >
            <Text className="text-white text-lg font-semibold mr-2">📋</Text>
            <Text className="text-white text-lg font-semibold">返回账单列表</Text>
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default BillCanvasScreen;
