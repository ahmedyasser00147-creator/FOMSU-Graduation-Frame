const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frame = new Image();
frame.src = "frame.png";

const upload = document.getElementById("upload");

let userImage = null;
let scale = 1;
let rotation = 0;
let posX = 0;
let posY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;

/* 🔴 مساحة الصورة داخل الدرع */
const PHOTO_AREA = {
  x: 300,
  y: 360,
  width: 480,
  height: 620
};

frame.onload = draw;

upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    userImage = img;

    /* ✅ Cover mode – يمنع الفراغ الأبيض */
    const scaleX = PHOTO_AREA.width / img.width;
    const scaleY = PHOTO_AREA.height / img.height;
    scale = Math.max(scaleX, scaleY) * 1.05;

    posX = PHOTO_AREA.x + PHOTO_AREA.width / 2;
    posY = PHOTO_AREA.y + PHOTO_AREA.height / 2;
    rotation = 0;

    draw();
  };
  img.src = URL.createObjectURL(file);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage) {
    ctx.save();

    ctx.beginPath();
    ctx.rect(
      PHOTO_AREA.x,
      PHOTO_AREA.y,
      PHOTO_AREA.width,
      PHOTO_AREA.height
    );
    ctx.clip();

    ctx.translate(posX, posY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    ctx.drawImage(
      userImage,
      -userImage.width / 2,
      -userImage.height / 2
    );

    ctx.restore();
  }

  ctx.drawImage(frame, 0, 0, 1080, 1350);
}

/* 🖱️ + 📱 Drag */
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", drag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("mouseleave", endDrag);

canvas.addEventListener("touchstart", startDrag);
canvas.addEventListener("touchmove", drag);
canvas.addEventListener("touchend", endDrag);

function startDrag(e) {
  isDragging = true;
  const pos = getPosition(e);
  startX = pos.x - posX;
  startY = pos.y - posY;
}

function drag(e) {
  if (!isDragging) return;
  const pos = getPosition(e);
  posX = pos.x - startX;
  posY = pos.y - startY;
  draw();
}

function endDrag() {
  isDragging = false;
}

function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
      y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)
    };
  }
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

/* 🎛 Controls */
function zoomIn() {
  scale *= 1.05;
  draw();
}

function zoomOut() {
  scale *= 0.95;

  const minScale = Math.max(
    PHOTO_AREA.width / userImage.width,
    PHOTO_AREA.height / userImage.height
  );

  if (scale < minScale) scale = minScale;
  draw();
}

function rotateLeft() {
  rotation -= Math.PI / 18;
  draw();
}

function rotateRight() {
  rotation += Math.PI / 18;
  draw();
}

/* ⬇ حفظ الصورة بالجودة الكاملة */
function downloadImage() {
  const link = document.createElement("a");
  link.download = "FOMSU-Graduation.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
