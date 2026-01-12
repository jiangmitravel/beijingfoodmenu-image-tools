# Privacy Policy for Batch Image Processor

**Last Updated**: January 12, 2026

## Introduction

This Privacy Policy describes how the Batch Image Processor browser extension ("we", "our", or "the extension") handles your data. We are committed to protecting your privacy and being transparent about our practices.

**TL;DR**: We don't collect, store, or transmit any of your data. Everything happens locally in your browser.

---

## What This Extension Does

Batch Image Processor is a browser extension that allows you to:
- Process multiple images simultaneously
- Compress, resize, and convert image formats
- Remove metadata from images
- Download processed images individually or as a ZIP archive
- Collect images from web pages via right-click menu

**All processing happens locally in your browser** - your images never leave your device.

---

## Data Collection

### We Do NOT Collect:

❌ **Personal Information**: We do not collect names, email addresses, or any personally identifiable information.

❌ **Image Data**: Your images are processed entirely in your browser. We never upload, store, or transmit your images to any server.

❌ **Browsing History**: We do not track which websites you visit or which images you process.

❌ **Usage Analytics**: We do not use any analytics, tracking pixels, or telemetry.

❌ **Cookies**: We do not set any cookies.

❌ **Location Data**: We do not access or collect your location information.

### What We Store Locally:

✅ **User Preferences**: Your processing settings (quality, format, resize options) are stored locally in your browser using the browser's storage API. This data never leaves your device and can be cleared at any time by removing the extension.

✅ **Image Queue**: When you add images for processing, they are temporarily stored in your browser's memory. This data is cleared when you close the extension or clear the queue.

---

## Permissions Explained

The extension requires certain permissions to function. Here's exactly what each permission is used for:

### 1. **contextMenus**
- **Purpose**: Adds a "Process Images from Page" option to your right-click menu
- **Usage**: Only activates when you explicitly right-click and select this option
- **Data Access**: None

### 2. **downloads**
- **Purpose**: Saves processed images to your computer
- **Usage**: Only when you click "Process & Download"
- **Data Access**: None - only saves files you explicitly choose to process

### 3. **scripting**
- **Purpose**: Extracts image URLs from web pages when you use the context menu
- **Usage**: Only when you explicitly select "Process Images from Page"
- **Data Access**: Reads image URLs from the current page only when requested

### 4. **storage**
- **Purpose**: Saves your processing preferences locally
- **Usage**: Stores settings in your browser's local storage
- **Data Access**: Only your settings - never transmitted anywhere

### 5. **activeTab**
- **Purpose**: Grants temporary access to the current tab when you interact with the extension
- **Usage**: Only when you click the extension icon or use the "Process Images from Page" context menu
- **Data Access**: Reads image URLs from the active tab only - permission is automatically revoked when you navigate away

---

## How Your Data is Processed

1. **Image Upload**: When you select images, they are loaded into your browser's memory
2. **Processing**: All compression, resizing, and format conversion happens in your browser using JavaScript
3. **Download**: Processed images are saved directly to your computer
4. **Cleanup**: Image data is cleared from memory when you close the extension

**At no point is any data transmitted to our servers or any third party.**

---

## Third-Party Services

We do **NOT** use any third-party services, including:
- ❌ Analytics providers (Google Analytics, etc.)
- ❌ Advertising networks
- ❌ Cloud storage services
- ❌ Content delivery networks (CDNs) for user data
- ❌ Social media integrations

The only external code included is the JSZip library, which is bundled locally within the extension and used solely for creating ZIP archives in your browser.

---

## Data Security

Since we don't collect or transmit any data, there is no data to secure on our end. However:

- ✅ All processing happens locally in your browser
- ✅ Your images never leave your device
- ✅ No network requests are made to external servers
- ✅ The extension is open source - you can verify our claims by reviewing the code

---

## Your Rights

Since we don't collect any personal data, traditional data rights (access, deletion, portability) don't apply. However:

- **Right to Transparency**: This privacy policy explains exactly what the extension does
- **Right to Control**: You can uninstall the extension at any time
- **Right to Verify**: The extension is open source - you can review the code on GitHub

---

## Children's Privacy

This extension does not knowingly collect any information from anyone, including children under 13. The extension is a productivity tool that processes images locally and does not require any personal information.

---

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.

---

## Open Source

This extension is open source and licensed under the MIT License. You can review the complete source code at:

**GitHub Repository**: https://github.com/jiangmitravel/beijingfoodmenu-image-tools

---

## Contact Us

If you have any questions about this Privacy Policy or the extension, please contact us:

- **GitHub Issues**: https://github.com/jiangmitravel/beijingfoodmenu-image-tools/issues
- **Website**: https://jiangmitravel.github.io/beijingfoodmenu-image-tools/
- **Developer**: Beijing Food Menu Team

---

## Summary

**In Plain English**:
- We don't collect any of your data
- We don't track you
- We don't use analytics
- Your images are processed entirely in your browser
- Nothing is uploaded to any server
- You can verify all of this by reviewing our open source code

**Privacy Score**: 🟢🟢🟢🟢🟢 (5/5) - Maximum Privacy

---

*This extension is developed by the Beijing Food Menu team and is provided free of charge under the MIT License.*
