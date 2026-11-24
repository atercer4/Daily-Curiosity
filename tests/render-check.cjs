// Render check (issue #49): every card, on Today and in Explore, at phone and desktop widths, in headless Chromium.
// CI installs a pinned Playwright for this script only; nothing here ships with the site.
// Usage: node tests/render-check.cjs [outDir]   (exit code 1 on any failure; screenshots of failures go to outDir)
'use strict';
const http = require('node:http');
const { readFileSync, existsSync, mkdirSync } = require('node:fs');
const { join, normalize, extname } = require('node:path');
const { chromium } = require('playwright');

const ROOT = join(__dirname, '..');
const OUT = process.argv[2] || join(ROOT, 'render-check');
const WIDTHS = [320, 390, 1280];
const MIN_LABEL_PX = 13;   // plate labels, measured on screen (font size × plate scale)
const MIN_TARGET_PX = 44;  // DESIGN_SYSTEM.md rule 5
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.txt': 'text/plain' };

// A synthetic plate, numbers strip and cover drawing, so the illustration path is checked even before real plates exist.
// It is injected in the browser only and is never card content.
const FIXTURE = {
  type: 'plate', viewBox: '0 0 400 300', cover: true, placement: 'idea',
  alt: 'Synthetic render-check fixture: a circle in a dashed orbit with two labels, used only by tests/render-check.cjs.',
  caption: 'Synthetic render-check fixture.',
  shapes: [{ el: 'circle', cx: 200, cy: 150, r: 60 }, { el: 'ellipse', cx: 200, cy: 150, rx: 170, ry: 70, rotate: -15, tone: 'muted', dash: true },
    { el: 'line', x1: 10, y1: 150, x2: 390, y2: 150, tone: 'accent' }, { el: 'circle', cx: 360, cy: 110, r: 6, tone: 'gold', fill: true }],
  labels: [{ x: 270, y: 145, text: 'Label' }, { x: 390, y: 290, text: 'about one unit', anchor: 'end', note: true }],
  numbers: [{ value: '−7', unit: 'units', label: 'First synthetic figure.' }, { value: '+45', unit: 'units', label: 'Second synthetic figure.' },
    { value: '≈10', unit: 'units', label: 'Third synthetic figure, with a longer label to test wrapping.' }]
};

function serve() {
  const server = http.createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    const file = join(ROOT, path || 'index.html');
    if (!file.startsWith(ROOT) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// Runs in the page: renders one card on both surfaces with every disclosure open, then measures it.
function inspect({ index, fixture, minLabel, minTarget }) {
  if (fixture) DAILY_CURIOSITIES[index] = { ...DAILY_CURIOSITIES[index], visual: fixture };
  renderCover(index, { year: 2026, month: 11, day: 15 });
  renderCard(document.querySelector('#today-curiosity'), index, 'today-entry-title', 2, false, true);
  showCard(index);
  document.querySelectorAll('details').forEach(d => { d.open = true; });
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
    const problems = [];
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw + 1) problems.push(`horizontal overflow: page is ${document.documentElement.scrollWidth}px wide at ${vw}px`);
    const entry = DAILY_CURIOSITIES[index];
    const figures = [...document.querySelectorAll('#today-curiosity figure, #curiosity figure')];
    if (entry.visual && figures.length !== 2) problems.push(`expected the visual on both surfaces, found ${figures.length}`);
    // Measure the drawing itself, not the figure around it: padding and the caption keep a figure tall even when
    // the drawing inside has vanished (Codex review on PR #50).
    const visible = node => {
      for (let n = node; n && n.nodeType === 1; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
      }
      return true;
    };
    const drawn = (node, what) => {
      const r = node.getBoundingClientRect();
      if (!visible(node) || r.width < 40 || r.height < 40) problems.push(`${what} is not drawn: ${Math.round(r.width)}×${Math.round(r.height)}${visible(node) ? '' : ', hidden'}`);
      return r;
    };
    for (const figure of figures) {
      const column = figure.closest('article').getBoundingClientRect();
      const labelled = figure.querySelector('[role="img"]');
      if (!labelled || (labelled.getAttribute('aria-label') || '').length < 50) { problems.push('figure lacks a text alternative'); continue; }
      const box = drawn(labelled, 'figure drawing');
      if (box.left < column.left - 1 || box.right > column.right + 1) problems.push('figure extends past its reading column');
      for (const part of labelled.querySelectorAll('.diagram-item, circle, ellipse, line, rect, path, polyline'))
        if (!visible(part)) { problems.push('part of a figure is hidden'); break; }
    }
    if (entry.visual && entry.visual.cover) {
      const cover = document.querySelector('#cover-drawing-slot svg.plate');
      if (!cover) problems.push('cover drawing is missing'); else drawn(cover, 'cover drawing');
    }
    if (entry.visual && entry.visual.numbers) {
      const strip = document.querySelector('#today-numbers .numbers-strip');
      if (!strip) problems.push('numbers strip is missing'); else drawn(strip, 'numbers strip');
    }
    for (const plate of document.querySelectorAll('svg.plate')) {
      const r = plate.getBoundingClientRect();
      const scale = r.width / plate.viewBox.baseVal.width;
      for (const label of plate.querySelectorAll('text')) {
        const px = parseFloat(getComputedStyle(label).fontSize) * scale;
        if (px < minLabel) problems.push(`plate label "${label.textContent}" renders at ${px.toFixed(1)}px`);
        const lb = label.getBoundingClientRect();
        if (lb.left < -1 || lb.right > vw + 1) problems.push(`plate label "${label.textContent}" is cut off by the screen edge`);
      }
    }
    for (const control of document.querySelectorAll('button, summary, .cover-cta')) {
      const b = control.getBoundingClientRect();
      if (b.width && b.height < minTarget) problems.push(`small target (${Math.round(b.height)}px): ${control.textContent.trim().slice(0, 40)}`);
    }
    resolve(problems);
  })));
}

