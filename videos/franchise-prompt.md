<context>
Apex Global Center (AGC) is a Singapore education group that sells district, city and country franchises: the franchisee runs the centre, Apex HQ supplies the trainers, the programs from partner institutions and a 90-day launch programme.
This film plays on social with sound, vertical, and at franchise shows. It must sell the model to a working adult who has never run a school.
Read `videos/BRAND.md` first. It holds the brief, the look, the claims and what is off limits (all prices). This prompt only adds the story.
</context>

<inputs>
Decided (v2): 1080x1920 and 1920x1080, 60 fps preview, 240 fps final, dark, 28 bars at 118.004 BPM, 56.947 s. Music: "Midnight Funk", Michael Ramir C., Mixkit Stock Music Free License, `public/audio/midnight-funk.mp3` (gitignored). Edit: song bars 3 to 31 (`src/film/edit.json`). Measured grid spread 4.2 ms.
</inputs>

<direction>
Confident, plain, specific. A business opportunity told like a product launch, never like an infomercial.
Ingredients: Apex mark as the one brand element across the film · big punchlines word by word, short labels in scenes · cuts on the beat, the mark travels between scenes, the 90 counter travels into the timeline header · real footage in framed cards, partner logo tiles, CTA end card.
Only the site's own surfaces: ink, paper, white logo tiles, orange accent, hairline rules, 2 px corners.
Banned: prices, fees, splits, royalty, profit, payback, naming a partner college in copy, "proven", "guaranteed", job placement, the unconfirmed site stats, em dashes, glows, gradients, particles, bouncy easing.
</direction>

<cast>
- The brand element: the Apex mark. Draws itself in bar 1, travels to center on the drop (bar 6), shrinks to a corner mark for the middle, returns for the end card.
- Cursors: none.
- Real material: Kingston International College events (QE Talk seminar, classroom session, milestone ceremony) from the site's own WhatsApp videos, and the graduation photo from the site's homepage.
</cast>

<structure>
118 BPM, 4/4, 28 bars (v2). Rendered twice from one scene set: vertical 1080x1920 and landscape 1920x1080 (src/film/layout.ts). One beat is 0.508 s, one bar 2.034 s. Something happens on every beat.

Bar 1, opening. The mark traces itself at the top and fills on beat 3. "Own an / education / business." lands word by word from 0.25 s.
Bars 2 and 3, the promise. "High quality & / extremely affordable / education." builds under it on eighths.
Bars 4 and 5, proof. Framed Kingston event footage cutting every two beats (class, one-on-one, seminar, certificate on stage). "Trainers come from Apex HQ." then "You run the business."
Bars 6 and 7, the drop. The mark travels to center, bell. "Open an Apex / Global Center / in your city." on eighths.
Bars 8 to 10, the network. A dotted world map, camera close on Singapore HQ; arcs fly to 31 office cities nearest first while the camera pulls back to the whole world. "Join the Apex network." The counter climbs to 40+ offices worldwide.
Bars 11 and 12, the students. "50,000+" counts up, "students on our online platform." Three columns of real certificate photos scroll past at different speeds.
Bars 13 and 14, product. Paper ground. "Programs from partner institutions", "Diplomas, degrees and master's programs." Six partner logo tiles pop one per beat.
Bar 15, the number. Ink ground. "90" counts up, "days of launch support from Apex HQ."
Bars 16 to 20, the programme. The 90 travels to the header. A rail fills over three bars; Month 1 Set up, Month 2 Train, Month 3 Open land one per bar, items on beats. Bar 19: "From signed contract to independent operation, in 90 days."
Bars 21 to 23, the tiers. "Start with a district. Grow from there." Four tiles land in bar 22, then the orange highlight climbs one tier per beat in bar 23.
Bars 24 and 25, the people. Eight graduation moments, one per beat, Kingston and ECU, photos pushing in slowly.
Bar 26, the promise. "Support from day one."
Bars 27 and 28, ending. The mark returns, "Apex Global Center", "Franchise enquiries", WhatsApp +65 9225 9877 and apexglobalcenter.com. Music fades over the last 1.4 s. (The VIFS 2026 card was removed on the product owner's request.)
</structure>

<gotchas>
Nothing important in the top 180 px or bottom 280 px (platform UI). Keep a slot for every word before it lands. Footage is 848x480 WhatsApp video: frame it in cards no wider than 920 px so it is never upscaled more than about 1.5x. Judge the encoded file, decode its pixels.
Not a loop: verify.py's seam check does not apply.
Every cut is reviewed by the product owner before it is posted.
</gotchas>

<start>
Overnight run, Sahi asleep: the beat sheet and three style frames were reviewed by Claude instead of waiting for an OK, and are in the morning report for Sahi to overrule.
</start>
