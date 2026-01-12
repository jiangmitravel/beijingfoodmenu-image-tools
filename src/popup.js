// popup.js - V2.0 (Dimensions + Renaming + IMG Tags)

// --- STATE ---
let storedImages = []; 
let currentEditIndex = -1;
let editCanvas = document.getElementById('editorCanvas');
let editCtx = editCanvas.getContext('2d');
let currentEditImage = null; 

// --- ICONS ---
const SRC_EDIT = "data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M3%2017.25V21h3.75L17.81%209.94l-3.75-3.75L3%2017.25zM20.71%207.04c.39-.39.39-1.02%200-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41%200l-1.83%201.83%203.75%203.75%201.83-1.83z%22%2F%3E%3C%2Fsvg%3E";
const SRC_DELETE = "data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M6%2019c0%201.1.9%202%202%202h8c1.1%200%202-.9%202-2V7H6v12zM19%204h-3.5l-1-1h-5l-1%201H5v2h14V4z%22%2F%3E%3C%2Fsvg%3E";

// --- CONSTANTS ---
const PRESETS = {
    social: { qual: 85, fmt: 'image/jpeg', mode: 'fixed', width: 1080, height: '' },
    web: { qual: 75, fmt: 'image/webp', mode: 'fixed', width: 400, height: '' },
    print: { qual: 100, fmt: 'image/png', mode: 'pct', pct: 100, height: '' }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get(['storedImages', 'selectedImageUrl', 'pageImages']);
    storedImages = data.storedImages || [];

    let isDirty = false;
    if (data.selectedImageUrl) {
        if (!isDuplicate(data.selectedImageUrl)) {
            storedImages.push({ url: data.selectedImageUrl, name: 'captured_image' });
            isDirty = true;
        }
        chrome.storage.local.remove('selectedImageUrl');
    }
    if (data.pageImages && data.pageImages.length) {
        data.pageImages.forEach(url => {
            if (!isDuplicate(url)) storedImages.push({ url, name: 'batch_image' });
        });
        isDirty = true;
        chrome.storage.local.remove('pageImages');
    }

    if (isDirty) saveImages();
    renderGallery();

    setupPresetListener();
    setupEditorListeners();
    setupProcessingListeners();
    setupUploadListener();
    setupGalleryDelegation();
});

function isDuplicate(url) {
    return storedImages.some(img => img.url === url);
}

function saveImages() {
    chrome.storage.local.set({ storedImages });
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const count = document.getElementById('galleryCount');
    const empty = document.getElementById('emptyState');
    
    grid.innerHTML = '';
    count.textContent = `Images: ${storedImages.length}`;
    
    if (storedImages.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    storedImages.forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        // HTML Structure
        div.innerHTML = `
            <img class="thumb" src="${img.url}" id="img-${idx}">
            <div class="img-dims" id="dims-${idx}">...</div>
            <div class="grid-actions">
                <button class="action-icon edit-btn" data-index="${idx}" title="Edit">
                    <img src="${SRC_EDIT}">
                </button>
                <button class="action-icon delete-btn" data-index="${idx}" title="Delete">
                    <img src="${SRC_DELETE}">
                </button>
            </div>
        `;
        grid.appendChild(div);

        // Calculate Dims on Load
        const imgEl = document.getElementById(`img-${idx}`);
        imgEl.onload = () => {
            const w = imgEl.naturalWidth;
            const h = imgEl.naturalHeight;
            const dimsEl = document.getElementById(`dims-${idx}`);
            if(dimsEl) dimsEl.textContent = `${w} x ${h}`;
        };
    });
}

function setupGalleryDelegation() {
    const grid = document.getElementById('galleryGrid');
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const idx = parseInt(btn.dataset.index);
        
        if (btn.classList.contains('edit-btn')) {
            openEditor(idx);
        } else if (btn.classList.contains('delete-btn')) {
            deleteImage(idx);
        }
    });

    document.getElementById('clearBtn').onclick = () => {
        storedImages = [];
        saveImages();
        renderGallery();
    };
}

function openEditor(idx) {
    currentEditIndex = idx;
    const imgData = storedImages[idx];
    document.getElementById('editorOverlay').style.display = 'flex';
    
    currentEditImage = new Image();
    currentEditImage.onload = () => {
        editCanvas.width = currentEditImage.width;
        editCanvas.height = currentEditImage.height;
        editCtx.drawImage(currentEditImage, 0, 0);
    };
    currentEditImage.src = imgData.url;
}

function setupEditorListeners() {
    document.getElementById('closeEditor').onclick = () => {
        document.getElementById('editorOverlay').style.display = 'none';
    };

    document.getElementById('rotateRight').onclick = () => rotateCanvas(90);
    document.getElementById('rotateLeft').onclick = () => rotateCanvas(-90);
    document.getElementById('cropSquare').onclick = () => cropCanvas(1);
    document.getElementById('crop43').onclick = () => cropCanvas(4/3);
    
    document.getElementById('saveEdit').onclick = () => {
        const newUrl = editCanvas.toDataURL('image/png');
        storedImages[currentEditIndex].url = newUrl;
        storedImages[currentEditIndex].isEdited = true;
        saveImages();
        renderGallery();
        document.getElementById('editorOverlay').style.display = 'none';
    };
}

