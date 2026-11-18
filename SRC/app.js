/* Local data + native disclosures. Independent Today and Explore surfaces; no storage or requests. */
'use strict';
const categoryNavigation = document.querySelector('#categories');
const cabinet = document.querySelector('#cabinet');
const cabinetCount = document.querySelector('#cabinet-count');
const article = document.querySelector('#curiosity');
const todayArticle = document.querySelector('#today-curiosity');
// The cabinet of curiosities (DESIGN_SYSTEM.md section 2.4): "All" plus the four categories filter the grid.
const filters = ['All', ...CATEGORIES];
// Category accent keys for CSS (data-category); the structure is identical for every category.
const categoryKeys = { 'Science & Nature': 'science', 'Engineering & Technology': 'engineering', 'Arts & Culture': 'arts', 'History & Society': 'history' };
let selectedFilter = 'All';
let currentIndex = -1;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

// One reading row (DESIGN_SYSTEM.md section 2.3): a native disclosure whose summary carries the label and a short
// italic note. The beat keeps its own heading for the outline; it is visually hidden because the summary shows the label.
function disclosure(label, note, paragraphs, headingTag) {
  const details = element('details', null, 'beat-row');
  const summary = element('summary');
  const rule = element('span', null, 'beat-rule');
  rule.setAttribute('aria-hidden', 'true');
  const state = element('span', null, 'beat-state');
  state.setAttribute('aria-hidden', 'true');
  summary.append(rule, element('span', label, 'beat-label'), element('span', note, 'beat-note'), state);
  details.append(summary);
  const body = element('section', null, 'beat');
  body.append(element(headingTag, label, 'beat-title visually-hidden'));
  paragraphs.forEach(text => body.append(element('p', text)));
  details.append(body);
  return { details, body };
}

// Plate figures (issue #47): an original line drawing described as data in the card's `visual` field, so every
// label is reviewed with the card text. Only these shapes and numeric/path attributes are drawn; nothing else
// from the data reaches the DOM (no href, style, script or event attributes), and labels are set as text.
const SVG_NS = 'http://www.w3.org/2000/svg';
// Prototype-free lookup: names like "constructor" or "__proto__" are simply not shapes.
const PLATE_SHAPES = Object.assign(Object.create(null), { circle: ['cx', 'cy', 'r'], ellipse: ['cx', 'cy', 'rx', 'ry'], line: ['x1', 'y1', 'x2', 'y2'],
  rect: ['x', 'y', 'width', 'height', 'rx'], path: ['d'], polyline: ['points'] });
const PLATE_TONES = ['ink', 'accent', 'muted', 'gold'];

function svg(tag, attributes, className) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  if (className) node.setAttribute('class', className);
  return node;
}

// Labels keep the same on-screen size however far a plate is scaled (Codex review on PR #48): the observer
// publishes viewBox units per CSS pixel as --plate-scale, and the label font sizes multiply by it.
const plateScale = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => entries.forEach(({ target }) => {
  if (!target.isConnected) { plateScale.unobserve(target); return; } // a replaced card's plate
  const rendered = target.getBoundingClientRect().width;
  if (!rendered) return; // inside a closed disclosure: measured again when it opens
  target.style.setProperty('--plate-scale', (target.viewBox.baseVal.width / rendered).toFixed(3));
})) : null;

function plateDrawing(visual) {
  const drawing = svg('svg', { viewBox: visual.viewBox, focusable: 'false' }, 'plate');
  if (plateScale) plateScale.observe(drawing);
  visual.shapes.forEach(shape => {
    const allowed = typeof shape.el === 'string' ? PLATE_SHAPES[shape.el] : undefined;
    if (!Array.isArray(allowed)) return;
    const attributes = {};
    allowed.forEach(key => { if (shape[key] !== undefined) attributes[key] = shape[key]; });
    if (shape.el === 'ellipse' && shape.rotate) attributes.transform = `rotate(${Number(shape.rotate)} ${Number(shape.cx)} ${Number(shape.cy)})`;
    const tone = PLATE_TONES.includes(shape.tone) ? shape.tone : 'ink';
    drawing.append(svg(shape.el, attributes, `tone-${tone}${shape.fill ? ' filled' : ''}${shape.dash ? ' dashed' : ''}`));
  });
  (visual.labels || []).forEach(label => {
    const text = svg('text', { x: label.x, y: label.y, 'text-anchor': ['start', 'middle', 'end'].includes(label.anchor) ? label.anchor : 'start' },
      `plate-label${label.note ? ' note' : ''}`);
    text.textContent = label.text;
    drawing.append(text);
  });
  return drawing;
}

