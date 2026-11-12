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

function disclosure(label, heading, paragraphs, headingTag) {
  const details = element('details');
  const summary = element('summary');
  summary.append(element('span', label), element('span', 'Open', 'when-closed'), element('span', 'Close', 'when-open'));
  details.append(summary);
  const body = element('section', null, 'beat');
  body.append(element(headingTag, heading, 'beat-title'));
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

// level is the card title's heading level; deeper beats follow it so each surface keeps a nested outline.
function renderCard(article, index, titleId, level, moveFocus = false) {
  const entry = DAILY_CURIOSITIES[index];
  const heading = offset => 'h' + (level + offset);
  article.replaceChildren();
  article.setAttribute('data-category', categoryKeys[entry.category]);
  article.append(element('p', entry.category, 'eyebrow'));
  const title = element(heading(0), entry.title);
  title.id = titleId;
  title.className = 'card-title';
  article.append(title, element('p', '01 / Hook', 'beat-label'), element('p', entry.hook, 'hook'));
  const core = disclosure('The idea', 'The idea', entry.core, heading(1));
  const deep = disclosure('Look closer', 'Look closer', entry.deep, heading(2));
  if (entry.visual) deep.body.append(explanatoryVisual(entry.visual));
  deep.body.append(element(heading(3), 'Sources', 'sources-title'));
  const sources = element('ul', null, 'sources');
  entry.sources.forEach(source => {
    const item = element('li');
    const link = element('a', source.label);
    link.href = source.url;
    item.append(link);
    sources.append(item);
  });
  deep.body.append(sources);
  const recall = element('section', null, 'recall');
  recall.append(element(heading(3), 'Remember this?', 'sources-title'), element('p', entry.recall.prompt));
  const response = element('details', null, 'recall-response');
  const revealControl = element('summary');
  revealControl.append(element('span', 'Reveal response'), element('span', 'Open', 'when-closed'), element('span', 'Close', 'when-open'));
  response.append(revealControl, element('p', entry.recall.reveal));
  recall.append(response);
  deep.body.append(recall);
  deep.details.addEventListener('toggle', () => {
    if (!deep.details.open) response.open = false;
  });
  core.body.append(deep.details);
  // Closing a shallower beat resets deeper disclosure, including keyboard use.
  core.details.addEventListener('toggle', () => {
    if (!core.details.open) { deep.details.open = false; response.open = false; }
  });
  article.append(core.details, element('p', 'A little discovery is enough. You can stop here.', 'closing'));
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

// The dark "?" tile always leads the grid, whatever the filter.
const surpriseTile = element('li', null, 'tile tile-surprise');
const surpriseButton = element('button', null, 'tile-surprise-button');
surpriseButton.type = 'button';
const mark = element('span', '?', 'tile-mark');
mark.setAttribute('aria-hidden', 'true');
surpriseButton.append(mark, element('span', 'Take me somewhere unexpected', 'tile-surprise-label'));
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
  // The category's line icon is drawn in CSS (inline SVG mask) and is decorative: the category is also written out.
  const icon = element('span', null, 'tile-icon');
  icon.setAttribute('aria-hidden', 'true');
  item.append(element('p', entry.category + ' · ' + cardNumber(index), 'tile-meta'), name, element('p', firstSentence(entry.hook), 'tile-hook'), open, icon);
  return item;
}

function renderCabinet() {
  const shown = DAILY_CURIOSITIES.map((entry, i) => selectedFilter === 'All' || entry.category === selectedFilter ? i : -1).filter(i => i !== -1);
  cabinet.replaceChildren();
  cabinet.append(surpriseTile, ...shown.map(tile));
  const total = DAILY_CURIOSITIES.length;
  cabinetCount.textContent = selectedFilter === 'All' ? `${total} curiosities` : `${shown.length} of ${total} curiosities · ${selectedFilter}`;
  [...categoryNavigation.children].forEach((button, i) => {
    button.setAttribute('aria-pressed', String(filters[i] === selectedFilter));
  });
}

// Filtering changes only the grid; the open Explore card and Today stay as they are.
function selectFilter(filter) {
  selectedFilter = filter;
  renderCabinet();
}

filters.forEach(filter => {
  const button = element('button', filter);
  button.type = 'button';
  button.addEventListener('click', () => selectFilter(filter));
  categoryNavigation.append(button);
});
// Counts in copy come from the library size, never hard-coded (DESIGN_SYSTEM.md section 5).
document.querySelectorAll('[data-library-count]').forEach(node => { node.textContent = String(DAILY_CURIOSITIES.length); });
const localDate = readLocalCalendarDate();
const todayIndex = cardIndexForDate(localDate.year, localDate.month, localDate.day);
renderCover(todayIndex, localDate);
renderCard(todayArticle, todayIndex, 'today-entry-title', 2);
renderCabinet();
surprise(false);
