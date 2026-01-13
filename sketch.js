// HERO MORPH — SVG ⇄ SVG ⇄ FULL-WIDTH CODE SHAPE (ELASTIC MAGNET + FALLOFF)

let particles = [];
let font;
let shapeA, shapeB;

// ---------------- CONFIG ----------------
const DENSITY = 5;
const HERO_SCALE = 0.85;

const ORGANIZE_FORCE = 0.03;
const DAMPING = 0.8;

const HOVER_RADIUS = 90;
const HOVER_FORCE = 2.2;
const CODE_HOVER_MULTIPLIER = 2.4;

// Magnet tuning
const MAGNET_FORCE = 0.2;
const ELASTIC_RADIUS = 18;

// Falloff layers (percent of radius)
const MAGNET_CORE = 0.25;
const MAGNET_MID = 0.6;

const IDLE_AMPLITUDE = 6;
const IDLE_SPEED = 0.0004;

const FONT_SIZE = 14;
const LINE_HEIGHT = 24;
const CHAR_WIDTH = 12;

const BASE_COLOR = [38, 47, 59];
const ACCENT_COLORS = [
  [22, 106, 234],
  [205, 196, 255],
  [228, 255, 152]
];
const COLOR_RADIUS = 260;
const BASE_ALPHA = 0.25 * 255;
const SPOTLIGHT_ALPHA = 255;

// ---------------- MODES ----------------
const MODE_SHAPE = 0;
const MODE_CODE = 1;

let mode = MODE_SHAPE;
let targetShape = 0;
let codeHoverMode = 0;

// ---------------- CODE BLOCK ----------------
const CODE_LINES = [
  `<!DOCTYPE html>`,
  `<html lang="en">`,
  `<head>`,
  `  <meta charset="UTF-8">`,
  `  <title>Hero Morph Engine</title>`,
  `</head>`,
  `<body>`,
  `  <canvas id="hero"></canvas>`,
  `</body>`,
  `</html>`
];

// ---------------- PRELOAD ----------------
function preload() {
  font = loadFont("Wix Madefor Text VF-normal-400-100.ttf");
  shapeA = loadImage("heroShapeA.svg");
  shapeB = loadImage("heroShapeB.svg");
}

// ---------------- SETUP ----------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(FONT_SIZE);
  textAlign(LEFT, TOP);
  noStroke();
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  buildParticles();
}

// ---------------- SVG SAMPLING ----------------
function extractPoints(img) {
  let pts = [];
  img.loadPixels();

  const scale = min(width / img.width, height / img.height) * HERO_SCALE;
  const ox = (width - img.width * scale) * 0.5;
  const oy = (height - img.height * scale) * 0.5;

  for (let y = 0; y < img.height; y += DENSITY) {
    for (let x = 0; x < img.width; x += DENSITY) {
      let i = (x + y * img.width) * 4;
      if (img.pixels[i + 3] > 40) {
        pts.push({ x: ox + x * scale, y: oy + y * scale });
      }
    }
  }
  return pts;
}

// ---------------- CODE GRID ----------------
function generateCodePoints() {
  let pts = [];
  const marginX = 20;
  const marginY = 30;

  const cols = floor((width - marginX * 2) / CHAR_WIDTH);
  const rows = floor((height - marginY * 2) / LINE_HEIGHT);

  const fullCode = CODE_LINES.join("\n");
  let index = 0;

  for (let r = 0; r < rows; r++) {
    let y = marginY + r * LINE_HEIGHT;
    let x = marginX;

    for (let c = 0; c < cols; c++) {
      pts.push({
        x,
        y,
        char: fullCode[index % fullCode.length]
      });
      x += CHAR_WIDTH;
      index++;
    }
  }
  return pts;
}

// ---------------- BUILD ----------------
function buildParticles() {
  particles = [];

  const a = extractPoints(shapeA);
  const b = extractPoints(shapeB);
  const c = generateCodePoints();

  shuffle(a, true);
  shuffle(b, true);

  for (let i = 0; i < c.length; i++) {
    particles.push({
      x: a[i % a.length].x,
      y: a[i % a.length].y,
      vx: 0,
      vy: 0,
      a: a[i % a.length],
      b: b[i % b.length],
      c: c[i],
      char: c[i].char
    });
  }
}

// ---------------- INPUT ----------------
function mousePressed() {
  if (mode === MODE_SHAPE) {
    mode = MODE_CODE;
    codeHoverMode = 1 - codeHoverMode;
  } else {
    mode = MODE_SHAPE;
    targetShape = 1 - targetShape;
  }
}

// ---------------- DRAW ----------------
function draw() {
  background("#FFFFFF");

  let accent = ACCENT_COLORS[targetShape % ACCENT_COLORS.length];

  for (let p of particles) {
    let target =
      mode === MODE_CODE ? p.c : targetShape === 0 ? p.a : p.b;

    p.vx += (target.x - p.x) * ORGANIZE_FORCE;
    p.vy += (target.y - p.y) * ORGANIZE_FORCE;

    let d = dist(mouseX, mouseY, p.x, p.y);

    // Shape mode → push only
    if (mode === MODE_SHAPE && d < HOVER_RADIUS) {
      let a = atan2(p.y - mouseY, p.x - mouseX);
      let f = (1 - d / HOVER_RADIUS) * HOVER_FORCE;
      p.vx += cos(a) * f;
      p.vy += sin(a) * f;
    }

    // Code mode
    if (mode === MODE_CODE && d < HOVER_RADIUS) {
      if (codeHoverMode === 0) {
        // Push
        let a = atan2(p.y - mouseY, p.x - mouseX);
        let f =
          (1 - d / HOVER_RADIUS) *
          HOVER_FORCE *
          CODE_HOVER_MULTIPLIER;
        p.vx += cos(a) * f;
        p.vy += sin(a) * f;
      } else {
        // -------- MAGNET WITH FALLOFF LAYERS --------
        let dx = mouseX - p.x;
        let dy = mouseY - p.y;
        let distToMouse = sqrt(dx * dx + dy * dy);

        if (distToMouse > ELASTIC_RADIUS) {
          let nd = distToMouse / HOVER_RADIUS;
          let strength = 0;

          if (nd < MAGNET_CORE) {
            // Core
            strength = 1;
          } else if (nd < MAGNET_MID) {
            // Mid
            strength = map(nd, MAGNET_CORE, MAGNET_MID, 1, 0.35);
          } else {
            // Outer
            strength = map(nd, MAGNET_MID, 1, 0.35, 0.08);
          }

          let stretch = distToMouse - ELASTIC_RADIUS;
          let pull = stretch * MAGNET_FORCE * strength;

          p.vx += (dx / distToMouse) * pull;
          p.vy += (dy / distToMouse) * pull;
        }
      }
    }

    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.x += p.vx;
    p.y += p.vy;

    let t = constrain(1 - d / COLOR_RADIUS, 0, 1);
    fill(
      lerp(BASE_COLOR[0], accent[0], t),
      lerp(BASE_COLOR[1], accent[1], t),
      lerp(BASE_COLOR[2], accent[2], t),
      lerp(BASE_ALPHA, SPOTLIGHT_ALPHA, t)
    );

    text(p.char, p.x, p.y);
  }
}

// ---------------- RESIZE ----------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildParticles();
}