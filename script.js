const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* أبعاد الفريم الأصلية */
canvas.width = 1080;
canvas.height = 1350;

let img = new Image();
let scale = 1;
let rotation = 0;

/* مركز الكانفاس */
let x = canvas.width / 2;
let y = canvas.height / 2;

/* رفع الصورة */
document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.onload = draw;
  };
  reader.readAsDataURL(e.target.files[0]);
});

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

/* ================= DRAG (Mouse + Touch) ================= */
let dragging = false;
let lastX = 0;
let lastY = 0;

function getPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  if (evt.touches) {
    return {
      x: (evt.touches[0].clientX - rect.left) * scaleX,
      y: (evt.touches[0].clientY - rect.top) * scaleY
    };
  } else {
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }
}

/* Mouse */
canvas.addEventListener("mousedown", e => {
  dragging = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
});

canvas.addEventListener("mousemove", e => {
  if (!dragging) return;
  const pos = getPos(e);
  x += pos.x - lastX;
  y += pos.y - lastY;
  lastX = pos.x;
  lastY = pos.y;
  draw();
});

canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);

/* Touch */
canvas.addEventListener("touchstart", e => {
  dragging = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
});

canvas.addEventListener("touchmove", e => {
  if (!dragging) return;
  e.preventDefault();
  const pos = getPos(e);
  x += pos.x - lastX;
  y += pos.y - lastY;
  lastX = pos.x;
  lastY = pos.y;
  draw();
}, { passive: false });

canvas.addEventListener("touchend", () => dragging = false);

/* ================= DRAW ================= */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!img.src) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}

/* تحميل الصورة (جودة عالية وحجم معقول) */
document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "FOMSU-3-Graduation.png";
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
});
