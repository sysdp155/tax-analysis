# Quick Start Guide

## Desktop App Development

1. Install dependencies:
```bash
npm install
```

2. Convert icon (choose one method):
```bash
# Method 1: Get instructions
node scripts/convertIcon.js

# Method 2: Use online converter
# Visit https://cloudconvert.com/svg-to-png
# Upload public/icon.svg, set size to 512x512
# Save as public/icon.png
```

3. Run in development mode:
```bash
npm run electron:dev
```

## Building Desktop App

Build for your platform:
```bash
npm run dist
```

Find the installer in the `dist/` folder.

## Testing with Sample Data

Generate sample Excel file:
```bash
node scripts/generateSampleData.js
```

This creates `1.xlsx` with sample sales data.

## Usage

1. Launch the app
2. Drag and drop the Excel file or click to browse
3. View the generated report
4. Export as PDF or DOCX

## Troubleshooting

If the app doesn't start:
- Ensure port 3000 is available
- Check that all dependencies are installed
- Try running `npm run build` first

For icon issues:
- Make sure icon.png exists in public/ folder
- Icon should be 512x512 pixels
