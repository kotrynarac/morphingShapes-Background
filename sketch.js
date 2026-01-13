// HERO MORPH — SVG ⇄ SVG ⇄ FULL-WIDTH CODE SHAPE (STABLE)

let particles = [];
let font;
let shapeA, shapeB;

// ---------------- CONFIG ----------------
const DENSITY = 5;
const HERO_SCALE = 0.85;

const ORGANIZE_FORCE = 0.03;
const DAMPING = 0.78;

const HOVER_RADIUS = 90;
const HOVER_FORCE = 2.2;

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
`  <link rel="preconnect" href="https://fonts.googleapis.com">`,
`  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
`  <link rel="stylesheet" href="/styles/reset.css">`,
`  <link rel="stylesheet" href="/styles/tokens.css">`,
`  <link rel="stylesheet" href="/styles/layout.css">`,
`  <link rel="stylesheet" href="/styles/typography.css">`,
`  <link rel="stylesheet" href="/styles/hero.css">`,
`  <link rel="stylesheet" href="/styles/components/button.css">`,
`  <link rel="stylesheet" href="/styles/components/navigation.css">`,
`</head>`,
`<body class="page page--home page--motion-enabled page--theme-light" data-scroll="locked">`,
`  <header class="site-header site-header--transparent site-header--sticky" data-state="idle">`,
`    <div class="site-header__inner site-header__inner--wide">`,
`      <a href="/" class="brand brand--logo brand--animated" aria-label="Wix Home">WIX</a>`,
`      <nav class="navigation navigation--primary navigation--horizontal" role="navigation">`,
`        <ul class="navigation__list">`,
`          <li class="navigation__item"><a href="#platform">Platform</a></li>`,
`          <li class="navigation__item"><a href="#solutions">Solutions</a></li>`,
`          <li class="navigation__item"><a href="#developers">Developers</a></li>`,
`          <li class="navigation__item"><a href="#pricing">Pricing</a></li>`,
`          <li class="navigation__item"><a href="#enterprise">Enterprise</a></li>`,
`        </ul>`,
`      </nav>`,
`    </div>`,
`  </header>`,
`  <main class="main-content main-content--fluid main-content--scroll-locked">`,
`    <section class="hero hero--fullscreen hero--interactive hero--particle-driven" data-state="idle" data-morph-target="shapeA">`,
`      <canvas id="hero-canvas" width="1920" height="1080" data-density="5" data-hover-radius="90"></canvas>`,
`      <div class="hero-overlay hero-overlay--centered hero-overlay--wide">`,
`        <h1 class="hero-title hero-title--xl hero-title--bold">Create without limits using interactive motion systems</h1>`,
`        <p class="hero-subtitle hero-subtitle--lg">Design, build, and scale immersive digital experiences with modular tooling and performance-first architecture.</p>`,
`        <div class="hero-actions hero-actions--inline">`,
`          <button class="button button--primary button--lg button--rounded" data-action="start">Get Started</button>`,
`          <button class="button button--secondary button--lg button--ghost" data-action="docs">View Documentation</button>`,
`        </div>`,
`      </div>`,
`    </section>`,
`    <section class="features features--grid features--three-up features--spacious">`,
`      <article class="feature-card feature-card--interactive" data-index="0">`,
`        <h2 class="feature-card__title">Design Freedom</h2>`,
`        <p class="feature-card__description">Composable layouts, responsive typography, motion primitives, and scalable design tokens.</p>`,
`      </article>`,
`      <article class="feature-card feature-card--interactive" data-index="1">`,
`        <h2 class="feature-card__title">Developer Control</h2>`,
`        <p class="feature-card__description">APIs, webhooks, CLI tooling, headless CMS integration, and custom render pipelines.</p>`,
`      </article>`,
`      <article class="feature-card feature-card--interactive" data-index="2">`,
`        <h2 class="feature-card__title">Performance at Scale</h2>`,
`        <p class="feature-card__description">GPU-accelerated animation, adaptive rendering strategies, and edge-first delivery.</p>`,
`      </article>`,
`    </section>`,
`    <section class="developer-section developer-section--dark">`,
`      <pre class="code-sample"><code>npm install @wix/hero-morph-engine --save</code></pre>`,
`      <pre class="code-sample"><code>import { createHeroEngine } from "@wix/hero-morph-engine";</code></pre>`,
`    </section>`,
`  </main>`,
`  <footer class="site-footer site-footer--dark site-footer--wide">`,
`    <div class="site-footer__inner">`,
`      <span class="site-footer__copy">© 2026 Wix.com. All rights reserved.</span>`,
`      <nav class="site-footer__nav">`,
`        <a href="/privacy">Privacy</a>`,
`        <a href="/terms">Terms</a>`,
`        <a href="/accessibility">Accessibility</a>`,
`        <a href="/status">System Status</a>`,
`      </nav>`,
`    </div>`,
`  </footer>`,
`  <script type="module">`,
`    import { initHero, updateHero, destroyHero } from "/scripts/hero/core.js";`,
`    import { prefersReducedMotion, throttle } from "/scripts/utils/environment.js";`,
`    const canvas = document.getElementById("hero-canvas");`,
`    const config = {`,
`      density: 5,`,
`      idleAmplitude: 6,`,
`      hoverRadius: 90,`,
`      morphSpeed: 0.03,`,
`      enableCodeMorph: true,`,
`      enableIdleMotion: true`,
`    };`,
`    function bootstrapHero() {`,
`      if (!canvas || prefersReducedMotion()) return;`,
`      initHero({ canvas, ...config });`,
`    }`,
`    const handleResize = throttle(() => {`,
`      updateHero({ canvas, resize: true });`,
`    }, 100);`,
`    function cleanupHero() {`,
`      destroyHero({ canvas, cleanup: true });`,
`    }`,
`    window.addEventListener("DOMContentLoaded", bootstrapHero);`,
`    window.addEventListener("resize", handleResize);`,
`    window.addEventListener("beforeunload", cleanupHero);`,
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

// ---------------- CODE → POINT CLOUD (FULL SCREEN, FIXED) ----------------
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

  const count = c.length; // IMPORTANT: always fill screen

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

    let idleX = cos(time + target.x * 0.002) * IDLE_AMPLITUDE;
    let idleY = sin(time + target.y * 0.002) * IDLE_AMPLITUDE;

    p.vx += (target.x + idleX - p.x) * ORGANIZE_FORCE;
    p.vy += (target.y + idleY - p.y) * ORGANIZE_FORCE;

    let dm = dist(mouseX, mouseY, p.x, p.y);
    if (dm < HOVER_RADIUS) {
      let ang = atan2(p.y - mouseY, p.x - mouseX);
      let f = (1 - dm / HOVER_RADIUS) * HOVER_FORCE;
      p.vx += cos(ang) * f;
      p.vy += sin(ang) * f;
    }

    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.x += p.vx;
    p.y += p.vy;

    let cd = dist(mouseX, mouseY, p.x, p.y);
    let t = constrain(1 - cd / COLOR_RADIUS, 0, 1);

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
