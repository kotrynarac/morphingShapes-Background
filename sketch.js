// HERO MORPH — SVG ⇄ SVG ⇄ SVG ⇄ SVG ⇄ FULL-WIDTH CODE SHAPE
// (AUTO STATE SWITCH + MAGNET / PUSH INTERCHANGE)

let particles = [];
let font;
let shapes = [];

// ---------------- CONFIG ----------------
const DENSITY = 5;
const HERO_SCALE = 0.85;

const ORGANIZE_FORCE = 0.03;
const DAMPING = 0.8;

const HOVER_RADIUS = 90;
const HOVER_FORCE = 2.2;
const CODE_HOVER_MULTIPLIER = 4.4;

// Magnet tuning
const MAGNET_FORCE = 0.3;
const ELASTIC_RADIUS = 18;

// Falloff layers
const MAGNET_CORE = 0.45;
const MAGNET_MID = 0.6;

const FONT_SIZE = 14;
const LINE_HEIGHT = 24;
const CHAR_WIDTH = 12;

const BASE_COLOR = [38, 47, 59];
const ACCENT_COLORS = [
  [22, 106, 234],
  [205, 196, 255],
  [228, 255, 152]
];

// 🔥 COLOR INTENSITY TUNING
const COLOR_RADIUS = 520;
const GLOBAL_COLOR_BASE = 0.25;
const BASE_ALPHA = 0.25 * 255;
const SPOTLIGHT_ALPHA = 255;
const TRANSITION_FLASH_TIME = 1200;

// ---------------- TIMING ----------------
const STATE_DURATION = 7000;
let lastSwitchTime = 0;

// ---------------- MODES ----------------
const MODE_SHAPE = 0;
const MODE_CODE = 1;

let mode = MODE_SHAPE;
let targetShape = 0;
let codeHoverMode = 0;
let activeAccent;
let transitionFlash = 0;

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

  shapes.push(loadImage("heroShapeA.svg"));
  shapes.push(loadImage("heroShapeB.svg"));
  shapes.push(loadImage("heroShapeC.svg"));
  shapes.push(loadImage("heroShapeD.svg"));
  shapes.push(loadImage("heroShapeE.svg"));
  shapes.push(loadImage("heroShapeF.svg"));
  shapes.push(loadImage("heroShapeG.svg"));
  shapes.push(loadImage("heroShapeH.svg"));
  shapes.push(loadImage("heroShapeI.svg"));
  shapes.push(loadImage("heroShapeJ.svg"));
}

// ---------------- SETUP ----------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(FONT_SIZE);
  textAlign(LEFT, TOP);
  noStroke();
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));

  activeAccent = random(ACCENT_COLORS);
  buildParticles();
  lastSwitchTime = millis();
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

  const shapePoints = shapes.map(s => extractPoints(s));
  const codePoints = generateCodePoints();

  shapePoints.forEach(p => shuffle(p, true));

  for (let i = 0; i < codePoints.length; i++) {
    particles.push({
      x: shapePoints[0][i % shapePoints[0].length].x,
      y: shapePoints[0][i % shapePoints[0].length].y,
      vx: 0,
      vy: 0,
      shapes: shapePoints.map(s => s[i % s.length]),
      code: codePoints[i],
      char: codePoints[i].char
    });
  }
}

// ---------------- AUTO STATE SWITCH ----------------
function updateStateMachine() {
  if (millis() - lastSwitchTime < STATE_DURATION) return;

  lastSwitchTime = millis();
  activeAccent = random(ACCENT_COLORS);
  transitionFlash = millis();

  if (mode === MODE_SHAPE) {
    mode = MODE_CODE;
    codeHoverMode = 1 - codeHoverMode;
  } else {
    mode = MODE_SHAPE;
    targetShape = (targetShape + 1) % shapes.length;
  }
}

// ---------------- DRAW ----------------
function draw() {
  background("#FFFFFF");
  updateStateMachine();

  for (let p of particles) {
    let target = mode === MODE_CODE ? p.code : p.shapes[targetShape];

    p.vx += (target.x - p.x) * ORGANIZE_FORCE;
    p.vy += (target.y - p.y) * ORGANIZE_FORCE;

    let d = dist(mouseX, mouseY, p.x, p.y);

    if (mode === MODE_SHAPE && d < HOVER_RADIUS) {
      let a = atan2(p.y - mouseY, p.x - mouseX);
      let f = (1 - d / HOVER_RADIUS) * HOVER_FORCE;
      p.vx += cos(a) * f;
      p.vy += sin(a) * f;
    }

    if (mode === MODE_CODE && d < HOVER_RADIUS) {
      if (codeHoverMode === 0) {
        let a = atan2(p.y - mouseY, p.x - mouseX);
        let f =
          (1 - d / HOVER_RADIUS) *
          HOVER_FORCE *
          CODE_HOVER_MULTIPLIER;
        p.vx += cos(a) * f;
        p.vy += sin(a) * f;
      } else {
        let dx = mouseX - p.x;
        let dy = mouseY - p.y;
        let distToMouse = sqrt(dx * dx + dy * dy);

        if (distToMouse > ELASTIC_RADIUS) {
          let nd = distToMouse / HOVER_RADIUS;
          let strength =
            nd < MAGNET_CORE
              ? 1
              : nd < MAGNET_MID
              ? map(nd, MAGNET_CORE, MAGNET_MID, 1, 0.35)
              : map(nd, MAGNET_MID, 1, 0.35, 0.08);

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

    // -------- COLOR SYSTEM (ONLY CHANGE) --------

    let cursorT = constrain(1 - d / COLOR_RADIUS, 0, 1);
    let ambientT = GLOBAL_COLOR_BASE;

    let flashT = 0;
    if (transitionFlash > 0) {
      flashT =
        1 -
        constrain(
          (millis() - transitionFlash) / TRANSITION_FLASH_TIME,
          0,
          1
        );
    }

    let t = max(cursorT, ambientT, flashT);
    t = pow(t, 1.8);

    fill(
      lerp(BASE_COLOR[0], activeAccent[0], t),
      lerp(BASE_COLOR[1], activeAccent[1], t),
      lerp(BASE_COLOR[2], activeAccent[2], t),
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
