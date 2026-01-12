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
            function: extractImagesFromPage
        });
    }
});

// The function injected into the page
// Extract images with filtering options
function extractImagesFromPage() {
    const minSize = 200; // Minimum size for filtering
    const images = Array.from(document.querySelectorAll('img'))
        .map(img => ({
            url: img.src,
            width: img.naturalWidth,
            height: img.naturalHeight,
            alt: img.alt || '',
            className: img.className || ''
        }))
        .filter(img => {
            // Basic size filter
            if (img.width < minSize || img.height < minSize) return false;

            // Exclude tiny icons
            if (img.width < 100 && img.height < 100) return false;

            // Exclude common icon/logo patterns
            const url = img.url.toLowerCase();
            if (url.includes('icon') || url.includes('logo') || url.includes('avatar')) {
                if (img.width < 200 || img.height < 200) return false;
            }

            // Only http/https/data URLs
            if (!img.url.startsWith('http') && !img.url.startsWith('data:')) return false;

            return true;
        });

    // De-duplicate by URL
    const uniqueImagesMap = new Map();
    images.forEach(img => {
        if (!uniqueImagesMap.has(img.url)) {
            uniqueImagesMap.set(img.url, img);
        }
    });
    const uniqueImages = Array.from(uniqueImagesMap.values());

    // Save to storage DIRECTLY from content script? No, content script has separate storage view often in older paradigms, 
    // but in MV3 check permissions. Safest is send message to background.
    chrome.runtime.sendMessage({ type: 'page_images_found', images: uniqueImages });

    // User feedback
    alert(`Found ${uniqueImages.length} images!\nOpen the Beijing Food Menu extension icon to process them.`);
}

// Background listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'page_images_found') {
        chrome.storage.local.set({ pageImages: request.images });
    }
});
