const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', '1.xlsx');

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('Sheet Name:', sheetName);
  console.log('\nTotal Rows:', data.length);
  
  if (data.length > 0) {
    console.log('\nColumns found:');
    Object.keys(data[0]).forEach(col => {
      console.log('  -', col);
    });
    
    console.log('\nFirst row sample:');
    console.log(JSON.stringify(data[0], null, 2));
  }
} catch (error) {
  console.error('Error reading file:', error.message);
}
