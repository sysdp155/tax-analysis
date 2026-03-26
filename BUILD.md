# Desktop App Build Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Development Mode

Run the app in development mode:
```bash
npm run electron:dev
```

## Building for Production

Build for current platform:
```bash
npm run dist
```

Platform-specific builds:
```bash
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
```

## Output
Built apps will be in `dist/` folder.

## Icon Setup
Convert icon.svg to icon.png (512x512) before building.
Use online tools like cloudconvert.com or ImageMagick.