function rotateCanvas(deg) {
    const temp = document.createElement('canvas');
    const ctx = temp.getContext('2d');
    
    if (Math.abs(deg) === 90) {
        temp.width = editCanvas.height;
        temp.height = editCanvas.width;
    } else {
        temp.width = editCanvas.width;
        temp.height = editCanvas.height;
    }
    
    ctx.translate(temp.width/2, temp.height/2);
    ctx.rotate(deg * Math.PI / 180);
    ctx.drawImage(editCanvas, -editCanvas.width/2, -editCanvas.height/2);
    
    editCanvas.width = temp.width;
    editCanvas.height = temp.height;
    editCtx.drawImage(temp, 0, 0);
}

function cropCanvas(ratio) {
    const w = editCanvas.width;
    const h = editCanvas.height;
    const currentRatio = w / h;
    
    let cropW, cropH, offsetX, offsetY;
    
    if (currentRatio > ratio) {
        cropH = h;
        cropW = h * ratio;
        offsetX = (w - cropW) / 2;
        offsetY = 0;
    } else {
        cropW = w;
        cropH = w / ratio;
        offsetX = 0;
        offsetY = (h - cropH) / 2;
    }
    
    const tempData = editCtx.getImageData(offsetX, offsetY, cropW, cropH);
    editCanvas.width = cropW;
    editCanvas.height = cropH;
    editCtx.putImageData(tempData, 0, 0);
}

function deleteImage(idx) {
    storedImages.splice(idx, 1);
    saveImages();
    renderGallery();
}

function setupUploadListener() {
    const input = document.getElementById('fileInput');
    input.addEventListener('change', async (e) => {
        for (let file of e.target.files) {
            const url = await readFile(file);
            storedImages.push({ url, name: file.name });
        }
        saveImages();
        renderGallery();
        input.value = '';
    });
}

function readFile(file) {
    return new Promise(r => {
        const reader = new FileReader();
        reader.onload = e => r(e.target.result);
        reader.readAsDataURL(file);
    });
}

function setupProcessingListeners() {
    document.getElementById('processBtn').onclick = async () => {
        if (!storedImages.length) return alert('No images!');
        
        const btn = document.getElementById('processBtn');
        btn.disabled = true;
        btn.textContent = 'Processing...';
        
        const quality = parseInt(document.getElementById('quality').value) / 100;
        const format = document.getElementById('format').value;
        const resizeMode = document.querySelector('input[name="resize"]:checked').value;
        
        const prefixInput = document.getElementById('filenamePrefix').value.trim();
        const prefix = prefixInput || 'processed';
        
        const processed = [];
        
        for (let i=0; i<storedImages.length; i++) {
            const img = await processImage(storedImages[i].url, quality, format, resizeMode);
            const ext = format.split('/')[1];
            processed.push({ blob: img, name: `${prefix}_${i+1}.${ext}` });
        }
        
        if (processed.length > 1) {
            const zip = new JSZip();
            processed.forEach(p => zip.file(p.name, p.blob));
            const content = await zip.generateAsync({type:"blob"});
            const url = URL.createObjectURL(content);
            chrome.downloads.download({ url, filename: `${prefix}_batch.zip`, saveAs: false });
        } else {
            const url = URL.createObjectURL(processed[0].blob);
            chrome.downloads.download({ url, filename: processed[0].name, saveAs: false });
        }
        
        btn.disabled = false;
        btn.textContent = 'Process & Download';
    };
}

function processImage(url, quality, format, resizeMode) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            
            if (resizeMode === 'pct') {
                const p = parseInt(document.getElementById('pctSelect').value) / 100;
                w *= p; h *= p;
            } else {
                const fw = parseInt(document.getElementById('fixedWidthVal').value);
                const fh = parseInt(document.getElementById('fixedHeightVal').value);

                if (fw && fh) {
                    const ratio = Math.min(fw / w, fh / h);
                    w *= ratio;
                    h *= ratio;
                } else if (fw) {
                    h = img.height * (fw / img.width);
                    w = fw;
                } else if (fh) {
                    w = img.width * (fh / img.height);
                    h = fh;
                }
            }
            
            const cvs = document.createElement('canvas');
            cvs.width = w; cvs.height = h;
            cvs.getContext('2d').drawImage(img, 0, 0, w, h);
            cvs.toBlob(resolve, format, quality);
        };
        img.src = url;
    });
}

function setupPresetListener() {
    const select = document.getElementById('presetSelect');
    select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'custom') return;
        
        const p = PRESETS[val];
        document.getElementById('quality').value = p.qual;
        document.getElementById('qualVal').textContent = p.qual + '%';
        document.getElementById('format').value = p.fmt;
        
        const radios = document.getElementsByName('resize');
        for (let r of radios) r.checked = (r.value === p.mode);
        toggleResizeInput(); 

        if (p.mode === 'pct') {
            document.getElementById('pctSelect').value = p.pct;
        } else {
            document.getElementById('fixedWidthVal').value = p.width || '';
            document.getElementById('fixedHeightVal').value = p.height || '';
        }
    });

    ['quality', 'fixedWidthVal', 'fixedHeightVal', 'pctSelect'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', () => select.value = 'custom');
    });
    
    document.getElementById('quality').addEventListener('input', (e) => {
        document.getElementById('qualVal').textContent = e.target.value + '%';
    });
    
    document.getElementsByName('resize').forEach(r => r.addEventListener('change', () => {
        toggleResizeInput();
        select.value = 'custom';
    }));
}

function toggleResizeInput() {
    const isFixed = document.querySelector('input[name="resize"][value="fixed"]').checked;
    document.getElementById('resizePct').style.display = isFixed ? 'none' : 'block';
    document.getElementById('resizeFixed').style.display = isFixed ? 'block' : 'none';
}
