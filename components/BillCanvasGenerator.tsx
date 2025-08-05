import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BillDetail } from '../types/bill';

interface BillCanvasGeneratorProps {
  bill: BillDetail;
  onGenerated?: (imageUri: string) => void;
}

export const BillCanvasGenerator: React.FC<BillCanvasGeneratorProps> = ({
  bill,
  onGenerated,
}) => {
  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    } catch {
      return dateString;
    }
  };

  if (!bill) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>账单信息不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>电子账单</Text>
        <Text style={styles.headerSubtitle}>Electronic Bill</Text>
      </View>

      {/* 账单编号 */}
      <View style={styles.section}>
        <Text style={styles.billNumber}>账单编号: {String(bill.id || 'N/A')}</Text>
      </View>

      {/* 金额信息 */}
      <View style={styles.section}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>应付金额</Text>
          <Text style={styles.amountValue}>{formatAmount(bill.amount || 0)}</Text>
        </View>
      </View>

      {/* 详细信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账单信息</Text>
        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>账单月份：</Text>
          <Text style={styles.detailValue}>{String(bill.billPeriod || '未知')}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>账单日期：</Text>
          <Text style={styles.detailValue}>{bill.dueDate ? formatDate(bill.dueDate) : '未知'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>账单状态：</Text>
          <Text style={styles.detailValue}>{String(bill.statusDescription || '未知')}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>房间信息：</Text>
          <Text style={styles.detailValue}>
            {String(bill.roomNumber || '未知')} · {String(bill.buildingName || '未知')}
          </Text>
        </View>
      </View>

      {/* 费用明细 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>费用明细</Text>
        <View style={styles.divider} />

        {bill.rent && bill.rent > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>房租：</Text>
            <Text style={styles.detailValue}>{formatAmount(bill.rent)}</Text>
          </View>
        )}

        {bill.electricityAmount && bill.electricityAmount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>电费：</Text>
            <Text style={styles.detailValue}>
              {formatAmount(bill.electricityAmount)}
              {bill.electricityUsage ? ` (${String(bill.electricityUsage)}度)` : ''}
            </Text>
          </View>
        )}

        {bill.waterAmount && bill.waterAmount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>水费：</Text>
            <Text style={styles.detailValue}>
              {formatAmount(bill.waterAmount)}
              {bill.waterUsage ? ` (${String(bill.waterUsage)}吨)` : ''}
            </Text>
          </View>
        )}

        {bill.hotWaterAmount && bill.hotWaterAmount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>热水费：</Text>
            <Text style={styles.detailValue}>
              {formatAmount(bill.hotWaterAmount)}
              {bill.hotWaterUsage ? ` (${String(bill.hotWaterUsage)}吨)` : ''}
            </Text>
          </View>
        )}

        {bill.deposit && bill.deposit > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>押金：</Text>
            <Text style={styles.detailValue}>{formatAmount(bill.deposit)}</Text>
          </View>
        )}

        {bill.otherFees && bill.otherFees > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>其他费用：</Text>
            <Text style={styles.detailValue}>
              {formatAmount(bill.otherFees)}
              {bill.otherFeesDescription ? ` (${String(bill.otherFeesDescription)})` : ''}
            </Text>
          </View>
        )}

        {/* 总计 */}
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, styles.totalLabel]}>总计：</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>{formatAmount(bill.amount || 0)}</Text>
        </View>
      </View>

      {bill.notes && (
        <View style={styles.section}>
          <Text style={styles.detailLabel}>备注：</Text>
          <Text style={styles.notes}>{String(bill.notes)}</Text>
        </View>
      )}

      {/* 底部信息 */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>
          生成时间：{new Date().toLocaleString('zh-CN')}
        </Text>
        {bill.createdByUsername && (
          <Text style={styles.footerText}>
            创建人：{String(bill.createdByUsername)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 15,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 5,
  },
  amountContainer: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#dc2626',
  },
  notes: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    padding: 20,
  },
});
