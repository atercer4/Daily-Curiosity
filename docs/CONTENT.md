# Concept A v4 content and source register

Implementation date: October 20, 2026. Authority: [approved v4 brief, Decision 009](https://docs.google.com/document/d/1B9JH9ZwmSX2nxNa-hS2xWxB4DlzB7_a6v_8j68khWXE/edit), dated October 13, last modified October 14 at 04:04:36.805 UTC. Read from Drive before application changes.

## Editorial decisions

Exactly 20 cards, five per unchanged category. Five v3 topics remain; atomic seconds, musical octaves, and railway time were replaced to reduce the shared measurement/time/coordination motif. Venus and tree rings are the two remaining cards centered on time or dating. No category was renamed or added. Category identity comes from subject selection and writing, without new navigation, themes, or artwork.

Science asks about observed natural processes; engineering follows mechanisms and tradeoffs; arts attends to materials, performance, cultural participation, and spatial experience; history reads objects and institutions in their social context. The Gothic card centers on experienced light and imagery rather than repeating the bridge card’s force lesson. The banknote and stamp address different historical changes: representing value and prepaying delivery.

Hooks include mysteries, sensory observations, familiar experiences, historical reversals, comparisons, and material journeys. New Deep Dives begin with distinct questions or concrete explanations rather than a repeated Imagine formula. Of 20 Deep Dive openings, only the retained tree-ring card starts with Imagine; Rosetta uses a short hypothetical comparison later. Bridge and woodcut openings were lightly revised. Analogies remain where helpful and are not required for every card. All cards retain the same voluntary three beats, with roughly 20–35-word Hooks, 85–115-word Core Insights, and 130–175-word Deep Dives. Length is a guardrail, not evidence of editorial quality.

## Optional cover fields (Design System 1.0, issue #23)

Cards may add two optional fields for Today's cover (DESIGN_SYSTEM.md section 2):

- `question`: the italic cover headline. Wrap its key phrase in braces, for example `"Why would anyone launch a clock that’s {wrong on purpose?}"`; the braced phrase renders in cover gold. Use at most one braced phrase.
- `tease`: one or two sentences, more mysterious than explanatory.

Without them the cover shows the card's title and hook. Both are content and go through the two-reviewer fact-check gate (DESIGN_SYSTEM.md rule 3; REVIEW_PROTOCOL.md). Since Design 1.0 step 5 (issue #26) every card has both. Questions stay at or under 14 words with exactly one braced key phrase; teases stay at or under 30 words and add no claim beyond the card's sourced text.

## Visuals: plates, numbers strip and cover drawings (Design System 1.0 step 6, issue #47)

A card has at most one `visual`. Everything a reader can see in it (labels, numbers, units, alt text, caption) lives inside that field. `visual` is already part of the canonical Draft Hash, so every visual goes through the two-reviewer register gate with the card text (DESIGN_SYSTEM.md rule 3; REVIEW_PROTOCOL.md). A test fails if a card uses any field outside the canonical hash.

`type` is one of:
- `bars`: compare a few quantities on one scale (venus-clocks);
- `mirror`: a before/after pair (woodcut-reversal);
- `plate`: an original line drawing, described below.

Every visual needs `alt` (over 50 characters, describing the relationships, not just the parts) and a `caption`.

### Plate fields

| Field | Meaning |
|---|---|
| `viewBox` | `"0 0 W H"`. Design at about 400 units wide, so labels stay readable at phone width. |
| `shapes` | Line work. `el` is one of `circle`, `ellipse` (optional `rotate`), `line`, `rect`, `path` or `polyline`, with numeric or path attributes only. `tone` is `ink`, `accent` (the category colour), `muted` or `gold` (decoration only). Optional `dash: true` and `fill: true`. Anything else (`href`, `style`, event attributes, other elements) is ignored. |
| `labels` | `{ x, y, text, anchor?, note? }`. Text of at most 40 characters, set as text and never as markup. `note: true` uses the italic note style for asides such as "≈ 20,000 km up". Labels render at 15px (notes 16px) on screen at every width, so leave room around them for phone sizes. |
| `placement` | `"idea"` puts the figure in The idea. The default is Look closer. |
| `cover` | `true` redraws the plate on the Today cover in ivory and cover gold. The cover copy is decorative; the reading figure carries the text alternative. Use this only when the drawing is the card's central image. |

### Numbers strip

`numbers` holds at most three entries of the form `{ value, unit, label }`, for example `{ "value": "−7", "unit": "µs/day", "label": "Speed: the satellite's clock falls behind." }`. On Today the strip sits between the cover and the reading column. On Explore it sits in the card, above The idea. Every value must appear in, or follow directly from, the card's sourced text.

### Choosing a format (visual assessment)

Every new or revised card records one choice in its draft:

| Choice | Use it for |
|---|---|
| Diagram or technical illustration | mechanisms, forces, cycles |
| Historical object, document or timeline | sequences, inscriptions, layouts |
| Scientific or natural-history plate | structures, specimens, scales |
| Cultural or artistic process | steps, materials, reversals |
| None | when prose already does the job |

A visual must explain something the prose cannot do as well (rule 1). Reuse a plate pattern when the subject fits, but draw custom geometry when the subject needs it, so cards do not all look alike.

## Topics, category identity, and visuals

| # | Category | Topic / card title | Subdomain | Editorial approach |
| --- | --- | --- | --- | --- |
| 1 | Science & Nature | A year before a full turn | Astronomy | Paradox question; rotating-platform comparison |
| 2 | Science & Nature | A history written in wood | Dendrochronology / environmental evidence | Object mystery; overlapping-ribbon analogy |
| 3 | Science & Nature | The partnership inside a coral | Reef ecology / symbiosis | Visible change; biological cause and recovery |
| 4 | Science & Nature | Stone columns without a stonecutter | Geology | Visual pattern; cracks traced into depth |
| 5 | Science & Nature | Two ways a leaf changes color | Plant biology | Two routes to a familiar change; pigment distinction |
| 6 | Engineering & Technology | How can a road hang from cables? | Structural engineering | Load-path question; follow a car’s weight |
| 7 | Engineering & Technology | Steel protected by its own surface | Materials | Surprising surface protection; boundary explanation |
| 8 | Engineering & Technology | Moving heat instead of making it | Energy / thermodynamics | Counterintuitive transfer; widen the energy boundary |
| 9 | Engineering & Technology | Why a damaged code can still scan | Computing / error correction | Damaged object mystery; resilience tradeoff |
| 10 | Engineering & Technology | An easier climb costs more turns | Machines / transportation | Familiar bodily experience; teeth-count example |
| 11 | Arts & Culture | The picture that prints backward | Printmaking | Reversal question; stamp demonstration |
| 12 | Arts & Culture | A painted blue with a long journey | Painting materials | Material journey; workshop-to-viewer perspective |
| 13 | Arts & Culture | A whole performance behind a screen | Performance | Scene-led hook; object versus performed work |
| 14 | Arts & Culture | A food tradition larger than a recipe | Food traditions | Recipe versus participation; social knowledge |
| 15 | Arts & Culture | Making room for colored light | Architecture / religious art | Spatial experience; light and imagery |
| 16 | History & Society | One message, three scripts | Writing / decipherment | Historical repetition; evidence comparison |
| 17 | History & Society | Coins pictured on paper money | Monetary history | Object question; printed claim versus exchange |
| 18 | History & Society | The library gift with an ongoing cost | Public institutions | Conditional gift; construction versus ongoing service |
| 19 | History & Society | When receiving a letter came with a bill | Communication / postal reform | Counterintuitive former practice; follow payment |
| 20 | History & Society | A shipping container made of clay | Trade / archaeology | Ordinary object as evidence; compare marks and context |
| 21 | Engineering & Technology | Clocks designed to tick slow | Satellite navigation / relativity | Deliberate error; competing effects and a built-in fix |
| 22 | Arts & Culture | Painting before the wall dries | Painting technique / materials | Deadline set by the material; chemistry and visible traces |
| 23 | Science & Nature | The smell waiting on the ground | Soil chemistry / fluid physics | Sensory observation; hidden ingredients and the launch mechanism |
| 24 | History & Society | The receipts that burned Parliament | Public finance / institutions | Obsolete record system as cause; follow the disposal |

## Source register and per-card visual decisions

The links below are exactly those displayed in each card’s Deep Dive & Sources. Copy is original synthesis, not extracted passages. Sources were researched using publisher pages and indexed publisher text; a search result is not a successful live link check. Source attribution describes support, not independent editorial approval.

### 1. A year before a full turn

- ID: `venus-clocks`; category: Science & Nature.
- Subject: Astronomy.
- Visual: Shared-scale duration bars clarify three meanings.
- [NASA Science — Venus facts (rotation, orbit, backward spin)](https://science.nasa.gov/venus/venus-facts/)
- [NASA NSSDCA — Venus fact sheet (sidereal rotation, length of solar day, orbit)](https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html)

### 2. A history written in wood

- ID: `tree-ring-calendar`; category: Science & Nature.
- Subject: Dendrochronology / environmental evidence.
- Visual: Omitted: a credible ring-pattern diagram would need evidence beyond a generic decorative cross-section.
- [National Park Service — Tree rings and the tales they tell](https://www.nps.gov/articles/000/tree-rings.htm)
- [National Park Service, Mesa Verde — Artifact gallery: Tree rings](https://home.nps.gov/meve/learn/education/tree-rings.htm)

### 3. The partnership inside a coral

- ID: `coral-partners`; category: Science & Nature.
- Subject: Reef ecology / symbiosis.
- Visual: Omitted: prose separates bleaching from death without implying every white coral has the same condition.
- [NOAA — Are corals animals or plants?](https://oceanservice.noaa.gov/facts/coral.html)
- [NOAA Flower Garden Banks National Marine Sanctuary — Coral bleaching](https://flowergarden.noaa.gov/education/bleaching.html)

### 4. Stone columns without a stonecutter

- ID: `basalt-columns`; category: Science & Nature.
- Subject: Geology.
- Visual: Omitted: a generic hexagon grid could falsely imply all columns are regular or six-sided.
- [National Park Service — Columnar jointing](https://www.nps.gov/subjects/volcanoes/columnar-jointing.htm)
- [National Park Service — Devils Postpile](https://www.nps.gov/places/devilspostpile.htm)

### 5. Two ways a leaf changes color

- ID: `autumn-pigments`; category: Science & Nature.
- Subject: Plant biology.
- Visual: Omitted: color swatches would illustrate hues but not explain pigment loss versus production.
- [NOAA NESDIS — Why do leaves change color?](https://www.nesdis.noaa.gov/about/k-12-education/understanding-our-planet/why-do-leaves-change-color)
- [Smithsonian Science Education Center — Autumn splendor](https://ssec.si.edu/stemvisions-blog/autumn-splendor-why-do-leaves-change-color-fall)
- [Clemson Cooperative Extension (HGIC) — Color changes in autumn leaves](https://hgic.clemson.edu/factsheet/color-changes-in-autumn-leaves/)

### 6. How can a road hang from cables?

- ID: `suspension-bridge`; category: Engineering & Technology.
- Subject: Structural engineering.
- Visual: Omitted: prose traces forces; a decorative bridge silhouette would not improve the load explanation.
- [Golden Gate Bridge District — How the bridge spans the Golden Gate](https://www.goldengate.org/exhibits/how-the-bridge-spans-the-golden-gate/)
- [Golden Gate Bridge District — Bridge towers](https://goldengate.org/exhibits/bridge-towers)

### 7. Steel protected by its own surface

- ID: `stainless-surface`; category: Engineering & Technology.
- Subject: Materials.
- Visual: Omitted: an unscaled film illustration could misrepresent the very thin protective layer.
- [worldstainless — Corrosion resistance of stainless steels (training module PDF)](https://worldstainless.org/wp-content/uploads/2025/02/Module_05_Corrosion_Resistance_of_Stainless_Steels_en.pdf)
- [Live Science — Why doesn’t stainless steel rust?](https://livescience.com/chemistry/why-doesn-t-stainless-steel-rust)

### 8. Moving heat instead of making it

- ID: `heat-pump`; category: Engineering & Technology.
- Subject: Energy / thermodynamics.
- Visual: Omitted: the two-sided transfer is explained in prose; no ornamental equipment drawing.
- [Natural Resources Canada — Heating and cooling with a heat pump](https://natural-resources.canada.ca/energy-efficiency/energy-star/heating-cooling-heat-pump)
- [ENERGY STAR — How does a heat pump work?](https://www.energystar.gov/node/11903)

### 9. Why a damaged code can still scan

- ID: `qr-recovery`; category: Engineering & Technology.
- Subject: Computing / error correction.
- Visual: Omitted: no scannable code or simulated damage that might imply guaranteed recovery.
- [DENSO WAVE — QR Code error correction](https://www.qrcode.com/en/about/error_correction.html)
- [DENSO WAVE — What is a QR Code?](https://www.qrcode.com/en/about/)

### 10. An easier climb costs more turns

- ID: `bicycle-gears`; category: Engineering & Technology.
- Subject: Machines / transportation.
- Visual: Omitted: the example explains the ratio directly without adding a second quantitative graphic.
- [Exploratorium — Science of Cycling: Drives & Gears](https://annex.exploratorium.edu/cycling/gears1.html)
- [Exploratorium — Science of Cycling: Pedaling & Cadence](https://annex.exploratorium.edu/cycling/gears3.html)
- [Explain that Stuff — Gears](https://www.explainthatstuff.com/gears.html)

### 11. The picture that prints backward

- ID: `woodcut-reversal`; category: Arts & Culture.
- Subject: Printmaking.
- Visual: Face-on block/print R comparison makes actual horizontal reversal visible.
- [The Metropolitan Museum of Art — Woodcut: materials and techniques](https://www.metmuseum.org/perspectives/materials-and-techniques-printmaking-woodcut)
- [Guggenheim Museum Bilbao — Woodcut](https://pro.guggenheim-bilbao.eus/en/did-you-know/woodcut)

### 12. A painted blue with a long journey

- ID: `ultramarine`; category: Arts & Culture.
- Subject: Painting materials.
- Visual: Omitted: a generic blue swatch cannot represent pigment layering or the specific artwork.
- [National Gallery — Making Colour: journey through colour](https://www.nationalgallery.org.uk/exhibitions/past/making-colour/journey-through-colour)
- [National Gallery — Studying Raphael: pigments and medium](https://www.nationalgallery.org.uk/research/publications/studying-raphael/studying-raphael-pigments-and-medium)

### 13. A whole performance behind a screen

- ID: `shadow-puppetry`; category: Arts & Culture.
- Subject: Performance.
- Visual: Omitted: a still silhouette would add atmosphere but not the timing of performance.
- [UNESCO — Chinese shadow puppetry](https://ich.unesco.org/en/RL/chinese-shadow-puppetry-00421)
- [UNESCO — Representative List of the Intangible Cultural Heritage of Humanity 2010–2011 (PDF)](https://ich.unesco.org/doc/src/17331-EN.pdf)

### 14. A food tradition larger than a recipe

- ID: `washoku`; category: Arts & Culture.
- Subject: Food traditions.
- Visual: Omitted: a food photograph would narrow a social practice to one presentation.
- [UNESCO — Washoku, traditional dietary cultures of the Japanese, notably for the celebration of New Year](https://ich.unesco.org/en/RL/00869)
- [UNESCO — Intergovernmental Committee decision 8.COM 8.17 (2013): inscription of washoku](https://ich.unesco.org/en/decisions/8.COM/8.17)

### 15. Making room for colored light

- ID: `gothic-light`; category: Arts & Culture.
- Subject: Architecture / religious art.
- Visual: Omitted: no stock cathedral photograph or diagram that conflates different buildings.
- [Columbia University Media Center for Art History — The Gothic structural revolution (Life of a Cathedral: Amiens)](https://projects.mcah.columbia.edu/amiens-arthum/node/3597.html)
- [Victoria and Albert Museum — Stained glass: an introduction](https://www.vam.ac.uk/articles/stained-glass-an-introduction)

### 16. One message, three scripts

- ID: `rosetta-scripts`; category: History & Society.
- Subject: Writing / decipherment.
- Visual: Omitted: text distinguishes three scripts from two languages without a decorative stone image.
- [British Museum on Google Arts & Culture — The Rosetta Stone (object)](https://artsandculture.google.com/asset/the-rosetta-stone/DgH6pMM1guUUPA)
- [British Museum on Google Arts & Culture — The Rosetta Stone (story)](https://artsandculture.google.com/story/the-rosetta-stone-the-british-museum/OQVRt6m8dEG4rw?hl=en)

### 17. Coins pictured on paper money

- ID: `ming-banknote`; category: History & Society.
- Subject: Monetary history.
- Visual: Omitted: no invented reproduction of the historic note; original record is linked.
- [Smarthistory — Ming banknote (British Museum)](https://smarthistory.org/?p=56036)
- [British Museum — Great Ming Circulating Treasure Note (Google Arts & Culture)](https://artsandculture.google.com/asset/great-ming-circulating-treasure-note/iAFKr9bi4LqIRA)
- [Columbia University, Asia for Educators — Song dynasty paper money](https://afe.easia.columbia.edu/songdynasty-module/econ-rev-money.html)

### 18. The library gift with an ongoing cost

- ID: `carnegie-libraries`; category: History & Society.
- Subject: Public institutions.
- Visual: Omitted: a building photograph would not explain the funding arrangement.
- [National Park Service — Carnegie Libraries: The Future Made Bright](https://home.nps.gov/articles/carnegie-libraries-the-future-made-bright-teaching-with-historic-places.htm)
- [Carnegie — Libraries and the history of library funding](https://carnegie.org/our-work/libraries/)

### 19. When receiving a letter came with a bill

- ID: `penny-black`; category: History & Society.
- Subject: Communication / postal reform.
- Visual: Omitted: a stamp portrait would not explain prepayment better than the text.
- [The Postal Museum — Large-print gallery guide, Zone 2](https://www.postalmuseum.org/wp-content/uploads/2025/05/2025-TPM-Large-Print-Guide-Zone-2-B.pdf)
- [Smithsonian National Postal Museum — The world’s first postage stamps](https://postalmuseum.si.edu/exhibition/the-queen%E2%80%99s-own-postal-reforms-that-transformed-the-mail/the-worlds-first-postage-stamps)
- [Smithsonian National Postal Museum — Great Britain](https://postalmuseum.si.edu/exhibition/international-philately-europe-northern-europe/great-britain)

### 20. A shipping container made of clay

- ID: `roman-amphorae`; category: History & Society.
- Subject: Trade / archaeology.
- Visual: Omitted: a generic amphora could imply one shape for all transport jars.
- [French Ministry of Culture — Amphorae for the wine trade](https://archeologie.culture.gouv.fr/villa/en/amphorae-wine-trade)
- [Roman Inscriptions of Britain — Amphorae: painted inscriptions](https://romaninscriptionsofbritain.org/instrumentum/2492)

### Phase 2 additions (issue #17, November 2026)

Researched and written by the build agent (Claude); the Drive research inbox had no usable candidates. Each card awaits ChatGPT's independent fact-check before merge (STANDING_DIRECTION sections 8 and 14). IDs are appended to `DAILY_CARD_IDS`, Engineering then Arts, so no two consecutive cards share a category (including the wrap to `venus-clocks`). Category counts are now 5 / 6 / 6 / 5.

### 21. Clocks designed to tick slow

- ID: `gps-relativity`; category: Engineering & Technology.
- Subject: Satellite navigation / relativity. Mechanism and tradeoff: two relativistic effects pull in opposite directions, and the net is corrected in the clock design before launch.
- Visual: Plate (scientific diagram), placed in The idea and redrawn on the Today cover: Earth with a ground clock, and a satellite clock on a dashed orbit labelled “≈ 20,000 km up” and “≈ 14,000 km/h”, captioned “Not to scale”; it shows height and speed, the two causes, in one image. Numbers strip: −7 µs/day (speed), +45 µs/day (gravity), ≈10 km/day (position error if uncorrected).
- [Richard W. Pogge — Real-World Relativity: The GPS Navigation System (Astronomy 162 course notes)](https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps.html): altitude about 20,000 km, speed about 14,000 km/h, −7 µs/day (speed), +45 µs/day (gravity), net +38 µs/day, clocks designed to tick slower, about 10 km/day error if uncorrected; the engineers included these effects when they designed and deployed the system.
- [Physics Today (Neil Ashby) — Relativity and the Global Positioning System](https://physicstoday.aip.org/features/relativity-and-the-global-positioning-system): distance as c·Δt from the signal's travel time; "factory offset" before launch; more than 11 km of navigational error building up in one day, quickly making the system useless; the first GPS satellite launched in 1977 amid uncertainty about the effect's magnitude and even its sign, its clock operated for three weeks to measure its rate, agreeing with the relativistic calculation to better than 1%.
- Read on 11 November 2026. Also consulted, not linked: Ashby, "Relativistic Effects in the Global Positioning System" (AAPT-hosted PDF), which gives the same fractional rates.
- Register-approved v5 (Draft Hash `57f44d01b20863b511ea08068fe67e63e0cb16cf5cef093bec85a05c396e7575`; Claude and ChatGPT both PASS, 17 November 2026; v4 and v5 by owner exception to the 3-version rule), coded in issue #60. Retitled from "Clocks set slow on purpose" to Pogge's wording; the framing sentence about when the fix happens replaced with Pogge's statement that engineers built the effects in; Ashby's factory-offset sentence quoted directly; the Pogge source relabelled by what the page shows (author and course notes).
- Register-approved v7 (Draft Hash `3e572452283d320e7a71e139f1976704d01d010d4f750bd12a223f4a570e59cc`; Claude and ChatGPT both PASS, 19 November 2026; v6 and v7 by owner exception to the 3-version rule), coded in issue #27 (Design System 1.0 step 6): adds the orbit plate, numbers strip and cover drawing; two Deep Dive sentences reworded to Ashby's wording (receiver distance as the speed of light times travel time; the 1977 three-week measurement agreeing to better than 1%). Sources and recall unchanged.

### 22. Painting before the wall dries

- ID: `true-fresco`; category: Arts & Culture.
- Subject: Painting technique / materials. Practice behind the finished thing: the material's setting time shapes how the work is divided into day-sized patches.
- Visual: Omitted: a photograph of giornata seams would need an external image; the text describes them.
- [The National Gallery, London — Glossary: fresco](https://www.nationalgallery.org.uk/paintings/glossary/fresco): name from the Italian for fresh; paint applied to wet intonaco, the final very smooth layer; only as much plaster as can be painted in one day; giornata; the method bonds the fresco to the wall; the arriccio is the penultimate layer; a secco on dried buon fresco or dry intonaco.
- [Istituto e Museo di Storia della Scienza, Florence — Benozzo Gozzoli: Fresco](https://brunelleschi.imss.fi.it/benozzogozzoli/technics/Fresco.html): the surface had to remain wet throughout the painting, so it was applied only to a day's area; the outline drawn on the arriccio; ground pigments mixed with water on wet plaster; carbonation of the lime releases heat and can burn plant-based pigments, so not all pigments could be used; touching up after drying; blues (ultramarine, azurite) painted a secco. Owner-saved copy for reviewers: `true-fresco — IMSS Florence Fresco.pdf` in Drive `04_Fact_Check_Sources`.
- Register-approved v6 (Draft Hash `14442821e06fb64062879ce883f521026d60618782a5fbad82d6c05a0e85f682`; Claude and ChatGPT both PASS, 17 November 2026; v4 to v6 by owner exception to the 3-version rule), coded in issue #62. Britannica (partial reads), Wikipedia, the Museu Nacional d'Art de Catalunya page (HTTP 521) and Tate (HTTP 403) were dropped, along with the claims that rested on them (durability, flaking, the Renaissance, lime fixing the colour).

### Phase 2 additions (issue #19, November 2026)

Researched and written by the build agent (Claude); the Drive research inbox had no candidate topics. Each card awaits ChatGPT's independent fact-check before merge (STANDING_DIRECTION sections 8 and 14). IDs are appended to `DAILY_CARD_IDS`, Science then History, so no two consecutive cards share a category (Arts → Science → History → wrap to `venus-clocks`, Science). Category counts are now 6 / 6 / 6 / 6.

### 23. The smell waiting on the ground

- ID: `petrichor`; category: Science & Nature.
- Subject: Soil chemistry / fluid physics. Natural process: compounds that build up on dry ground are launched into the air by bubbles trapped in raindrops.
- Visual: Omitted: the champagne-bubble comparison in the text does the explaining; a diagram would need external slow-motion imagery to add anything.
- [EarthDate (Switch Energy Alliance) — The Scent of Rain](https://www.earthdate.org/episodes/the-scent-of-rain): named petrichor in 1964 by Australian scientists; a mixture of aromatic oils produced by plants and geosmin; organic compounds collecting on dry surfaces; drops strike plants and the ground and liberate organic compounds and aromatic oils; geosmin from actinobacteria; humans detect a few parts per trillion; scent strongest after light rainfall on sandy soils.
- [MIT News — Rainfall can release aerosols, study finds](https://news.mit.edu/2015/rainfall-can-release-aerosols-0114): high-speed cameras; drops trap tiny air bubbles on porous surfaces that shoot upward and burst "in a fizz of aerosols", as in champagne; far more aerosols in light and moderate rain than heavy rain; lots of aerosols from sandy or clay soils; most aerosols when drops are neither too fast nor too slow and the surface neither too wet nor too dry; aerosols "may carry aromatic elements" and the smell coming from this mechanism is "one hypothesis"; published in Nature Communications.
- Register-approved v5 (Draft Hash `a673d9a8e719904a8e42386e98ff819bb788eeb315910d0ac7016c3e6dd1b056`; Claude and ChatGPT both PASS, 17 November 2026; v4 and v5 by owner exception to the 3-version rule), coded in issue #62. The Smithsonian source (bot-checked) and its etymology were dropped; the "most of the smell is not in the water" claim was replaced with "it comes from the ground"; the strongest-scent line is credited to EarthDate with the caveat that the MIT study measured aerosols, not smell; the question and closing line are scoped to the earthy smell (EarthDate attributes the pre-rain smell to ozone), and bubble transport of the smell is labelled the researchers' hypothesis.

### 24. The receipts that burned Parliament

- ID: `exchequer-tallies`; category: History & Society.
- Subject: Public finance / institutions. Institutional arrangement: a medieval record-keeping system, abolished on paper, still had to be physically disposed of.
- Visual: Omitted: a photograph of a tally stick would need an external image; the text describes the split stick.
- [The History of Parliament — Burning the House down: the fire of 1834](https://historyofparliament.com/2013/10/16/the-fire-of-1834/): tally sticks as medieval Exchequer receipts, the Exchequer a government office based at Westminster; on 16 October 1834 the "unsupervised and ill-advised burning" of two large cartloads in the heating furnaces below the House of Lords; a chimney fire smouldered under the floor of the chamber throughout the day; warning signs persistently ignored; a doorkeeper's wife spotted the flames a few minutes after six in the evening; most of the medieval buildings destroyed; Prime Minister: "one of the greatest instances of stupidity upon record".
- [Science Museum Group — Medieval Exchequer tally sticks](https://collection.sciencemuseumgroup.org.uk/objects/co60506/medieval-exchequer-tally-sticks): used by the Exchequer from the 12th to the 19th centuries; notches show the amount; sticks split into halves whose match showed they "tallied"; abolished in 1826; the left-behind sticks were burned.
- Register-approved v3 (Draft Hash `87d392ef399a991bf936cb58eb5fedfea4e0d2e5250df216516ead51010cd49a`; Claude and ChatGPT both PASS, 15 November 2026), coded in issue #56. The Wikipedia article and the UK Parliament Living Heritage page (bot-checked) were dropped as sources, and the details that rested only on them (Treasury officials, Weobley, firewood, Cross and Furlong, the two furnaces, the tourists, Westminster Hall, paper records) were removed.

## Visual scope

Two retained local HTML/CSS explanatory visuals, both inside the optional Deep Dive: Venus duration bars (117, 225, 243 Earth days on one zero-based scale) and woodcut reversal (reversed block R, normal paper R). Both retain relationship-based text alternatives and captions. Since issue #27, `gps-relativity` adds a third: a register-approved orbit plate in The idea, with a numbers strip and a cover drawing. No new visual assets, stock images, AI images, decorative diagrams, or external image requests. The other 21 cards intentionally omit visuals for the reasons above.

## Source-read limitations and independent checks

Manual verification of all links and claim support remains part of independent QA. Automated direct reads returned anti-bot challenges for UNESCO’s two inscription pages and 403 responses for Smarthistory and the Postal Museum’s production Penny Black page. Their publisher-indexed text was available; UNESCO also provides the linked puppetry information sheet, and the postal card has a Smithsonian source. The Postal Museum’s indexed staging copy was consulted but is not linked in the app. British Museum source pages also require independent browser checking; earlier v3 readbacks had tool errors.

The DOE Heat Pump Systems page was indexed but its direct read returned 404; verify it manually before release. A second, directly readable DOE-hosted Massachusetts DOER handout is included for the transfer mechanism and heating/cooling operation. No blanket claim that every citation was live-link-tested is made. Publisher pages can change independently of this static prototype. No source content or remote services are requested until the reader follows a citation.
