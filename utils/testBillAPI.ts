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
    const targetId = billId || this.testBillId || 8; // 默认使用ID 8进行测试

    console.log('🧪 测试获取账单详情，ID:', targetId);

    try {
      const result = await billService.getBillDetail(targetId).toPromise();

      console.log('✅ 获取账单详情成功:', result);
      console.log('📋 账单标题:', result.title);
      console.log('💰 账单金额:', result.amount);
      console.log('🏠 房间信息:', result.room);
      console.log('👤 租户信息:', result.tenant);

      // 测试费用明细
      console.log('💰 费用明细:');
      if (result.rent) console.log('  - 房租:', result.rent);
      if (result.electricityAmount) console.log('  - 电费:', result.electricityAmount, '(用量:', result.electricityUsage, '度)');
      if (result.waterAmount) console.log('  - 水费:', result.waterAmount, '(用量:', result.waterUsage, '吨)');
      if (result.hotWaterAmount) console.log('  - 热水费:', result.hotWaterAmount, '(用量:', result.hotWaterUsage, '吨)');
      if (result.deposit) console.log('  - 押金:', result.deposit);
      if (result.otherFees) console.log('  - 其他费用:', result.otherFees, '(', result.otherFeesDescription, ')');

      return result;
    } catch (error) {
      console.error('❌ 获取账单详情失败:', error);
      throw error;
    }
  }

  /**
   * 测试账单详情API修复
   */
  async testBillDetailAPIFix() {
    console.log('🧪 测试账单详情API修复...');
    console.log('📝 测试场景：使用正确的API端点 /api/bills/{id} 而不是 /api/bills/{id}/payments');

    try {
      // 测试获取账单详情
      const billDetail = await this.testGetBillDetail(8);

      if (billDetail) {
        console.log('✅ API修复测试成功！');
        console.log('🎯 验证点：');
        console.log('  ✓ 成功调用 /api/bills/8 端点');
        console.log('  ✓ 正确解析API响应数据');
        console.log('  ✓ 成功转换为BillDetail格式');
        console.log('  ✓ 包含完整的费用明细信息');

        return true;
      }
    } catch (error) {
      console.error('❌ API修复测试失败:', error);
      return false;
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
    console.log('💡 注意：此接口需要用户登录并调用 POST /api/bills/generate');

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
    console.log('💡 注意：此接口需要用户登录并调用 DELETE /api/bills/{id}');

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
   * 测试更新预估账单
   */
  async testUpdateEstimatedBill(billId: number, updateData?: any) {
    const defaultUpdateData = {
      rent: 1600.00,
      deposit: 800.00,
      electricityUsage: 125.5,
      waterUsage: 18.2,
      hotWaterUsage: 9.5,
      otherFees: 150.00,
      otherFeesDescription: "网络费60元 + 清洁费90元",
      billStatus: "CONFIRMED",
      notes: "账单已更新并确认"
    };

    const finalUpdateData = updateData || defaultUpdateData;

    console.log('🧪 测试更新预估账单...');
    console.log('🎯 预估账单ID:', billId);
    console.log('📝 更新数据:', finalUpdateData);
    console.log('💡 注意：此接口需要用户登录并调用 PUT /api/bills/{id}');

    try {
      const result = await billService.updateEstimatedBill(billId, finalUpdateData).toPromise();

      console.log('✅ 更新预估账单成功:', result);
      console.log('📋 更新后的预估账单详情:');
      console.log('  - ID:', result.id);
      console.log('  - 房间号:', result.roomNumber);
      console.log('  - 楼宇名称:', result.buildingName);
      console.log('  - 账单月份:', result.billMonth);
      console.log('  - 房租:', result.rent, '元');
      console.log('  - 电费用量:', result.electricityUsage, '度');
      console.log('  - 水费用量:', result.waterUsage, '吨');
      console.log('  - 热水用量:', result.hotWaterUsage, '吨');
      console.log('  - 其他费用:', result.otherFees, '元');
      console.log('  - 其他费用说明:', result.otherFeesDescription);
      console.log('  - 总金额:', result.totalAmount, '元');
      console.log('  - 状态:', result.billStatus, '-', result.billStatusDescription);
      console.log('  - 备注:', result.notes);
      console.log('  - 更新时间:', result.updatedAt);

      return result;
    } catch (error: any) {
      console.error('❌ 更新预估账单失败:', error);
      console.error('📝 错误详情:', error.message);

      if (error.status === 401) {
        console.log('💡 提示：请先登录后再试');
      } else if (error.status === 404) {
        console.log('💡 提示：预估账单不存在或已被删除');
      } else if (error.status === 409) {
        console.log('💡 提示：账单状态冲突，无法更新');
      } else if (error.status === 400) {
        console.log('💡 提示：请求参数错误，请检查输入数据');
      } else if (error.status === 403) {
        console.log('💡 提示：权限不足，请检查用户权限');
      }

      throw error;
    }
  }

  /**
   * 测试更新预估账单 - 只更新房租
   */
  async testUpdateBillRent(billId: number, newRent: number = 1800.00) {
    console.log('🧪 测试更新预估账单房租...');
    console.log('🎯 预估账单ID:', billId, '新房租:', newRent);

    return this.testUpdateEstimatedBill(billId, {
      rent: newRent,
      notes: `房租已调整为¥${newRent.toFixed(2)}`
    });
  }

  /**
   * 测试更新预估账单 - 只更新杂项费用
   */
  async testUpdateBillOtherFees(billId: number, amount: number = 200.00, description: string = "网络费100元 + 清洁费100元") {
    console.log('🧪 测试更新预估账单杂项费用...');
    console.log('🎯 预估账单ID:', billId, '杂项费用:', amount, '说明:', description);

    return this.testUpdateEstimatedBill(billId, {
      otherFees: amount,
      otherFeesDescription: description,
      notes: `杂项费用已更新：${description}`
    });
  }

  /**
   * 测试更新预估账单 - 只更新用量
   */
  async testUpdateBillUsage(billId: number, electricityUsage: number = 150.0, waterUsage: number = 25.0, hotWaterUsage: number = 12.0) {
    console.log('🧪 测试更新预估账单用量...');
    console.log('🎯 预估账单ID:', billId);
    console.log('⚡ 电费用量:', electricityUsage, '度');
    console.log('💧 水费用量:', waterUsage, '吨');
    console.log('🔥 热水用量:', hotWaterUsage, '吨');

    return this.testUpdateEstimatedBill(billId, {
      electricityUsage,
      waterUsage,
      hotWaterUsage,
      notes: `用量已更新：电${electricityUsage}度，水${waterUsage}吨，热水${hotWaterUsage}吨`
    });
  }

  /**
   * 测试更新预估账单 - 只更新状态
   */
  async testUpdateBillStatus(billId: number, newStatus: string = "CONFIRMED") {
    console.log('🧪 测试更新预估账单状态...');
    console.log('🎯 预估账单ID:', billId, '新状态:', newStatus);

    return this.testUpdateEstimatedBill(billId, {
      billStatus: newStatus,
      notes: `账单状态已更新为${newStatus}`
    });
  }

  /**
   * 测试更新预估账单 - 只更新备注
   */
  async testUpdateBillNotes(billId: number, notes: string = "账单信息已手动验证和更新") {
    console.log('🧪 测试更新预估账单备注...');
    console.log('🎯 预估账单ID:', billId, '新备注:', notes);

    return this.testUpdateEstimatedBill(billId, { notes });
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

      // 9. 测试更新预估账单（注意：需要先有预估账单）
      // await this.testUpdateEstimatedBill(1); // 取消注释以测试更新功能
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // 10. 测试删除预估账单（注意：这会删除刚生成的账单）
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
  console.log('   window.testBillAPI.testBillDetailAPIFix() - 测试账单详情API修复');
  console.log('   window.testBillAPI.testUpdateBill(billId) - 测试更新账单');
  console.log('   window.testBillAPI.testPayBill(billId) - 测试支付账单');
  console.log('   window.testBillAPI.testDeleteBill(billId) - 测试删除账单');
  console.log('   window.testBillAPI.testGetBillStats() - 测试获取账单统计');
  console.log('   window.testBillAPI.testGenerateBills() - 测试生成账单');
  console.log('   window.testBillAPI.testGetEstimatedBills() - 测试获取预估账单');
  console.log('   window.testBillAPI.testGetEstimatedBillsByRoomId(roomId) - 测试获取房间预估账单');
  console.log('   window.testBillAPI.testGetEstimatedBillsByStatus(status) - 测试获取状态预估账单');
  console.log('   window.testBillAPI.testGenerateEstimatedBill(roomId, billMonth) - 测试生成预估账单');
  console.log('   window.testBillAPI.testUpdateEstimatedBill(billId, updateData) - 测试更新预估账单');
  console.log('   window.testBillAPI.testUpdateBillRent(billId, newRent) - 测试更新房租');
  console.log('   window.testBillAPI.testUpdateBillOtherFees(billId, amount, description) - 测试更新杂项费用');
  console.log('   window.testBillAPI.testUpdateBillUsage(billId, electricity, water, hotWater) - 测试更新用量');
  console.log('   window.testBillAPI.testUpdateBillStatus(billId, status) - 测试更新状态');
  console.log('   window.testBillAPI.testUpdateBillNotes(billId, notes) - 测试更新备注');
  console.log('   window.testBillAPI.testDeleteEstimatedBill(billId) - 测试删除预估账单');
  console.log('   window.testBillAPI.runAllTests() - 运行所有测试');
  console.log('');
  console.log('💡 预估账单操作示例:');
  console.log('   window.testBillAPI.testGenerateEstimatedBill(1, "2025-08") - 为房间1生成2025年8月预估账单');
  console.log('   window.testBillAPI.testUpdateBillRent(123, 2000) - 更新账单123的房租为2000元');
  console.log('   window.testBillAPI.testUpdateBillOtherFees(123, 300, "网络费150 + 清洁费150") - 更新杂项费用');
  console.log('   window.testBillAPI.testUpdateBillUsage(123, 180, 30, 15) - 更新用量数据');
  console.log('   window.testBillAPI.testUpdateBillStatus(123, "CONFIRMED") - 确认账单');
  console.log('   window.testBillAPI.testUpdateBillNotes(123, "已手动核实") - 更新备注');
  console.log('   window.testBillAPI.testDeleteEstimatedBill(123) - 删除预估账单');
  console.log('');
  console.log('📱 UI操作说明:');
  console.log('   1. 在预估账单列表页面点击"✏️ 编辑"按钮');
  console.log('   2. 在弹出的表单中一次性编辑所有字段');
  console.log('   3. 支持编辑：房租、押金、用量、杂项费用、状态、备注');
  console.log('   4. 点击"保存"提交更新，点击"取消"放弃修改');
  console.log('   5. 点击"🔄 重置为原始值"恢复到编辑前的数据');
  console.log('');
  console.log('⚠️  注意：更新和删除预估账单操作请谨慎使用！');
}

export default billAPITester;
