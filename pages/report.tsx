import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ReportPage from '@/components/ReportPage';
import KPICard from '@/components/KPICard';
import { RevenueChart, OrdersChart, ProductChart, ChannelChart, StatusChart } from '@/components/Charts';
import { NormalizedDataRow } from '@/utils/excelParser';
import {
  calculateKPIs,
  analyzeProducts,
  analyzeCategories,
  analyzeChannels,
  analyzeCustomers,
  analyzeTrends,
  detectDataQualityIssues
} from '@/utils/analytics';
import { generateFullInsights } from '@/utils/insightGenerator';
import { exportReportToPDF } from '@/utils/pdfExport';
import { exportReportToWord } from '@/utils/docxExport';
import { format } from 'date-fns';

export default function Report() {
  const router = useRouter();
  const [data, setData] = useState<NormalizedDataRow[]>([]);
  const [companyName, setCompanyName] = useState('Business Analytics');
  const [reportTitle, setReportTitle] = useState('Business Performance Report');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('reportData');
    if (!storedData) {
      router.push('/');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      const normalizedData = parsedData.map((row: any) => ({
        ...row,
        date: new Date(row.date)
      }));
      setData(normalizedData);
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/');
    }
  }, [router]);

  if (data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  const kpis = calculateKPIs(data);
  const products = analyzeProducts(data);
  const categories = analyzeCategories(data);
  const channels = analyzeChannels(data);
  const customers = analyzeCustomers(data);
  const trends = analyzeTrends(data);
  const insights = generateFullInsights(kpis, trends, products, categories, channels);
  const qualityIssues = detectDataQualityIssues(data);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportReportToPDF('report-container', `${reportTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    try {
      await exportReportToWord(
        kpis,
        products,
        categories,
        channels,
        customers,
        insights,
        reportTitle,
        companyName
      );
    } catch (error) {
      console.error('Error exporting Word:', error);
      alert('Failed to export Word document. Please try again.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Head>
        <title>{reportTitle} | Business Report Generator</title>
        <meta name="description" content="Professional business report with insights and analytics" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                {isEditing ? (
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    className="text-xl font-semibold border-b-2 border-primary focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <h1 
                    className="text-xl font-semibold cursor-pointer hover:text-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    {reportTitle}
                  </h1>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={handleExportWord}
                  disabled={isExportingWord}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isExportingWord ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Word
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div id="report-container">
            {/* Page 1: Executive Summary */}
            <ReportPage pageNumber={1} title="Executive Summary" companyName={companyName}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Overview</h2>
                  <p className="text-sm text-gray-600">
                    Reporting Period: {format(kpis.reportingPeriod.start, 'MMMM dd, yyyy')} - {format(kpis.reportingPeriod.end, 'MMMM dd, yyyy')}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard
                    title="Total Revenue"
                    value={`$${kpis.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  />
                  <KPICard
                    title="Total Orders"
                    value={kpis.totalOrders.toLocaleString()}
                  />
                  <KPICard
                    title="Average Order Value"
                    value={`$${kpis.averageOrderValue.toFixed(2)}`}
                  />
                  <KPICard
                    title="Units Sold"
                    value={kpis.totalQuantitySold.toLocaleString()}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Completed Orders</p>
                      <p className="text-2xl font-bold text-green-600">{kpis.completedOrders}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Pending Orders</p>
                      <p className="text-2xl font-bold text-yellow-600">{kpis.pendingOrders}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600 mb-1">Cancelled Orders</p>
                      <p className="text-2xl font-bold text-red-600">{kpis.cancelledOrders}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.executiveSummary}</p>
                </div>
              </div>
            </ReportPage>

            {/* Page 2: Sales Performance Overview */}
            <ReportPage pageNumber={2} title="Sales Performance Overview" companyName={companyName}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend Analysis</h2>
                  <RevenueChart data={trends} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Volume Trend</h2>
                  <OrdersChart data={trends} />
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Commentary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.salesOverview}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
                  <StatusChart 
                    completed={kpis.completedOrders}
                    pending={kpis.pendingOrders}
                    cancelled={kpis.cancelledOrders}
                  />
                </div>
              </div>
            </ReportPage>

            {/* Page 3: Product and Category Analysis */}
            <ReportPage pageNumber={3} title="Product & Category Analysis" companyName={companyName}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 Products by Revenue</h2>
                  <ProductChart data={products} />
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Insights</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{insights.productInsights}</p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold">Product</th>
                          <th className="px-4 py-2 text-right font-semibold">Revenue</th>
                          <th className="px-4 py-2 text-right font-semibold">Orders</th>
                          <th className="px-4 py-2 text-right font-semibold">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.slice(0, 10).map((product, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{product.product}</td>
                            <td className="px-4 py-2 text-right">${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-2 text-right">{product.orders}</td>
                            <td className="px-4 py-2 text-right">{product.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Category Performance</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categories.slice(0, 6).map((category, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Revenue: ${category.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          <p>Orders: {category.orders}</p>
                          <p>Quantity: {category.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ReportPage>

            {/* Page 4: Channel and Customer Insights */}
            <ReportPage pageNumber={4} title="Channel & Customer Insights" companyName={companyName}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Channel Distribution</h2>
                  <ChannelChart data={channels} />
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Channel Analysis</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{insights.channelInsights}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {channels.map((channel, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{channel.channel}</h4>
                        <p className="text-2xl font-bold text-primary mb-1">
                          ${channel.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-600">{channel.orders} orders ({channel.percentage.toFixed(1)}%)</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Top Customers</h2>
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Rank</th>
                          <th className="px-4 py-3 text-left font-semibold">Customer</th>
                          <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                          <th className="px-4 py-3 text-right font-semibold">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {customers.slice(0, 10).map((customer, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{idx + 1}</td>
                            <td className="px-4 py-3">{customer.customer}</td>
                            <td className="px-4 py-3 text-right">${customer.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right">{customer.orders}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </ReportPage>

            {/* Page 5: Conclusions and Recommendations */}
            <ReportPage pageNumber={5} title="Conclusions & Recommendations" companyName={companyName}>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Overall Performance Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The business has generated <span className="font-semibold">${kpis.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> in total revenue 
                    with an average order value of <span className="font-semibold">${kpis.averageOrderValue.toFixed(2)}</span>. 
                    Order completion rate stands at <span className="font-semibold">{((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(1)}%</span>, 
                    demonstrating {((kpis.completedOrders / kpis.totalOrders) * 100) > 85 ? 'strong' : 'moderate'} operational efficiency.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Strategic Recommendations</h2>
                  <div className="space-y-4">
                    {insights.recommendations.map((recommendation, idx) => (
                      <div key={idx} className="bg-white border-l-4 border-primary rounded-lg p-5 shadow-sm">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Business Risks
                    </h3>
                    <ul className="space-y-2 text-sm text-red-800">
                      {kpis.cancelledOrders / kpis.totalOrders > 0.1 && (
                        <li>• High cancellation rate impacting revenue</li>
                      )}
                      {channels[0]?.percentage > 70 && (
                        <li>• Over-reliance on single sales channel</li>
                      )}
                      {products.length > 0 && (products.slice(0, 3).reduce((s, p) => s + p.revenue, 0) / products.reduce((s, p) => s + p.revenue, 0)) > 0.6 && (
                        <li>• Revenue concentration in few products</li>
                      )}
                      <li>• Market volatility and competitive pressure</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Growth Opportunities
                    </h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Expand product portfolio and diversify offerings</li>
                      <li>• Develop underperforming sales channels</li>
                      <li>• Implement customer retention programs</li>
                      <li>• Optimize pricing and promotional strategies</li>
                    </ul>
                  </div>
                </div>

                {qualityIssues.missingValues > 0 || qualityIssues.duplicateRows > 0 || qualityIssues.invalidTotals > 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">Data Quality Notes</h3>
                    <p className="text-sm text-yellow-800">
                      {qualityIssues.missingValues > 0 && `${qualityIssues.missingValues} records with missing values. `}
                      {qualityIssues.duplicateRows > 0 && `${qualityIssues.duplicateRows} potential duplicate entries. `}
                      {qualityIssues.invalidTotals > 0 && `${qualityIssues.invalidTotals} records with calculation discrepancies. `}
                      Consider data cleanup for more accurate analysis.
                    </p>
                  </div>
                ) : null}

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    This report was generated on {format(new Date(), 'MMMM dd, yyyy')} using automated business intelligence analysis.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    For questions or additional analysis, please contact your business analytics team.
                  </p>
                </div>
              </div>
            </ReportPage>
          </div>
        </div>
      </div>
    </>
  );
}
