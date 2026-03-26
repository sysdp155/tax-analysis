# Business Report Generator

A professional desktop application that transforms Excel sales data into comprehensive, multi-page business reports with AI-generated insights, charts, and actionable recommendations.

## Features

- **Excel File Upload**: Drag-and-drop or browse to upload .xlsx, .xls, or .csv files
- **Intelligent Data Parsing**: Automatically maps common column variations (e.g., "Order ID" vs "Order_ID")
- **Comprehensive Analytics**: 
  - KPI calculations (revenue, orders, AOV, quantities)
  - Product and category analysis
  - Sales channel performance
  - Customer insights
  - Trend analysis
- **AI-Generated Insights**: Professional business commentary and recommendations
- **Professional Charts**: Revenue trends, order volumes, product performance, channel distribution
- **5-Page Report Structure**:
  1. Executive Summary
  2. Sales Performance Overview
  3. Product & Category Analysis
  4. Channel & Customer Insights
  5. Conclusions & Recommendations
- **PDF & DOCX Export**: Download professional reports in multiple formats
- **Print Support**: Print-optimized layouts
- **Editable Report Titles**: Customize company name and report title
- **Desktop App**: Runs as a standalone application on Windows, macOS, and Linux

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Desktop**: Electron
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Excel Parsing**: SheetJS (xlsx)
- **PDF Export**: jsPDF + html2canvas
- **DOCX Export**: docx
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Generate sample data:

```bash
node scripts/generateSampleData.js
```

### Running the Desktop App

Development mode (with hot reload):
```bash
npm run electron:dev
```

### Building the Desktop App

See [BUILD.md](BUILD.md) for detailed build instructions.

Quick build for your platform:
```bash
npm run dist
```

The built application will be in the `dist/` folder.

## Web Version (Optional)

You can also run as a web app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## Expected Excel Structure

Your Excel file should contain columns similar to:

- **Date**: Order or transaction date
- **Order_ID**: Unique order identifier
- **Product**: Product name
- **Category**: Product category
- **Quantity**: Number of units
- **Unit_Price**: Price per unit
- **Total**: Total amount
- **Customer**: Customer name
- **Address**: Location/city
- **Channel**: Sales channel (Online, Retail, etc.)
- **Status**: Order status (Completed, Pending, Cancelled)

The app intelligently maps common column name variations.

## Usage

1. **Upload**: Drop your Excel file or click to browse
2. **Processing**: The app validates and analyzes your data
3. **Review**: View the generated 5-page report with insights
4. **Export**: Download as PDF or print directly

## Project Structure

\`\`\`
├── components/          # React components
│   ├── Charts.tsx      # Chart components
│   ├── FileUpload.tsx  # File upload component
│   ├── KPICard.tsx     # KPI display card
│   └── ReportPage.tsx  # Report page wrapper
├── pages/              # Next.js pages
│   ├── index.tsx       # Upload page
│   └── report.tsx      # Report display page
├── utils/              # Utility functions
│   ├── analytics.ts    # Data analysis functions
│   ├── excelParser.ts  # Excel parsing logic
│   ├── insightGenerator.ts  # AI insight generation
│   └── pdfExport.ts    # PDF export functionality
├── scripts/            # Utility scripts
│   └── generateSampleData.js  # Sample data generator
└── styles/             # Global styles
    └── globals.css
\`\`\`

## Key Features Explained

### Data Validation

- Checks for required columns (Date, Product, Total)
- Validates file format
- Provides helpful error messages

### Column Mapping

Automatically recognizes variations like:
- "Order ID" → "Order_ID" → "OrderID"
- "Unit Price" → "Unit_Price" → "UnitPrice"

### AI Insights

Generates professional commentary on:
- Overall performance trends
- Product concentration risks
- Channel performance
- Strategic recommendations
- Growth opportunities

### Data Quality Detection

Identifies:
- Missing values
- Duplicate rows
- Invalid calculations
- Anomalies

## Customization

### Company Branding

Edit the report to include your company name by clicking on the title in the report view.

### Chart Colors

Modify colors in `components/Charts.tsx`:

\`\`\`typescript
const COLORS = ['#2563eb', '#10b981', '#f59e0b', ...];
\`\`\`

### Report Structure

Customize report pages in `pages/report.tsx` by modifying the `ReportPage` components.

## Production Deployment

Build for production:

\`\`\`bash
npm run build
npm start
\`\`\`

Deploy to Vercel, Netlify, or any Node.js hosting platform.

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
