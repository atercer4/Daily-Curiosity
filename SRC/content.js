/* Local v6 library: approved v4 text plus optional recall. */
'use strict';
const CATEGORIES = [
  "Science & Nature",
  "Engineering & Technology",
  "Arts & Culture",
  "History & Society"
];

const DAILY_CURIOSITIES = [
  {
    "id": "venus-clocks",
    "category": "Science & Nature",
    "title": "A year before a full turn",
    "hook": "Venus goes around the Sun before it finishes one rotation. How can a planet have a day longer than its year?",
    "core": [
      "A planet has two separate motions: it spins on its axis and travels around the Sun. Venus takes about 243 Earth days to turn once, but only about 225 Earth days to complete its orbit. Its rotation is unusually slow, and it spins in the opposite direction to most planets.",
      "There is a catch in the word “day.” Here it means one rotation measured against distant stars. It does not mean the time from one sunrise to the next. On Venus, that second kind of day takes about 117 Earth days. Both measurements are useful; they answer different questions."
    ],
    "deep": [
      "Picture yourself on a turning platform that also moves around a lamp. You can make one full turn and face the same wall again. But the lamp may now be in a different direction. Facing the wall again and facing the lamp again are two different ways to count a day.",
      "Venus has the same two motions: it turns and it travels around the Sun. It turns slowly, in the opposite direction to its trip around the Sun. One full turn takes about 243 Earth days. From one sunrise to the next takes about 117. A full trip around the Sun takes about 225.",
      "So the phrase “a day longer than a year” needs a little care. It is true if a day means one full turn. It is not true if a day means the time between sunrises. The numbers describe the same planet, using different clocks."
    ],
    "sources": [
      {
        "label": "NASA Science — Venus facts (rotation, orbit, and solar day)",
        "url": "https://science.nasa.gov/venus/venus-facts/"
      },
      {
        "label": "NASA StarChild — The planet Venus",
        "url": "https://starchild.gsfc.nasa.gov/docs/StarChild/solar_system_level2/venus.html"
      }
    ],
    "visual": {
      "type": "bars",
      "max": 243,
      "alt": "Three bars use the same scale in Earth days: sunrise to sunrise on Venus, 117; one orbit, 225; one full turn, 243. Rotation takes slightly longer than an orbit and about twice as long as a solar day.",
      "caption": "Approximate Earth days, on one shared scale. Bars compare durations, not distances.",
      "items": [
        {
          "label": "Sunrise to sunrise",
          "detail": "117 Earth days",
          "value": 117
        },
        {
          "label": "One orbit (a year)",
          "detail": "225 Earth days",
          "value": 225
        },
        {
          "label": "One full turn",
          "detail": "243 Earth days",
          "value": 243
        }
      ]
    },
    "recall": {
      "prompt": "Why does “a day longer than a year” need a definition of day?",
      "reveal": "Venus takes longer to complete one rotation than one orbit. Sunrise to sunrise measures a different interval, which is shorter than its year."
    }
  },
  {
    "id": "tree-ring-calendar",
    "category": "Science & Nature",
    "title": "A history written in wood",
    "hook": "A wooden beam can hold a calendar older than the building around it. The clue is not just how many rings it has.",
    "core": [
      "Tree rings can do more than suggest a tree’s age. Their changing widths form patterns that researchers compare across different trees. Trees growing under similar conditions may record similar sequences of wider and narrower rings. Matching those sequences can help assign calendar years to wood.",
      "This method is called dendrochronology. A sample from a living tree can overlap with older timber, which can overlap with still older wood. Together, the samples extend the record beyond any one tree’s lifetime. The useful clue is the shared pattern, rather than an isolated ring count or the apparent age of a piece of wood."
    ],
    "deep": [
      "Imagine two torn pieces of patterned ribbon. Part of the design appears on both pieces. Match that shared section and you can see how the pieces fit, even without the whole ribbon. Researchers use a similar idea when they compare tree rings.",
      "A living tree provides rings with known dates. An older wooden beam may share part of that pattern. Matching the shared rings can place the beam’s older rings on a calendar too. More overlapping samples can extend the record further into the past. The National Park Service describes how wood in old buildings can help build this record.",
      "But dating wood is only part of understanding a place. Researchers also examine buildings and objects such as pottery. The rings help answer when the wood grew. Other evidence helps explain how people used it. A ring count gives a length of time; a matching pattern helps locate that time in history."
    ],
    "sources": [
      {
        "label": "National Park Service — Tree rings and the tales they tell",
        "url": "https://www.nps.gov/articles/000/tree-rings.htm"
      },
      {
        "label": "National Park Service, Mesa Verde — Artifact gallery: Tree rings",
        "url": "https://home.nps.gov/meve/learn/education/tree-rings.htm"
      }
    ],
    "recall": {
      "prompt": "What makes a tree-ring pattern more useful for dating wood than a ring count alone?",
      "reveal": "A count gives a span of time. Matching overlapping patterns with dated samples helps place that span on a calendar."
    }
  },
  {
    "id": "coral-partners",
    "category": "Science & Nature",
    "title": "The partnership inside a coral",
    "hook": "A coral can lose much of its color without losing its skeleton. What disappears first is a tiny partner living inside its tissues.",
    "core": [
      "Many shallow-water reef corals share their bodies with microscopic algae. The coral provides shelter and materials the algae use. With sunlight, the algae make food through photosynthesis and share some of it with their host. Their pigments also contribute much of the coral’s color.",
      "Under stress, including unusually warm water, corals can lose these algae. Their pale tissues reveal the white skeleton beneath: coral bleaching. A bleached coral is not necessarily dead, but it has lost an important food source. If conditions improve, the partnership can recover; prolonged stress makes survival harder."
    ],
    "deep": [
      "The animal and its algae remain different organisms even though they live so closely together. Coral polyps can catch food with their tentacles, while their resident algae use light. These are different ways of obtaining energy, and the relationship connects them within a small patch of living tissue.",
      "Bleaching therefore describes more than a change in appearance. The visible loss of color can signal a breakdown in that relationship. NOAA distinguishes bleaching from death: living coral may regain algae, while a coral that dies cannot simply recover when the water cools.",
      "Color alone is an incomplete account of a reef’s condition. The useful question is what is happening to the living partnership underneath it. This also explains why treating every white coral as already dead misses a crucial interval: the animal may still be alive, but under serious strain."
    ],
    "sources": [
      {
        "label": "NOAA — Corals and their symbiotic algae",
        "url": "https://oceanservice.noaa.gov/education/tutorial_corals/coral02_zooxanthellae.html"
      },
      {
        "label": "NOAA — What is coral bleaching?",
        "url": "https://oceanservice.noaa.gov/facts/coral_bleach.html"
      }
    ],
    "recall": {
      "prompt": "Why is a bleached coral not necessarily a dead coral?",
      "reveal": "Bleaching means the coral has lost its resident algae and an important food source. The animal may still be alive and can recover the partnership if conditions improve."
    }
  },
  {
    "id": "basalt-columns",
    "category": "Science & Nature",
    "title": "Stone columns without a stonecutter",
    "hook": "The sides of some lava cliffs look carefully fitted, like a bundle of stone pencils. Their regular outlines began as cracks in cooling rock.",
    "core": [
      "As a thick body of lava cools and solidifies, it contracts. The shrinking rock develops cracks that can join into a network of polygons. As cooling continues inward, the cracks extend too, dividing the rock into long columns. Geologists call this columnar jointing.",
      "Basalt often displays the pattern, including at Devils Postpile in California. Many columns have six sides, but five-sided and other shapes occur as well. They are not giant individual crystals. Their outlines record how a larger mass of rock fractured as it lost heat, without anyone cutting or stacking the pieces."
    ],
    "deep": [
      "Start with the surface where heat is escaping. Cracks begin there and advance into the rock as it cools. Columns tend to develop perpendicular to the cooling surface. A horizontal surface can therefore produce upright columns; a different cooling boundary can produce a different arrangement.",
      "The polygon at the end of a column is one view of a three-dimensional fracture pattern. Looking only at that end can make the rock resemble separate paving stones. Following the same edges down a cliff reveals how far the fractures continue through the former lava body.",
      "The National Park Service describes hexagons as common, not compulsory. That distinction matters when looking at a photograph or an exposed cliff: an irregular column is part of the natural pattern, rather than a failed version of a perfect design. The repeated forms come from cooling and contraction, with variation still visible in the result."
    ],
    "sources": [
      {
        "label": "National Park Service — Columnar jointing",
        "url": "https://www.nps.gov/subjects/volcanoes/columnar-jointing.htm"
      },
      {
        "label": "National Park Service — Devils Postpile",
        "url": "https://www.nps.gov/places/devilspostpile.htm"
      }
    ],
    "recall": {
      "prompt": "How can cooling lava produce columns without anyone cutting the rock?",
      "reveal": "Cooling rock contracts and cracks. As the cracks extend inward, their connected pattern divides the rock into columns, often but not always six-sided."
    }
  },
  {
    "id": "autumn-pigments",
    "category": "Science & Nature",
    "title": "Two ways a leaf changes color",
    "hook": "Autumn yellow and autumn red do not always arrive by the same route. Some leaf colors were already there; others are made during the change.",
    "core": [
      "Green chlorophyll helps leaves capture light for photosynthesis. In many deciduous trees, autumn brings changes that slow its replacement and allow it to break down. Yellow and orange pigments called carotenoids, present alongside the green, become easier to see.",
      "Red has a different story. Many leaves make red or purple pigments called anthocyanins during autumn. So the familiar idea that fall simply uncovers hidden colors is only part of the explanation. The final display depends on the tree species and conditions such as light and temperature, as well as which pigments remain in each leaf."
    ],
    "deep": [
      "A yellow leaf and a red leaf can look like two versions of the same seasonal event. At the level of pigments, however, one may mainly reveal existing color while the other also contains newly produced color. Loss and production can happen during the same transition.",
      "That helps explain why a single account of autumn color often feels incomplete. Saying that green fades explains the appearance of carotenoids, but it does not explain the formation of anthocyanins. Conversely, saying that a leaf makes its autumn colors overlooks the pigments it already contained.",
      "Weather affects the display, but it does not give every tree the same palette. Species differ in the pigments they contain and produce. A useful way to look at an autumn canopy is therefore as many overlapping changes, rather than one switch that turns all green leaves into a single set of replacement colors."
    ],
    "sources": [
      {
        "label": "NOAA NESDIS — Why do leaves change color?",
        "url": "https://www.nesdis.noaa.gov/about/k-12-education/understanding-our-planet/why-do-leaves-change-color"
      },
      {
        "label": "Smithsonian Science Education Center — Autumn splendor",
        "url": "https://ssec.si.edu/stemvisions-blog/autumn-splendor-why-do-leaves-change-color-fall"
      }
    ],
    "recall": {
      "prompt": "How do autumn yellows, oranges, reds, and purples differ in the way they appear?",
      "reveal": "Fading chlorophyll reveals yellow and orange pigments already present. Many leaves also make new red or purple pigments during autumn."
    }
  },
  {
    "id": "suspension-bridge",
    "category": "Engineering & Technology",
    "title": "How can a road hang from cables?",
    "hook": "The Golden Gate Bridge carries traffic on a road that hangs from cables. How does something flexible help hold up something so heavy?",
    "core": [
      "A suspension bridge gives weight a route to the ground. Vertical steel ropes hold up the road deck and connect it to the large curved cables above. Those main cables pass over towers and are held at their ends by massive anchorages.",
      "The ropes and cables are pulled tight: engineers call that tension. The towers are squeezed downward, which is called compression. At the Golden Gate, the anchorages resist the cables’ pull and are embedded in bedrock. Flexible cables and rigid towers do different jobs. The bridge works because those jobs connect, not because every part resists force in the same way."
    ],
    "deep": [
      "Follow the weight of a car parked on the bridge. It presses on the road deck. The vertical ropes pull upward on the deck and downward on the main cables. The main cables pass that load to the towers and the anchorages. The foundations connect the structure to the ground.",
      "A rope offers a useful everyday comparison. Pull its ends apart and it can carry tension. Push the ends together and it goes slack rather than acting like a firm column. A tower plays a different role: it supports a downward push. The bridge combines these different strengths in one structure.",
      "This is a simplified account of the Golden Gate’s support system, not a recipe for designing a bridge. Engineers also have to deal with moving traffic and changing conditions. Still, tracing the connected pushes and pulls explains why the sweeping cables are working parts, rather than decoration."
    ],
    "sources": [
      {
        "label": "Golden Gate Bridge District — How the bridge spans the Golden Gate",
        "url": "https://www.goldengate.org/exhibits/how-the-bridge-spans-the-golden-gate/"
      },
      {
        "label": "Golden Gate Bridge District — Steel suspender rope exhibit",
        "url": "https://www.goldengate.org/exhibits/steel-suspender-rope-exhibit/"
      }
    ],
    "recall": {
      "prompt": "How do the cables and towers share the job of supporting a suspension bridge?",
      "reveal": "Cables carry tension, while towers carry compression. Together with anchorages and foundations, they give the load a connected route to the ground."
    }
  },
  {
    "id": "stainless-surface",
    "category": "Engineering & Technology",
    "title": "Steel protected by its own surface",
    "hook": "The protection on stainless steel is far thinner than a coat of paint. The metal can form it again when fresh surface meets oxygen.",
    "core": [
      "Stainless steel contains chromium, which helps form a thin, protective oxide film on its surface. This film limits further corrosion. It is part of the material’s response to its surroundings, rather than a separately applied layer of paint.",
      "If the surface is scratched, the protective film can form again where oxygen is available. That does not make stainless steel immune to damage. Different grades suit different environments, and conditions such as exposure to chlorides can defeat the protection. “Stainless” describes useful resistance, not a promise that the metal can never corrode under any circumstances."
    ],
    "deep": [
      "The important boundary is where metal meets its environment. A bulk piece of steel may be strong, but corrosion begins through reactions at its exposed surface. Changing what happens at that boundary can therefore make a large difference to the life of the whole object.",
      "The industry organization worldstainless calls the protective film a passive layer. Here, passive means that the surface resists further reaction. The ability to form this film again explains why a small scratch need not have the same consequence as breaking through a protective paint coating.",
      "There is still a condition attached: the surrounding environment must allow the protective layer to do its job. Material choice and exposure both matter. The interesting feature is this combination of vulnerability and renewal. A surface can protect the metal underneath while remaining dependent on the chemistry around it, rather than acting as an unbreakable shell."
    ],
    "sources": [
      {
        "label": "worldstainless — Corrosion properties and the passive layer",
        "url": "https://worldstainless.org/about-stainless/properties/corrosion-properties/"
      }
    ],
    "recall": {
      "prompt": "What protects stainless steel, and why is that protection not an absolute guarantee?",
      "reveal": "A thin chromium-rich oxide film limits corrosion and can form again with oxygen. Some environments can still defeat that protective layer."
    }
  },
  {
    "id": "heat-pump",
    "category": "Engineering & Technology",
    "title": "Moving heat instead of making it",
    "hook": "A machine can warm a room by taking heat from colder outdoor air. “Cold” does not mean there is no heat left to move.",
    "core": [
      "An electric heat pump uses electricity to transfer heat from one place to another. In heating mode, an air-source system takes heat from outside and releases it indoors. A circulating refrigerant absorbs and releases heat as the equipment changes its pressure and temperature.",
      "This takes work: heat does not simply flow from colder outdoors into a warmer room on its own. The electrical input runs the process. Because the machine moves heat as well as using electricity, the heat delivered indoors can exceed the electrical energy supplied. The amount depends on the equipment and operating conditions."
    ],
    "deep": [
      "Think about the two ends of the job rather than just the warm air leaving the indoor unit. One side absorbs heat; the other releases it. The compressor and the rest of the refrigerant circuit make that transfer possible even when the desired direction opposes the natural flow from hot to cold.",
      "The Department of Energy describes heat pumps as devices that can provide both heating and cooling. In a reversible system, changing the direction of operation lets the indoor space give up heat instead. The room has switched roles, from the place receiving heat to the place losing it.",
      "There is no extra energy appearing from nowhere. The heat source outside the room is part of the accounting. Looking only at the electricity entering the machine leaves out the energy it collects elsewhere. That wider boundary is what makes the apparently puzzling comparison understandable."
    ],
    "sources": [
      {
        "label": "U.S. Department of Energy — Heat pump systems",
        "url": "https://www.energy.gov/energysaver/heat-pump-systems"
      },
      {
        "label": "Massachusetts DOER — Air-source heat pump handout (DOE-hosted PDF)",
        "url": "https://www.energy.gov/sites/prod/files/2017/07/f35/About%20Air%20Source%20Heat%20Pumps%20Handout.pdf"
      }
    ],
    "recall": {
      "prompt": "How can a heat pump deliver more heat than the electrical energy it uses?",
      "reveal": "It transfers heat from elsewhere as well as using electricity to run the process. Counting the outside heat source explains the energy delivered indoors."
    }
  },
  {
    "id": "qr-recovery",
    "category": "Engineering & Technology",
    "title": "Why a damaged code can still scan",
    "hook": "A smudge can hide part of a QR code without hiding its message. The printed pattern carries more than the information you came to read.",
    "core": [
      "A QR code includes error-correction data alongside its message. These extra mathematical clues can let a reader reconstruct information when some of the pattern is dirty or damaged. The design deliberately uses space for resilience, rather than packing every available square with new message content.",
      "DENSO WAVE describes four error-correction levels. More protection requires more space, and recovery still has limits. A damaged code is not guaranteed to scan. The key idea is that the reader can sometimes recover the intended data from the surviving pattern, instead of needing every printed part to remain perfect."
    ],
    "deep": [
      "Redundancy can be useful without being a second complete copy. Error-correction data constrains what the original message could have been. When damage stays within the method’s capabilities, those constraints help the reader recover the missing or corrupted information.",
      "There is a design tradeoff. For a given amount of message data, stronger error correction can require a larger QR code. DENSO WAVE recommends choosing a level with the expected environment in mind. A label likely to get dirty presents a different problem from a clean code displayed on a screen.",
      "This is why “some damage is recoverable” is more useful than a promise that a fixed chunk can always be removed. Recovery depends on the actual damage and the encoded protection. The extra information buys tolerance for imperfect conditions; it does not make the printed object indestructible or every scan successful."
    ],
    "sources": [
      {
        "label": "DENSO WAVE — QR Code error correction",
        "url": "https://www.qrcode.com/en/about/error_correction.html"
      },
      {
        "label": "DENSO WAVE — What is a QR Code?",
        "url": "https://www.qrcode.com/en/about/"
      }
    ],
    "recall": {
      "prompt": "What tradeoff lets a QR code survive some damage?",
      "reveal": "It uses space for error-correction data rather than only new message content. Those extra clues can help reconstruct data, but recovery has limits."
    }
  },
  {
    "id": "bicycle-gears",
    "category": "Engineering & Technology",
    "title": "An easier climb costs more turns",
    "hook": "Shifting down on a bicycle makes a hill feel easier, but the hill has not changed. The gears change what each pedal turn asks of you.",
    "core": [
      "A bicycle chain connects the front chainring to a rear sprocket. With a smaller front chainring or a larger rear sprocket, each pedal turn drives the rear wheel through fewer turns. This lower gear makes it easier to apply turning force at the wheel.",
      "The tradeoff is distance. You need more pedal revolutions to cover the same ground. A higher gear reverses that exchange, carrying you farther per turn while demanding more pedal force under comparable conditions. Gears let the rider choose a useful balance between force and pedaling speed; they do not remove the effort of climbing."
    ],
    "deep": [
      "Count the teeth engaged over one complete turn of the front chainring. That many links pass the rear sprocket. If the front has twice as many teeth as the rear, the rear sprocket turns twice for one pedal revolution. This example assumes the usual chain drive with the rear sprocket driving the wheel.",
      "Now make the rear sprocket larger while keeping the front one unchanged. The same length of moving chain takes it through fewer turns. The wheel therefore travels less far per pedal revolution, which is the distance side of the low-gear tradeoff.",
      "The Exploratorium describes gearing as a choice between speed and force. This is why a useful gear for a steep climb can feel frustrating on level ground: the rider may be turning the pedals quickly while advancing only a short distance. The mechanism has not changed; the demands of the journey have."
    ],
    "sources": [
      {
        "label": "Exploratorium — The science of cycling: Gears",
        "url": "https://annex.exploratorium.edu/cycling/gears1.html"
      },
      {
        "label": "Exploratorium — Gears and mechanical advantage",
        "url": "https://annex.exploratorium.edu/cycling/gears3.html"
      }
    ],
    "recall": {
      "prompt": "What do you give up when a lower bicycle gear makes pedaling easier?",
      "reveal": "The wheel travels less far per pedal turn. You gain turning force but need more pedal revolutions to cover the same ground."
    }
  },
  {
    "id": "woodcut-reversal",
    "category": "Arts & Culture",
    "title": "The picture that prints backward",
    "hook": "A printmaker wants a letter to face the right way on paper. Why might they need to carve it backward into the wood?",
    "core": [
      "A woodcut is made by carving away parts of a wooden block. The raised surface takes the ink; the cut-away areas normally stay blank on the paper. Pressing paper against the inked surface transfers the image.",
      "There is a twist: the printed image is reversed compared with the block. A letter carved as an ordinary R would print backward. To print a readable R, its shape on the block must be reversed first. This makes printmaking a task of planning what will appear after contact. The artist works on one surface while thinking about the image that will emerge on another."
    ],
    "deep": [
      "A stamp makes the reversal easy to test. Give it an arrow pointing left on its inked face. After you press it onto paper and lift it away, the printed arrow points right. The print faces you from the opposite surface. The same reversal happens when a woodcut transfers its image.",
      "The Met explains that the printmaker removes the areas that should not receive ink. A roller or ink ball coats the remaining raised surface. Paper is then pressed against it. Two choices matter at once: which parts are left high enough to print, and which way the finished image should face.",
      "The paired letters below make the second choice visible. The reversed letter represents the inked face of the block; the normal letter represents the finished print viewed face-on. This is a simple example, not a reproduction of an artwork. It shows why lettering can reveal a reversal that a more balanced shape might conceal."
    ],
    "visual": {
      "type": "mirror",
      "alt": "Face-on comparison: the block has a horizontally reversed capital R, while the finished paper print has a normal capital R. Contact printing reverses the design.",
      "caption": "A schematic letter, viewed face-on on each surface. The block’s raised, inked shape prints in reverse.",
      "items": [
        {
          "label": "Block face",
          "detail": "Reversed design"
        },
        {
          "label": "Paper print",
          "detail": "Readable result"
        }
      ]
    },
    "sources": [
      {
        "label": "The Metropolitan Museum of Art — Woodcut: materials and techniques",
        "url": "https://www.metmuseum.org/perspectives/materials-and-techniques-printmaking-woodcut"
      }
    ],
    "recall": {
      "prompt": "Why must a readable letter be reversed on a woodcut block?",
      "reveal": "Contact printing reverses the design. A backward letter on the inked block produces a readable letter on the paper."
    }
  },
  {
    "id": "ultramarine",
    "category": "Arts & Culture",
    "title": "A painted blue with a long journey",
    "hook": "A patch of blue in a Renaissance painting may begin with a stone mined far away. The color carries a history of materials as well as images.",
    "core": [
      "Natural ultramarine is a blue pigment made from lapis lazuli. For European painters, this stone came through long-distance trade from Afghanistan. Producing a useful pigment also required processing the stone. The resulting blue could be a costly artistic material.",
      "The National Gallery describes how painters used ultramarine and how material choices shaped their work. A blue passage was not simply a selection from an unlimited color menu. Its appearance depended on the pigment available, its preparation, and how the artist applied it. Looking at color can therefore open a second story about the making of a painting."
    ],
    "deep": [
      "On a finished canvas or panel, color looks like a property of the image. In the workshop, it was also a substance that had to be obtained and handled. Natural ultramarine makes that difference especially tangible: a mineral source stands behind an apparently weightless area of blue.",
      "The National Gallery’s research on Raphael identifies natural ultramarine among his pigments and discusses its use in layers of paint. A pigment’s presence alone does not tell the whole story. The layers and the materials beneath it also contribute to what the viewer sees.",
      "Following this material does not require treating every blue passage as a code with one fixed meaning. Instead, it adds another question to looking: what choices made this particular color possible here? Trade, workshop knowledge, and artistic decisions meet in the painted surface, even when the picture gives no obvious account of that journey."
    ],
    "sources": [
      {
        "label": "National Gallery — Making Colour: journey through colour",
        "url": "https://www.nationalgallery.org.uk/exhibitions/past/making-colour/journey-through-colour"
      },
      {
        "label": "National Gallery — Studying Raphael: pigments and medium",
        "url": "https://www.nationalgallery.org.uk/research/publications/studying-raphael/studying-raphael-pigments-and-medium"
      }
    ],
    "recall": {
      "prompt": "What can a painted blue reveal beyond the image it forms?",
      "reveal": "Natural ultramarine points to the stone, trade, preparation, and paint layers behind the color. Materials and workshop choices help shape what the viewer sees."
    }
  },
  {
    "id": "shadow-puppetry",
    "category": "Arts & Culture",
    "title": "A whole performance behind a screen",
    "hook": "A flat figure can turn into a lively character on a lit screen. In Chinese shadow puppetry, movement, music, and skilled hands work together.",
    "core": [
      "Chinese shadow puppetry uses figures made from leather or paper, manipulated behind an illuminated screen. Performers move them with rods while music and singing accompany the action. The audience sees a staged world built from light, silhouettes, and sound.",
      "UNESCO describes it as a living performance tradition, with skills passed between practitioners. Making the figures is only one part of the craft. Moving their joints, voicing characters, and working with the music bring the figures into a story. A puppet on display shows an object; a performance reveals the coordinated artistic skills that make that object act."
    ],
    "deep": [
      "The screen draws a boundary between the visible story and the people producing it. On one side are figures and their movements; behind them are the hands controlling the rods. Music and voices supply things a silhouette cannot convey by itself.",
      "UNESCO’s account includes both the making of puppets and the skills of performance. It also describes knowledge passed through families and troupes. This is a useful distinction when thinking about cultural heritage: preserving a physical figure and sustaining the ability to perform with it are related, but different, tasks.",
      "Watching a character move invites attention to that relationship. A joint has no expression on its own. Its timing within a gesture, alongside a voice or musical phrase, gives the movement a role in the scene. The artwork unfolds through performance, rather than being fully contained in the material object before the show begins."
    ],
    "sources": [
      {
        "label": "UNESCO — Chinese shadow puppetry",
        "url": "https://ich.unesco.org/en/RL/chinese-shadow-puppetry-00421"
      },
      {
        "label": "UNESCO — Chinese shadow puppetry information sheet",
        "url": "https://ich.unesco.org/doc/src/17331-EN.pdf"
      }
    ],
    "recall": {
      "prompt": "What does a shadow-puppet performance preserve that a displayed puppet alone cannot show?",
      "reveal": "Movement, voices, music, and timing bring the figure into a story. The tradition includes learned performance skills as well as the crafted object."
    }
  },
  {
    "id": "washoku",
    "category": "Arts & Culture",
    "title": "A food tradition larger than a recipe",
    "hook": "A recipe can tell you what goes into a dish. It cannot, by itself, explain everything a community passes on through preparing and sharing food.",
    "core": [
      "Washoku is a Japanese food culture that includes knowledge and practices around producing, preparing, and eating food. UNESCO’s inscription emphasizes respect for nature and its expression in New Year celebrations. The heritage is broader than a fixed menu or one famous dish.",
      "In the New Year practices described by UNESCO, special foods are prepared and shared, with ingredients and dishes carrying symbolic meanings. Families and communities transmit knowledge through participation. The food matters, but so do choosing it, making it, and gathering around it. A tradition can live in these relationships as much as in the final plate."
    ],
    "deep": [
      "Consider what a written recipe preserves well: ingredients, quantities, and a sequence of actions. Now consider what may be learned by taking part in a celebration: when preparations begin, who works together, and why a dish belongs to that occasion. These are different kinds of knowledge.",
      "UNESCO describes washoku as a social practice and highlights New Year as a setting where it is especially visible. The focus is not a claim that every Japanese household cooks or celebrates in exactly the same way. It identifies a body of knowledge and customs that people pass on.",
      "This changes the question from “Which food counts?” to “What practices are being continued?” A finished dish can be described on its own, but its cultural place may depend on season, occasion, and shared understanding. Learning about a food tradition therefore means paying attention to the activity around the food as well."
    ],
    "sources": [
      {
        "label": "UNESCO — Washoku, notably for the celebration of New Year",
        "url": "https://ich.unesco.org/en/RL/washoku-traditional-dietary-culture-of-the-japanese-notably-for-the-celebration-of-new-year-00869"
      }
    ],
    "recall": {
      "prompt": "Why does preserving a recipe preserve only part of a food tradition?",
      "reveal": "A recipe records ingredients and actions. A food tradition also includes occasions, shared preparation, meanings, and knowledge learned through participation."
    }
  },
  {
    "id": "gothic-light",
    "category": "Arts & Culture",
    "title": "Making room for colored light",
    "hook": "A Gothic church window does more than fill a gap in a wall. Its colored light belongs to a larger artistic idea about the space inside.",
    "core": [
      "Gothic builders combined pointed arches, ribbed vaults, and external supports to create interiors with larger windows. Stained glass could then occupy more of the building’s enclosing surface. Structure helped make room for a different experience of light.",
      "In medieval Christian churches, these windows also carried religious images and meanings. The Met describes biblical scenes, saints, and luminous color as central to the experience of the cathedral. The glass was neither a separate picture gallery nor merely a way to brighten a room. It joined architecture and imagery, shaping how the interior was seen and understood."
    ],
    "deep": [
      "Look at the window as part of the room, not just as an image held in a frame. Light passes through its colored glass into the same space occupied by the viewer. The building gives the image a scale and setting that a small independent object cannot provide.",
      "The Met’s account connects the upward movement of Gothic interiors with Christian aspirations toward heaven. It also describes windows filled with biblical stories and figures. Height, imagery, and colored light could reinforce one another in the religious experience of the space.",
      "That reading does not mean every Gothic building has the same arrangement or that every visitor responds alike. It offers a historically grounded way to connect choices that might otherwise seem separate. The large opening, the stained glass, and the proportions of the room belong to a shared artistic setting, rather than three unrelated items on a checklist."
    ],
    "sources": [
      {
        "label": "The Metropolitan Museum of Art — Gothic Art",
        "url": "https://www.metmuseum.org/essays/gothic-art"
      }
    ],
    "recall": {
      "prompt": "How do stained-glass windows work with a Gothic church’s interior?",
      "reveal": "Colored light, religious imagery, height, and space reinforce one another. The windows belong to the experience of the building, not just its decoration."
    }
  },
  {
    "id": "rosetta-scripts",
    "category": "History & Society",
    "title": "One message, three scripts",
    "hook": "The Rosetta Stone repeats a decree in three scripts. That repetition helped scholars read writing whose meaning had been lost for many centuries.",
    "core": [
      "The Rosetta Stone carries a decree in Egyptian hieroglyphs, Egyptian Demotic, and Ancient Greek. Three scripts does not mean three unrelated languages: hieroglyphs and Demotic are two ways of writing Egyptian. Scholars could still read the Greek, giving them a way into the other inscriptions.",
      "The stone mattered because the versions conveyed the same decree. A readable text provided something to compare with the unfamiliar writing. It was a key to decipherment, rather than an instant translation device. Repetition, which might seem redundant at first glance, made the object unusually useful for recovering a system of writing from the ancient world."
    ],
    "deep": [
      "The Rosetta Stone repeats an official message in three kinds of writing. Hieroglyphs suited a message from priests. Demotic was used for everyday Egyptian writing. Greek was used by the administration. As the British Museum explains, the same stone brought these different uses of writing together.",
      "Scholars could read the Greek version. That gave them a guide to what the other versions said, but it did not explain every sign. They still had to work out how the writing worked. Having the same message in a known script made that difficult task more approachable.",
      "Imagine three copies of a notice, with only one in writing you can read. You might look for repeated groups of signs and compare where they occur. You would still need to check each guess. This is much simpler than the real historical work, but it shows why repetition mattered: the known text gave clues to the unknown ones."
    ],
    "sources": [
      {
        "label": "British Museum — The Rosetta Stone: everything you need to know",
        "url": "https://www.britishmuseum.org/blog/everything-you-ever-wanted-know-about-rosetta-stone"
      },
      {
        "label": "British Museum — Rosetta Stone collection record",
        "url": "https://www.britishmuseum.org/collection/object/Y_EA24"
      }
    ],
    "recall": {
      "prompt": "Why did repeating a decree in different scripts help scholars decipher it?",
      "reveal": "The readable Greek version provided a comparison for unfamiliar writing. It offered clues, while scholars still had to work out and check how the scripts worked."
    }
  },
  {
    "id": "ming-banknote",
    "category": "History & Society",
    "title": "Coins pictured on paper money",
    "hook": "A Ming banknote pictures strings of coins on its surface. Why would a new form of money show the older kind it could stand for?",
    "core": [
      "A Ming dynasty banknote in the British Museum represents a value in strings of copper-alloy cash coins. Its printed coin imagery connects the paper to a familiar monetary unit. The sheet is light, but the value it names comes from a world of metal money.",
      "This was not the beginning of paper money in China; earlier dynasties had already used it. The Ming note is a surviving example of how an issued document could express monetary value. Its printed words and images show an authority presenting a claim, rather than the paper itself containing an equivalent quantity of valuable metal."
    ],
    "deep": [
      "The picture of coins makes an abstract relationship visible. Someone looking at the note encounters a familiar form of money, even though the object in their hands is paper. The image helps explain the denomination without turning the sheet into the metal it depicts.",
      "The British Museum’s account also describes the decline in value of Ming paper currency. A denomination printed on a note and what people will actually exchange for it need not remain the same. The surviving object records an official claim; it does not, by itself, prove how well that claim held up in daily transactions.",
      "Those two ways of reading the note belong together. One asks what its design says. The other asks how the currency worked in society. An object can be carefully made to express authority while its practical acceptance depends on circumstances beyond the printed border."
    ],
    "sources": [
      {
        "label": "British Museum — Ming banknote, published by Smarthistory",
        "url": "https://smarthistory.org/ming-banknote/"
      },
      {
        "label": "British Museum — Ming banknote collection record",
        "url": "https://www.britishmuseum.org/collection/object/C_1913-1011-30"
      }
    ],
    "recall": {
      "prompt": "What distinction matters between a banknote’s printed value and its use in society?",
      "reveal": "The note states an official value, but what people will exchange for it can differ. Its design expresses a claim, not proof of stable acceptance."
    }
  },
  {
    "id": "carnegie-libraries",
    "category": "History & Society",
    "title": "The library gift with an ongoing cost",
    "hook": "A town could receive money for a Carnegie library building and still need to make a lasting financial promise. The gift did not run the library.",
    "core": [
      "Andrew Carnegie’s library grants often paid for a building on condition that a community supplied a site and committed to supporting the library. The National Park Service reproduces an agreement requiring local funding for continuing operation. The arrangement separated construction from the cost of keeping a public service available.",
      "That distinction explains why a donated building was only part of the project. A library needed ongoing support after its doors opened. The community’s commitment was built into the grant conditions, linking a private contribution to a continuing public responsibility rather than treating the opening day as the finished task."
    ],
    "deep": [
      "The National Park Service’s teaching materials include a form of local resolution: the community promises annual support in return for the building grant. This turns a general intention to welcome a library into a commitment about what happens after construction.",
      "A building is easy to point to. Continuing service is less visible because it depends on repeated work and expenditure. Thinking about those two costs separately helps explain why the grant could be generous and conditional at the same time. The conditions addressed a problem that the construction money alone could not solve.",
      "This is a specific historical funding arrangement, rather than a verdict on how every library should be financed. It makes a broader institutional question concrete: who will keep a service going once the initial gift has been spent? The answer was part of the project from the outset, not an afterthought added when the building was complete."
    ],
    "sources": [
      {
        "label": "National Park Service — Carnegie Libraries: The Future Made Bright",
        "url": "https://home.nps.gov/articles/carnegie-libraries-the-future-made-bright-teaching-with-historic-places.htm"
      },
      {
        "label": "Carnegie — Libraries and the history of library funding",
        "url": "https://carnegie.org/our-work/libraries/"
      }
    ],
    "recall": {
      "prompt": "Why did a gift for a library building still require a community commitment?",
      "reveal": "Construction funding did not pay for continuing service. The community had to provide a site and ongoing support to keep the library operating."
    }
  },
  {
    "id": "penny-black",
    "category": "History & Society",
    "title": "When receiving a letter came with a bill",
    "hook": "In Britain before postal reform, a letter could arrive with postage still to pay. The familiar stamp helped move payment to the start of the journey.",
    "core": [
      "Before Britain’s postal reforms, charges commonly depended on distance and the number of sheets, and recipients usually paid. Reforms associated with Rowland Hill introduced simpler charges based on weight. In 1840, the Penny Black adhesive postage stamp made prepayment visible on the letter itself.",
      "The small label was part of a larger change in how the postal service worked. A sender could pay before dispatch, and the attached stamp showed that postage had been paid. Its importance was not just the printed portrait: it helped turn a payment into something that could travel with the message."
    ],
    "deep": [
      "From the recipient’s point of view, paying to receive a letter and opening one whose postage is already paid are different experiences. From the postal service’s point of view, payment made before dispatch can be represented on the item being carried. The stamp connects those two sides of the transaction.",
      "The Postal Museum places the Penny Black within a sequence of reforms, rather than presenting it as an isolated invention. Changes to rates and the basis of charging mattered alongside the adhesive label. The Smithsonian likewise treats it as part of a transformation in the mail.",
      "Following the payment reveals a less obvious history inside an everyday object. The label’s job was administrative as well as visual: it provided evidence that could move with a letter. A small addition to the envelope helped make a changed service understandable to the people sending, carrying, and receiving it."
    ],
    "sources": [
      {
        "label": "The Postal Museum — The first ever stamp: the Penny Black",
        "url": "https://www.postalmuseum.org/collections/highlights/the-first-ever-stamp-the-penny-black/"
      },
      {
        "label": "Smithsonian National Postal Museum — The 1840 Penny Black",
        "url": "https://postalmuseum.si.edu/exhibition/the-queen%E2%80%99s-own-postal-reforms-that-transformed-the-mail-the-worlds-first-postage-stamps"
      }
    ],
    "recall": {
      "prompt": "What did a postage stamp let travel with a letter besides the message?",
      "reveal": "Evidence that postage had already been paid. The stamp helped move payment from the recipient at delivery to the sender before dispatch."
    }
  },
  {
    "id": "roman-amphorae",
    "category": "History & Society",
    "title": "A shipping container made of clay",
    "hook": "A broken Roman jar can say something about a journey its contents no longer survive to tell. Ordinary packaging has become evidence of trade.",
    "core": [
      "Roman transport amphorae carried goods such as wine and olive oil. Their shapes varied, and some bore stamps or painted inscriptions. Museums study these containers as evidence of production and movement, not only as complete objects worth displaying.",
      "At the Roman villa of Loupian in southern France, workshops made amphorae for wine. The French Ministry of Culture describes painted labels that could record information such as the wine, capacity, or owner. A container could therefore carry information as well as a product. Once the contents were gone, the ceramic could still preserve clues about the commercial world around it."
    ],
    "deep": [
      "An amphora’s shape alone does not tell every part of its story. The British Museum records a Roman wine transport jar with a stamp on its neck and identifies the vessel by type. Such details give researchers things to compare across finds.",
      "The Loupian examples add another kind of evidence: painted words about a traded product. Shape, markings, and the place where an object was found answer different questions. A useful account draws on them together rather than assuming one broken jar supplies a complete shipping itinerary.",
      "This is a reason to pay attention to ordinary objects in a museum. A prestigious sculpture may tell us about artistic choices and patronage; a transport jar can point toward goods being packed and moved. Its value as evidence comes partly from a practical job that was finished long before anyone placed it in a collection."
    ],
    "sources": [
      {
        "label": "French Ministry of Culture — Amphorae for the wine trade",
        "url": "https://archeologie.culture.gouv.fr/villa/en/amphorae-wine-trade"
      },
      {
        "label": "British Museum — Roman wine transport amphora",
        "url": "https://www.britishmuseum.org/collection/object/G_1816-0610-344"
      }
    ],
    "recall": {
      "prompt": "How can an empty transport jar remain useful evidence of trade?",
      "reveal": "Its shape, markings, and find location provide different clues about production and movement. Researchers combine them rather than treating one jar as a complete itinerary."
    }
  },
  {
    "id": "gps-relativity",
    "category": "Engineering & Technology",
    "title": "Clocks set slow on purpose",
    "hook": "Before a GPS satellite is launched, its atomic clocks are made to tick slightly slower than clocks on the ground. In orbit, that deliberate error disappears.",
    "core": [
      "GPS satellites orbit about 20,000 kilometers up, moving at roughly 14,000 kilometers per hour. Both facts affect their onboard atomic clocks. Because a satellite moves fast relative to the ground, special relativity predicts its clocks fall behind ground clocks by about 7 microseconds a day.",
      "Because the satellite is farther from Earth’s mass, general relativity predicts the opposite: its clocks run ahead by about 45 microseconds a day. Gravity wins, leaving a net gain of about 38 microseconds daily. So the clocks are designed to tick at a slightly lower frequency, which lets them keep pace with the ground once in orbit."
    ],
    "deep": [
      "Thirty-eight millionths of a second sounds negligible. The difficulty is that a receiver works out distance from how long a signal took to arrive, and radio signals travel at the speed of light. A tiny timing error becomes a large error in distance.",
      "The Ohio State astronomer Richard Pogge estimates that without the relativistic correction, errors in position would accumulate at about 10 kilometers each day. The physicist Neil Ashby, writing in Physics Today, puts the build-up at more than 11 kilometers in a day, quickly making the system useless for navigation.",
      "The interesting engineering choice is when the fix happens. Ashby describes a “factory offset” applied before launch. The correction is not a repair made after the clocks drift; it is built into them from the start, because the designers expected the orbit itself to change how those clocks keep time."
    ],
    "sources": [
      {
        "label": "Ohio State University (Richard Pogge) — Real-World Relativity: The GPS Navigation System",
        "url": "https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps.html"
      },
      {
        "label": "Physics Today (Neil Ashby) — Relativity and the Global Positioning System",
        "url": "https://physicstoday.aip.org/features/relativity-and-the-global-positioning-system"
      }
    ],
    "recall": {
      "prompt": "Why are GPS satellite clocks set to tick slightly slow before launch?",
      "reveal": "In orbit, weaker gravity makes them run ahead by more than their speed makes them fall behind. The offset cancels that net gain so they keep time with ground clocks."
    }
  },
  {
    "id": "true-fresco",
    "category": "Arts & Culture",
    "title": "Painting before the wall dries",
    "hook": "Some of the most lasting wall paintings were made against a deadline. The painter had to finish each section before the plaster dried, because drying is what held the color.",
    "core": [
      "In buon, or true, fresco, painters grind dry pigments in water and apply them to freshly laid lime plaster. The final, very smooth layer is called the intonaco. As it dries, the colors set with the plaster and become a permanent part of the wall rather than a coat of paint resting on top.",
      "That creates a deadline. Only as much plaster as can be painted in one day is spread on the wall, and each day’s patch is called a giornata, Italian for “a day’s work.” A large fresco is therefore built piece by piece, one fresh area of plaster at a time."
    ],
    "deep": [
      "Why does drying matter so much? Lime plaster sets by reacting with carbon dioxide in the air: calcium hydroxide becomes calcium carbonate. That reaction fixes the pigment particles in the plaster. Water carries the color in, and the chemistry of the setting wall locks it there.",
      "The method leaves traces. The different day stages can usually be seen as faint seams, and in many large frescoes the divisions are visible from the ground. A wall-sized painting may contain ten to twenty or more giornate, so the seams quietly record a sequence of working days.",
      "Painting on dry plaster, called a secco, works differently. Without the wet wall to hold it, pigment needs a binder such as egg, glue or oil. True fresco is generally more durable than secco work added on top of it, and some secco details have since fallen away, leaving the fresco underneath."
    ],
    "sources": [
      {
        "label": "The National Gallery, London — Glossary: fresco",
        "url": "https://www.nationalgallery.org.uk/paintings/glossary/fresco"
      },
      {
        "label": "Encyclopaedia Britannica — Fresco painting",
        "url": "https://www.britannica.com/art/fresco-painting"
      },
      {
        "label": "Wikipedia — Fresco (technique and chemistry)",
        "url": "https://en.wikipedia.org/wiki/Fresco"
      }
    ],
    "recall": {
      "prompt": "Why did a fresco painter plaster only one day’s area at a time?",
      "reveal": "The pigment had to go onto wet lime plaster, which fixes the color as it sets. Plaster that dried before painting could only take less durable secco work."
    }
  },
  {
    "id": "petrichor",
    "category": "Science & Nature",
    "title": "The smell waiting on the ground",
    "hook": "After a dry spell, the first light rain often brings a rich, earthy smell. Most of that smell is not in the falling water. It was already waiting on the ground.",
    "core": [
      "In 1964, Australian scientists gave the scent a name: petrichor, from Greek words for stone and for ichor, the fluid said to flow in the veins of the gods. It comes largely from two ingredients. During dry spells, oils and other compounds from decaying plant matter collect on rock and soil surfaces.",
      "The second ingredient is geosmin, a compound made by bacteria that live in soil. People are remarkably sensitive to it: we can notice just a few parts per trillion in the air. Rain lifts these compounds off the ground and carries them to our noses."
    ],
    "deep": [
      "How does a raindrop throw a smell into the air? In 2015, researchers at MIT used high-speed cameras to film drops landing on different surfaces. When a drop hits a porous surface such as soil, it traps tiny air bubbles where it lands.",
      "Those bubbles rise through the drop and burst out of its top, much like bubbles in a glass of champagne. Each burst releases a fizz of aerosols: tiny particles that drift away on the air, carrying scent compounds with them. The team published the work in Nature Communications.",
      "The details fit a familiar experience. Moderate or light rain on sandy or clay soils produced the most aerosols. Slower drops and more porous ground both produced more. That is one reason the scent is often strongest when a light shower falls on dry, sandy ground. The smell of rain is really the smell of the ground, launched into the air one bursting bubble at a time."
    ],
    "sources": [
      {
        "label": "Smithsonian Magazine — High-speed video shows when the smell of rain begins",
        "url": "https://www.smithsonianmag.com/smart-news/high-speed-video-shows-when-smell-rain-begins-180953958/"
      },
      {
        "label": "EarthDate (Bureau of Economic Geology, UT Austin) — The scent of rain",
        "url": "https://www.earthdate.org/episodes/the-scent-of-rain"
      }
    ],
    "recall": {
      "prompt": "Where does the earthy smell of rain on dry ground come from?",
      "reveal": "Plant oils and geosmin from soil bacteria build up on the ground. Raindrops trap tiny air bubbles that burst and carry those compounds into the air."
    }
  },
  {
    "id": "exchequer-tallies",
    "category": "History & Society",
    "title": "The receipts that burned Parliament",
    "hook": "In 1834, most of the old Houses of Parliament in London burned down. The fire began with a pile of wooden receipts the government had used for centuries and no longer needed.",
    "core": [
      "Since medieval times, the Exchequer, a government office based at Westminster, had recorded payments on tally sticks: pieces of carved, notched wood, normally willow. Each stick was split in two, so that both sides of an agreement kept a matching record of what had been paid.",
      "Paper eventually replaced them. A 1782 Act of Parliament said records should be kept on paper, not tallies, but it came into force only in 1826, when the last holder of an old Exchequer office died. That left Westminster with two large cartloads of obsolete wooden accounts, and someone had to get rid of them."
    ],
    "deep": [
      "Treasury officials told the Clerk of Works, Richard Weobley, to clear the old tallies. He decided against giving them to parliamentary staff as firewood. Instead, on 16 October 1834, two labourers, Joshua Cross and Patrick Furlong, burned them in the two heating furnaces directly below the House of Lords.",
      "The furnaces had been designed to burn coal, but wood burns with a high flame. A chimney fire smouldered under the floor of the Lords chamber. Around four in the afternoon, two visiting tourists felt heat from the floor coming through their boots. At about six, a doorkeeper’s wife spotted the flames.",
      "The fire destroyed most of the medieval buildings, though Westminster Hall survived. The Prime Minister called it “one of the greatest instances of stupidity upon record.” The episode shows how an institution’s habits can outlive their purpose: a record-keeping system abandoned on paper still had to be physically disposed of, and the way it was done cost Parliament its home."
    ],
    "sources": [
      {
        "label": "The History of Parliament — Burning the House down: the fire of 1834",
        "url": "https://historyofparliament.com/2013/10/16/the-fire-of-1834/"
      },
      {
        "label": "Wikipedia — Burning of Parliament",
        "url": "https://en.wikipedia.org/wiki/Burning_of_Parliament"
      }
    ],
    "recall": {
      "prompt": "How did old wooden accounting records cause the 1834 fire at Westminster?",
      "reveal": "Obsolete Exchequer tally sticks were burned in coal furnaces below the House of Lords. The wood’s high flames started a chimney fire that spread through the old palace."
    }
  }
];
