import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportReportToPDF(reportElementId: string, filename: string = 'business-report.pdf'): Promise<void> {
  const reportElement = document.getElementById(reportElementId);
  
  if (!reportElement) {
    throw new Error('Report element not found');
  }
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  
  const pages = reportElement.querySelectorAll('.report-page');
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;
    
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    if (i > 0) {
      pdf.addPage();
    }
    
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, Math.min(imgHeight, pageHeight - margin * 2));
    
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Page ${i + 1} of ${pages.length}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  pdf.save(filename);
}

export function generatePrintStyles(): string {
  return `
    @media print {
      body * {
        visibility: hidden;
      }
      #report-container, #report-container * {
        visibility: visible;
      }
      #report-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .report-page {
        page-break-after: always;
        page-break-inside: avoid;
      }
      .no-print {
        display: none !important;
      }
    }
  `;
}
