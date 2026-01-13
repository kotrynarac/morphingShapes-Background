// HERO MORPH — SVG ⇄ SVG ⇄ FULL-WIDTH CODE SHAPE (STABLE + HIGH-CONTRAST CODE MODE)

let particles = [];
let font;
let shapeA, shapeB;

// ---------------- CONFIG ----------------
const DENSITY = 5;
const HERO_SCALE = 0.85;

const ORGANIZE_FORCE = 0.03;
const ORGANIZE_FORCE_CODE = 0.018;
const DAMPING = 0.78;

const HOVER_RADIUS = 90;
const HOVER_FORCE = 2.2;
const CODE_HOVER_MULTIPLIER = 3.0;

const IDLE_AMPLITUDE = 6;
const IDLE_SPEED = 0.0004;

const FONT_SIZE = 14;
const LINE_HEIGHT = 24;
const CHAR_WIDTH = 12;

const VELOCITY_GLOW_MAX = 6.0;

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

// ---------------- CODE BLOCK ----------------
const CODE_LINES = [
`<!DOCTYPE html>`,
`<html lang="en" data-theme="light" data-app="hero-morph-engine" data-version="2.4.1">`,
`<head>`,
`  <meta charset="UTF-8">`,
`  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`,
`  <meta name="description" content="Interactive hero system using particle-based SVG morphing, code-driven layouts, and GPU-accelerated motion pipelines.">`,
`  <meta name="author" content="Wix Engineering Platform">`,
`  <meta name="robots" content="index, follow">`,
`  <meta http-equiv="X-UA-Compatible" content="IE=edge">`,
`  <title>Hero Morph Engine — Interactive Motion System</title>`,
`  <link rel="stylesheet" href="/styles/reset.css">`,
`  <link rel="stylesheet" href="/styles/layout.css">`,
`  <link rel="stylesheet" href="/styles/hero.css">`,
`</head>`,
`<body>`,
`  <main class="main-content">`,
`    <section class="hero hero--interactive">`,
`      <canvas id="hero-canvas"></canvas>`,
`    </section>`,
`  </main>`,
`  <script type="module">`,
`    import { initHero } from "/scripts/hero/core.js";`,
`    const canvas = document.querySelector("#hero-canvas");`,
`    initHero({ canvas, enableCodeMorph: true });`,
`  </script>`,
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

// ---------------- CODE → POINT CLOUD ----------------
function generateCodePoints() {
  let pts = [];

  const marginX = 20;
  const marginY = 30;

  const cols = floor((width - marginX * 2) / CHAR_WIDTH);
  const rows = ceil((height - marginY * 2) / LINE_HEIGHT);

  const fullCode = CODE_LINES.join("\n");
  let index = 0;

  for (let r = 0; r < rows; r++) {
    let y = marginY + r * LINE_HEIGHT;
    let x = marginX;

    for (let c = 0; c < cols; c++) {
      const ch = fullCode[index % fullCode.length];
      pts.push({
        x,
        y,
        char: ch === "\n" ? " " : ch
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

  const count = c.length;

  shuffle(a, true);
  shuffle(b, true);

  for (let i = 0; i < count; i++) {
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
  if (mode === MODE_SHAPE) mode = MODE_CODE;
  else {
    mode = MODE_SHAPE;
    targetShape = 1 - targetShape;
  }
}

// ---------------- DRAW ----------------
function draw() {
  background("#FFFFFF");

  let time = frameCount * IDLE_SPEED;
  let accent = ACCENT_COLORS[targetShape % ACCENT_COLORS.length];

  for (let p of particles) {
    let target =
      mode === MODE_CODE
        ? p.c
        : targetShape === 0
        ? p.a
        : p.b;

    let organize =
      mode === MODE_CODE ? ORGANIZE_FORCE_CODE : ORGANIZE_FORCE;

    let idleX = cos(time + target.x * 0.002) * IDLE_AMPLITUDE;
    let idleY = sin(time + target.y * 0.002) * IDLE_AMPLITUDE;

    p.vx += (target.x + idleX - p.x) * organize;
    p.vy += (target.y + idleY - p.y) * organize;

    let dm = dist(mouseX, mouseY, p.x, p.y);
    if (dm < HOVER_RADIUS) {
      let ang = atan2(p.y - mouseY, p.x - mouseX);
      let strength =
        mode === MODE_CODE
          ? HOVER_FORCE * CODE_HOVER_MULTIPLIER
          : HOVER_FORCE;

      let f = (1 - dm / HOVER_RADIUS) * strength;
      p.vx += cos(ang) * f;
      p.vy += sin(ang) * f;
    }

    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.x += p.vx;
    p.y += p.vy;

    let speed = constrain(sqrt(p.vx * p.vx + p.vy * p.vy), 0, VELOCITY_GLOW_MAX);
    let glow = speed / VELOCITY_GLOW_MAX;

    let cd = dist(mouseX, mouseY, p.x, p.y);
    let t = constrain(1 - cd / COLOR_RADIUS, 0, 1);

    fill(
      lerp(BASE_COLOR[0], accent[0], max(t, glow)),
      lerp(BASE_COLOR[1], accent[1], max(t, glow)),
      lerp(BASE_COLOR[2], accent[2], max(t, glow)),
      lerp(BASE_ALPHA, SPOTLIGHT_ALPHA, max(t, glow))
    );

    textSize(FONT_SIZE + glow * 2.5);
    text(p.char, p.x, p.y);
  }
}

// ---------------- RESIZE ----------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildParticles();
}
