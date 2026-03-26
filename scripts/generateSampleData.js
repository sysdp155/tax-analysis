const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const products = [
  { name: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99 },
  { name: 'Wireless Mouse', category: 'Electronics', price: 29.99 },
  { name: 'USB-C Cable', category: 'Accessories', price: 19.99 },
  { name: 'Desk Chair', category: 'Furniture', price: 249.99 },
  { name: 'Standing Desk', category: 'Furniture', price: 599.99 },
  { name: 'Monitor 27"', category: 'Electronics', price: 399.99 },
  { name: 'Keyboard Mechanical', category: 'Electronics', price: 149.99 },
  { name: 'Webcam HD', category: 'Electronics', price: 89.99 },
  { name: 'Headphones', category: 'Electronics', price: 199.99 },
  { name: 'Desk Lamp', category: 'Accessories', price: 49.99 },
  { name: 'Notebook Set', category: 'Stationery', price: 24.99 },
  { name: 'Pen Pack', category: 'Stationery', price: 12.99 },
  { name: 'Phone Stand', category: 'Accessories', price: 34.99 },
  { name: 'Cable Organizer', category: 'Accessories', price: 15.99 },
  { name: 'Tablet 10"', category: 'Electronics', price: 449.99 }
];

const customers = [
  'Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs',
  'Digital Dynamics', 'Smart Systems', 'Future Tech', 'Prime Enterprises',
  'Alpha Industries', 'Beta Solutions', 'Gamma Corp', 'Delta Systems',
  'Epsilon Group', 'Zeta Technologies', 'Eta Innovations'
];

const addresses = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'
];

const channels = ['Online', 'Retail Store', 'Partner', 'Direct Sales'];
const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Cancelled'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSampleData(numRows = 500) {
  const data = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2024, 11, 31);
  
  for (let i = 0; i < numRows; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = product.price;
    const total = quantity * unitPrice;
    
    data.push({
      Date: randomDate(startDate, endDate).toISOString().split('T')[0],
      Order_ID: `ORD-${String(i + 1000).padStart(6, '0')}`,
      Product: product.name,
      Category: product.category,
      Quantity: quantity,
      Unit_Price: unitPrice,
      Total: parseFloat(total.toFixed(2)),
      Customer: customers[Math.floor(Math.random() * customers.length)],
      Address: addresses[Math.floor(Math.random() * addresses.length)],
      Channel: channels[Math.floor(Math.random() * channels.length)],
      Status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  data.sort((a, b) => new Date(a.Date) - new Date(b.Date));
  
  return data;
}

const sampleData = generateSampleData(500);

const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');

const outputPath = path.join(__dirname, '..', 'public', 'sample-data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Sample data generated: ${outputPath}`);
console.log(`Total rows: ${sampleData.length}`);
console.log(`Date range: ${sampleData[0].Date} to ${sampleData[sampleData.length - 1].Date}`);
