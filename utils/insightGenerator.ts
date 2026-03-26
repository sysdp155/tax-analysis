import { KPIMetrics, ProductAnalysis, CategoryAnalysis, ChannelAnalysis, TrendData } from './analytics';
import { format } from 'date-fns';

export interface ReportInsights {
  executiveSummary: string;
  salesOverview: string;
  productInsights: string;
  channelInsights: string;
  recommendations: string[];
}

export function generateExecutiveSummary(kpis: KPIMetrics): string {
  const { totalRevenue, totalOrders, averageOrderValue, reportingPeriod } = kpis;
  const startDate = format(reportingPeriod.start, 'MMM dd, yyyy');
  const endDate = format(reportingPeriod.end, 'MMM dd, yyyy');
  
  const completionRate = kpis.totalOrders > 0 
    ? ((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(1) 
    : '0';
  
  return `This report analyzes business performance for the period from ${startDate} to ${endDate}. During this timeframe, the business generated $${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in total revenue across ${totalOrders.toLocaleString()} orders. The average order value stood at $${averageOrderValue.toFixed(2)}, with ${kpis.totalQuantitySold.toLocaleString()} units sold. Order completion rate reached ${completionRate}%, with ${kpis.completedOrders} completed orders, ${kpis.pendingOrders} pending, and ${kpis.cancelledOrders} cancelled. Overall, the business demonstrates ${totalRevenue > 50000 ? 'strong' : 'moderate'} revenue generation with ${completionRate > '90' ? 'excellent' : completionRate > '75' ? 'good' : 'room for improvement in'} order fulfillment performance.`;
}

export function generateSalesOverview(trends: TrendData[], kpis: KPIMetrics): string {
  if (trends.length === 0) {
    return 'Insufficient data to analyze sales trends.';
  }
  
  const revenues = trends.map(t => t.revenue);
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues);
  const peakPeriod = trends.find(t => t.revenue === maxRevenue)?.period || 'unknown';
  
  const variance = revenues.reduce((sum, r) => sum + Math.pow(r - avgRevenue, 2), 0) / revenues.length;
  const volatility = variance > avgRevenue * 0.3 ? 'high' : variance > avgRevenue * 0.1 ? 'moderate' : 'low';
  
  let trendDirection = 'stable';
  if (trends.length >= 3) {
    const firstThird = trends.slice(0, Math.floor(trends.length / 3)).reduce((s, t) => s + t.revenue, 0);
    const lastThird = trends.slice(-Math.floor(trends.length / 3)).reduce((s, t) => s + t.revenue, 0);
    const change = ((lastThird - firstThird) / firstThird) * 100;
    
    if (change > 10) trendDirection = 'increasing';
    else if (change < -10) trendDirection = 'decreasing';
  }
  
  return `Sales performance shows ${trendDirection} trends throughout the reporting period with ${volatility} volatility. Revenue peaked during ${peakPeriod} at $${maxRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}, while the lowest period recorded $${minRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Average revenue per period was $${avgRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}. ${trendDirection === 'increasing' ? 'The upward trajectory indicates positive business momentum and growing market traction.' : trendDirection === 'decreasing' ? 'The declining trend warrants attention and strategic intervention to reverse the pattern.' : 'Stable performance suggests consistent operations, though growth opportunities may exist.'} Order volume ${kpis.totalOrders > 100 ? 'remained robust' : 'showed moderate activity'}, with ${((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(0)}% successfully completed.`;
}

export function generateProductInsights(products: ProductAnalysis[], categories: CategoryAnalysis[]): string {
  if (products.length === 0) {
    return 'No product data available for analysis.';
  }
  
  const topProduct = products[0];
  const topRevenue = products.slice(0, 3).reduce((sum, p) => sum + p.revenue, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const concentration = (topRevenue / totalRevenue) * 100;
  
  const topCategory = categories[0];
  const categoryCount = categories.length;
  
  return `Product analysis reveals that ${topProduct.product} is the top revenue generator, contributing $${topProduct.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} across ${topProduct.orders} orders. The top three products account for ${concentration.toFixed(1)}% of total revenue, indicating ${concentration > 60 ? 'high concentration risk' : concentration > 40 ? 'moderate concentration' : 'well-diversified sales'}. ${categoryCount > 1 ? `Across ${categoryCount} categories, ${topCategory.category} leads with $${topCategory.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} in revenue.` : 'All products fall within a single category.'} ${products.length > 10 ? `With ${products.length} products in the portfolio, the business shows good product diversity.` : 'The product portfolio could benefit from expansion to reduce dependency on key items.'} ${products[products.length - 1].revenue < totalRevenue * 0.01 ? 'Several low-performing products may warrant review for discontinuation or repositioning.' : 'Product performance is relatively balanced across the range.'}`;
}

export function generateChannelInsights(channels: ChannelAnalysis[]): string {
  if (channels.length === 0) {
    return 'No channel data available for analysis.';
  }
  
  const topChannel = channels[0];
  const weakestChannel = channels[channels.length - 1];
  
  let insight = `Channel analysis shows ${topChannel.channel} as the dominant sales channel, generating $${topChannel.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${topChannel.percentage.toFixed(1)}% of total revenue) across ${topChannel.orders} orders. `;
  
  if (channels.length > 1) {
    insight += `In contrast, ${weakestChannel.channel} contributed $${weakestChannel.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${weakestChannel.percentage.toFixed(1)}%), indicating ${weakestChannel.percentage < 10 ? 'significant underperformance' : 'lower market penetration'}. `;
    
    if (topChannel.percentage > 70) {
      insight += `The heavy reliance on ${topChannel.channel} presents concentration risk and suggests opportunity for channel diversification. `;
    } else {
      insight += `Channel distribution shows reasonable balance, reducing dependency risk. `;
    }
  } else {
    insight += 'Operating through a single channel presents both focus and risk concentration. ';
  }
  
  insight += channels.length > 2 
    ? 'Multi-channel presence provides resilience and broader market reach.' 
    : 'Expanding to additional channels could unlock new revenue streams and reduce risk.';
  
  return insight;
}

export function generateRecommendations(
  kpis: KPIMetrics,
  products: ProductAnalysis[],
  channels: ChannelAnalysis[],
  trends: TrendData[]
): string[] {
  const recommendations: string[] = [];
  
  if (kpis.cancelledOrders / kpis.totalOrders > 0.1) {
    recommendations.push('Reduce order cancellation rate by improving product descriptions, inventory management, and customer communication. Current cancellation rate exceeds 10% and directly impacts revenue.');
  }
  
  if (products.length > 0) {
    const topRevenue = products.slice(0, 3).reduce((sum, p) => sum + p.revenue, 0);
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    if ((topRevenue / totalRevenue) > 0.6) {
      recommendations.push('Diversify product portfolio to reduce revenue concentration risk. Consider expanding complementary product lines and promoting mid-tier products to balance revenue distribution.');
    }
  }
  
  if (channels.length > 0 && channels[0].percentage > 70) {
    recommendations.push(`Reduce dependency on ${channels[0].channel} by investing in underperforming channels. Develop channel-specific marketing strategies and optimize customer experience across all touchpoints.`);
  }
  
  if (kpis.averageOrderValue < 100) {
    recommendations.push('Increase average order value through bundling strategies, cross-selling, upselling, and minimum order incentives. Target AOV increase of 15-20% through strategic pricing and promotions.');
  }
  
  if (trends.length >= 3) {
    const revenues = trends.map(t => t.revenue);
    const lastThird = revenues.slice(-Math.floor(revenues.length / 3));
    const declining = lastThird.every((v, i, arr) => i === 0 || v <= arr[i - 1]);
    
    if (declining) {
      recommendations.push('Address declining sales trend through market analysis, competitive review, and customer feedback. Consider refreshing product offerings, adjusting pricing strategy, or launching targeted marketing campaigns.');
    }
  }
  
  if (products.length > 5) {
    const lowPerformers = products.filter(p => p.revenue < (products.reduce((s, p) => s + p.revenue, 0) / products.length) * 0.3);
    if (lowPerformers.length > 0) {
      recommendations.push('Review and optimize or discontinue low-performing products that generate below 30% of average product revenue. Reallocate resources to high-performing items and emerging opportunities.');
    }
  }
  
  if (recommendations.length < 3) {
    recommendations.push('Implement customer retention programs and loyalty initiatives to increase repeat purchase rates and customer lifetime value.');
    recommendations.push('Invest in data analytics capabilities to enable real-time performance monitoring and faster decision-making.');
  }
  
  return recommendations.slice(0, 5);
}

export function generateFullInsights(
  kpis: KPIMetrics,
  trends: TrendData[],
  products: ProductAnalysis[],
  categories: CategoryAnalysis[],
  channels: ChannelAnalysis[]
): ReportInsights {
  return {
    executiveSummary: generateExecutiveSummary(kpis),
    salesOverview: generateSalesOverview(trends, kpis),
    productInsights: generateProductInsights(products, categories),
    channelInsights: generateChannelInsights(channels),
    recommendations: generateRecommendations(kpis, products, channels, trends)
  };
}
