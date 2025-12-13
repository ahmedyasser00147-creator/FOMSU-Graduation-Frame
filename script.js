const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const zoomInput = document.getElementById('zoom');

const frame = new Image();
frame.src = 'frame.png';

let img = new Image();
let imgX = 0, imgY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;

// Upload photo
upload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    img.src = URL.createObjectURL(file);
});

img.onload = function() {
    imgX = 0;
    imgY = 0;
    scale = 1;
    drawCanvas();
}

// Zoom control
zoomInput.addEventListener('input', function() {
    scale = parseFloat(this.value);
    drawCanvas();
});

// Dragging
canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.offsetX - imgX;
    startY = e.offsetY - imgY;
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        imgX = e.offsetX - startX;
        imgY = e.offsetY - startY;
        drawCanvas();
    }
});

canvas.addEventListener('mouseup', function() { isDragging = false; });
canvas.addEventListener('mouseleave', function() { isDragging = false; });

// Draw function
function drawCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, imgX, imgY, img.width*scale, img.height*scale);
    ctx.drawImage(frame, 0,0,canvas.width,canvas.height);
}

// Download
document.getElementById('download').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'graduation-frame.png';
    link.href = canvas.toDataURL();
    link.click();
});
