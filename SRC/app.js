/* Local data + native disclosures. Independent Today and Explore surfaces; no storage or requests. */
'use strict';
const categoryNavigation = document.querySelector('#categories');
const article = document.querySelector('#curiosity');
const todayArticle = document.querySelector('#today-curiosity');
const choices = ['Surprise Me', ...CATEGORIES];
let selectedCategory = 'Surprise Me';
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

function renderCard(article, index, titleId, moveFocus = false) {
  const entry = DAILY_CURIOSITIES[index];
  article.replaceChildren();
  article.append(element('p', entry.category, 'eyebrow'));
  const title = element('h2', entry.title);
  title.id = titleId;
  title.className = 'card-title';
  article.append(title, element('p', '01 / Hook', 'beat-label'), element('p', entry.hook, 'hook'));
  const core = disclosure('02 / Core Insight', 'Core insight', entry.core, 'h3');
  const deep = disclosure('03 / Deep Dive & Sources', 'Deep dive', entry.deep, 'h4');
  if (entry.visual) deep.body.append(explanatoryVisual(entry.visual));
  deep.body.append(element('h5', 'Sources', 'sources-title'));
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
  recall.append(element('h5', 'Optional · Pause and recall', 'sources-title'), element('p', entry.recall.prompt));
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

function showCard(index, moveFocus = false) {
  currentIndex = index;
  renderCard(article, index, 'entry-title', moveFocus);
  [...categoryNavigation.children].forEach((button, i) => {
    button.setAttribute('aria-pressed', String(choices[i] === selectedCategory));
  });
}

function selectCategory(category, moveFocus = true) {
  let index;
  if (category === 'Surprise Me') {
    // Same full library, excluding only the card on screen. No browsing history.
    const candidates = DAILY_CURIOSITIES.map((_, i) => i).filter(i => i !== currentIndex);
    index = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    const matches = DAILY_CURIOSITIES.map((entry, i) => entry.category === category ? i : -1).filter(i => i !== -1);
    // Cycle every card in this category using only the current card.
    index = matches[(matches.indexOf(currentIndex) + 1) % matches.length];
  }
  selectedCategory = category;
  showCard(index, moveFocus);
}

choices.forEach(category => {
  const button = element('button', category);
  button.type = 'button';
  button.addEventListener('click', () => selectCategory(category));
  categoryNavigation.append(button);
});
const localDate = readLocalCalendarDate();
renderCard(todayArticle, cardIndexForDate(localDate.year, localDate.month, localDate.day), 'today-entry-title');
selectCategory('Surprise Me', false);
