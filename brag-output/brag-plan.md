# /brag-slim plan: Apex Global Center franchise

Run: 2026-09-27, overnight, on Opus 5.5, so `/brag` handed off to `/brag-slim` as its dispatch rule says.
Input: website, the rebuilt AGC site on http://localhost:4322 (design branch). Format: vertical 1080x1920, 30 fps. Duration: 20 s.
Tone: `app-store` (clean feature cards, smooth slides), light ground so it reads differently from the product-film cut.
Product owner's brief: attractive to franchisees, show the tiers and the 3-month support, **no prices**.

## Inspect: the answers
- **What is it?** A franchise to open an Apex Global Center, an education centre selling programs from partner institutions.
- **Who is it for, and what does it do for them?** Working adults and entrepreneurs who want a business of their own but have never run a school. Apex HQ supplies the trainers, the programs, staff recruitment and 90 days of launch support.
- **What sets it apart?** You do not teach. HQ does the teaching and the launch; the franchisee runs the business.
- **Most impressive claim that is true?** "From signed contract to fully independent operation, in 90 days." (Apex's own revised franchise plan.)
- **Visual hook?** Big type on paper, the orange Apex mark, one real graduation photo.
- **Real UI or flow to show?** The site's own identity: Apex Editorial tokens (ink `#0F1416`, paper `#F1F0EC`, orange `#FF6702`), Helvetica Neue bold, flat 2 px cards, the real graduation photo from the homepage hero, the site's headline "Open an Apex Global Center in your city."
- **Tone?** app-store: calm, clean, confident. No jokes, this is a money decision.
- **One-line caption?** Run an education business without teaching a class.

## Angle
The division of labour. You run the business, Apex does everything a first-time owner is scared of: teaching, programs, hiring, the launch.

## Storyboard (Simon Says, 120 BPM, bar = 2 s)
| Time | Scene | On screen | Motion | Sound |
|---|---|---|---|---|
| 0.0 to 3.6 | Hook | "Run an education business." then "We handle the teaching." (orange) | words land one by one on eighths | music in on the downbeat |
| 3.6 to 6.0 | Reveal | Graduation photo slides up into the top half; Apex mark, "Apex Global Center", "Open one in your city." | stagger: old out, then photo, then lockup | soft impact on the photo |
| 6.0 to 10.0 | Highlight 1 | Card "What Apex HQ gives you": Trainers from Apex HQ · Programs from partner institutions · Staff recruitment and screening · Local launch marketing | one row ticks in per half bar | soft click per tick |
| 10.0 to 14.0 | Highlight 2 | "From contract to grand opening in 90 days." Three segments fill: Month 1 Set up · Month 2 Train · Month 3 Open, then "Then it's yours to run." | segments fill in turn | click per month |
| 14.0 to 17.0 | Highlight 3 | "Start with a district. Grow from there." A staircase: District · City · Country · HQ (by invitation) | one step per beat, climbing | light slide per step |
| 17.0 to 20.0 | Outro | Mark, "Apex Global Center", "Franchise enquiries", WhatsApp +65 9225 9877, apexglobalcenter.com | lockup lands, holds | bell on the mark |

## Claims check
- No prices, fees, splits, royalty or profit. (product owner)
- No "proven", no guarantees, no job placement. (pitch_playbook, deck_standard)
- Reviewed by the product owner before posting.

## Build
Remotion, in the same workspace as the product-film cut (`src/brag/Brag.tsx`), since it was already on the machine. Every frame a pure function of time. Music cut on bars with the product-film `audio-edit.py` so the cut lands on a downbeat. Stills of every scene and mid-transition before the full render.
