// Dependency-free content and application-wiring checks; not browser emulation.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { createHash } = require('node:crypto');
const vm = require('node:vm');
const read = path => readFileSync(join(__dirname, '..', path), 'utf8');
const categories = ['Science & Nature', 'Engineering & Technology', 'Arts & Culture', 'History & Society'];
class NodeStub {
  constructor(tag) { this.tag = tag; this.children = []; this.attributes = {}; this.events = {}; this.open = false; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren() { this.children = []; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(type, callback) { this.events[type] = callback; }
  focus() { this.focused = true; }
}
// The original 20-card daily order. Phase 2 appends new cards after these; this prefix never changes.
const ORIGINAL_DAILY_IDS = ['venus-clocks', 'suspension-bridge', 'woodcut-reversal', 'rosetta-scripts', 'coral-partners',
  'stainless-surface', 'shadow-puppetry', 'ming-banknote', 'basalt-columns', 'heat-pump', 'washoku', 'carnegie-libraries',
  'autumn-pigments', 'qr-recovery', 'gothic-light', 'penny-black', 'tree-ring-calendar', 'bicycle-gears', 'ultramarine', 'roman-amphorae'];
// extra: synthetic cards appended (in the test only) to content and to the end of the daily order.
function fixture(initialRandom = 0, date = { year: 2026, month: 10, day: 22 }, extra = []) {
  const controls = new NodeStub('div'), cabinet = new NodeStub('ul'), cabinetCount = new NodeStub('p'), article = new NodeStub('article'), today = new NodeStub('article'), count = new NodeStub('span');
  const cover = Object.fromEntries(['#today-question', '#today-tease', '#cover-category', '#cover-number', '#today-date'].map(id => [id, new NodeStub(id === '#today-date' ? 'time' : 'p')]));
  let random = initialRandom;
  const math = Object.create(Math);
  math.random = () => random;
  const context = vm.createContext({ Math: math, document: {
    querySelector: selector => {
      if (selector === '#categories') return controls;
      if (selector === '#cabinet') return cabinet;
      if (selector === '#cabinet-count') return cabinetCount;
      if (selector === '#curiosity') return article;
      if (selector === '#today-curiosity') return today;
      if (selector in cover) return cover[selector];
      throw Error('Unexpected selector ' + selector);
    },
    querySelectorAll: selector => {
      if (selector === '[data-library-count]') return [count];
      throw Error('Unexpected selector ' + selector);
    },
    createElement: tag => new NodeStub(tag)
  }});
  vm.runInContext(read('SRC/content.js') + (extra.length ? '\nDAILY_CURIOSITIES.push(...' + JSON.stringify(extra) + ');' : ''), context);
  const entries = vm.runInContext('DAILY_CURIOSITIES', context);
  const daily = read('SRC/daily.js');
  const listEnd = daily.indexOf('\n]);');
  vm.runInContext(extra.length ? daily.slice(0, listEnd) + extra.map(e => ',\n  ' + JSON.stringify(e.id)).join('') + daily.slice(listEnd) : daily, context);
  context.readLocalCalendarDate = () => date; // Inject calendar fields, not a mocked clock.
  vm.runInContext(read('SRC/app.js'), context);
  return { controls, cabinet, cabinetCount, article, today, count, cover, context, entries, setRandom: value => { random = value; } };
}
function descendants(node, tag) {
  return node.children.flatMap(child => [...(child.tag === tag ? [child] : []), ...descendants(child, tag)]);
}
function find(node, predicate) {
  return node.children.flatMap(child => [...(predicate(child) ? [child] : []), ...find(child, predicate)]);
}
const title = f => find(f.article, n => n.className === 'card-title')[0].textContent;
const headingLevels = article => find(article, n => /^h[1-6]$/.test(n.tag)).map(n => [Number(n.tag[1]), n.textContent]);
const words = text => text.trim().split(/\s+/u).length;
// The cabinet (issue #24): controls are the filter chips (All + categories); the first grid item is the "?" tile.
const surpriseButton = f => f.cabinet.children[0].children[0];
const tiles = f => f.cabinet.children.slice(1);
const tileFor = (f, id) => tiles(f).find(t => find(t, n => n.className === 'tile-title')[0].id === 'tile-title-' + id);
const tileButton = (f, id) => find(tileFor(f, id), n => n.tag === 'button')[0];
const filterButton = (f, name) => f.controls.children.find(n => n.textContent === name);
// Opens a card the way a reader does: through its tile, choosing "All" first if a filter hides it.
function selectEntry(f, index) {
  if (!tileFor(f, f.entries[index].id)) filterButton(f, 'All').events.click();
  tileButton(f, f.entries[index].id).events.click();
}
// Opens a card through the "?" tile by steering Math.random to its slot.
function surpriseTo(f, index) {
  if (title(f) === f.entries[index].title) surpriseButton(f).events.click();
  const candidates = Array.from(f.entries).filter(e => e.title !== title(f));
  const slot = candidates.findIndex(e => e.id === f.entries[index].id);
  f.setRandom((slot + 0.5) / candidates.length);
  surpriseButton(f).events.click();
}
function assertClosed(article) {
  const layers = descendants(article, 'details');
  assert.equal(layers.length, 3);
  assert.ok(layers.every(node => !node.open));
  assert.ok(descendants(layers[0], 'details').includes(layers[1]));
}

test('at least twenty sourced cards with unique IDs and titles, balanced categories, and all three beats', () => {
  const { entries } = fixture();
  const n = entries.length;
  assert.ok(n >= 20);
  assert.equal(new Set(entries.map(e => e.id)).size, n);
  assert.equal(new Set(entries.map(e => e.title)).size, n);
  const counts = categories.map(category => entries.filter(e => e.category === category).length);
  assert.ok(Math.min(...counts) >= 5, 'every category keeps its original five cards');
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 2, 'no category more than 2 cards ahead: ' + counts);
  entries.forEach(entry => {
    assert.ok(categories.includes(entry.category));
    const counts = [words(entry.hook), words(entry.core.join(' ')), words(entry.deep.join(' '))];
    assert.ok(counts[0] >= 20 && counts[0] <= 35, entry.id + ' hook');
    assert.ok(counts[1] >= 85 && counts[1] <= 115, entry.id + ' core');
    assert.ok(counts[2] >= 130 && counts[2] <= 175, entry.id + ' deep');
    assert.ok(entry.sources.length > 0);
    for (const source of entry.sources) {
      assert.ok(source.label.length > 12);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
  });
});

test('five native filter chips expose one selected state; the "?" tile leads the grid; initial hook without a gate', () => {
  const f = fixture();
  assert.deepEqual(f.controls.children.map(n => n.textContent), ['All', ...categories]);
  assert.ok(f.controls.children.every(n => n.tag === 'button' && n.type === 'button'));
  assert.equal(f.controls.children[0].attributes['aria-pressed'], 'true');
  assert.equal(f.controls.children.filter(n => n.attributes['aria-pressed'] === 'true').length, 1);
  const surprise = surpriseButton(f);
  assert.equal(f.cabinet.children[0].className, 'tile tile-surprise');
  assert.equal(surprise.tag, 'button'); assert.equal(surprise.type, 'button');
  assert.equal(surprise.children[0].textContent, '?');
  assert.equal(surprise.children[0].attributes['aria-hidden'], 'true');
  assert.equal(surprise.children[1].textContent, 'Take me somewhere unexpected');
  assert.equal(title(f), f.entries[0].title);
  assert.ok(f.article.children.some(n => n.textContent === f.entries[0].hook));
  assertClosed(f.article);
  assert.equal(f.article.focused, undefined, 'No automatic focus steal on load');
});

test('every tile shows category, number, title, the hook\'s first sentence and a native "Look inside" button', () => {
  const f = fixture();
  assert.equal(tiles(f).length, f.entries.length, 'one tile per card under "All"');
  f.entries.forEach((entry, i) => {
    const item = tiles(f)[i];
    assert.equal(item.tag, 'li');
    assert.equal(item.attributes['data-category'], { 'Science & Nature': 'science', 'Engineering & Technology': 'engineering', 'Arts & Culture': 'arts', 'History & Society': 'history' }[entry.category]);
    const [meta, name, hook, button] = item.children;
    assert.equal(meta.textContent, entry.category + ' · No. ' + String(i + 1).padStart(3, '0'));
    assert.equal(name.textContent, entry.title);
    assert.ok(entry.hook.startsWith(hook.textContent), entry.id + ' hook prefix');
    assert.match(hook.textContent, /[.!?]["”’)]*$/, entry.id + ' ends a sentence');
    assert.ok(hook.textContent.length < entry.hook.length || !/[.!?]\s/.test(entry.hook), entry.id + ' only the first sentence');
    assert.equal(button.tag, 'button'); assert.equal(button.type, 'button');
    assert.equal(button.children[0].textContent, 'Look inside');
    assert.equal(button.children[1].textContent, ' →');
    assert.equal(button.children[1].attributes['aria-hidden'], 'true');
    assert.equal(button.attributes['aria-labelledby'], button.id + ' ' + name.id, 'accessible name is "Look inside <title>"');
  });
  const ids = tiles(f).flatMap(t => find(t, n => n.id).map(n => n.id));
  assert.equal(new Set(ids).size, ids.length, 'tile ids are unique');
  assert.equal(f.context.firstSentence('One. Two.'), 'One.');
  assert.equal(f.context.firstSentence('He said “Go.” Then left.'), 'He said “Go.”');
  assert.equal(f.context.firstSentence('No full stop'), 'No full stop');
});

test('every card is reachable from the grid and from each filter; opening a tile moves focus and starts closed', () => {
  const f = fixture();
  ['All', ...categories].forEach(filter => {
    const chip = filterButton(f, filter);
    chip.events.click();
    assert.equal(chip.attributes['aria-pressed'], 'true');
    assert.equal(f.controls.children.filter(n => n.attributes['aria-pressed'] === 'true').length, 1);
    const expected = f.entries.filter(e => filter === 'All' || e.category === filter);
    assert.deepEqual(tiles(f).map(t => t.children[1].textContent), Array.from(expected, e => e.title), filter);
    assert.equal(surpriseButton(f).children[1].textContent, 'Take me somewhere unexpected', 'the "?" tile stays under every filter');
    assert.equal(f.cabinetCount.textContent, filter === 'All' ? `${f.entries.length} curiosities` : `${expected.length} of ${f.entries.length} curiosities · ${filter}`);
    expected.forEach(entry => {
      descendants(f.article, 'details').forEach(n => { n.open = true; });
      f.article.focused = undefined;
      tileButton(f, entry.id).events.click();
      assert.equal(title(f), entry.title);
      assertClosed(f.article);
      assert.equal(f.article.focused, true, 'focus moves to the opened card');
      assert.equal(chip.attributes['aria-pressed'], 'true', 'opening a tile keeps the filter');
    });
  });
});

test('counts come from the library size and filters split it exactly', () => {
  const f = fixture();
  const sizes = categories.map(c => { filterButton(f, c).events.click(); return tiles(f).length; });
  assert.equal(sizes.reduce((a, b) => a + b, 0), f.entries.length);
  assert.doesNotMatch(read('SRC/app.js'), /\b(five|twenty|Twenty|Five)\b/);
});

test('initial Surprise Me covers every card bin, including their boundaries', () => {
  const n = fixture().entries.length;
  // i / n can round to just below the bin in floating point (e.g. 15 / 22 * 22 < 15), so step up to the
  // smallest value the app's Math.floor(random * n) places in bin i; that is still the bin's lower boundary.
  const lowest = i => { let r = i / n; while (Math.floor(r * n) < i) r += Number.EPSILON; return r; };
  for (let i = 0; i < n; i++) {
    assert.ok(lowest(i) - i / n <= 4 * Number.EPSILON, 'boundary adjustment stays within rounding error');
    for (const random of [lowest(i), (i + 1) / n - Number.EPSILON]) {
      const f = fixture(random);
      assert.equal(title(f), f.entries[i].title);
      assert.equal(f.controls.children[0].attributes['aria-pressed'], 'true', '"All" is selected on load');
    }
  }
});

test('Surprise Me reaches every other card from every current card; no immediate repeats', () => {
  const n = fixture().entries.length;
  // As in the bin test above: slot / (n - 1) can round just below its bin (e.g. 13 / 23 * 23 < 13), so step
  // up to the smallest value Math.floor(random * (n - 1)) places in the slot.
  const lowest = slot => { let r = slot / (n - 1); while (Math.floor(r * (n - 1)) < slot) r += Number.EPSILON; return r; };
  for (let current = 0; current < n; current++) {
    const eligible = Array.from({ length: n }, (_, i) => i).filter(i => i !== current);
    eligible.forEach((expected, slot) => {
      assert.ok(lowest(slot) - slot / (n - 1) <= 4 * Number.EPSILON, 'boundary adjustment stays within rounding error');
      for (const random of [lowest(slot), (slot + 1) / (n - 1) - Number.EPSILON]) {
        const f = fixture((current + 0.5) / n);
        f.setRandom(random);
        f.article.focused = undefined;
        surpriseButton(f).events.click();
        assert.equal(f.article.focused, true);
        assert.equal(title(f), f.entries[expected].title);
        assert.notEqual(title(f), f.entries[current].title);
        assertClosed(f.article);
      }
    });
  }
});

test('filters change only the grid: the open card, Today and the "?" draw ignore them; no saved preference', () => {
  const f = fixture(0.99);
  const open = title(f), today = [...f.today.children];
  categories.forEach(category => {
    filterButton(f, category).events.click();
    assert.equal(title(f), open, 'filtering does not replace the open card');
    assert.deepEqual(f.today.children, today);
  });
  // With a filter on, the "?" still draws from the whole library (excluding only the open card).
  filterButton(f, categories[0]).events.click();
  const other = f.entries.findIndex(e => e.category !== categories[0] && e.title !== open);
  surpriseTo(f, other);
  assert.equal(title(f), f.entries[other].title);
  assert.equal(filterButton(f, categories[0]).attributes['aria-pressed'], 'true');
});

test('every real selection path render complete content/sources and reset disclosures', () => {
  const f = fixture();
  [...f.entries.map((entry, i) => [entry, i, selectEntry]), ...f.entries.map((entry, i) => [entry, i, surpriseTo])].forEach(([entry, i, open]) => {
    descendants(f.article, 'details').forEach(n => { n.open = true; });
    open(f, i);
    assert.equal(title(f), entry.title);
    assertClosed(f.article);
    const paragraphs = descendants(f.article, 'p').map(n => n.textContent);
    for (const text of [entry.hook, ...entry.core, ...entry.deep]) assert.ok(paragraphs.includes(text));
    const links = descendants(f.article, 'a');
    assert.equal(links.length, entry.sources.length);
    links.forEach((link, j) => {
      assert.equal(link.href, entry.sources[j].url);
      assert.equal(link.textContent, entry.sources[j].label);
    });
  });
});

test('closing the core resets the deep dive, while reopening it does not reveal the deep dive', () => {
  const { article } = fixture();
  const [core, deep] = descendants(article, 'details');
  core.open = true; core.events.toggle(); assert.equal(deep.open, false);
  deep.open = true; core.open = false; core.events.toggle(); assert.equal(deep.open, false);
  core.open = true; core.events.toggle(); assert.equal(deep.open, false);
});

test('a new page instance forgets the filter and starts on "All" with a random card', () => {
  const first = fixture();
  first.controls.children[3].events.click();
  assert.equal(first.controls.children[3].attributes['aria-pressed'], 'true');
  const n = first.entries.length;
  const reloaded = fixture((n - 0.5) / n);
  assert.equal(reloaded.controls.children[0].attributes['aria-pressed'], 'true');
  assert.equal(tiles(reloaded).length, n);
  assert.equal(title(reloaded), reloaded.entries[n - 1].title);
  assertClosed(reloaded.article);
});

test('the two original visuals still render; optional absence is safe and text alternatives exist', () => {
  const f = fixture();
  for (const id of ['venus-clocks', 'woodcut-reversal']) assert.ok(f.entries.find(e => e.id === id).visual, id + ' keeps its visual');
  assert.ok(f.entries.every(e => !e.visual || ['bars', 'mirror'].includes(e.visual.type)), 'only renderer-supported visual types');
  f.entries.forEach((entry, i) => {
    selectEntry(f, i);
    const figures = descendants(f.article, 'figure');
    assert.equal(figures.length, entry.visual ? 1 : 0);
    if (!entry.visual) return;
    assert.ok(descendants(descendants(f.article, 'details')[1], 'figure').includes(figures[0]));
    const [diagram, caption] = figures[0].children;
    assert.equal(diagram.attributes.role, 'img');
    assert.equal(diagram.attributes['aria-label'], entry.visual.alt);
    assert.ok(entry.visual.alt.length > 50);
    assert.equal(caption.textContent, entry.visual.caption);
    assert.ok(diagram.children.every(n => n.attributes['aria-hidden'] === 'true'));
    if (entry.visual.type === 'bars') {
      diagram.children.forEach((row, j) => assert.equal(row.children[2].attributes.style, `width: ${100 * entry.visual.items[j].value / entry.visual.max}%`));
    } else {
      assert.equal(diagram.children[0].children[2].className, 'print-letter reversed');
      assert.equal(diagram.children[1].children[2].className, 'print-letter');
    }
  });
});

test('premise, category prompt, and native disclosure action labels remain present', () => {
  const html = read('index.html');
  assert.match(html, /One curious idea a day\. Explore only as deeply as you want\./);
  assert.match(html, /What are you curious about today\?/);
  assert.ok(html.indexOf('class="premise"') < html.indexOf('id="categories"'));
  assert.match(html, /role="group" aria-labelledby="selection-title"/);
  const { article } = fixture();
  for (const summary of descendants(article, 'summary')) {
    assert.equal(summary.children[1].textContent, 'Open');
    assert.equal(summary.children[2].textContent, 'Close');
    assert.equal(descendants(summary, 'button').length, 0);
  }
});

test('runtime scope remains static: no external assets, data collection, persistence, or extra flows', () => {
  const html = read('index.html'), app = read('SRC/app.js'), css = read('SRC/styles.css');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (!url.startsWith('#') && !url.startsWith('data:')) assert.ok(read(url).length > 0);
  }
  assert.doesNotMatch(app, /\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|sendBeacon|Notification|geolocation|setInterval)\b|document\.cookie|https?:\/\//);
  assert.doesNotMatch(html, /<(form|input|textarea|audio|video|iframe)\b/);
  // Inline data: URIs (the SVG paper grain) contain the SVG namespace string but make no request.
  assert.doesNotMatch(css.replace(/url\("data:[^"]*"\)/g, ''), /@import|https?:/);
  const f = fixture();
  assert.equal(descendants(f.article, 'button').length, 0, 'No extra card actions');
});

// Snapshot folders were retired when the project moved to git (2026-11). Git history now
// preserves every earlier version; the baseline checks below pin what those snapshots protected.

test('fixed daily permutation contains all IDs once, keeps the original order first, mixes categories across wrap, and ignores authoring order', () => {
  const f = fixture();
  const ids = Array.from(vm.runInContext('DAILY_CARD_IDS', f.context));
  const n = f.entries.length;
  assert.equal(ids.length, n);
  assert.equal(new Set(ids).size, n);
  assert.deepEqual([...ids].sort(), Array.from(f.entries, e => e.id).sort());
  assert.deepEqual(ids.slice(0, 20), ORIGINAL_DAILY_IDS, 'new cards are appended after the original 20');
  ids.forEach((id, i) => assert.notEqual(f.entries.find(e => e.id === id).category, f.entries.find(e => e.id === ids[(i + 1) % n]).category));
  vm.runInContext('DAILY_CURIOSITIES.reverse()', f.context);
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.UTC(2026, 9, 22 + i));
    const index = f.context.cardIndexForDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
    assert.equal(f.entries[index].id, ids[i]);
  }
});

test('same dates are stable; every rolling window of library length covers all cards including negative offsets', () => {
  const f = fixture(), map = f.context.cardIndexForDate, n = f.entries.length;
  const values = [];
  for (let i = -(2 * n + 5); i <= 2 * n + 5; i++) {
    const d = new Date(Date.UTC(2026, 9, 22 + i));
    const args = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
    values.push(map(...args));
    assert.equal(map(...args), map(...args));
  }
  for (let i = 0; i + n < values.length; i++) {
    assert.equal(new Set(values.slice(i, i + n)).size, n);
    assert.notEqual(values[i], values[i + 1]);
    assert.equal(values[i], values[i + n]);
  }
  assert.equal(title({ article: fixture(0, {year:2026,month:10,day:22}).today }), title({ article: fixture(.99, {year:2026,month:10,day:22}).today }));
});

test('leap days, century rules, year boundaries, and representative DST dates advance one slot', () => {
  const f = fixture(), map = f.context.cardIndexForDate;
  const ids = Array.from(vm.runInContext('DAILY_CARD_IDS', f.context));
  const sequences = [
    [[2024,2,28],[2024,2,29],[2024,3,1]],
    [[2025,2,28],[2025,3,1]], [[2000,2,28],[2000,2,29],[2000,3,1]],
    [[2100,2,28],[2100,3,1]], [[2026,12,31],[2027,1,1]],
    [[2026,3,7],[2026,3,8],[2026,3,9]],
    [[2026,10,31],[2026,11,1],[2026,11,2]],
    [[2026,3,28],[2026,3,29],[2026,3,30]],
    [[2026,10,24],[2026,10,25],[2026,10,26]]
  ];
  for (const seq of sequences) {
    const slots = seq.map(args => ids.indexOf(f.entries[map(...args)].id));
    slots.slice(1).forEach((slot, i) => assert.equal(slot, (slots[i] + 1) % ids.length));
  }
  for (const args of [[2025,2,29],[2100,2,29],[2026,4,31],[2026,0,1],[2026,1,0]]) assert.throws(() => map(...args), /Invalid|Expected/);
  const daily = read('SRC/daily.js');
  assert.doesNotMatch(daily.slice(daily.indexOf('function cardIndexForDate'), daily.indexOf('function readLocalCalendarDate')), /new Date|Math.random|readLocalCalendarDate/);
  assert.match(daily, /getFullYear\(\)/); assert.match(daily, /getMonth\(\)/); assert.match(daily, /getDate\(\)/);
});

test('Today nodes and open disclosures survive every filter, tile and Surprise action', () => {
  const f = fixture();
  const nodes = [...f.today.children];
  const [core, deep] = descendants(f.today, 'details');
  core.open = true; deep.open = true;
  const actions = [...f.controls.children.map(b => () => b.events.click()), () => surpriseButton(f).events.click(),
    ...f.entries.map(e => () => selectEntry(f, f.entries.indexOf(e)))];
  actions.forEach(action => {
    for (let i = 0; i < 3; i++) {
      action();
      assert.deepEqual(f.today.children, nodes);
      assert.equal(core.open, true); assert.equal(deep.open, true);
    }
  });
  const [exploreCore, exploreDeep] = descendants(f.article, 'details');
  exploreCore.open = true; exploreDeep.open = true;
  core.open = false; core.events.toggle();
  assert.equal(deep.open, false);
  assert.equal(exploreCore.open, true); assert.equal(exploreDeep.open, true);
  core.open = true; deep.open = true;
  exploreCore.open = false; exploreCore.events.toggle();
  assert.equal(exploreDeep.open, false); assert.equal(deep.open, true);
  assert.equal(f.today.focused, undefined);
});

test('both surfaces render all cards with independent titles, sources and diagrams; Explore may match Today', () => {
  const n = fixture().entries.length;
  for (let offset = 0; offset < n; offset++) {
    const date = new Date(Date.UTC(2026, 9, 22 + offset));
    const fields = {year: date.getUTCFullYear(), month: date.getUTCMonth()+1, day: date.getUTCDate()};
    const f = fixture(0, fields);
    const dailyIndex = f.context.cardIndexForDate(fields.year,fields.month,fields.day);
    const matched = fixture((dailyIndex + .5) / n, fields);
    assert.equal(title(matched), title({article:matched.today}));
    assert.equal(matched.article.children[1].id, 'entry-title');
    assert.equal(matched.today.children[1].id, 'today-entry-title');
    for (const article of [matched.today, matched.article]) {
      assertClosed(article);
      const entry = matched.entries[dailyIndex];
      const paragraphs = descendants(article,'p').map(p=>p.textContent);
      for (const p of [entry.hook,...entry.core,...entry.deep]) assert.ok(paragraphs.includes(p));
      assert.deepEqual(descendants(article,'a').map(a=>a.href),Array.from(entry.sources,s=>s.url));
      assert.equal(descendants(article,'figure').length,entry.visual ? 1 : 0);
    }
  }
});

test('original card fields stay byte-stable against the git-era baseline; no persistence in runtime scripts', () => {
  const baseline = JSON.parse(read('tests/baseline/card-content-sha256.json'));
  assert.equal(Object.keys(baseline).length, 20);
  const entries = fixture().entries;
  for (const [id, sha] of Object.entries(baseline)) {
    const entry = entries.find(e => e.id === id);
    assert.ok(entry, 'baseline card still present: ' + id);
    const { recall, ...fields } = entry;
    assert.equal(createHash('sha256').update(JSON.stringify(fields)).digest('hex'), sha, 'original fields changed: ' + id);
  }
  for (const path of ['SRC/app.js','SRC/daily.js','SRC/content.js']) assert.doesNotMatch(read(path), /\b(localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|sendBeacon|WebSocket|Notification)\b|document\.cookie/);
  assert.match(read('index.html'), /Today’s Curiosity/); assert.match(read('index.html'), /The cabinet of curiosities/);
});

test('every recall prompt is optional, nested inside Deep Dive, and responses begin closed', () => {
  const f=fixture();
  f.entries.forEach((entry,i)=>{
    assert.deepEqual(Object.keys(entry.recall).sort(),['prompt','reveal']);
    assert.ok(entry.recall.prompt.length>20 && entry.recall.reveal.length>20);
    assert.ok(words(entry.recall.reveal)<=45);
    selectEntry(f,i);
    const [core,deep,response]=descendants(f.article,'details');
    assert.ok(descendants(deep,'details').includes(response));
    const sections=descendants(deep,'section').filter(n=>n.className==='recall');
    assert.equal(sections.length,1);
    assert.equal(descendants(sections[0],'p')[0].textContent,entry.recall.prompt);
    assert.equal(descendants(response,'p')[0].textContent,entry.recall.reveal);
    assert.equal(descendants(sections[0],'h6')[0].textContent,'Remember this?');
    assert.equal(response.children[0].tag,'summary');
    assert.equal(response.open,false);
    core.open=true; deep.open=true; response.open=true;
    deep.open=false; deep.events.toggle(); assert.equal(response.open,false);
    deep.open=true; assert.equal(response.open,false);
    response.open=true; core.open=false; core.events.toggle(); assert.equal(response.open,false);
  });
});

test('same-card Today and Explore recall is independent and Explore changes reset only Explore', () => {
  const f=fixture();
  assert.equal(title(f),title({article:f.today}));
  const today=descendants(f.today,'details'), explore=descendants(f.article,'details');
  today.forEach(n=>n.open=true);
  assert.equal(explore[2].open,false);
  explore.forEach(n=>n.open=true);
  today[2].open=false; assert.equal(explore[2].open,true);
  today[2].open=true;
  selectEntry(f, (f.entries.findIndex(e=>e.title===title(f))+1)%f.entries.length);
  assert.equal(descendants(f.article,'details')[2].open,false);
  assert.equal(today[2].open,true);
  assert.equal(f.today.focused,undefined);
});

test('v6 introduces no evaluative controls, persistence, announcements, or timers', () => {
  const f=fixture();
  for(const article of [f.today,f.article]) {
    for(const tag of ['input','textarea','form','button','progress']) assert.equal(descendants(article,tag).length,0);
    const text=JSON.stringify(article);
    assert.doesNotMatch(text,/correct|incorrect|points|score|grade|streak|aria-live|role":"status/i);
  }
  assert.doesNotMatch(read('SRC/app.js'),/setTimeout|setInterval|localStorage|sessionStorage|indexedDB|document\.cookie|aria-live/);
});

// Re-pinned in issue #13 (Phase 2 enabler): a comment documenting the append-only rule was added, and the
// pin now excludes the ID list so content PRs can append IDs without re-pinning. The ID list itself is
// pinned by ORIGINAL_DAILY_IDS (prefix) and the permutation test above. The mapping code is unchanged from v5.
test('daily mapping code is unchanged: SRC/daily.js outside the ID list matches its pinned hash', () => {
  const daily = read('SRC/daily.js');
  const start = daily.indexOf('Object.freeze([') + 'Object.freeze(['.length, end = daily.indexOf('\n]);');
  assert.ok(start > 'Object.freeze(['.length && end > start);
  const code = daily.slice(0, start) + daily.slice(end);
  assert.equal(createHash('sha256').update(code).digest('hex'), '4dc01593dfa24f5a235b1d7d671bc9ada2526b8d5a96e4883f9d70664280b209');
});

test('heading outline nests each card below its surface heading on Today and Explore', () => {
  const html = read('index.html');
  // Design 1.0 step 2: the cover question is the page's only h1; Today's card title stays h2 below it.
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1 id="today-question"[^>]*>Today’s Curiosity<\/h1>/);
  assert.match(html, /<h2 id="explore-title"[^>]*>The cabinet of curiosities<\/h2>/);
  assert.match(html, /<h3 id="selection-title"[^>]*>What are you curious about today\?<\/h3>/);
  assert.doesNotMatch(html, /<h[4-6]/);
  const outline = base => [[base, null], [base + 1, 'The idea'], [base + 2, 'Look closer'], [base + 3, 'Sources'], [base + 3, 'Remember this?']];
  const f = fixture();
  f.entries.forEach((entry, i) => {
    selectEntry(f, i);
    const expected = outline(3).map(([level, text]) => [level, text ?? entry.title]);
    assert.deepEqual(headingLevels(f.article), expected, entry.id + ' explore');
    assert.equal(find(f.article, n => n.className === 'card-title')[0].id, 'entry-title');
  });
  const seen = new Set();
  for (let i = 0; i < f.entries.length; i++) { // library-length consecutive days cover every card.
    const d = new Date(Date.UTC(2026, 10, 1 + i)); // UTC calendar arithmetic, so N >= 31 rolls into December.
    const today = fixture(0, { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }).today;
    const entryTitle = find(today, n => n.className === 'card-title')[0];
    assert.equal(entryTitle.id, 'today-entry-title');
    assert.deepEqual(headingLevels(today), outline(2).map(([level, text]) => [level, text ?? entryTitle.textContent]));
    seen.add(entryTitle.textContent);
  }
  assert.equal(seen.size, f.entries.length);
});

test('docs/RECALL.md register matches every recall prompt and response in SRC/content.js exactly', () => {
  const f = fixture();
  const register = new Map();
  for (const block of read('docs/RECALL.md').split(/\n(?=- ID: )/).slice(1)) {
    const id = block.match(/^- ID: `([^`]+)`/)[1];
    const prompt = block.match(/^- Prompt: (.+)$/m)[1];
    const reveal = block.match(/^- Response: (.+)$/m)[1];
    assert.ok(!register.has(id), 'duplicate RECALL.md entry: ' + id);
    register.set(id, { prompt, reveal });
  }
  assert.equal(register.size, f.entries.length);
  for (const entry of f.entries) {
    assert.deepEqual(register.get(entry.id), { prompt: entry.recall.prompt, reveal: entry.recall.reveal }, 'RECALL.md out of sync: ' + entry.id);
  }
});

test('approved v7 recall wording fix: autumn-pigments prompt names every color its response covers', () => {
  const entry = fixture().entries.find(e => e.id === 'autumn-pigments');
  assert.equal(entry.recall.prompt, 'How do autumn yellows, oranges, reds, and purples differ in the way they appear?');
  assert.equal(entry.recall.reveal, 'Fading chlorophyll reveals yellow and orange pigments already present. Many leaves also make new red or purple pigments during autumn.');
});

test('docs/ROLLBACK.md documents restore, revert-by-PR, incident notes and a corrective task, and is linked from README', () => {
  const doc = read('docs/ROLLBACK.md');
  assert.match(read('README.md'), /\]\(docs\/ROLLBACK\.md\)/);
  assert.match(doc, /Netlify/);
  assert.match(doc, /Publish deploy/);
  assert.match(doc, /git revert/);
  assert.match(doc, /revert pull request/i);
  assert.match(doc, /## 3\. Document the failure/);
  assert.match(doc, /corrective task/i);
  assert.match(doc, /labeled `auto`/);
  assert.match(doc, /Don't force-push/);
  assert.doesNotMatch(doc, /git push[^\n]*(--force|\s-f\b)/);
  assert.doesNotMatch(doc, /git push[^\n]*\bmain\b/);
  assert.doesNotMatch(doc, /git reset --hard/);
});

test('forced-colors mode keeps the bar chart and the selected category visible with system colors', () => {
  const css = read('SRC/styles.css');
  const block = css.match(/@media \(forced-colors: active\) \{([\s\S]*?)\n\}/);
  assert.ok(block, 'forced-colors media block exists');
  assert.match(block[1], /\.bar-fill \{[^}]*background: CanvasText;[^}]*forced-color-adjust: none;/);
  assert.match(block[1], /button\[aria-pressed="true"\] \{[^}]*background: Highlight;[^}]*color: HighlightText;/);
  assert.match(read('docs/QA.md'), /issue #9/);
});

test('docs/RELEASE_NOTES.md records the Phase 1 baseline, git-era changes, limitations, pending QA and rollback', () => {
  const doc = read('docs/RELEASE_NOTES.md');
  assert.match(read('README.md'), /\]\(docs\/RELEASE_NOTES\.md\)/);
  for (const heading of ['## Baseline contents', '## Changes since the git import', '## Known limitations', '## Pending QA', '## Rollback'])
    assert.ok(doc.includes('\n' + heading + '\n'), heading);
  for (const issue of ['#3', '#5', '#7', '#9']) assert.match(doc, new RegExp('\\| ' + issue + ' \\|'));
  assert.match(doc, /\]\(ROLLBACK\.md\)/);
  const f = fixture();
  assert.match(doc, new RegExp('\\*\\*Library:\\*\\* ' + f.entries.length + ' cards'));
  const sourceCount = Array.from(f.entries).reduce((n, e) => n + e.sources.length, 0);
  assert.match(doc, new RegExp(sourceCount + ' source links'));
});

test('the app and daily rotation generalize to N cards: two synthetic cards appended (test-only) are fully reachable', () => {
  const baseFixture = fixture(), base = Array.from(baseFixture.entries);
  const baseIds = Array.from(vm.runInContext('DAILY_CARD_IDS', baseFixture.context));
  const categoryOf = id => base.find(e => e.id === id).category;
  const baseCount = category => base.filter(e => e.category === category).length;
  // Derive the synthetic categories from the current library: the first differs from the last real card, the second
  // differs from the first and from the card the rotation wraps to; prefer the smallest categories to keep balance.
  const bySize = categories.slice().sort((a, b) => baseCount(a) - baseCount(b));
  const first = bySize.find(c => c !== categoryOf(baseIds[baseIds.length - 1]));
  const second = bySize.find(c => c !== first && c !== categoryOf(baseIds[0]));
  const clone = (id, category) => ({ ...JSON.parse(JSON.stringify(base.find(e => e.category === category))), id, title: 'Synthetic ' + id, category });
  const extra = [clone('synthetic-a', first), clone('synthetic-b', second)];
  const f = fixture(0, undefined, extra), n = f.entries.length, map = f.context.cardIndexForDate;
  assert.equal(n, base.length + 2);
  const ids = Array.from(vm.runInContext('DAILY_CARD_IDS', f.context));
  assert.deepEqual(ids, [...baseIds, 'synthetic-a', 'synthetic-b']);
  const counts = categories.map(c => f.entries.filter(e => e.category === c).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 2, 'synthetic cards keep categories balanced: ' + counts);
  ids.forEach((id, i) => assert.notEqual(f.entries.find(e => e.id === id).category, f.entries.find(e => e.id === ids[(i + 1) % n]).category));
  // Today: n consecutive days show every card once, then repeat; the original cards keep their relative order.
  const days = Array.from({ length: 2 * n }, (_, i) => { const d = new Date(Date.UTC(2026, 9, 22 + i)); return f.entries[map(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())].id; });
  assert.deepEqual(days.slice(0, n), ids);
  assert.deepEqual(days.slice(n), ids);
  const last = new Date(Date.UTC(2026, 9, 22 + n - 1)); // epoch + (n - 1) days -> the last slot
  const todayTitle = fixture(0, { year: last.getUTCFullYear(), month: last.getUTCMonth() + 1, day: last.getUTCDate() }, extra).today;
  assert.equal(find(todayTitle, x => x.className === 'card-title')[0].textContent, 'Synthetic synthetic-b');
  // Surprise Me: every bin reaches its card, and from the last card every other card is reachable.
  for (let i = 0; i < n; i++) assert.equal(title(fixture((i + 0.5) / n, undefined, extra)), f.entries[i].title);
  const reached = new Set();
  for (let slot = 0; slot < n - 1; slot++) {
    const g = fixture((n - 0.5) / n, undefined, extra);
    g.setRandom((slot + 0.5) / (n - 1));
    surpriseButton(g).events.click();
    reached.add(title(g));
  }
  assert.equal(reached.size, n - 1);
  assert.ok(!reached.has(f.entries[n - 1].title));
  // Filters: each category's tiles include the appended cards, and every tile opens its card.
  categories.forEach(category => {
    const g = fixture(0, undefined, extra), expected = f.entries.filter(e => e.category === category).map(e => e.title);
    filterButton(g, category).events.click();
    const seen = tiles(g).map(t => { find(t, n => n.tag === 'button')[0].events.click(); return title(g); });
    assert.deepEqual(seen, Array.from(expected), category);
  });
  assert.equal(fixture(0, undefined, extra).cabinetCount.textContent, n + ' curiosities');
  categories.forEach(c => assert.equal(f.entries.filter(e => e.category === c).length, baseCount(c) + extra.filter(e => e.category === c).length, c));
  // Appended cards render the same nested outline as the originals.
  selectEntry(f, n - 1);
  assert.deepEqual(headingLevels(f.article).map(([level]) => level), [3, 4, 5, 6, 6]);
  assertClosed(f.article);
});

// Design System 1.0 step 1 (issue #22): self-hosted fonts, tokens, texture and copy.
test('Design 1.0 fonts are self-hosted woff2 files with their OFL licences, loaded from local paths', () => {
  const css = read('SRC/styles.css');
  const faces = [...css.matchAll(/@font-face \{([^}]*)\}/g)].map(m => m[1]);
  assert.ok(faces.length >= 4);
  const families = new Set(faces.map(face => face.match(/font-family: '([^']+)'/)[1]));
  assert.deepEqual([...families].sort(), ['Playfair Display', 'Source Sans 3']);
  for (const face of faces) {
    const urls = [...face.matchAll(/url\("([^"]+)"\)/g)].map(m => m[1]);
    assert.equal(urls.length, 1);
    assert.match(urls[0], /^fonts\/[a-z0-9-]+\.woff2$/, 'local woff2 path: ' + urls[0]);
    const bytes = readFileSync(join(__dirname, '..', 'SRC', urls[0]));
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', 'real woff2 file: ' + urls[0]);
  }
  for (const licence of ['SRC/fonts/OFL-PlayfairDisplay.txt', 'SRC/fonts/OFL-SourceSans3.txt']) {
    const text = read(licence);
    assert.match(text, /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.match(text.split('\n')[0], /^Copyright /);
  }
});

test('Design 1.0 makes no http(s) requests from CSS or HTML: only card source links are absolute URLs', () => {
  const css = read('SRC/styles.css'), html = read('index.html');
  // Inline data: URIs (the SVG grain) carry the SVG namespace string but make no request.
  const cssWithoutData = css.replace(/url\("data:[^"]*"\)/g, '');
  assert.doesNotMatch(cssWithoutData, /https?:|@import|\/\//);
  for (const match of css.matchAll(/url\("([^"]+)"\)/g)) assert.match(match[1], /^(data:|fonts\/)/);
  assert.doesNotMatch(html, /https?:|\/\//);
  assert.doesNotMatch(read('SRC/app.js'), /https?:\/\//);
  // Card sources are the only absolute URLs, and they are rendered as plain links.
  for (const entry of fixture().entries) for (const source of entry.sources) assert.equal(new URL(source.url).protocol, 'https:');
});

test('Design 1.0 tokens: section 3 colours are defined, gold is decoration only, and text colours pass AA on ivory', () => {
  const css = read('SRC/styles.css');
  const tokens = { ivory: '#F9F5E8', parchment: '#EDE2C8', ink: '#1F1E1A', night: '#16202E', navy: '#3E5F8A', green: '#4C6B50',
    'red-brown': '#9A3E24', plum: '#64466A', muted: '#6B6455', gold: '#B8893D', 'cover-gold': '#E2B867', rule: '#D9CBA8' };
  for (const [name, value] of Object.entries(tokens)) assert.match(css, new RegExp(`--${name}: ${value};`), name);
  // Gold may only colour the ✳ mark and list markers on light surfaces, never text.
  for (const rule of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (/(^|[^-])color: var\(--gold\)/.test(rule[2])) assert.match(rule[1].trim(), /^(\.brand span|\.sources li::marker)$/, rule[1]);
  }
  const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  for (const text of ['ink', 'navy', 'green', 'red-brown', 'plum', 'muted'])
    for (const surface of ['ivory', 'parchment']) assert.ok(ratio(tokens[text], tokens[surface]) >= 4.5, `${text} on ${surface}`);
  assert.ok(ratio(tokens.ivory, tokens.ink) >= 4.5, 'selected chip');
  assert.ok(ratio(tokens.gold, tokens.ivory) < 4.5, 'gold really is decoration-only');
  for (const [category, key] of [['science', 'green'], ['engineering', 'navy'], ['arts', 'red-brown'], ['history', 'plum']])
    assert.match(css, new RegExp(`\\[data-category="${category}"\\] \\{ --accent: var\\(--${key}\\); \\}`));
  const f = fixture();
  for (const article of [f.today, f.article]) {
    const entry = f.entries.find(e => e.title === find(article, n => n.className === 'card-title')[0].textContent);
    assert.equal(article.attributes['data-category'], { 'Science & Nature': 'science', 'Engineering & Technology': 'engineering', 'Arts & Culture': 'arts', 'History & Society': 'history' }[entry.category]);
  }
});

test('Design 1.0 copy: section labels, invitation wording, and no hard-coded card counts or version badges', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /\b(five|twenty|Twenty|Five|v6|Concept A)\b|\b\d+ (ideas|cards)\b/);
  assert.match(html, /a modern field journal for how the world works/);
  const f = fixture();
  assert.equal(f.count.textContent, String(f.entries.length), 'footer count comes from the library size');
  const labels = descendants(f.article, 'summary').map(s => s.children[0].textContent);
  assert.deepEqual(labels, ['The idea', 'Look closer', 'Reveal response']);
  assert.equal(surpriseButton(f).children[1].textContent, 'Take me somewhere unexpected');
  assert.doesNotMatch(read('SRC/app.js'), /Core Insight|Deep Dive &|Pause and recall/);
});

// Design System 1.0 step 2 (issue #23): the Today cover.
const keyPhrases = f => f.cover['#today-question'].children.filter(n => typeof n !== 'string' && n.className === 'key-phrase');
const coverQuestion = f => f.cover['#today-question'].children.map(n => typeof n === 'string' ? n : n.textContent).join('');
test('Today cover falls back to title and hook, and uses optional question (with a {key phrase}) and tease', () => {
  const f = fixture();
  const todayEntry = f.entries.find(e => e.title === find(f.today, n => n.className === 'card-title')[0].textContent);
  const index = f.entries.indexOf(todayEntry);
  assert.ok(f.entries.every(e => e.question === undefined && e.tease === undefined), 'no card text changes in this step');
  assert.equal(coverQuestion(f), todayEntry.title);
  assert.equal(keyPhrases(f).length, 0);
  assert.equal(f.cover['#today-tease'].textContent, todayEntry.hook);
  assert.equal(f.cover['#cover-category'].textContent, todayEntry.category);
  assert.equal(f.cover['#cover-number'].textContent, 'No. ' + String(index + 1).padStart(3, '0'));
  const date = { year: 2026, month: 11, day: 11 };
  const withFields = { ...todayEntry, question: 'Why would anyone launch a clock that’s {wrong on purpose?}', tease: 'A short, mysterious tease.' };
  f.entries[index] = withFields;
  f.context.renderCover(index, date);
  assert.equal(coverQuestion(f), 'Why would anyone launch a clock that’s wrong on purpose?');
  const key = keyPhrases(f);
  assert.equal(key.length, 1);
  assert.equal(key[0].tag, 'span');
  assert.equal(key[0].textContent, 'wrong on purpose?');
  assert.equal(f.cover['#today-tease'].textContent, 'A short, mysterious tease.');
  f.entries[index] = { ...todayEntry, question: 'A question with no key phrase?' };
  f.context.renderCover(index, date);
  assert.equal(coverQuestion(f), 'A question with no key phrase?');
  assert.equal(f.cover['#today-tease'].textContent, todayEntry.hook, 'tease falls back on its own');
  f.entries[index] = { ...todayEntry, tease: 'Only a tease.' };
  f.context.renderCover(index, date);
  assert.equal(coverQuestion(f), todayEntry.title, 'question falls back on its own');
  assert.equal(f.cover['#today-date'].textContent, 'Wednesday, 11 November');
  assert.equal(f.cover['#today-date'].attributes.datetime, '2026-11-11');
});

test('Today cover shows the same card as the unchanged daily mapping on every day of the rotation', () => {
  const n = fixture().entries.length;
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.UTC(2026, 9, 22 + i));
    const fields = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
    const f = fixture(0, fields);
    const expected = f.entries[f.context.cardIndexForDate(fields.year, fields.month, fields.day)];
    assert.equal(expected.id, ORIGINAL_DAILY_IDS[i] ?? vm.runInContext('DAILY_CARD_IDS', f.context)[i], 'Today mapping unchanged');
    assert.equal(find(f.today, n => n.className === 'card-title')[0].textContent, expected.title);
    assert.equal(coverQuestion(f), expected.question || expected.title);
    assert.equal(f.cover['#cover-category'].textContent, expected.category);
  }
  const weekdays = [[2026, 11, 12, 'Thursday, 12 November', '2026-11-12'], [2024, 2, 29, 'Thursday, 29 February', '2024-02-29'], [2027, 1, 3, 'Sunday, 3 January', '2027-01-03']];
  for (const [year, month, day, text, iso] of weekdays) {
    const f = fixture(0, { year, month, day });
    assert.equal(f.cover['#today-date'].textContent, text);
    assert.equal(f.cover['#today-date'].attributes.datetime, iso);
  }
});

test('Today cover markup: metadata, question, tease and a "Find out why" link whose target exists in the reading area', () => {
  const html = read('index.html');
  const cover = html.slice(html.indexOf('<section class="cover"'), html.indexOf('</section>', html.indexOf('<section class="cover"')));
  const order = ['class="cover-meta"', 'Today’s curiosity', 'id="cover-category"', 'id="cover-number"', 'id="today-question"', 'id="today-tease"', 'class="cover-cta"'];
  order.forEach((needle, i) => { assert.ok(cover.includes(needle), needle); if (i) assert.ok(cover.indexOf(needle) > cover.indexOf(order[i - 1]), needle); });
  const cta = cover.match(/<a class="cover-cta" href="#([^"]+)">Find out why <span aria-hidden="true">↓<\/span><\/a>/);
  assert.ok(cta, 'native link with the approved copy');
  assert.equal((html.match(new RegExp(`id="${cta[1]}"`, 'g')) || []).length, 1, 'CTA target exists once');
  assert.ok(html.indexOf(`id="${cta[1]}"`) > html.indexOf('</section>', html.indexOf('<section class="cover"')), 'target is below the cover');
  assert.match(html, /<time id="today-date"/);
  assert.ok(html.indexOf('<header class="masthead">') < html.indexOf('<section class="cover"'));
  // Nothing else sits on the cover: drawings and the numbers strip come in later steps.
  assert.doesNotMatch(cover, /<(img|svg|figure|button)\b/);
});

test('Today cover styling: base night theme for every category, AA text on night, phone first screen, motion only when allowed', () => {
  const css = read('SRC/styles.css'), app = read('SRC/app.js');
  assert.doesNotMatch(app, /cover[^\n]*data-category|data-theme/, 'no per-category cover theme until step 4');
  assert.match(css, /\.cover \{ background-color: var\(--night\);/);
  const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const muted = css.match(/--cover-muted: (#[0-9A-F]{6});/)[1];
  for (const text of ['#F9F5E8', '#E2B867', muted]) assert.ok(ratio(text, '#16202E') >= 4.5, text + ' on night');
  assert.ok(ratio('#1F1E1A', '#E2B867') >= 4.5, 'ink on the gold button');
  assert.match(css, /\.cover-cta \{[^}]*min-height: 48px/);
  const phone = css.slice(css.indexOf('@media (max-width: 480px)'));
  assert.match(phone, /\.cover \{[^}]*min-height: calc\(100svh - var\(--masthead-phone\)\)/);
  // Animation and smooth scrolling appear only inside the no-preference block.
  const motionStart = css.indexOf('@media (prefers-reduced-motion: no-preference) {');
  assert.ok(motionStart > 0);
  const motionEnd = css.indexOf('\n}\n', motionStart);
  const outside = css.slice(0, motionStart) + css.slice(motionEnd);
  assert.doesNotMatch(outside, /animation|@keyframes|transition|scroll-behavior/);
  assert.match(css.slice(motionStart, motionEnd), /scroll-behavior: smooth/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*\.cover-cta/);
});
