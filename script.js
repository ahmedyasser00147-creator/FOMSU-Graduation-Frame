const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* حجم التصميم */
canvas.width = 1080;
canvas.height = 1350;

/* تحميل الفريم */
const frame = new Image();
frame.src = "frame.png";

/* منطقة الصورة داخل الدرع */
const PHOTO_AREA = {
  x: 290,
  y: 360,
  width: 500,
  height: 620
};

let img = new Image();
let scale = 1;
let rotation = 0;

/* مركز الصورة */
let x = PHOTO_AREA.x + PHOTO_AREA.width / 2;
let y = PHOTO_AREA.y + PHOTO_AREA.height / 2;

/* رفع الصورة */
document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.onload = autoFit;
  };
  reader.readAsDataURL(e.target.files[0]);
});

/* ضبط تلقائي داخل الدرع */
function autoFit() {
  const scaleX = PHOTO_AREA.width / img.width;
  const scaleY = PHOTO_AREA.height / img.height;
  scale = Math.max(scaleX, scaleY);

  x = PHOTO_AREA.x + PHOTO_AREA.width / 2;
  y = PHOTO_AREA.y + PHOTO_AREA.height / 2;
  rotation = 0;

  document.getElementById("zoom").value = scale;
  document.getElementById("rotate").value = 0;

  draw();
}

/* Zoom */
document.getElementById("zoom").addEventListener("input", e => {
  scale = e.target.value;
  draw();
});

/* Rotate */
document.getElementById("rotate").addEventListener("input", e => {
  rotation = e.target.value * Math.PI / 180;
  draw();
});

/* Drag (Mobile + PC) */
let dragging = false;
let lastX = 0, lastY = 0;

function getPos(evt) {
  const r = canvas.getBoundingClientRect();
  const sx = canvas.width / r.width;
  const sy = canvas.height / r.height;

  if (evt.touches) {
    return {
      x: (evt.touches[0].clientX - r.left) * sx,
      y: (evt.touches[0].clientY - r.top) * sy
    };
  }
  return {
    x: (evt.clientX - r.left) * sx,
    y: (evt.clientY - r.top) * sy
  };
}

canvas.addEventListener("mousedown", e => {
  dragging = true;
  const p = getPos(e);
  lastX = p.x; lastY = p.y;
});

canvas.addEventListener("mousemove", e => {
  if (!dragging) return;
  const p = getPos(e);
  x += p.x - lastX;
  y += p.y - lastY;
  lastX = p.x; lastY = p.y;
  draw();
});

canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("touchstart", e => {
  dragging = true;
  const p = getPos(e);
  lastX = p.x; lastY = p.y;
});

canvas.addEventListener("touchmove", e => {
  if (!dragging) return;
  e.preventDefault();
  const p = getPos(e);
  x += p.x - lastX;
  y += p.y - lastY;
  lastX = p.x; lastY = p.y;
  draw();
}, { passive: false });

canvas.addEventListener("touchend", () => dragging = false);

/* الرسم */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (img.src) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(PHOTO_AREA.x, PHOTO_AREA.y, PHOTO_AREA.width, PHOTO_AREA.height);
    ctx.clip();

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }

  /* رسم الفريم فوق الصورة */
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

/* تحميل الصورة كاملة */
document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "FOMSU-3-Graduation.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
});
