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
  const controls = new NodeStub('div'), article = new NodeStub('article'), today = new NodeStub('article');
  let random = initialRandom;
  const math = Object.create(Math);
  math.random = () => random;
  const context = vm.createContext({ Math: math, document: {
    querySelector: selector => {
      if (selector === '#categories') return controls;
      if (selector === '#curiosity') return article;
      if (selector === '#today-curiosity') return today;
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
  return { controls, article, today, context, entries, setRandom: value => { random = value; } };
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
function selectEntry(f, index) {
  if (title(f) === f.entries[index].title) f.controls.children[0].events.click();
  const candidates = Array.from(f.entries).filter(e => e.title !== title(f));
  const slot = candidates.findIndex(e => e.id === f.entries[index].id);
  f.setRandom((slot + 0.5) / candidates.length);
  f.controls.children[0].events.click();
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

test('five native choice buttons expose one selected state and initial hook without a gate', () => {
  const f = fixture();
  assert.deepEqual(f.controls.children.map(n => n.textContent), ['Surprise Me', ...categories]);
  assert.ok(f.controls.children.every(n => n.tag === 'button' && n.type === 'button'));
  assert.equal(f.controls.children[0].attributes['aria-pressed'], 'true');
  assert.equal(f.controls.children.filter(n => n.attributes['aria-pressed'] === 'true').length, 1);
  assert.equal(title(f), f.entries[0].title);
  assert.ok(f.article.children.some(n => n.textContent === f.entries[0].hook));
  assertClosed(f.article);
  assert.equal(f.article.focused, undefined, 'No automatic focus steal on load');
});

test('each category cycles all of its cards twice without an immediate repeat', () => {
  categories.forEach((category, i) => {
    const f = fixture();
    const expected = Array.from(f.entries.filter(e => e.category === category), e => e.id);
    const seen = [], size = expected.length;
    for (let repeat = 0; repeat < 2 * size; repeat++) {
      const previous = title(f);
      f.controls.children[i + 1].events.click();
      const entry = f.entries.find(e => e.title === title(f));
      assert.equal(entry.category, category);
      assert.notEqual(title(f), previous);
      seen.push(entry.id);
      assert.equal(f.controls.children[i + 1].attributes['aria-pressed'], 'true');
      assert.equal(f.controls.children.filter(n => n.attributes['aria-pressed'] === 'true').length, 1);
      assert.equal(f.article.focused, true);
    }
    assert.equal(new Set(seen.slice(0, size)).size, size);
    assert.deepEqual(seen.slice(0, size), seen.slice(size));
    assert.deepEqual([...new Set(seen)].sort(), expected.sort());
  });
});

test('initial Surprise Me covers every card bin, including their boundaries', () => {
  const n = fixture().entries.length;
  for (let i = 0; i < n; i++) {
    for (const random of [i / n, (i + 1) / n - Number.EPSILON]) {
      const f = fixture(random);
      assert.equal(title(f), f.entries[i].title);
      assert.equal(f.controls.children[0].attributes['aria-pressed'], 'true');
    }
  }
});

test('Surprise Me reaches every other card from every current card; no immediate repeats', () => {
  const n = fixture().entries.length;
  for (let current = 0; current < n; current++) {
    const eligible = Array.from({ length: n }, (_, i) => i).filter(i => i !== current);
    eligible.forEach((expected, slot) => {
      for (const random of [slot / (n - 1), (slot + 1) / (n - 1) - Number.EPSILON]) {
        const f = fixture((current + 0.5) / n);
        f.setRandom(random);
        f.controls.children[0].events.click();
        assert.equal(title(f), f.entries[expected].title);
        assert.notEqual(title(f), f.entries[current].title);
        assertClosed(f.article);
      }
    });
  }
});

test('switching categories uses the current card, not a saved preference or history', () => {
  const f = fixture(0.99);
  categories.forEach((category, i) => {
    f.controls.children[(i + 1) % 4 + 1].events.click();
    f.controls.children[i + 1].events.click();
    const matches = f.entries.filter(e => e.category === category);
    assert.equal(title(f), matches[0].title);
    f.setRandom(0.999);
    f.controls.children[0].events.click();
    assert.equal(f.controls.children[0].attributes['aria-pressed'], 'true');
  });
  const within = fixture(2.5 / f.entries.length);
  within.controls.children[1].events.click();
  assert.equal(title(within), within.entries[3].title, 'Category continues from a card drawn by Surprise Me');
});

test('every real selection path render complete content/sources and reset disclosures', () => {
  const f = fixture();
  f.entries.forEach((entry, i) => {
    descendants(f.article, 'details').forEach(n => { n.open = true; });
    selectEntry(f, i);
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

test('a new page instance forgets category state and starts with Surprise Me', () => {
  const first = fixture();
  first.controls.children[3].events.click();
  const n = first.entries.length;
  const reloaded = fixture((n - 0.5) / n);
  assert.equal(reloaded.controls.children[0].attributes['aria-pressed'], 'true');
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
  assert.doesNotMatch(css, /@import|https?:/);
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

test('Today nodes and open disclosures survive every Explore category and Surprise action', () => {
  const f = fixture();
  const nodes = [...f.today.children];
  const [core, deep] = descendants(f.today, 'details');
  core.open = true; deep.open = true;
  f.controls.children.forEach(button => {
    for (let i = 0; i < 6; i++) {
      button.events.click();
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
  assert.match(read('index.html'), /Today’s Curiosity/); assert.match(read('index.html'), /Explore More/);
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
    assert.match(descendants(sections[0],'h6')[0].textContent,/Optional/);
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
  f.controls.children[1].events.click();
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
  assert.match(html, /<h1 id="today-title"[^>]*>Today’s Curiosity<\/h1>/);
  assert.match(html, /<h2 id="explore-title"[^>]*>Explore More<\/h2>/);
  assert.match(html, /<h3 id="selection-title"[^>]*>What are you curious about today\?<\/h3>/);
  assert.doesNotMatch(html, /<h[4-6]/);
  const outline = base => [[base, null], [base + 1, 'Core insight'], [base + 2, 'Deep dive'], [base + 3, 'Sources'], [base + 3, 'Optional · Pause and recall']];
  const f = fixture();
  f.entries.forEach((entry, i) => {
    selectEntry(f, i);
    const expected = outline(3).map(([level, text]) => [level, text ?? entry.title]);
    assert.deepEqual(headingLevels(f.article), expected, entry.id + ' explore');
    assert.equal(find(f.article, n => n.className === 'card-title')[0].id, 'entry-title');
  });
  const seen = new Set();
  for (let day = 1; day <= f.entries.length; day++) { // library-length consecutive days cover every card.
    const today = fixture(0, { year: 2026, month: 11, day }).today;
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

test('the app and daily rotation generalize to N cards: a synthetic 22-card library (test-only) is fully reachable', () => {
  const base = fixture().entries;
  const clone = (from, id, category) => ({ ...JSON.parse(JSON.stringify(base.find(e => e.id === from))), id, title: 'Synthetic ' + id, category });
  // Appended after roman-amphorae (History): Arts, then History, then wrap to venus-clocks (Science).
  const extra = [clone('ultramarine', 'synthetic-arts', 'Arts & Culture'), clone('penny-black', 'synthetic-history', 'History & Society')];
  const f = fixture(0, undefined, extra), n = f.entries.length, map = f.context.cardIndexForDate;
  assert.equal(n, base.length + 2);
  const ids = Array.from(vm.runInContext('DAILY_CARD_IDS', f.context));
  assert.deepEqual(ids, [...Array.from(vm.runInContext('DAILY_CARD_IDS', fixture().context)), 'synthetic-arts', 'synthetic-history']);
  ids.forEach((id, i) => assert.notEqual(f.entries.find(e => e.id === id).category, f.entries.find(e => e.id === ids[(i + 1) % n]).category));
  // Today: n consecutive days show every card once, then repeat; the original cards keep their relative order.
  const days = Array.from({ length: 2 * n }, (_, i) => { const d = new Date(Date.UTC(2026, 9, 22 + i)); return f.entries[map(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())].id; });
  assert.deepEqual(days.slice(0, n), ids);
  assert.deepEqual(days.slice(n), ids);
  const todayTitle = fixture(0, { year: 2026, month: 11, day: 12 }, extra).today; // epoch + 21 days -> slot 21
  assert.equal(find(todayTitle, x => x.className === 'card-title')[0].textContent, 'Synthetic synthetic-history');
  // Surprise Me: every bin reaches its card, and from the last card every other card is reachable.
  for (let i = 0; i < n; i++) assert.equal(title(fixture((i + 0.5) / n, undefined, extra)), f.entries[i].title);
  const reached = new Set();
  for (let slot = 0; slot < n - 1; slot++) {
    const g = fixture((n - 0.5) / n, undefined, extra);
    g.setRandom((slot + 0.5) / (n - 1));
    g.controls.children[0].events.click();
    reached.add(title(g));
  }
  assert.equal(reached.size, n - 1);
  assert.ok(!reached.has(f.entries[n - 1].title));
  // Categories: Arts and History now cycle six cards each, including the appended ones.
  categories.forEach((category, i) => {
    const g = fixture(0, undefined, extra), expected = f.entries.filter(e => e.category === category).map(e => e.title), seen = [];
    for (let k = 0; k < expected.length; k++) { g.controls.children[i + 1].events.click(); seen.push(title(g)); }
    assert.deepEqual([...seen].sort(), [...expected].sort(), category);
  });
  assert.equal(f.entries.filter(e => e.category === 'Arts & Culture').length, 6);
  // Appended cards render the same nested outline as the originals.
  selectEntry(f, n - 1);
  assert.deepEqual(headingLevels(f.article).map(([level]) => level), [3, 4, 5, 6, 6]);
  assertClosed(f.article);
});
