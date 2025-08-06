import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { GuideImage, StepGuide, FeatureCard } from '../../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');

export const UsageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeSection, setActiveSection] = useState<string>('overview');

  // 指南章节
  const guideSections = [
    {
      id: 'overview',
      title: '系统概览',
      icon: '🏠',
      color: '#3B82F6'
    },
    {
      id: 'building',
      title: '楼宇管理',
      icon: '🏢',
      color: '#10B981'
    },
    {
      id: 'room',
      title: '房间管理',
      icon: '🏠',
      color: '#8B5CF6'
    },
    {
      id: 'utility',
      title: '抄表管理',
      icon: '📊',
      color: '#06B6D4'
    },
    {
      id: 'bill',
      title: '账单管理',
      icon: '💰',
      color: '#EF4444'
    },
    {
      id: 'tips',
      title: '使用技巧',
      icon: '💡',
      color: '#F59E0B'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-6 shadow-sm">
          <Text className="mb-2 text-3xl font-bold text-gray-800">使用指南</Text>
          <Text className="text-base text-gray-500">详细的操作指南和最佳实践</Text>
        </View>

        {/* 导航标签 */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {guideSections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  onPress={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-full border ${
                    activeSection === section.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      activeSection === section.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {section.icon} {section.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 内容区域 */}
        <View className="p-6">
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );

  // 渲染内容
  function renderContent() {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'building':
        return renderBuildingGuide();
      case 'room':
        return renderRoomGuide();
      case 'utility':
        return renderUtilityGuide();
      case 'bill':
        return renderBillGuide();
      case 'tips':
        return renderTips();
      default:
        return renderOverview();
    }
  }

  // 系统概览
  function renderOverview() {
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">🏢 楼宇管理系统概览</Text>

        {/* 系统介绍 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">系统简介</Text>
          <Text className="text-gray-600 leading-6 mb-4">
            楼宇管理系统是一个专为房东和物业管理人员设计的综合管理平台，帮助您高效管理楼宇、房间、租户和账单。
          </Text>

          {/* 核心功能 */}
          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-base font-semibold text-blue-800 mb-2">🎯 核心功能</Text>
            <View className="space-y-2">
              <Text className="text-blue-700 text-sm">• 楼宇信息管理和费用标准设置</Text>
              <Text className="text-blue-700 text-sm">• 房间状态管理和租户信息维护</Text>
              <Text className="text-blue-700 text-sm">• 水电表抄表记录和用量统计</Text>
              <Text className="text-blue-700 text-sm">• 自动账单生成和费用计算</Text>
              <Text className="text-blue-700 text-sm">• 数据导出和报表分析</Text>
            </View>
          </View>
        </View>

        {/* 操作流程 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">📋 推荐操作流程</Text>

          <View className="space-y-4">
            {[
              { step: 1, title: '创建楼宇', desc: '添加楼宇基本信息，设置水电费单价', icon: '🏢', color: '#3B82F6' },
              { step: 2, title: '添加房间', desc: '在楼宇下创建房间，设置租金和租户信息', icon: '🏠', color: '#10B981' },
              { step: 3, title: '抄表记录', desc: '定期录入水电表读数，系统自动计算用量', icon: '📊', color: '#8B5CF6' },
              { step: 4, title: '生成账单', desc: '基于抄表数据自动生成月度账单', icon: '💰', color: '#EF4444' }
            ].map((item) => (
              <View key={item.step} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <Text className="text-lg">{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">步骤 {item.step}: {item.title}</Text>
                  <Text className="text-sm text-gray-600 mt-1">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 快速开始 */}
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 mb-6">
          <Text className="text-xl font-bold text-white mb-2">🚀 快速开始</Text>
          <Text className="text-blue-100 mb-4">
            新用户建议从创建第一个楼宇开始，逐步完善系统数据
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateBuilding')}
            className="bg-white rounded-lg py-3 px-4 self-start"
          >
            <Text className="text-blue-600 font-semibold">立即创建楼宇</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 楼宇管理指南
  function renderBuildingGuide() {
    const createBuildingSteps = [
      {
        title: '进入创建页面',
        description: '点击首页"创建楼宇"或楼宇列表页"+ 新建"按钮',
        icon: '🏢',
        color: '#3b82f6'
      },
      {
        title: '填写基本信息',
        description: '输入楼宇名称（如：阳光小区1号楼）和房东信息',
        icon: '📝',
        color: '#10b981'
      },
      {
        title: '设置费用标准',
        description: '设置电费、水费、热水费单价（元/度或元/吨）',
        icon: '💰',
        color: '#f59e0b'
      },
      {
        title: '选择收租方式',
        description: '建议选择"固定月初收租"，便于统一管理',
        icon: '📅',
        color: '#8b5cf6'
      },
      {
        title: '完成创建',
        description: '检查信息无误后，点击"创建楼宇"按钮完成',
        icon: '✅',
        color: '#ef4444'
      }
    ];

    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">🏢 楼宇管理指南</Text>

        {/* 创建楼宇步骤 */}
        <StepGuide
          title="创建楼宇步骤"
          steps={createBuildingSteps}
          backgroundColor="#f0f9ff"
        />

        {/* 示例界面 */}
        <GuideImage
          title="创建楼宇界面示例"
          description="填写楼宇基本信息，设置费用标准，选择收租方式"
          placeholder="🏢"
          aspectRatio={3/4}
        />

        {/* 快速操作 */}
        <FeatureCard
          title="立即开始"
          description="创建您的第一个楼宇，开始使用楼宇管理系统"
          icon="🚀"
          color="#3b82f6"
          buttonText="创建楼宇"
          onPress={() => navigation.navigate('CreateBuilding')}
          features={[
            '快速创建楼宇信息',
            '设置个性化费用标准',
            '选择合适的收租方式'
          ]}
        />

        {/* 管理楼宇 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">✏️ 管理楼宇</Text>

          <View className="space-y-4">
            <View className="bg-green-50 rounded-lg p-4">
              <Text className="font-semibold text-green-800 mb-2">常用操作：</Text>
              <View className="space-y-2">
                <Text className="text-green-700 text-sm">• 编辑楼宇：修改基本信息和费用标准</Text>
                <Text className="text-green-700 text-sm">• 查看房间：进入该楼宇的房间管理</Text>
                <Text className="text-green-700 text-sm">• 删除楼宇：移除楼宇（会同时删除所有房间）</Text>
                <Text className="text-green-700 text-sm">• 刷新数据：获取最新的楼宇信息</Text>
              </View>
            </View>

            <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <Text className="font-semibold text-yellow-800 mb-2">⚠️ 重要提示：</Text>
              <Text className="text-yellow-700 text-sm">
                删除楼宇是不可逆操作，会同时删除该楼宇下的所有房间和相关数据，请谨慎操作。
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('BuildingList')}
            className="bg-green-500 rounded-lg py-3 px-4 mt-4 self-start"
          >
            <Text className="text-white font-semibold">管理楼宇</Text>
          </TouchableOpacity>
        </View>

        {/* 费用设置技巧 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">💰 费用设置技巧</Text>

          <View className="space-y-3">
            <View className="bg-purple-50 rounded-lg p-3">
              <Text className="font-medium text-purple-800 mb-1">电费设置</Text>
              <Text className="text-purple-700 text-sm">
                建议设置为当地电力公司价格+0.1-0.2元/度的管理费
              </Text>
            </View>

            <View className="bg-blue-50 rounded-lg p-3">
              <Text className="font-medium text-blue-800 mb-1">水费设置</Text>
              <Text className="text-blue-700 text-sm">
                可参考当地自来水公司价格，通常在3-6元/吨
              </Text>
            </View>

            <View className="bg-orange-50 rounded-lg p-3">
              <Text className="font-medium text-orange-800 mb-1">热水费设置</Text>
              <Text className="text-orange-700 text-sm">
                如有热水供应，建议设置为8-15元/吨
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 房间管理指南
  function renderRoomGuide() {
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">🏠 房间管理指南</Text>

        {/* 添加房间 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">➕ 添加房间</Text>

          <View className="space-y-4">
            <View className="bg-purple-50 rounded-lg p-4">
              <Text className="font-semibold text-purple-800 mb-2">操作步骤：</Text>
              <View className="space-y-2">
                <Text className="text-purple-700 text-sm">1. 进入楼宇管理，选择目标楼宇</Text>
                <Text className="text-purple-700 text-sm">2. 点击"查看房间"进入房间列表</Text>
                <Text className="text-purple-700 text-sm">3. 点击"+ 新建"创建房间</Text>
                <Text className="text-purple-700 text-sm">4. 填写房间号（如：101、201A）</Text>
                <Text className="text-purple-700 text-sm">5. 设置月租金和押金金额</Text>
                <Text className="text-purple-700 text-sm">6. 选择房间状态和租户信息</Text>
              </View>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 items-center">
              <Text className="text-6xl mb-2">🏠</Text>
              <Text className="text-gray-600 text-sm">房间管理界面示例</Text>
              <Text className="text-gray-500 text-xs mt-1">（显示房间列表和操作按钮）</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('RoomList', {})}
            className="bg-purple-500 rounded-lg py-3 px-4 mt-4 self-start"
          >
            <Text className="text-white font-semibold">管理房间</Text>
          </TouchableOpacity>
        </View>

        {/* 房间状态管理 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">🏷️ 房间状态管理</Text>

          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-green-50 rounded-lg">
              <Text className="text-2xl mr-3">🟢</Text>
              <View className="flex-1">
                <Text className="font-semibold text-green-800">已出租</Text>
                <Text className="text-green-700 text-sm">房间已有租户，正常收租状态</Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-yellow-50 rounded-lg">
              <Text className="text-2xl mr-3">🟡</Text>
              <View className="flex-1">
                <Text className="font-semibold text-yellow-800">空置</Text>
                <Text className="text-yellow-700 text-sm">房间暂无租户，可对外招租</Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-red-50 rounded-lg">
              <Text className="text-2xl mr-3">🔴</Text>
              <View className="flex-1">
                <Text className="font-semibold text-red-800">维修中</Text>
                <Text className="text-red-700 text-sm">房间正在维修，暂不可出租</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 租户信息管理 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">👤 租户信息管理</Text>

          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="font-semibold text-blue-800 mb-2">建议记录的信息：</Text>
            <View className="space-y-1">
              <Text className="text-blue-700 text-sm">• 租户姓名和联系电话</Text>
              <Text className="text-blue-700 text-sm">• 身份证号码（用于合同）</Text>
              <Text className="text-blue-700 text-sm">• 入住日期和租期</Text>
              <Text className="text-blue-700 text-sm">• 押金和租金标准</Text>
              <Text className="text-blue-700 text-sm">• 特殊约定事项</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 抄表管理指南
  function renderUtilityGuide() {
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">📊 抄表管理指南</Text>

        {/* 抄表流程 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">📝 抄表流程</Text>

          <View className="space-y-4">
            <View className="bg-cyan-50 rounded-lg p-4">
              <Text className="font-semibold text-cyan-800 mb-2">标准抄表流程：</Text>
              <View className="space-y-2">
                <Text className="text-cyan-700 text-sm">1. 进入"抄水电表"页面</Text>
                <Text className="text-cyan-700 text-sm">2. 选择楼宇和房间进行筛选</Text>
                <Text className="text-cyan-700 text-sm">3. 点击"+ 新建"创建抄表记录</Text>
                <Text className="text-cyan-700 text-sm">4. 选择房间和抄表日期</Text>
                <Text className="text-cyan-700 text-sm">5. 录入当前水表、电表读数</Text>
                <Text className="text-cyan-700 text-sm">6. 系统自动计算用量和费用</Text>
                <Text className="text-cyan-700 text-sm">7. 确认无误后保存记录</Text>
              </View>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 items-center">
              <Text className="text-6xl mb-2">📊</Text>
              <Text className="text-gray-600 text-sm">抄表记录界面示例</Text>
              <Text className="text-gray-500 text-xs mt-1">（显示表格形式的抄表数据）</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('UtilityReadingList', {})}
            className="bg-cyan-500 rounded-lg py-3 px-4 mt-4 self-start"
          >
            <Text className="text-white font-semibold">开始抄表</Text>
          </TouchableOpacity>
        </View>

        {/* 抄表技巧 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">💡 抄表技巧</Text>

          <View className="space-y-3">
            <View className="bg-green-50 rounded-lg p-3">
              <Text className="font-medium text-green-800 mb-1">📅 定期抄表</Text>
              <Text className="text-green-700 text-sm">
                建议每月固定日期抄表，如每月1号或月底最后一天
              </Text>
            </View>

            <View className="bg-blue-50 rounded-lg p-3">
              <Text className="font-medium text-blue-800 mb-1">📸 拍照记录</Text>
              <Text className="text-blue-700 text-sm">
                抄表时建议拍照保存表计读数，避免纠纷
              </Text>
            </View>

            <View className="bg-yellow-50 rounded-lg p-3">
              <Text className="font-medium text-yellow-800 mb-1">🔍 仔细核对</Text>
              <Text className="text-yellow-700 text-sm">
                录入前仔细核对读数，确保数据准确无误
              </Text>
            </View>
          </View>
        </View>

        {/* 异常处理 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">⚠️ 异常处理</Text>

          <View className="space-y-3">
            <View className="bg-red-50 rounded-lg p-3 border border-red-200">
              <Text className="font-medium text-red-800 mb-1">读数异常</Text>
              <Text className="text-red-700 text-sm">
                如发现用量异常（过高或过低），请检查表计是否正常，必要时联系维修
              </Text>
            </View>

            <View className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <Text className="font-medium text-orange-800 mb-1">表计故障</Text>
              <Text className="text-orange-700 text-sm">
                表计损坏时可暂时按平均用量估算，并及时安排维修更换
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 账单管理指南
  function renderBillGuide() {
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">💰 账单管理指南</Text>

        {/* 账单生成 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">📋 账单生成</Text>

          <View className="space-y-4">
            <View className="bg-green-50 rounded-lg p-4">
              <Text className="font-semibold text-green-800 mb-2">自动生成流程：</Text>
              <View className="space-y-2">
                <Text className="text-green-700 text-sm">1. 系统基于抄表记录自动计算用量</Text>
                <Text className="text-green-700 text-sm">2. 根据楼宇费用标准计算费用</Text>
                <Text className="text-green-700 text-sm">3. 生成预估账单供确认</Text>
                <Text className="text-green-700 text-sm">4. 确认后生成正式账单</Text>
                <Text className="text-green-700 text-sm">5. 支持导出和打印功能</Text>
              </View>
            </View>

            <View className="bg-gray-100 rounded-lg p-4 items-center">
              <Text className="text-6xl mb-2">💰</Text>
              <Text className="text-gray-600 text-sm">账单管理界面示例</Text>
              <Text className="text-gray-500 text-xs mt-1">（显示账单列表和详细信息）</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('EstimatedBillList', {})}
            className="bg-green-500 rounded-lg py-3 px-4 mt-4 self-start"
          >
            <Text className="text-white font-semibold">查看账单</Text>
          </TouchableOpacity>
        </View>

        {/* 账单类型 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">📊 账单类型</Text>

          <View className="space-y-3">
            <View className="flex-row items-center p-3 bg-blue-50 rounded-lg">
              <Text className="text-2xl mr-3">🏠</Text>
              <View className="flex-1">
                <Text className="font-semibold text-blue-800">房租账单</Text>
                <Text className="text-blue-700 text-sm">固定月租费用</Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-yellow-50 rounded-lg">
              <Text className="text-2xl mr-3">⚡</Text>
              <View className="flex-1">
                <Text className="font-semibold text-yellow-800">电费账单</Text>
                <Text className="text-yellow-700 text-sm">基于用电量计算</Text>
              </View>
            </View>

            <View className="flex-row items-center p-3 bg-cyan-50 rounded-lg">
              <Text className="text-2xl mr-3">💧</Text>
              <View className="flex-1">
                <Text className="font-semibold text-cyan-800">水费账单</Text>
                <Text className="text-cyan-700 text-sm">基于用水量计算</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 使用技巧
  function renderTips() {
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-800 mb-4">💡 使用技巧</Text>

        {/* 效率提升 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">🚀 效率提升技巧</Text>

          <View className="space-y-3">
            <View className="bg-purple-50 rounded-lg p-3">
              <Text className="font-medium text-purple-800 mb-1">批量操作</Text>
              <Text className="text-purple-700 text-sm">
                使用筛选功能，可以快速定位到特定楼宇或房间的数据
              </Text>
            </View>

            <View className="bg-indigo-50 rounded-lg p-3">
              <Text className="font-medium text-indigo-800 mb-1">数据备份</Text>
              <Text className="text-indigo-700 text-sm">
                定期导出重要数据，建议每月备份一次
              </Text>
            </View>

            <View className="bg-pink-50 rounded-lg p-3">
              <Text className="font-medium text-pink-800 mb-1">模板使用</Text>
              <Text className="text-pink-700 text-sm">
                创建标准化的操作模板，提高数据录入效率
              </Text>
            </View>
          </View>
        </View>

        {/* 常见问题 */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">❓ 常见问题</Text>

          <View className="space-y-4">
            <View className="border-l-4 border-blue-500 pl-4">
              <Text className="font-medium text-gray-800 mb-1">Q: 如何修改已确认的抄表记录？</Text>
              <Text className="text-gray-600 text-sm">
                A: 已确认的记录不能直接修改，需要先取消确认，然后编辑后重新确认。
              </Text>
            </View>

            <View className="border-l-4 border-green-500 pl-4">
              <Text className="font-medium text-gray-800 mb-1">Q: 账单计算错误怎么办？</Text>
              <Text className="text-gray-600 text-sm">
                A: 检查楼宇费用标准设置和抄表数据是否正确，修正后重新生成账单。
              </Text>
            </View>

            <View className="border-l-4 border-yellow-500 pl-4">
              <Text className="font-medium text-gray-800 mb-1">Q: 如何处理租户换房的情况？</Text>
              <Text className="text-gray-600 text-sm">
                A: 先结清原房间账单，然后修改房间状态，在新房间录入租户信息。
              </Text>
            </View>
          </View>
        </View>

        {/* 联系支持 */}
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5">
          <Text className="text-xl font-bold text-white mb-2">🆘 需要帮助？</Text>
          <Text className="text-blue-100 mb-4">
            如果您在使用过程中遇到问题，可以通过以下方式获取帮助
          </Text>
          <View className="space-y-2">
            <Text className="text-blue-100 text-sm">📧 邮箱：support@example.com</Text>
            <Text className="text-blue-100 text-sm">📞 电话：400-123-4567</Text>
            <Text className="text-blue-100 text-sm">💬 在线客服：工作日 9:00-18:00</Text>
          </View>
        </View>
      </View>
    );
  }
};
