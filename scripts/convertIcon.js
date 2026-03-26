// Icon Conversion Helper
// This script provides instructions for converting the SVG icon to PNG

console.log('\n=== Icon Conversion Instructions ===\n');
console.log('To build the desktop app, you need to convert icon.svg to icon.png (512x512)');
console.log('\nOption 1: Online Converters');
console.log('  - Visit: https://cloudconvert.com/svg-to-png');
console.log('  - Upload: public/icon.svg');
console.log('  - Set size: 512x512');
console.log('  - Download as: public/icon.png');
console.log('\nOption 2: Using ImageMagick (if installed)');
console.log('  Run: convert public/icon.svg -resize 512x512 public/icon.png');
console.log('\nOption 3: Using Node.js (install sharp)');
console.log('  npm install sharp');
console.log('  Then run this script with --convert flag');
console.log('\n====================================\n');

if (process.argv.includes('--convert')) {
  try {
    const sharp = require('sharp');
    const fs = require('fs');
    const path = require('path');
    
    const svgPath = path.join(__dirname, '../public/icon.svg');
    const pngPath = path.join(__dirname, '../public/icon.png');
    
    sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath)
      .then(() => {
        console.log('✓ Icon converted successfully!');
      })
      .catch(err => {
        console.error('✗ Conversion failed:', err.message);
      });
  } catch (err) {
    console.error('✗ Sharp not installed. Run: npm install sharp');
  }
}
