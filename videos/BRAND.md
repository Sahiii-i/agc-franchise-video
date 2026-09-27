# Apex Global Center video kit

The look, rules, assets and code for every Apex Global Center (AGC) film. Each film prompt points here and only adds its story.
Sources: the rebuilt AGC site (design branch, served on localhost), its `src/styles/global.css` ("Apex Editorial" tokens), Apex's internal franchise notes (tiers, the revised 90-day plan, the pitch playbook), the house deck standard and the product owner's answers on 2026-09-27. When this file and those sources disagree, the sources win.

## The brief (from the interview, 2026-09-27)
- Plays: social, with sound (WhatsApp, Instagram, TikTok, franchise show screens, VIFS 2026 in Ho Chi Minh City). Format: **9:16, 1080x1920**. Length: about 59 s (v2).
- Audience: prospective franchisees. Pitch playbook: white-collar working adults and entrepreneurs who want a business of their own, not full-time educators.
- Music: "Midnight Funk", Michael Ramir C., Mixkit Stock Music Free License (social posts and online ads, no attribution; not TV, radio, CDs or games). Cut on bars with `scripts/audio-edit.py`.
- Must show: **the four franchise tiers and the 3-month (90-day) launch support.** Sahi: make that attractive.
- **No prices.** No licence fee, no revenue split, no royalty, no profit or payback figures. (Product owner, 2026-09-27.)
- **v2 notes (product owner, 2026-09-27):** the hook carries "High quality & extremely affordable education"; show the 40+ office network on an animated world map and the 50,000+ students on the online platform right after "Open an Apex Global Center in your city"; use Kingston event footage and certificate photos freely, ECU included; end on a VIFS 2026 card.
- Ingredients (defaults chosen overnight, Sahi to overrule): brand element = the Apex mark drawing itself; words = big punchlines word by word plus short labels; transitions = cuts on the beat plus one travelling element (the tier tile); extras = real event footage in framed cards, partner institution logos, a CTA end card.
- Ending: WhatsApp +65 9225 9877 and apexglobalcenter.com (both public on the site).

## Hard rules
- No em dashes anywhere. (house style)
- Plain and measured, no superlatives: never "proven", "highly achievable", "game changing", "guaranteed". (pitch_playbook, "Writing to prospects")
- No job placement or outcome promises. (deck_standard claims discipline, pillars.json comment)
- Casing: sentence case for lines, uppercase only for small eyebrows with 0.14em tracking. (global.css `.eyebrow`)
- Type: Helvetica Neue, bold 700 for headings, letter spacing about -0.03em on display sizes. (global.css)
- Corners: 2 px radius. Flat surfaces, no shadows, thin rules. (global.css `--radius`, `--rule`)
- Surfaces: ink `#0F1416` and paper `#F1F0EC`, with white tiles for logos (PartnerWall). No gradients, glows or particles.

## Frame (1080x1920, 60 fps preview, 240 fps final with motion blur, dark)
- Framing: full bleed ink ground, content inside 80 px side margins, nothing important in the bottom 280 px (platform UI) or top 180 px.
- Words: punchlines 120 to 150 px bold, accent words in orange. Labels 44 to 56 px. Eyebrows 30 px uppercase tracked.

## Color
| Token | Value | Use |
|---|---|---|
| background (ink) | `#0F1416` | main ground |
| ink 2 | `#1A2225` | lifted tiles on ink |
| paper | `#F1F0EC` | foreground text on ink, light scenes |
| paper 2 | `#E7E5DF` | rules on paper |
| accent | `#FF6702` | brand mark, accent words, progress |
| accent ink | `#C24A00` | accent text on paper |
| muted | `#6B7578` | secondary text |
| rule on dark | `rgba(241,240,236,0.18)` | dividers |

## Type
- Helvetica Neue (macOS system font, same stack as the site). No web font needed on this Mac.

## Signature elements
| Element | Look | Source | In films |
|---|---|---|---|
| Apex mark | orange "a" ring with a stem, single path | `src/assets/brand/logo.svg` | draws on as an outline, then fills |
| Eyebrow | 12 px uppercase, 0.14em tracking, orange on dark | global.css | scaled to 30 px |
| Partner tiles | flat tiles, logo centered | PartnerWall.astro | white tiles, 2 px radius |
| Rules | 1 px hairlines | global.css | between list rows |

## Components
| Need | Source | In films |
|---|---|---|
| Header lockup | Header.astro (mark + "Apex Global Center") | redraw: the site is Astro, not React, so nothing imports as is |
| Partner wall | PartnerWall.astro | redraw with the same tile rules |
| Photos and footage | the site's images and videos, Apex's photo library | real material only: Kingston event videos (QE Talk seminar, classes, milestone ceremony), graduation photos from Kingston and European City University, and 30 trainee certificate photos from the online platform. The 15 s program clips look AI generated and are not used. |

## Claims
- What the films may show: 40+ offices worldwide and 50,000+ students on the online platform (both confirmed by the product owner, 2026-09-27), "High quality & extremely affordable education" (the product owner's line), four tiers (District or Sub Franchise, City or Province, Country or Master Franchise, HQ by invitation), exclusive territory by district, an upgrade path between tiers, the 90-day launch programme month by month, trainers supplied by Apex HQ, programs from partner institutions, HQ-led staff recruitment and local lead generation in month 1.
- What they must not show: any price, fee, split, royalty, profit, payback period, the unconfirmed site stats (100K+ learners, 5000+ clients, 10K+ careers), "proven", job placement. Do not name a partner college in the copy; a logo in a photo backdrop is fine.
- Approved lines (Apex's own words): "Open an Apex Global Center in your city." (site pillar heading). "From signed contract to fully independent operation, in 90 days." (Franchise revised plan deck).
- Human approval: every cut is reviewed by the product owner before it is posted.

## Workspace
- `~/GitHub/agc-franchise-video/`, its own package (the site is Astro, so there are no React components to share).
- Remotion 4.0.529, pinned exact. React 19. Bun as a local dev dependency (global install needs root). uv from pip.
- Fonts: system Helvetica Neue.
- Scripts: `scripts/beats.py`, `audio-edit.py`, `stills.ts`, `render.ts`, `verify.py` from product-film 1.1.0.
- Music and footage are not committed.
