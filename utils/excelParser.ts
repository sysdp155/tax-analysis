import * as XLSX from 'xlsx';

export interface RawDataRow {
  [key: string]: any;
}

export interface NormalizedDataRow {
  date: Date;
  orderId: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  address: string;
  channel: string;
  status: string;
}

const COLUMN_MAPPINGS: { [key: string]: string[] } = {
  date: ['date', 'order_date', 'orderdate', 'transaction_date'],
  orderId: ['order_id', 'orderid', 'order id', 'id', 'transaction_id'],
  product: ['product', 'product_name', 'productname', 'item', 'item_name'],
  category: ['category', 'product_category', 'productcategory', 'type'],
  quantity: ['quantity', 'qty', 'units', 'amount'],
  unitPrice: ['unit_price', 'unitprice', 'unit price', 'price', 'unit_cost', 'unit price (usd)'],
  total: ['total', 'total_price', 'totalprice', 'amount', 'revenue', 'gross_sales', 'gross sales', 'net_sales', 'net sales', 'gross sales (usd)', 'net sales (usd)'],
  customer: ['customer', 'customer_name', 'customername', 'client', 'buyer'],
  address: ['address', 'location', 'city', 'region', 'area'],
  channel: ['channel', 'sales_channel', 'saleschannel', 'source', 'platform'],
  status: ['status', 'order_status', 'orderstatus', 'state']
};

export function parseExcelFile(file: File): Promise<RawDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as RawDataRow[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

function normalizeColumnName(columnName: string): string | null {
  const normalized = columnName.toLowerCase().trim().replace(/[_\s]+/g, '_');
  
  for (const [standardName, variations] of Object.entries(COLUMN_MAPPINGS)) {
    if (variations.some(v => normalized.includes(v) || v.includes(normalized))) {
      return standardName;
    }
  }
  
  return null;
}

export function normalizeData(rawData: RawDataRow[]): NormalizedDataRow[] {
  if (rawData.length === 0) return [];
  
  const columnMap: { [key: string]: string } = {};
  const firstRow = rawData[0];
  
  for (const column of Object.keys(firstRow)) {
    const normalized = normalizeColumnName(column);
    if (normalized) {
      columnMap[normalized] = column;
    }
  }
  
  return rawData.map(row => {
    const normalized: any = {};
    
    for (const [standardName, originalName] of Object.entries(columnMap)) {
      normalized[standardName] = row[originalName];
    }
    
    // Handle Excel serial date numbers
    let parsedDate = new Date();
    if (normalized.date) {
      if (typeof normalized.date === 'number') {
        // Excel serial date: days since 1900-01-01
        parsedDate = new Date((normalized.date - 25569) * 86400 * 1000);
      } else {
        parsedDate = new Date(normalized.date);
      }
    }
    
    return {
      date: parsedDate,
      orderId: String(normalized.orderId || ''),
      product: String(normalized.product || 'Unknown'),
      category: String(normalized.category || 'Uncategorized'),
      quantity: Number(normalized.quantity) || 0,
      unitPrice: Number(normalized.unitPrice) || 0,
      total: Number(normalized.total) || (Number(normalized.quantity) || 0) * (Number(normalized.unitPrice) || 0),
      customer: String(normalized.customer || 'Unknown'),
      address: String(normalized.address || 'Unknown'),
      channel: String(normalized.channel || 'Unknown'),
      status: String(normalized.status || 'Completed').toLowerCase()
    };
  });
}

export function validateExcelStructure(rawData: RawDataRow[]): { valid: boolean; missingColumns: string[] } {
  if (rawData.length === 0) {
    return { valid: false, missingColumns: ['No data found'] };
  }
  
  const firstRow = rawData[0];
  const columns = Object.keys(firstRow).map(c => c.toLowerCase());
  const missingColumns: string[] = [];
  
  const requiredFields = ['date', 'product', 'total'];
  
  for (const field of requiredFields) {
    const variations = COLUMN_MAPPINGS[field];
    const found = variations.some(v => columns.some(c => c.includes(v) || v.includes(c)));
    
    if (!found) {
      missingColumns.push(field);
    }
  }
  
  return {
    valid: missingColumns.length === 0,
    missingColumns
  };
}
