import { NormalizedDataRow } from './excelParser';
import { format, startOfDay, startOfWeek, startOfMonth, differenceInDays } from 'date-fns';

export interface KPIMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalQuantitySold: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  reportingPeriod: { start: Date; end: Date };
}

export interface ProductAnalysis {
  product: string;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface CategoryAnalysis {
  category: string;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface ChannelAnalysis {
  channel: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface CustomerAnalysis {
  customer: string;
  revenue: number;
  orders: number;
}

export interface TrendData {
  period: string;
  revenue: number;
  orders: number;
}

export interface DataQualityIssues {
  missingValues: number;
  duplicateRows: number;
  invalidTotals: number;
}

export function calculateKPIs(data: NormalizedDataRow[]): KPIMetrics {
  const totalRevenue = data.reduce((sum, row) => sum + row.total, 0);
  const totalOrders = data.length;
  const totalQuantitySold = data.reduce((sum, row) => sum + row.quantity, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const completedOrders = data.filter(row => 
    row.status.includes('complete') || row.status.includes('delivered') || row.status.includes('success')
  ).length;
  
  const pendingOrders = data.filter(row => 
    row.status.includes('pending') || row.status.includes('processing') || row.status.includes('progress')
  ).length;
  
  const cancelledOrders = data.filter(row => 
    row.status.includes('cancel') || row.status.includes('refund') || row.status.includes('failed')
  ).length;
  
  const dates = data.map(row => row.date).sort((a, b) => a.getTime() - b.getTime());
  
  return {
    totalRevenue,
    totalOrders,
    totalQuantitySold,
    averageOrderValue,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    reportingPeriod: {
      start: dates[0] || new Date(),
      end: dates[dates.length - 1] || new Date()
    }
  };
}

export function analyzeProducts(data: NormalizedDataRow[]): ProductAnalysis[] {
  const productMap = new Map<string, ProductAnalysis>();
  
  data.forEach(row => {
    const existing = productMap.get(row.product) || {
      product: row.product,
      revenue: 0,
      quantity: 0,
      orders: 0
    };
    
    existing.revenue += row.total;
    existing.quantity += row.quantity;
    existing.orders += 1;
    
    productMap.set(row.product, existing);
  });
  
  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

export function analyzeCategories(data: NormalizedDataRow[]): CategoryAnalysis[] {
  const categoryMap = new Map<string, CategoryAnalysis>();
  
  data.forEach(row => {
    const existing = categoryMap.get(row.category) || {
      category: row.category,
      revenue: 0,
      quantity: 0,
      orders: 0
    };
    
    existing.revenue += row.total;
    existing.quantity += row.quantity;
    existing.orders += 1;
    
    categoryMap.set(row.category, existing);
  });
  
  return Array.from(categoryMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

export function analyzeChannels(data: NormalizedDataRow[]): ChannelAnalysis[] {
  const channelMap = new Map<string, { revenue: number; orders: number }>();
  const totalRevenue = data.reduce((sum, row) => sum + row.total, 0);
  
  data.forEach(row => {
    const existing = channelMap.get(row.channel) || { revenue: 0, orders: 0 };
    existing.revenue += row.total;
    existing.orders += 1;
    channelMap.set(row.channel, existing);
  });
  
  return Array.from(channelMap.entries())
    .map(([channel, stats]) => ({
      channel,
      revenue: stats.revenue,
      orders: stats.orders,
      percentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function analyzeCustomers(data: NormalizedDataRow[]): CustomerAnalysis[] {
  const customerMap = new Map<string, CustomerAnalysis>();
  
  data.forEach(row => {
    const existing = customerMap.get(row.customer) || {
      customer: row.customer,
      revenue: 0,
      orders: 0
    };
    
    existing.revenue += row.total;
    existing.orders += 1;
    
    customerMap.set(row.customer, existing);
  });
  
  return Array.from(customerMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

export function analyzeTrends(data: NormalizedDataRow[]): TrendData[] {
  if (data.length === 0) return [];
  
  const dates = data.map(row => row.date).sort((a, b) => a.getTime() - b.getTime());
  const daysDiff = differenceInDays(dates[dates.length - 1], dates[0]);
  
  let groupBy: 'day' | 'week' | 'month' = 'day';
  if (daysDiff > 90) groupBy = 'month';
  else if (daysDiff > 30) groupBy = 'week';
  
  const trendMap = new Map<string, { revenue: number; orders: number }>();
  
  data.forEach(row => {
    let key: string;
    if (groupBy === 'month') {
      key = format(startOfMonth(row.date), 'MMM yyyy');
    } else if (groupBy === 'week') {
      key = format(startOfWeek(row.date), 'MMM dd');
    } else {
      key = format(startOfDay(row.date), 'MMM dd');
    }
    
    const existing = trendMap.get(key) || { revenue: 0, orders: 0 };
    existing.revenue += row.total;
    existing.orders += 1;
    trendMap.set(key, existing);
  });
  
  return Array.from(trendMap.entries())
    .map(([period, stats]) => ({
      period,
      revenue: stats.revenue,
      orders: stats.orders
    }));
}

export function detectDataQualityIssues(data: NormalizedDataRow[]): DataQualityIssues {
  let missingValues = 0;
  let invalidTotals = 0;
  
  data.forEach(row => {
    if (!row.product || row.product === 'Unknown' || 
        !row.customer || row.customer === 'Unknown') {
      missingValues++;
    }
    
    const calculatedTotal = row.quantity * row.unitPrice;
    if (Math.abs(calculatedTotal - row.total) > 0.01 && calculatedTotal > 0) {
      invalidTotals++;
    }
  });
  
  const orderIds = data.map(row => row.orderId).filter(id => id);
  const duplicateRows = orderIds.length - new Set(orderIds).size;
  
  return {
    missingValues,
    duplicateRows,
    invalidTotals
  };
}
