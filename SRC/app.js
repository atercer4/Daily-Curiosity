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

function explanatoryVisual(visual) {
  const figure = element('figure', null, 'explanatory-visual');
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
// openIdea: Today opens The idea by default (DESIGN_SYSTEM.md section 2.3); Explore cards start fully closed.
function renderCard(article, index, titleId, level, moveFocus = false, openIdea = false) {
  const entry = DAILY_CURIOSITIES[index];
  const heading = offset => 'h' + (level + offset);
  article.replaceChildren();
  article.setAttribute('data-category', categoryKeys[entry.category]);
  article.append(element('p', entry.category, 'eyebrow'));
  const title = element(heading(0), entry.title);
  title.id = titleId;
  title.className = 'card-title';
  article.append(title, element('p', entry.hook, 'hook'));
  const core = disclosure('The idea', 'about a minute', entry.core, heading(1));
  const deep = disclosure('Look closer', 'deep dive & sources', entry.deep, heading(1));
  if (entry.visual) deep.body.append(explanatoryVisual(entry.visual));
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
  core.details.open = openIdea;
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
const localDate = readLocalCalendarDate();
const todayIndex = cardIndexForDate(localDate.year, localDate.month, localDate.day);
renderCover(todayIndex, localDate);
renderCard(todayArticle, todayIndex, 'today-entry-title', 2, false, true);
renderCabinet();
surprise(false);
