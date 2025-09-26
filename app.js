const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createRadialGradient(
  canvas.width / 2,
  canvas.height / 2,
  100,
  canvas.width / 2,
  canvas.height / 2,
  200
);

gradient.addColorStop(1, "rgb(150, 150, 150, 0.6)");

// Text overlay configuration
const overlayText = "LOAD OF PIXELS";
const columnIllumination = new Map(); // Track illuminated columns
let textBounds = null;

function initializeTextBounds() {
  // More reasonable text size
  const fontSize = Math.min(canvas.width / 12, 80); // Much smaller and reasonable
  ctx.font = `bold ${fontSize}px monospace`;
  const textWidth = ctx.measureText(overlayText).width;

  textBounds = {
    x: (canvas.width - textWidth) / 2,
    // nudge down a little so text sits visually centered
    y: canvas.height / 2 + Math.round(fontSize / 3),
    width: textWidth,
    height: fontSize,
    fontSize: fontSize,
  };
}

class Symbol {
  constructor(x, y, fontSize, canvasHeight) {
    this.characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()';
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.text = "";
    this.canvasHeight = canvasHeight;
  }

  draw(context) {
    this.text = this.characters.charAt(
      Math.floor(Math.random() * this.characters.length)
    );

    // Track column illumination when symbols are in text area
    if (textBounds && this.intersectsTextVertically()) {
      this.illuminateColumn();
    }

    context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);

    if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) {
      this.y = 0;
    } else {
      this.y += 1;
    }
  }

  intersectsTextVertically() {
    const symbolY = this.y * this.fontSize;
    return (
      symbolY >= textBounds.y - textBounds.height &&
      symbolY <= textBounds.y + textBounds.height
    );
  }

  illuminateColumn() {
    const column = Math.floor(this.x);
    const now = Date.now();

    if (!columnIllumination.has(column)) {
      columnIllumination.set(column, []);
    }

    const columnData = columnIllumination.get(column);
    columnData.push(now);

    // Keep only recent illumination events
    const filtered = columnData.filter((time) => now - time < 300);
    columnIllumination.set(column, filtered);
  }
}

class Effect {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.fontSize = 15;
    this.columns = Math.floor(this.canvasWidth / this.fontSize);
    this.symbols = [];
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.columns; i++) {
      this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
    }
  }

  resize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.columns = Math.floor(this.canvasWidth / this.fontSize);
    this.symbols = [];
    this.initialize();
  }
}

const effect = new Effect(canvas.width, canvas.height);
let lastTime = 0;
const fps = 40;
const nextFrame = 1000 / fps;
let timer = 0;

// Initialize text bounds
initializeTextBounds();

function drawColumnIlluminatedText(context) {
  if (!textBounds) return;

  const now = Date.now();
  const columnWidth = effect.fontSize;

  // Set up text properties
  context.font = `bold ${textBounds.fontSize}px monospace`;
  context.textAlign = "left";

  // For each column that has recent illumination
  for (const [column, times] of columnIllumination) {
    const recentTimes = times.filter((time) => now - time < 300);

    if (recentTimes.length === 0) continue;

    // Calculate illumination intensity based on recent activity
    const intensity = Math.min(recentTimes.length / 5, 1);
    const baseAlpha = 0.1; // Very subtle
    const alpha = baseAlpha + intensity * 0.15;

    // Calculate the column's x position
    const columnX = column * columnWidth;

    // Only draw text portions that intersect with this column
    if (
      columnX >= textBounds.x - columnWidth &&
      columnX <= textBounds.x + textBounds.width + columnWidth
    ) {
      // Set up clipping to only show this column's portion
      context.save();
      context.beginPath();
      context.rect(
        columnX,
        textBounds.y - textBounds.height,
        columnWidth,
        textBounds.height * 2
      );
      context.clip();

      // Draw the text with subtle illumination
      context.shadowColor = `rgba(255,255,255,${alpha * 0.3})`;
      context.shadowBlur = 4;
      context.fillStyle = `rgba(255,255,255,${alpha})`;
      context.fillText(overlayText, textBounds.x, textBounds.y);

      context.restore();
    }

    // Clean up old times
    columnIllumination.set(column, recentTimes);
  }
}

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (timer > nextFrame) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.textAlign = "center";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient; //'#0aff0a';
    ctx.font = effect.fontSize + "px monospace";
    effect.symbols.forEach((symbol) => symbol.draw(ctx));

    // Draw the column-illuminated text portions
    drawColumnIlluminatedText(ctx);

    timer = 0;
  } else {
    timer += deltaTime;
  }
  requestAnimationFrame(animate);
}

// start animation
requestAnimationFrame(animate);

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  effect.resize(canvas.width, canvas.height);
  initializeTextBounds();
});
