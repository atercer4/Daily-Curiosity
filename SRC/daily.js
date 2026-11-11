/* Daily order is independent of the content authoring order. Months are 1-based. */
/* New cards are appended to the end of DAILY_CARD_IDS so existing cards keep their relative order.
   The rotation length equals the library size, so it grows as cards are added. */
'use strict';
const DAILY_CARD_IDS = Object.freeze([
  "venus-clocks",
  "suspension-bridge",
  "woodcut-reversal",
  "rosetta-scripts",
  "coral-partners",
  "stainless-surface",
  "shadow-puppetry",
  "ming-banknote",
  "basalt-columns",
  "heat-pump",
  "washoku",
  "carnegie-libraries",
  "autumn-pigments",
  "qr-recovery",
  "gothic-light",
  "penny-black",
  "tree-ring-calendar",
  "bicycle-gears",
  "ultramarine",
  "roman-amphorae"
]);
const DAILY_EPOCH = Date.UTC(2026, 9, 22);

function cardIndexForDate(year, month, day) {
  if (!Number.isInteger(year) || year < 100 || year > 9999 ||
      !Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day)) {
    throw new RangeError('Expected calendar fields: year 100–9999, month 1–12, valid day');
  }
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > lengths[month - 1]) throw new RangeError('Invalid calendar day');
  // UTC is only calendar arithmetic here; these fields were already read locally.
  const offset = (Date.UTC(year, month - 1, day) - DAILY_EPOCH) / 86400000;
  const slot = ((offset % DAILY_CARD_IDS.length) + DAILY_CARD_IDS.length) % DAILY_CARD_IDS.length;
  return DAILY_CURIOSITIES.findIndex(entry => entry.id === DAILY_CARD_IDS[slot]);
}

function readLocalCalendarDate() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
