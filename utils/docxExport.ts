import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { KPIMetrics, ProductAnalysis, CategoryAnalysis, ChannelAnalysis, CustomerAnalysis } from './analytics';
import { ReportInsights } from './insightGenerator';

export async function exportReportToWord(
  kpis: KPIMetrics,
  products: ProductAnalysis[],
  categories: CategoryAnalysis[],
  channels: ChannelAnalysis[],
  customers: CustomerAnalysis[],
  insights: ReportInsights,
  reportTitle: string = 'Business Performance Report',
  companyName: string = 'Business Analytics'
): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title Page
          new Paragraph({
            text: reportTitle,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: companyName,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Generated on ${format(new Date(), 'MMMM dd, yyyy')}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: `Reporting Period: ${format(kpis.reportingPeriod.start, 'MMM dd, yyyy')} - ${format(kpis.reportingPeriod.end, 'MMM dd, yyyy')}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),

          // Page 1: Executive Summary
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true
          }),

          // KPI Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Total Revenue', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Total Orders', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Average Order Value', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Units Sold', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(`$${kpis.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)]
                  }),
                  new TableCell({
                    children: [new Paragraph(kpis.totalOrders.toLocaleString())]
                  }),
                  new TableCell({
                    children: [new Paragraph(`$${kpis.averageOrderValue.toFixed(2)}`)]
                  }),
                  new TableCell({
                    children: [new Paragraph(kpis.totalQuantitySold.toLocaleString())]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          new Paragraph({
            text: 'Key Highlights',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Completed Orders: ', bold: true }),
              new TextRun(kpis.completedOrders.toString())
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Pending Orders: ', bold: true }),
              new TextRun(kpis.pendingOrders.toString())
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Cancelled Orders: ', bold: true }),
              new TextRun(kpis.cancelledOrders.toString())
            ],
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: insights.executiveSummary,
            spacing: { after: 400 }
          }),

          // Page 2: Sales Performance Overview
          new Paragraph({
            text: 'Sales Performance Overview',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true
          }),

          new Paragraph({
            text: 'Performance Commentary',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: insights.salesOverview,
            spacing: { after: 400 }
          }),

          new Paragraph({
            text: 'Order Status Distribution',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Completed: ${kpis.completedOrders} (${((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(1)}%)` })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Pending: ${kpis.pendingOrders} (${((kpis.pendingOrders / kpis.totalOrders) * 100).toFixed(1)}%)` })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Cancelled: ${kpis.cancelledOrders} (${((kpis.cancelledOrders / kpis.totalOrders) * 100).toFixed(1)}%)` })
            ],
            spacing: { after: 400 }
          }),

          // Page 3: Product Analysis
          new Paragraph({
            text: 'Product & Category Analysis',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true
          }),

          new Paragraph({
            text: 'Product Insights',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: insights.productInsights,
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: 'Top 10 Products by Revenue',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Product', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Revenue', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Orders', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Quantity', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  })
                ]
              }),
              ...products.slice(0, 10).map(product => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(product.product)] }),
                    new TableCell({ children: [new Paragraph(`$${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)] }),
                    new TableCell({ children: [new Paragraph(product.orders.toString())] }),
                    new TableCell({ children: [new Paragraph(product.quantity.toString())] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Page 4: Channel & Customer Insights
          new Paragraph({
            text: 'Channel & Customer Insights',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true
          }),

          new Paragraph({
            text: 'Channel Analysis',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: insights.channelInsights,
            spacing: { after: 200 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Channel', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Revenue', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Orders', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Percentage', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  })
                ]
              }),
              ...channels.map(channel => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(channel.channel)] }),
                    new TableCell({ children: [new Paragraph(`$${channel.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)] }),
                    new TableCell({ children: [new Paragraph(channel.orders.toString())] }),
                    new TableCell({ children: [new Paragraph(`${channel.percentage.toFixed(1)}%`)] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          new Paragraph({
            text: 'Top Customers',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Rank', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Customer', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Revenue', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Orders', bold: true })] })],
                    shading: { fill: 'E5E7EB' }
                  })
                ]
              }),
              ...customers.slice(0, 10).map((customer, idx) => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph((idx + 1).toString())] }),
                    new TableCell({ children: [new Paragraph(customer.customer)] }),
                    new TableCell({ children: [new Paragraph(`$${customer.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)] }),
                    new TableCell({ children: [new Paragraph(customer.orders.toString())] })
                  ]
                })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Page 5: Conclusions & Recommendations
          new Paragraph({
            text: 'Conclusions & Recommendations',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true
          }),

          new Paragraph({
            text: 'Overall Performance Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: `The business has generated $${kpis.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} in total revenue with an average order value of $${kpis.averageOrderValue.toFixed(2)}. Order completion rate stands at ${((kpis.completedOrders / kpis.totalOrders) * 100).toFixed(1)}%, demonstrating ${((kpis.completedOrders / kpis.totalOrders) * 100) > 85 ? 'strong' : 'moderate'} operational efficiency.`,
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: 'Strategic Recommendations',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 }
          }),

          ...insights.recommendations.map((rec, idx) => 
            new Paragraph({
              children: [
                new TextRun({ text: `${idx + 1}. `, bold: true }),
                new TextRun(rec)
              ],
              spacing: { after: 100 }
            })
          ),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          new Paragraph({
            text: '---',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `This report was generated on ${format(new Date(), 'MMMM dd, yyyy')} using automated business intelligence analysis.`,
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${reportTitle.replace(/\s+/g, '-').toLowerCase()}.docx`);
}
