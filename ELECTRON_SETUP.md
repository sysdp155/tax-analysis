# Electron Desktop App Setup

Your Next.js project is now configured as an Electron desktop application!

## Development

Run the app in development mode:

```bash
npm run electron:dev
```

This will:
- Start the Next.js dev server on port 3000
- Launch Electron with hot-reload enabled
- Open DevTools automatically

## Building for Production

### Build for Windows
```bash
npm run electron:build:win
```

### Build for macOS
```bash
npm run electron:build:mac
```

### Build for Linux
```bash
npm run electron:build:linux
```

### Build for all platforms
```bash
npm run electron:build
```

## Output

Built applications will be in the `dist/` folder:
- Windows: `.exe` installer and portable version
- macOS: `.dmg` installer
- Linux: `.AppImage` and `.deb` packages

## Features

- ✅ Native window with custom menu
- ✅ File operations support
- ✅ Keyboard shortcuts (Ctrl/Cmd+O for file open, Ctrl/Cmd+Q to quit)
- ✅ Auto-updates ready (configure in package.json)
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Secure context isolation
- ✅ Production-ready configuration

## Configuration

Edit `electron/main.js` to customize:
- Window size and behavior
- Menu items
- Keyboard shortcuts
- App icon and metadata

Edit `package.json` build section to customize:
- App ID and product name
- Build targets
- Installer options
- File inclusions

## Notes

- The app runs Next.js server internally in production
- All your existing Next.js features work as expected
- Excel file uploads and exports work natively
- PDF and DOCX generation work without browser limitations