// The cover copy of a plate (visual.cover): the same drawing in the cover's language. The reading figure
// carries the text alternative, so this copy is decorative.
function coverDrawing(visual) {
  const holder = element('div', null, 'cover-drawing');
  holder.setAttribute('aria-hidden', 'true');
  holder.append(plateDrawing(visual));
  return holder;
}

// Numbers strip (DESIGN_SYSTEM.md section 2.2): at most three figures, each from the card's sourced text.
function numbersStrip(numbers) {
  const list = element('ul', null, 'numbers-strip');
  list.setAttribute('aria-label', 'In numbers');
  numbers.slice(0, 3).forEach(item => {
    const entry = element('li', null, 'number');
    const value = element('p', null, 'number-value');
    value.append(element('span', item.value, 'number-figure'), element('span', item.unit, 'number-unit'));
    entry.append(value, element('p', item.label, 'number-label'));
    list.append(entry);
  });
  return list;
}

function explanatoryVisual(visual) {
  const figure = element('figure', null, 'explanatory-visual');
  if (visual.type === 'plate') {
    figure.className = 'explanatory-visual plate-figure';
    const drawing = plateDrawing(visual);
    // A single text alternative explains the whole drawing, including relationships; labels are inside it.
    drawing.setAttribute('role', 'img');
    drawing.setAttribute('aria-label', visual.alt);
    figure.append(drawing, element('figcaption', visual.caption));
    return figure;
  }
  const diagram = element('div', null, `diagram ${visual.type}`);
  // A single text alternative explains the whole schematic, including relationships.
  diagram.setAttribute('role', 'img');
  diagram.setAttribute('aria-label', visual.alt);
  visual.items.forEach((item, index) => {
    const card = element('div', null, 'diagram-item');
    card.setAttribute('aria-hidden', 'true');
    card.append(element('strong', item.label), element('span', item.detail));
    if (visual.type === 'bars') {
      const bar = element('span', null, 'bar-fill');
      bar.setAttribute('style', `width: ${100 * item.value / visual.max}%`);
      card.append(bar);
    }
    if (visual.type === 'mirror') {
      card.append(element('span', 'R', index === 0 ? 'print-letter reversed' : 'print-letter'));
    }
    diagram.append(card);
  });
  figure.append(diagram, element('figcaption', visual.caption));
  return figure;
}

// level is the card title's heading level; each beat is one level deeper, so each surface keeps a nested outline.
// today: Today opens The idea by default (DESIGN_SYSTEM.md section 2.3) and shows its numbers strip under the cover;
// Explore cards start fully closed and show the strip inside the card.
function renderCard(article, index, titleId, level, moveFocus = false, today = false) {
  const entry = DAILY_CURIOSITIES[index];
  const heading = offset => 'h' + (level + offset);
  article.replaceChildren();
  article.setAttribute('data-category', categoryKeys[entry.category]);
  article.append(element('p', entry.category, 'eyebrow'));
  const title = element(heading(0), entry.title);
  title.id = titleId;
  title.className = 'card-title';
  article.append(title, element('p', entry.hook, 'hook'));
  // Explore shows the numbers strip inside the card; Today shows it between the cover and the reading column.
  if (entry.visual && entry.visual.numbers && !today) article.append(numbersStrip(entry.visual.numbers));
  const core = disclosure('The idea', 'about a minute', entry.core, heading(1));
  const deep = disclosure('Look closer', 'deep dive & sources', entry.deep, heading(1));
  // A visual sits in Look closer unless its data asks for The idea (placement: "idea").
  if (entry.visual) (entry.visual.placement === 'idea' ? core : deep).body.append(explanatoryVisual(entry.visual));
  deep.body.append(element(heading(2), 'Sources', 'sources-title'));
  const sources = element('ul', null, 'sources');
  entry.sources.forEach(source => {
    const item = element('li');
    const link = element('a', source.label);
    link.href = source.url;
    item.append(link);
    sources.append(item);
  });
  deep.body.append(sources);
  const recall = disclosure('Remember this?', 'optional', [entry.recall.prompt], heading(1));
  recall.body.className = 'beat recall';
  const response = element('details', null, 'recall-response');
  const revealControl = element('summary');
  revealControl.append(element('span', 'Reveal response'));
  response.append(revealControl, element('p', entry.recall.reveal));
  recall.body.append(response);
  // Closing Remember this? also closes its response, including keyboard use; the three rows are otherwise independent.
  recall.details.addEventListener('toggle', () => {
    if (!recall.details.open) response.open = false;
  });
  core.details.open = today;
  article.append(core.details, deep.details, recall.details);
  if (moveFocus) article.focus();
}

