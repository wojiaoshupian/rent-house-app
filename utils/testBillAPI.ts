/**
 * 账单API测试工具
 * 
 * 使用方法：
 * 1. 在浏览器控制台中运行以下命令来测试账单API
 * 2. 确保已经登录并有有效的token
 * 
 * 测试命令：
 * - window.testBillAPI.testCreateBill()
 * - window.testBillAPI.testGetBillList()
 * - window.testBillAPI.testGetBillDetail(billId)
 * - window.testBillAPI.testUpdateBill(billId)
 * - window.testBillAPI.testPayBill(billId)
 * - window.testBillAPI.testDeleteBill(billId)
 * - window.testBillAPI.testGetBillStats()
 * - window.testBillAPI.testGenerateBills()
 * - window.testBillAPI.runAllTests()
 */

import { billService } from '../services/billService';
import { BillType, BillStatus, EstimatedBillStatus } from '../types/bill';

class BillAPITester {
  private testBillId: number | null = null;

  /**
   * 测试创建账单
   */
  async testCreateBill() {
    console.log('🧪 测试创建账单...');
    
    try {
      const testBillData = {
        roomId: 1, // 假设房间ID为1
        billType: BillType.RENT,
        title: '2024年1月房租',
        description: '测试账单描述',
        amount: 1500.00,
        billPeriod: '2024-01',
        dueDate: '2024-01-05',
        notes: '这是一个测试账单',
      };

      const result = await billService.createBill(testBillData).toPromise();
      this.testBillId = result.id;
      
      console.log('✅ 创建账单成功:', result);
      console.log('📝 账单ID:', result.id);
      console.log('💰 账单金额:', result.amount);
      console.log('📅 到期日期:', result.dueDate);
      
      return result;
    } catch (error) {
      console.error('❌ 创建账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试获取账单列表
   */
  async testGetBillList() {
    console.log('🧪 测试获取账单列表...');
    
    try {
      const result = await billService.getBillList().toPromise();
      
      console.log('✅ 获取账单列表成功:', result);
      console.log('📊 账单数量:', result.length);
      
      if (result.length > 0) {
        console.log('📋 第一个账单:', result[0]);
        if (!this.testBillId) {
          this.testBillId = result[0].id;
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ 获取账单列表失败:', error);
      throw error;
    }
  }

  /**
   * 测试获取账单详情
   */
  async testGetBillDetail(billId?: number) {
    const targetId = billId || this.testBillId;
    if (!targetId) {
      console.warn('⚠️ 没有可用的账单ID，请先创建账单或提供账单ID');
      return;
    }

    console.log('🧪 测试获取账单详情，ID:', targetId);
    
    try {
      const result = await billService.getBillDetail(targetId).toPromise();
      
      console.log('✅ 获取账单详情成功:', result);
      console.log('📋 账单标题:', result.title);
      console.log('💰 账单金额:', result.amount);
      console.log('🏠 房间信息:', result.room);
      console.log('👤 租户信息:', result.tenant);
      
      return result;
    } catch (error) {
      console.error('❌ 获取账单详情失败:', error);
      throw error;
    }
  }

  /**
   * 测试更新账单
   */
  async testUpdateBill(billId?: number) {
    const targetId = billId || this.testBillId;
    if (!targetId) {
      console.warn('⚠️ 没有可用的账单ID，请先创建账单或提供账单ID');
      return;
    }

    console.log('🧪 测试更新账单，ID:', targetId);
    
    try {
      const updateData = {
        id: targetId,
        title: '2024年1月房租（已更新）',
        amount: 1600.00,
        notes: '更新后的备注信息',
      };

      const result = await billService.updateBill(updateData).toPromise();
      
      console.log('✅ 更新账单成功:', result);
      console.log('📋 新标题:', result.title);
      console.log('💰 新金额:', result.amount);
      
      return result;
    } catch (error) {
      console.error('❌ 更新账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试支付账单
   */
  async testPayBill(billId?: number) {
    const targetId = billId || this.testBillId;
    if (!targetId) {
      console.warn('⚠️ 没有可用的账单ID，请先创建账单或提供账单ID');
      return;
    }

    console.log('🧪 测试支付账单，ID:', targetId);
    
    try {
      const paymentData = {
        amount: 1600.00,
        paymentMethod: 'CASH',
        notes: '现金支付测试',
      };

      const result = await billService.payBill(targetId, paymentData).toPromise();
      
      console.log('✅ 支付账单成功:', result);
      console.log('💳 支付状态:', result.status);
      console.log('💰 支付金额:', result.paidAmount);
      console.log('📅 支付时间:', result.paidAt);
      
      return result;
    } catch (error) {
      console.error('❌ 支付账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试获取账单统计
   */
  async testGetBillStats() {
    console.log('🧪 测试获取账单统计...');
    
    try {
      const result = await billService.getBillStats().toPromise();
      
      console.log('✅ 获取账单统计成功:', result);
      console.log('📊 总账单数:', result.totalBills);
      console.log('💰 总金额:', result.totalAmount);
      console.log('✅ 已支付金额:', result.paidAmount);
      console.log('⏳ 未支付金额:', result.unpaidAmount);
      console.log('⏰ 逾期金额:', result.overdueAmount);
      console.log('📈 状态统计:', result.statusStats);
      console.log('📊 类型统计:', result.typeStats);
      
      return result;
    } catch (error) {
      console.error('❌ 获取账单统计失败:', error);
      throw error;
    }
  }

  /**
   * 测试生成账单
   */
  async testGenerateBills() {
    console.log('🧪 测试生成账单...');

    try {
      const generateRequest = {
        roomIds: [1, 2, 3], // 假设房间ID
        billType: BillType.RENT,
        title: '2024年2月房租',
        billPeriod: '2024-02',
        dueDate: '2024-02-05',
        amount: 1500.00,
        notes: '批量生成的房租账单',
      };

      const result = await billService.generateBills(generateRequest).toPromise();

      console.log('✅ 生成账单成功:', result);
      console.log('📊 成功生成:', result.generated);
      console.log('❌ 生成失败:', result.failed);

      return result;
    } catch (error) {
      console.error('❌ 生成账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试获取预估账单
   */
  async testGetEstimatedBills() {
    console.log('🧪 测试获取预估账单...');

    try {
      const params = {
        roomId: 1,
        billMonth: '2025-08',
        page: 0,
        size: 10
      };

      const result = await billService.getEstimatedBills(params).toPromise();

      console.log('✅ 获取预估账单成功:', result);
      console.log('📊 预估账单数量:', result.data.length);
      console.log('📄 分页信息:', result.pagination);

      if (result.data.length > 0) {
        console.log('📋 第一个预估账单:', result.data[0]);
        console.log('💰 总金额:', result.data[0].totalAmount);
        console.log('🏠 房间:', result.data[0].roomNumber);
        console.log('📅 账单月份:', result.data[0].billMonth);
        console.log('📊 状态:', result.data[0].billStatusDescription);
      }

      return result;
    } catch (error) {
      console.error('❌ 获取预估账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试根据房间ID获取预估账单
   */
  async testGetEstimatedBillsByRoomId(roomId: number = 1) {
    console.log('🧪 测试根据房间ID获取预估账单，房间ID:', roomId);

    try {
      const result = await billService.getEstimatedBillsByRoomId(roomId, '2025-08').toPromise();

      console.log('✅ 获取房间预估账单成功:', result);
      console.log('📊 该房间预估账单数量:', result.length);

      if (result.length > 0) {
        const bill = result[0];
        console.log('📋 预估账单详情:');
        console.log('  - 房间:', bill.roomNumber, bill.buildingName);
        console.log('  - 房租:', bill.rent);
        console.log('  - 电费:', bill.electricityAmount, '(用量:', bill.electricityUsage, ')');
        console.log('  - 水费:', bill.waterAmount, '(用量:', bill.waterUsage, ')');
        console.log('  - 热水费:', bill.hotWaterAmount, '(用量:', bill.hotWaterUsage, ')');
        console.log('  - 总金额:', bill.totalAmount);
        console.log('  - 状态:', bill.billStatusDescription);
      }

      return result;
    } catch (error) {
      console.error('❌ 获取房间预估账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试根据状态获取预估账单
   */
  async testGetEstimatedBillsByStatus(status: EstimatedBillStatus = EstimatedBillStatus.GENERATED) {
    console.log('🧪 测试根据状态获取预估账单，状态:', status);

    try {
      const result = await billService.getEstimatedBillsByStatus(status).toPromise();

      console.log('✅ 获取状态预估账单成功:', result);
      console.log('📊 该状态预估账单数量:', result.length);

      if (result.length > 0) {
        console.log('📋 状态为', status, '的预估账单:');
        result.forEach((bill, index) => {
          console.log(`  ${index + 1}. 房间${bill.roomNumber} - ¥${bill.totalAmount} - ${bill.billMonth}`);
        });
      }

      return result;
    } catch (error) {
      console.error('❌ 获取状态预估账单失败:', error);
      throw error;
    }
  }

  /**
   * 测试生成预估账单
   */
  async testGenerateEstimatedBill(roomId: number = 1, billMonth?: string) {
    const targetBillMonth = billMonth || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    console.log('🧪 测试生成预估账单...');
    console.log('🎯 房间ID:', roomId, '账单月份:', targetBillMonth);
    console.log('💡 注意：此接口需要用户登录并调用 POST /api/estimated-bills/generate');

    try {
      const result = await billService.generateEstimatedBill(roomId, targetBillMonth).toPromise();

      console.log('✅ 生成预估账单成功:', result);
      console.log('📋 预估账单详情:');
      console.log('  - ID:', result.id);
      console.log('  - 房间号:', result.roomNumber);
      console.log('  - 楼宇名称:', result.buildingName);
      console.log('  - 账单月份:', result.billMonth);
      console.log('  - 账单日期:', result.billDate);
      console.log('  - 房租:', result.rent, '元');
      console.log('  - 电费:', result.electricityAmount, '元');
      console.log('  - 水费:', result.waterAmount, '元');
      console.log('  - 热水费:', result.hotWaterAmount, '元');
      console.log('  - 其他费用:', result.otherFees, '元');
      console.log('  - 总金额:', result.totalAmount, '元');
      console.log('  - 状态:', result.billStatus, '-', result.billStatusDescription);
      console.log('  - 创建时间:', result.createdAt);

      return result;
    } catch (error: any) {
      console.error('❌ 生成预估账单失败:', error);
      console.error('📝 错误详情:', error.message);

      if (error.status === 401) {
        console.log('💡 提示：请先登录后再试');
      } else if (error.status === 404) {
        console.log('💡 提示：房间不存在或没有相关数据');
      } else if (error.status === 409) {
        console.log('💡 提示：该房间该月份的预估账单已存在');
      } else if (error.status === 400) {
        console.log('💡 提示：请求参数错误，请检查房间ID和账单月份格式');
      }

      throw error;
    }
  }

  /**
   * 测试删除预估账单
   */
  async testDeleteEstimatedBill(billId: number) {
    console.log('🧪 测试删除预估账单...');
    console.log('🎯 预估账单ID:', billId);
    console.log('💡 注意：此接口需要用户登录并调用 DELETE /api/estimated-bills/{id}');

    try {
      await billService.deleteEstimatedBill(billId).toPromise();

      console.log('✅ 删除预估账单成功');
      console.log('📋 预估账单ID', billId, '已被删除');
      console.log('💡 提示：可以调用 testBillAPI.testGetEstimatedBills() 验证删除结果');

    } catch (error: any) {
      console.error('❌ 删除预估账单失败:', error);
      console.error('📝 错误详情:', error.message);

      if (error.status === 401) {
        console.log('💡 提示：请先登录后再试');
      } else if (error.status === 404) {
        console.log('💡 提示：预估账单不存在或已被删除');
      } else if (error.status === 409) {
        console.log('💡 提示：预估账单已确认，无法删除');
      } else if (error.status === 403) {
        console.log('💡 提示：权限不足，请检查用户权限');
      }

      throw error;
    }
  }

  /**
   * 测试删除账单
   */
  async testDeleteBill(billId?: number) {
    const targetId = billId || this.testBillId;
    if (!targetId) {
      console.warn('⚠️ 没有可用的账单ID，请先创建账单或提供账单ID');
      return;
    }

    console.log('🧪 测试删除账单，ID:', targetId);
    
    try {
      await billService.deleteBill(targetId).toPromise();
      
      console.log('✅ 删除账单成功');
      this.testBillId = null; // 清除测试ID
      
      return true;
    } catch (error) {
      console.error('❌ 删除账单失败:', error);
      throw error;
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests() {
    console.log('🚀 开始运行所有账单API测试...');
    
    try {
      // 1. 测试创建账单
      await this.testCreateBill();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. 测试获取账单列表
      await this.testGetBillList();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. 测试获取账单详情
      await this.testGetBillDetail();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. 测试更新账单
      await this.testUpdateBill();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 5. 测试获取账单统计
      await this.testGetBillStats();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 6. 测试支付账单
      await this.testPayBill();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 7. 测试预估账单功能
      await this.testGetEstimatedBills();
      await new Promise(resolve => setTimeout(resolve, 1000));

      await this.testGetEstimatedBillsByRoomId(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      await this.testGetEstimatedBillsByStatus();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 8. 测试生成预估账单
      await this.testGenerateEstimatedBill(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 9. 测试删除预估账单（注意：这会删除刚生成的账单）
      // await this.testDeleteEstimatedBill(1); // 取消注释以测试删除功能
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // 8. 最后删除测试账单
      await this.testDeleteBill();

      console.log('🎉 所有账单API测试完成！');
    } catch (error) {
      console.error('💥 测试过程中出现错误:', error);
    }
  }

  /**
   * 获取测试账单ID
   */
  getTestBillId() {
    return this.testBillId;
  }

  /**
   * 设置测试账单ID
   */
  setTestBillId(billId: number) {
    this.testBillId = billId;
  }
}

// 创建全局实例
const billAPITester = new BillAPITester();

// 在开发环境中将测试工具挂载到window对象
if (__DEV__ && typeof window !== 'undefined') {
  (window as any).testBillAPI = billAPITester;
  console.log('🔧 账单API测试工具已加载！');
  console.log('📖 使用方法：');
  console.log('   window.testBillAPI.testCreateBill() - 测试创建账单');
  console.log('   window.testBillAPI.testGetBillList() - 测试获取账单列表');
  console.log('   window.testBillAPI.testGetBillDetail(billId) - 测试获取账单详情');
  console.log('   window.testBillAPI.testUpdateBill(billId) - 测试更新账单');
  console.log('   window.testBillAPI.testPayBill(billId) - 测试支付账单');
  console.log('   window.testBillAPI.testDeleteBill(billId) - 测试删除账单');
  console.log('   window.testBillAPI.testGetBillStats() - 测试获取账单统计');
  console.log('   window.testBillAPI.testGenerateBills() - 测试生成账单');
  console.log('   window.testBillAPI.testGetEstimatedBills() - 测试获取预估账单');
  console.log('   window.testBillAPI.testGetEstimatedBillsByRoomId(roomId) - 测试获取房间预估账单');
  console.log('   window.testBillAPI.testGetEstimatedBillsByStatus(status) - 测试获取状态预估账单');
  console.log('   window.testBillAPI.testGenerateEstimatedBill(roomId, billMonth) - 测试生成预估账单');
  console.log('   window.testBillAPI.testDeleteEstimatedBill(billId) - 测试删除预估账单');
  console.log('   window.testBillAPI.runAllTests() - 运行所有测试');
  console.log('');
  console.log('💡 预估账单操作示例:');
  console.log('   window.testBillAPI.testGenerateEstimatedBill(1, "2025-08") - 为房间1生成2025年8月预估账单');
  console.log('   window.testBillAPI.testGenerateEstimatedBill(2) - 为房间2生成当前月份预估账单');
  console.log('   window.testBillAPI.testDeleteEstimatedBill(123) - 删除ID为123的预估账单');
  console.log('');
  console.log('⚠️  注意：删除预估账单操作不可恢复，请谨慎使用！');
}

export default billAPITester;
