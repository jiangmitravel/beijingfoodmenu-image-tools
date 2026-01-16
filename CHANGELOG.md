# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-13

### Added
- **Advanced Cropping Tool**: Integrated Cropper.js for professional image cropping
  - Free-form cropping with drag-and-resize
  - Preset aspect ratios (1:1, 4:3, 16:9, 3:2)
  - Real-time preview
  - High-quality output
- **Enhanced Image Filtering**: Improved image extraction from web pages
  - Minimum size filter increased to 200×200px
  - Smart icon/logo detection and exclusion
  - Image metadata support (width, height, alt text)
  - Better duplicate detection

### Changed
- Edit button now opens advanced cropper instead of basic editor
- Image extraction returns metadata objects instead of URLs
- Package size increased to 70KB (added Cropper.js library)

### Technical
- Added Cropper.js v1.6.1 (37KB + 3.7KB CSS)
- Updated background.js image extraction logic
- Enhanced popup.js with cropper integration
- Backward compatible with old image format

## [1.1.0] - 2026-01-12

### Added
- **Batch Processing Improvements**: Enhanced error handling for processing multiple images
- **Progress Indicator**: Real-time progress display showing "Processing X/Y..." during batch operations
- **CORS Support**: Added `crossOrigin` support for processing images from external sources
- **Timeout Protection**: 30-second timeout per image to prevent indefinite hanging
- **Failure Statistics**: Shows success/failure count after batch processing completes

### Fixed
- Fixed issue where processing would hang when encountering problematic images
- Improved error handling - failed images are now skipped instead of stopping the entire process
- Better error messages in console for debugging CORS and loading issues

### Changed
- Processing button now shows detailed progress instead of generic "Processing..." message
- Failed images no longer block successful images from being processed

## [1.0.0] - 2026-01-12

### Initial Release

- **Batch Image Processing**: Process multiple images simultaneously
- **Quality Adjustment**: Control compression quality (1-100%)
- **Smart Resizing**: Scale by percentage or set fixed dimensions
- **Format Conversion**: Convert between JPEG, PNG, and WebP
- **Image Editor**: Built-in crop and rotate tools
- **Privacy Protection**: Remove EXIF metadata from images
- **Flexible Naming**: Custom prefix for processed files
- **ZIP Download**: Package all processed images into a single archive
- **Multi-Platform**: Available for Chrome and Edge browsers
- **Local Processing**: All processing happens in your browser - no uploads

### Features

- Drag-and-drop file upload
- Right-click context menu to process images from web pages
- Preset configurations (Social Media, Web, Print Quality)
- Real-time preview of images
- Modern, responsive interface
- Pure client-side processing (no server required)

---

**Note**: This is the first public release of Batch Image Processor, developed by the Beijing Food Menu team for food photography optimization.

### Known Limitations
- **Cropping**: Only works with uploaded images. Web-grabbed images cannot be cropped due to browser CORS restrictions, but can still be processed (compressed, converted, resized).

