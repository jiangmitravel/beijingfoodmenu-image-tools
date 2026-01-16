chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "processImage",
        title: "Process This Image",
        contexts: ["image"]
    });

    chrome.contextMenus.create({
        id: "processAllImages",
        title: "Process All Images on Page",
        contexts: ["page", "all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "processImage") {
        if (info.srcUrl) {
            chrome.storage.local.set({ selectedImageUrl: info.srcUrl }, () => {
                // Notify user visibly? Hard to do without tabs API permissions often.
                // We will rely on popup checking storage.
            });
        }
    } else if (info.menuItemId === "processAllImages") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractImagesFromPage
        }, (results) => {
            if (chrome.runtime.lastError) {
                console.error('executeScript error:', chrome.runtime.lastError);
                return;
            }

            if (results && results[0] && results[0].result) {
                const images = results[0].result;
                chrome.storage.local.set({ pageImages: images });
                console.log(`Found ${images.length} images. User should click extension icon.`);
            } else {
                console.log('No images found on this page.');
            }
        });
    }
});

// The function injected into the page
// Extract images with filtering options and convert to data URLs
async function extractImagesFromPage() {
    const minSize = 200;
    const images = Array.from(document.querySelectorAll('img'))
        .filter(img => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            if (w < minSize || h < minSize) return false;
            if (w < 100 && h < 100) return false;
            const url = img.src.toLowerCase();
            if (url.includes('icon') || url.includes('logo') || url.includes('avatar')) {
                if (w < 200 || h < 200) return false;
            }
            if (!img.src.startsWith('http') && !img.src.startsWith('data:')) return false;
            return true;
        });

    // Convert to data URLs using fetch → blob → FileReader
    const results = [];
    for (const img of images) {
        try {
            // Data URLs are already good
            if (img.src.startsWith('data:')) {
                results.push({
                    url: img.src,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    crossOrigin: false
                });
                continue;
            }

            // Check if same origin
            const imgUrl = new URL(img.src);
            const isSameOrigin = imgUrl.origin === window.location.origin;

            if (!isSameOrigin) {
                // Cross-origin: keep URL and mark it (can download but not edit)
                console.log('Cross-origin image (download only):', img.src);
                results.push({
                    url: img.src,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    crossOrigin: true
                });
                continue;
            }

            // Same origin: fetch and convert to data URL (can edit)
            try {
                const response = await fetch(img.src);
                const blob = await response.blob();
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                results.push({
                    url: dataUrl,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    crossOrigin: false
                });
            } catch (fetchError) {
                console.warn('Fetch failed for same-origin image:', img.src);
                // If fetch fails, treat as cross-origin (download only)
                results.push({
                    url: img.src,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    crossOrigin: true
                });
            }
        } catch (error) {
            console.warn('Failed to process image:', img.src, error);
        }
    }

    // De-duplicate by comparing first 100 chars of dataURL
    const uniqueImagesMap = new Map();
    results.forEach(img => {
        const key = img.url.substring(0, 100);
        if (!uniqueImagesMap.has(key)) {
            uniqueImagesMap.set(key, img);
        }
    });
    const uniqueImages = Array.from(uniqueImagesMap.values());

    // Show alert to user (works in page context)
    alert(`Found ${uniqueImages.length} images!\nClick the extension icon to process them.`);

    // Return images to background script
    return uniqueImages;
}


