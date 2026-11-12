# Daily Curiosity — Design System 1.0

Owner-approved 12 November 2026 (Direction F, "a modern field journal for how the world works"). Authority: [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 5b. Reference mockups: [desktop](design/direction-f-desktop.jpg), [phone](design/direction-f-phone.jpg).

**Identity in one line:** a modern cabinet of curiosities, presented like a field journal and a museum exhibit.

The design exists to make someone want to know the answer. It should feel curious, editorial, warm, intelligent and human. It must not feel like a SaaS page, a learning app, a quiz or a dashboard.

## 1. What stays fixed and what changes by category

**Fixed on every page:** masthead, typography, spacing scale, page structure, the ivory reading area, the category system and the editorial voice.

**Changes by category:** only the cover's background and the drawing language.

| Category | Cover look | Drawing language |
|---|---|---|
| Engineering & Technology | Navy blueprint: technical grid, orbit and construction lines | Diagrams, dimension lines, notation |
| Science & Nature | Deep green: specimen-plate feel | Botanical and natural-history line drawings, specimen labels |
| Arts & Culture | Warm red-brown: pigment and paper | Brushwork, materials, process |
| History & Society | Plum-brown: archive | Documents, ruled ledgers, stamps and seals |

Build these as one cover component with four themes, not four separate designs.

## 2. Page structure (Today)

1. **Cover** (dark, category-themed):
   - masthead with the ✳ mark and the date;
   - a small metadata line: Today's curiosity · category · number;
   - the **question**: an italic serif headline, with its key phrase in cover gold (`#E2B867`, dark covers only);
   - a short **tease**: one or two sentences, more mysterious than explanatory;
   - a **"Find out why ↓"** button;
   - an optional cover drawing.
2. **Numbers strip** (optional, parchment): at most three figures, each taken from the card's sourced text.
3. **Reading area** (ivory):
   - category, then the card title (the answer to the question), then the hook;
   - **The idea** (core) → **Look closer** (deep dive and sources) → **Remember this?** (recall);
   - all three are native disclosures that start closed (Today may open The idea by default).
4. **The cabinet of curiosities** (Explore):
   - a grid of tiles, each with an icon, category, title, the hook's first sentence and "Look inside →";
   - category filter chips ("All" plus the four categories);
   - a dark **"?" tile**: "Take me somewhere unexpected" (Surprise Me);
   - opening a tile shows the full card below the grid;
   - Today stays independent of Explore.

## 3. Tokens

| Token | Value | Use |
|---|---|---|
| ivory | `#F9F5E8` | Page background |
| parchment | `#EDE2C8` | Numbers strip, surfaces |
| ink | `#1F1E1A` | Text (15.3:1 on ivory) |
| night | `#16202E` | Cover base (themes tint it); ivory text on it is 15.0:1 |
| navy | `#3E5F8A` | Engineering accent, links (6.0:1) |
| green | `#4C6B50` | Science accent (5.5:1) |
| red-brown | `#9A3E24` | Arts accent (6.2:1) |
| plum | `#64466A` | History accent (7.3:1) |
| muted | `#6B6455` | Secondary text (5.4:1) |
| gold | `#B8893D` | On light surfaces: decoration only (the ✳ mark, rules, markers). **Never text on ivory or parchment** (2.9:1). |
| cover gold | `#E2B867` | On dark covers only: the ✳ mark, the question's key phrase and the cover button (8.8:1 on night). |
| rule | `#D9CBA8` | Hairlines |

**Fonts:** Playfair Display (titles, questions, display numbers, short italic notes) and Source Sans 3 (body, UI, labels).
- Both are SIL Open Font License fonts, **self-hosted** as Latin-subset woff2 files with their licence files (about 120 KB in total).
- No font CDN and no network requests: the runtime stays static and private.
- Playfair is for large sizes only. Text below about 18px uses Source Sans 3 or the italic notes style.

**Texture:**
- a faint paper grain (inline SVG noise);
- hairline rules and double rules;
- faint grids behind figures.

All of it is CSS or inline SVG, never image files.

## 4. Rules

1. **A visual must earn its space.** Figures, cover drawings and icons explain or identify; they never just decorate.
   - Drawings are original line art: no AI-generated images and no copied artwork.
   - Real public-domain plates may be used later only as a separate, owner-approved step (licence, hosting, alt text, size budget).
2. **Interactive only when interaction teaches something materially better than prose or a static visual.** Most cards get none. An interactive's numbers must come from the card's sources.
3. **Every new line is content.** Questions, teases, numbers strips, figure labels and interactive copy go through ChatGPT's fact-check like card text (STANDING_DIRECTION sections 8 and 14).
4. **Density discipline on phones.** At 390px the first screen shows only:
   - masthead;
   - one metadata line;
   - question;
   - tease;
   - button.

   Drawings shrink below the button, and the numbers strip comes after the cover. Check every design PR at 320, 390 and 1280px.
5. **Accessibility is not optional.**
   - WCAG AA contrast for all text;
   - the heading outline stays valid;
   - 44px minimum touch targets;
   - native controls;
   - motion only under `prefers-reduced-motion: no-preference`, with no autoplay beyond a slow decorative orbit or draw-in;
   - the forced-colors support from issue #9 is kept.
6. **No gamification.** No streaks, points, badges, profiles, bookmarks or accounts. Those remain escalations under section 7.

## 5. Copy conventions

| Element | Copy |
|---|---|
| Sections | The idea · Look closer · Remember this? |
| Surprise Me | "Take me somewhere unexpected" |
| Explore heading | "The cabinet of curiosities" |
| Tile action | "Look inside →" |
| Footer line | "a modern field journal for how the world works" |

Counts in copy are generated from the library size, never hard-coded ("five", "twenty").

## 6. Build order

Each step is one small PR, with tests, Codex review and a Netlify preview:

1. Type system, tokens and texture on the current layout; stale copy fixed.
2. The Today cover (with optional `question` and `tease` fields that fall back to title and hook) and the phone hierarchy.
3. The cabinet of curiosities.
4. The four category cover themes and tile icons.
5. Questions and teases for all cards (content PR, fact-checked).
6. Figures, numbers strips and the GPS interactive: content PRs, a few cards at a time.

New Phase 2 cards pause until steps 2 and 3 ship.