// Today's cover (DESIGN_SYSTEM.md section 2). Optional card fields: `question` (its key phrase may be
// wrapped in {braces}) and `tease`. Without them the cover falls back to the card's title and hook.
function coverText(entry) {
  const question = entry.question || entry.title;
  const match = /^([^{}]*)\{([^{}]+)\}([^{}]*)$/.exec(question);
  return {
    question: match ? [match[1], match[2], match[3]] : [question, '', ''],
    tease: entry.tease || entry.hook
  };
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function renderCover(index, date) {
  const entry = DAILY_CURIOSITIES[index];
  const { question, tease } = coverText(entry);
  const heading = document.querySelector('#today-question');
  heading.replaceChildren();
  if (question[0]) heading.append(question[0]);
  if (question[1]) heading.append(element('span', question[1], 'key-phrase'));
  if (question[2]) heading.append(question[2]);
  document.querySelector('#today-tease').textContent = tease;
  document.querySelector('#cover-category').textContent = entry.category;
  document.querySelector('#cover-number').textContent = cardNumber(index);
  // One cover component, four themes (DESIGN_SYSTEM.md section 1): the category picks the cover's
  // background and drawing language in CSS; the masthead shares the cover's base colour.
  ['#today-cover', '.masthead'].forEach(selector => document.querySelector(selector).setAttribute('data-category', categoryKeys[entry.category]));
  // Card-specific drawing and numbers (issue #47). Without them the cover keeps its category drawing.
  const visual = entry.visual || {};
  const drawingSlot = document.querySelector('#cover-drawing-slot');
  drawingSlot.replaceChildren();
  const cardDrawing = visual.type === 'plate' && visual.cover === true;
  if (cardDrawing) drawingSlot.append(coverDrawing(visual));
  document.querySelector('#today-cover').setAttribute('data-drawing', cardDrawing ? 'card' : 'category');
  const numbersSlot = document.querySelector('#today-numbers');
  numbersSlot.replaceChildren();
  if (visual.numbers) numbersSlot.append(numbersStrip(visual.numbers));
  // Calendar fields were read locally; UTC is only used to find the weekday of that calendar date.
  const weekday = weekdays[new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()];
  const time = document.querySelector('#today-date');
  time.setAttribute('datetime', [date.year, date.month, date.day].map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-'));
  time.textContent = `${weekday}, ${date.day} ${months[date.month - 1]}`;
}

const cardNumber = index => 'No. ' + String(index + 1).padStart(3, '0');

// The hook's first sentence, for the tile (closing quotes and brackets stay with it).
function firstSentence(text) {
  const match = /^.*?[.!?]["”’)]*(?=\s|$)/.exec(text);
  return match ? match[0] : text;
}

function showCard(index, moveFocus = false) {
  currentIndex = index;
  renderCard(article, index, 'entry-title', 3, moveFocus);
}

// Surprise Me: the full library, excluding only the Explore card on screen. No browsing history.
function surprise(moveFocus = true) {
  const candidates = DAILY_CURIOSITIES.map((_, i) => i).filter(i => i !== currentIndex);
  showCard(candidates[Math.floor(Math.random() * candidates.length)], moveFocus);
}

// The dark "?" tile closes the grid, whatever the filter.
const surpriseTile = element('li', null, 'tile tile-surprise');
const surpriseButton = element('button', null, 'tile-surprise-button');
surpriseButton.type = 'button';
const mark = element('span', '?', 'tile-mark');
mark.setAttribute('aria-hidden', 'true');
const surpriseCount = element('span', null, 'tile-surprise-note');
surpriseButton.append(mark, element('span', 'Take me somewhere unexpected', 'tile-surprise-label'), surpriseCount);
surpriseButton.addEventListener('click', () => surprise());
surpriseTile.append(surpriseButton);

function tile(index) {
  const entry = DAILY_CURIOSITIES[index];
  const item = element('li', null, 'tile');
  item.setAttribute('data-category', categoryKeys[entry.category]);
  const name = element('p', entry.title, 'tile-title');
  name.id = 'tile-title-' + entry.id;
  const open = element('button', null, 'tile-action');
  open.type = 'button';
  open.id = 'tile-open-' + entry.id;
  const arrow = element('span', ' →');
  arrow.setAttribute('aria-hidden', 'true');
  open.append(element('span', 'Look inside'), arrow);
  // Every tile has the same visible action, so its accessible name adds the title: "Look inside <title>".
  open.setAttribute('aria-labelledby', open.id + ' ' + name.id);
  open.addEventListener('click', () => showCard(index, true));
  // Tile head: the category's line icon (CSS inline-SVG mask, decorative: the category is also written out) and the number.
  const icon = element('span', null, 'tile-icon');
  icon.setAttribute('aria-hidden', 'true');
  const head = element('div', null, 'tile-head');
  head.append(icon, element('span', cardNumber(index), 'tile-number'));
  item.append(head, element('p', entry.category, 'tile-meta'), name, element('p', firstSentence(entry.hook), 'tile-hook'), open);
  return item;
}

function renderCabinet() {
  const shown = DAILY_CURIOSITIES.map((entry, i) => selectedFilter === 'All' || entry.category === selectedFilter ? i : -1).filter(i => i !== -1);
  cabinet.replaceChildren();
  cabinet.append(...shown.map(tile), surpriseTile);
  const total = DAILY_CURIOSITIES.length;
  surpriseCount.textContent = `One of ${total} ideas, chosen at random.`;
  cabinetCount.textContent = selectedFilter === 'All' ? `${total} curiosities` : `${shown.length} of ${total} curiosities · ${selectedFilter}`;
  [...categoryNavigation.children].forEach((button, i) => {
    button.setAttribute('aria-pressed', String(button.filter === selectedFilter));
  });
}

// Filtering changes only the grid; the open Explore card and Today stay as they are.
function selectFilter(filter) {
  selectedFilter = filter;
  renderCabinet();
}

// Chips show a short name and the category's dot; the accessible name keeps the full category.
const shortNames = { 'Science & Nature': 'Science', 'Engineering & Technology': 'Engineering', 'Arts & Culture': 'Arts', 'History & Society': 'History' };
filters.forEach(filter => {
  const button = element('button', null, 'chip');
  button.type = 'button';
  if (filter === 'All') button.textContent = 'All';
  else {
    const dot = element('span', null, 'chip-dot');
    dot.setAttribute('aria-hidden', 'true');
    button.append(dot, element('span', shortNames[filter]));
    button.setAttribute('aria-label', filter);
    button.setAttribute('data-category', categoryKeys[filter]);
  }
  button.filter = filter;
  button.addEventListener('click', () => selectFilter(filter));
  categoryNavigation.append(button);
});
// Counts in copy come from the library size, never hard-coded (DESIGN_SYSTEM.md section 5).
document.querySelectorAll('[data-library-count]').forEach(node => { node.textContent = String(DAILY_CURIOSITIES.length); });
// Today follows the local calendar (issue #66). The date it was rendered for is kept in memory only; when a hidden
// tab becomes visible on a different date, the cover, masthead date and Today card move to that date's curiosity.
// Nothing changes while the page stays visible, and Explore, the filter and focus are left as they are.
let todayDate = null;
function renderToday(date) {
  todayDate = date;
  const index = cardIndexForDate(date.year, date.month, date.day);
  renderCover(index, date);
  renderCard(todayArticle, index, 'today-entry-title', 2, false, true);
}
const sameDate = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;
const todayRowSummaries = () => Array.from(todayArticle.children).filter(node => node.className === 'beat-row').map(row => row.children[0]);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  const date = readLocalCalendarDate();
  if (sameDate(date, todayDate)) return;
  // Re-rendering removes Today's old nodes, so a keyboard position inside Today is carried over: a reading-row
  // summary to the same row of the new card, anything else (a link, the reveal control) to the Today article.
  // Focus elsewhere on the page is left alone.
  const active = document.activeElement;
  const focusInToday = Boolean(active) && active !== todayArticle && todayArticle.contains(active);
  const row = focusInToday ? todayRowSummaries().indexOf(active) : -1;
  renderToday(date);
  if (focusInToday) (row >= 0 ? todayRowSummaries()[row] : todayArticle).focus({ preventScroll: true });
});
renderToday(readLocalCalendarDate());
renderCabinet();
surprise(false);