(async () => {
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const failures = [];
  let checked = 0;
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url, { waitUntil: 'load' });
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
    const count = await page.evaluate(() => DAILY_CURIOSITIES.length);
    const cases = [...Array(count).keys()].map(index => ({ index, label: null })).concat([{ index: 0, label: 'synthetic plate fixture' }]);
    for (const { index, label } of cases) {
      const id = await page.evaluate(i => DAILY_CURIOSITIES[i].id, index);
      const name = `${label || id} @ ${width}px`;
      const problems = await page.evaluate(inspect, { index, fixture: label ? FIXTURE : null, minLabel: MIN_LABEL_PX, minTarget: MIN_TARGET_PX });
      problems.push(...errors.splice(0).map(e => 'page error: ' + e));
      checked++;
      if (problems.length) {
        failures.push({ name, problems });
        mkdirSync(OUT, { recursive: true });
        await page.screenshot({ path: join(OUT, `${(label || id).replace(/\W+/g, '-')}-${width}.png`), fullPage: true });
      }
    }
    // Explore views (issue #82): the four-preview landing view and each category view, with every tile drawn,
    // no overflow and full-size targets. The landing view shows exactly one tile per category plus the "?" tile.
    const views = await page.evaluate(() => [FEATURED, ...CATEGORIES]);
    for (const view of views) {
      const problems = await page.evaluate(({ view, minTarget }) => {
        selectFilter(view);
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
          const problems = [];
          const vw = document.documentElement.clientWidth;
          if (document.documentElement.scrollWidth > vw + 1) problems.push(`horizontal overflow: page is ${document.documentElement.scrollWidth}px wide at ${vw}px`);
          const tiles = [...document.querySelectorAll('#cabinet > .tile:not(.tile-surprise)')];
          const expected = view === FEATURED ? CATEGORIES.length : DAILY_CURIOSITIES.filter(e => e.category === view).length;
          if (tiles.length !== expected) problems.push(`expected ${expected} tiles, found ${tiles.length}`);
          if (view === FEATURED && document.querySelectorAll('#cabinet .tile-explore').length !== CATEGORIES.length) problems.push('expected one "Explore" button per category');
          if (!document.querySelector('#cabinet > .tile-surprise')) problems.push('the "?" tile is missing');
          for (const tile of document.querySelectorAll('#cabinet > .tile')) {
            const r = tile.getBoundingClientRect();
            if (r.width < 100 || r.height < 80 || r.right > vw + 1) problems.push(`tile is not drawn in the page: ${Math.round(r.width)}×${Math.round(r.height)}`);
          }
          for (const control of document.querySelectorAll('#categories button, #cabinet button')) {
            const b = control.getBoundingClientRect();
            if (b.width && b.height < minTarget) problems.push(`small target (${Math.round(b.height)}px): ${control.textContent.trim().slice(0, 40)}`);
            if (b.right > vw + 1) problems.push(`control cut off by the screen edge: ${control.textContent.trim().slice(0, 40)}`);
          }
          resolve(problems);
        })));
      }, { view, minTarget: MIN_TARGET_PX });
      problems.push(...errors.splice(0).map(e => 'page error: ' + e));
      checked++;
      const name = `Explore view "${view}" @ ${width}px`;
      if (problems.length) {
        failures.push({ name, problems });
        mkdirSync(OUT, { recursive: true });
        await page.screenshot({ path: join(OUT, `explore-${view.replace(/\W+/g, '-')}-${width}.png`), fullPage: true });
      }
    }
    await page.close();
  }
  // Fail-open (Codex review on PR #71): if content.js or app.js fails to load, the page under the masthead must not
  // stay hidden. The CSS fallback shows it after 3 s, with and without reduced motion.
  for (const blocked of ['content.js', 'app.js']) for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion });
    await page.route('**/SRC/' + blocked, route => route.abort());
    await page.goto(url, { waitUntil: 'load' });
    const name = `fail-open with ${blocked} blocked, reduced motion ${reducedMotion}`;
    try {
      await page.waitForFunction(() => ['.cover-inner', '.page', '.explore-surface', 'footer']
        .every(s => getComputedStyle(document.querySelector(s)).visibility === 'visible'), null, { timeout: 4500 });
    } catch {
      failures.push({ name, problems: ['content under the masthead is still hidden 4.5 s after load'] });
    }
    checked++;
    await page.close();
  }
  await browser.close();
  server.close();
  for (const { name, problems } of failures) console.log(`FAIL ${name}\n  - ${[...new Set(problems)].join('\n  - ')}`);
  console.log(`render check: ${checked - failures.length}/${checked} renders passed (${WIDTHS.join(', ')}px, Today and Explore, all disclosures open; the five Explore views; plus 4 first-paint fail-open checks)`);
  process.exit(failures.length ? 1 : 0);
})().catch(error => { console.error(error); process.exit(1); });
