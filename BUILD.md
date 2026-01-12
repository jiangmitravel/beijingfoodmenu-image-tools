# Beijing Food Menu Image Tools - Build System Guide

## 🎯 Overview

This project uses a **single-source, multi-build** system. Maintain one codebase and automatically generate release packages for Chrome and Edge platforms.

## 📂 Directory Structure

```
beijingfoodmenu-image-tools/
├── src/                          # Source code (browser-neutral)
│   ├── manifest.template.json    # Extension config template
│   ├── README.template.md        # Documentation template
│   ├── PRIVACY.template.md       # Privacy policy template
│   ├── popup.html                # Popup interface
│   ├── popup.js                  # Popup logic
│   ├── background.js             # Background service
│   ├── icons/                    # Icon resources
│   └── libs/                     # Third-party libraries (JSZip)
│
├── build/                        # Build output
│   ├── chrome/                   # Chrome version
│   ├── edge/                     # Edge version
│   ├── beijingfoodmenu-chrome-v1.0.0.zip
│   └── beijingfoodmenu-edge-v1.0.0.zip
│
└── scripts/                      # Build scripts
    ├── build.sh                  # Main build script
    ├── build-all.sh              # Build all platforms
    └── config.json               # Platform configuration
```

## 🚀 Quick Start

### Build Single Platform

```bash
# Build Chrome version
./scripts/build.sh chrome 1.0.0

# Build Edge version
./scripts/build.sh edge 1.0.0
```

### Build All Platforms

```bash
# Build all platforms at once
./scripts/build-all.sh 1.0.0
```

## 📝 Development Workflow

### 1. Modify Code

Edit files in the `src/` directory:

```bash
cd src/
# Edit popup.html, popup.js, background.js, etc.
```

**Note:** Use browser-neutral language. Avoid platform-specific terms like "Chrome".

### 2. Use Template Variables

For platform-specific text, use template variables:

**Available Variables:**
- `{{PLATFORM_NAME}}` - Chrome / Edge
- `{{PLATFORM_FULL}}` - Chrome Extension / Edge Extension  
- `{{EXTENSION_NAME}}` - Full extension name
- `{{SHORT_NAME}}` - Short extension name
- `{{BROWSER_NAME}}` - Chrome browser / Edge browser
- `{{STORE_NAME}}` - Chrome Web Store / Microsoft Edge Add-ons
- `{{STORE_POLICY}}` - Store policy name
- `{{STORE_URL}}` - chrome://extensions/ / edge://extensions/
- `{{HOMEPAGE_URL}}` - Project homepage URL
- `{{VERSION}}` - Version number

**Example:**

```markdown
<!-- PRIVACY.template.md -->
# Privacy Policy for {{EXTENSION_NAME}}

This extension works on your {{BROWSER_NAME}}.
```

### 3. Test Build

```bash
# Build for testing
./scripts/build.sh chrome 1.0.0

# Check generated files
cat build/chrome/manifest.json | head -10
```

### 4. Submit to Store

```bash
# Build final version
./scripts/build-all.sh 1.0.0

# Upload files:
# Chrome: build/beijingfoodmenu-chrome-v1.0.0.zip
# Edge: build/beijingfoodmenu-edge-v1.0.0.zip
```

## 🔄 Update Workflow

### Release New Version

1. **Modify source code** (in `src/` directory)
2. **Increment version number**
3. **Build all platforms**
4. **Test both packages**
5. **Submit to both stores**

```bash
# Complete workflow
vim src/popup.js              # Modify code
./scripts/build-all.sh 1.0.1  # Build new version
# Test build/chrome/ and build/edge/
# Upload to stores
```

## 📋 Configuration

### scripts/config.json

```json
{
  "platforms": {
    "chrome": {
      "PLATFORM_NAME": "Chrome",
      "EXTENSION_NAME": "Batch Image Processor",
      ...
    },
    "edge": {
      "PLATFORM_NAME": "Edge",
      "EXTENSION_NAME": "Batch Image Processor",
      ...
    }
  }
}
```

**Add New Platform:**

1. Add platform configuration in `config.json`
2. Run `./scripts/build.sh new-platform 1.0.0`

## ✅ Best Practices

### DO ✅

- Edit code in `src/` directory
- Use template variables for platform differences
- Update all platforms simultaneously for each release
- Test generated packages

### DON'T ❌

- Don't edit files in `build/` directory directly
- Don't hardcode "Chrome" in source code
- Don't manually replace text
- Don't maintain separate codebases

## 🐛 Troubleshooting

### Build Fails

```bash
# Check permissions
chmod +x scripts/*.sh

# Check if jq is installed (optional, has fallback)
brew install jq
```

### Template Variables Not Replaced

Check if filename contains `.template.`:
- ✅ `PRIVACY.template.md`
- ❌ `PRIVACY.md`

### ZIP Package Corrupted

```bash
# Test ZIP package
unzip -t build/beijingfoodmenu-chrome-v1.0.0.zip
```

## 📦 Generated Files

Each build generates:

1. **build/chrome/** - Chrome version source files
2. **build/edge/** - Edge version source files  
3. **build/beijingfoodmenu-chrome-v{version}.zip** - Chrome release package
4. **build/beijingfoodmenu-edge-v{version}.zip** - Edge release package

## 🎓 Examples

### Add New Template File

1. Create `src/new-file.template.txt`
2. Use `{{variables}}`
3. Run build
4. Check `build/chrome/new-file.txt`

### Modify Platform Configuration

```bash
vim scripts/config.json
# Modify PLATFORM_NAME, etc.
./scripts/build-all.sh 1.0.0
```

## 📞 Need Help?

- Check build logs
- Inspect `build/` directory
- Verify template file syntax
- Reference [great-wall-new-tab](https://github.com/jiangmitravel/great-wall-new-tab) build system
