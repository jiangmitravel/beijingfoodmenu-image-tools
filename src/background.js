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
function extractImagesFromPage() {
    const minSize = 50; // Filter small icons
    const images = Array.from(document.querySelectorAll('img'))
        .filter(img => img.naturalWidth > minSize && img.naturalHeight > minSize)
        .map(img => img.src)
        .filter(src => src.startsWith('http') || src.startsWith('data:'));
    
    // De-duplicate
    const uniqueImages = [...new Set(images)];
    
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
