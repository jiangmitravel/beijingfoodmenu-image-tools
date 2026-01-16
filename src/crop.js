// crop.js - Standalone crop page logic

let cropper = null;
let imageIndex = -1;
let imageData = null;

console.log('Crop page loaded');

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
imageIndex = parseInt(urlParams.get('index') || '-1');

console.log('Image index:', imageIndex);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, loading image data...');

    // Load image data from storage
    chrome.storage.local.get(['cropImageData'], (data) => {
        console.log('Storage data:', data);

        if (data.cropImageData) {
            imageData = data.cropImageData;
            console.log('Image data loaded:', imageData);
            initCropper(imageData.url);
        } else {
            console.error('No image data found in storage');
            alert('No image data found. Please try again.');
            window.close();
        }
    });
});

function initCropper(imageUrl) {
    console.log('Initializing cropper with URL:', imageUrl);

    const image = document.getElementById('cropImage');
    if (!image) {
        console.error('Image element not found!');
        return;
    }

    image.src = imageUrl;
    console.log('Image src set');

    image.onload = () => {
        console.log('Image loaded, creating Cropper instance...');

        // Destroy existing cropper if any
        if (cropper) {
            cropper.destroy();
        }

        try {
            cropper = new Cropper(image, {
                aspectRatio: NaN,
                viewMode: 1,
                autoCropArea: 0.8,
                responsive: true,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                background: false,
                ready: function () {
                    console.log('Cropper ready!');
                }
            });

            console.log('Cropper instance created:', cropper);
        } catch (error) {
            console.error('Error creating Cropper:', error);
            alert('Error initializing cropper: ' + error.message);
        }
    };

    image.onerror = (error) => {
        console.error('Image load error:', error);
        alert('Failed to load image');
    };
}

// Aspect ratio buttons
document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Ratio button clicked:', btn.dataset.ratio);

        // Remove active class from all buttons
        document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const ratio = btn.dataset.ratio;
        if (cropper) {
            if (ratio === 'free') {
                cropper.setAspectRatio(NaN);
            } else {
                cropper.setAspectRatio(parseFloat(ratio));
            }
            console.log('Aspect ratio set to:', ratio);
        } else {
            console.error('Cropper not initialized');
        }
    });
});

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    console.log('Cancel clicked');
    chrome.storage.local.remove('cropImageData');
    window.close();
});

// Apply button
document.getElementById('applyBtn').addEventListener('click', () => {
    console.log('Apply clicked');

    if (!cropper) {
        console.error('Cropper not initialized');
        alert('Cropper not ready. Please wait.');
        return;
    }

    try {
        const canvas = cropper.getCroppedCanvas();
        if (!canvas) {
            console.error('Failed to get cropped canvas');
            return;
        }

        console.log('Got cropped canvas');
        const croppedUrl = canvas.toDataURL('image/png');
        console.log('Cropped URL length:', croppedUrl.length);

        // Send cropped image back to popup
        chrome.storage.local.set({
            croppedImageResult: {
                index: imageIndex,
                url: croppedUrl
            }
        }, () => {
            console.log('Cropped result saved to storage');
            chrome.storage.local.remove('cropImageData');
            window.close();
        });
    } catch (error) {
        console.error('Error applying crop:', error);
        alert('Error applying crop: ' + error.message);
    }
});

console.log('Event listeners attached');

