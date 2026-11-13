---
name: ad-creatives
description: 'Plan and build Facebook and Instagram ad creatives that cannot embarrass the owner: formats and safe zones per placement, nothing cropped, text readable on a phone, sound only on purpose, one message per ad, honest claims within Meta''s rules, a landing page that repeats the promise, a naming scheme and a test matrix; turn raw video into short ad cuts; always a preview before anything is created, and ads are created paused. Use for "neue Creatives", "ich bin bereit, neue Creatives zu testen", "Anzeigenbilder", "Anzeigentext", "aus dem Video Anzeigen schneiden", "Reels-Anzeige", "Bild oder Video?", "new ad creatives", "cut ads from this video".'
---

# Ad creatives

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

vocavo does not run ads. Ads are built through the owner's ads connector (another vendor's MCP server in the same Claude): look through your tools for one that lists campaigns, ad sets and ads and can upload images or videos and create creatives and ads. None: say so in two sentences (see `start-here`) and still plan and preview the creatives.

Format, safe zone and claim details: `reference.md` in this skill's folder.

## 1. Questions, one at a time

Each with a proposed answer from what you already know (`manage-account` `get-playbook`, the landing page, the ads connector's insights per ad and `manage-leads` `summary` with `group_by: "utm_content"`):

1. Which offer and which landing page? The page must exist and its latest `manage-quality` `get-report` must pass after its last change; else `page-quality` first.
2. Which hypothesis does this round test? One sentence: "Ein Hook über das Problem bringt günstigere Leads als einer über das Ergebnis." From data when there is some: the winning ad's angle, the question leads ask, a page test result.
3. What material is there: photos, screenshots, raw videos, testimonials with permission? Never stock people pretending to be customers.
4. Placements: feed, stories and reels, or all (default: all, with a version per aspect ratio).

## 2. Plan the round

**One message per ad.** Hook (first line or first three seconds), proof (a real fact from the owner), call to action that matches the page. The landing page's headline repeats the ad's promise in the same words; if it does not, change the page (with a yes) or the ad.

**Test matrix: change one thing at a time.** One round varies one dimension (hook, or format, or visual), everything else equal. Image or video is decided by data, not taste: put an image and a video version of the same message side by side in the same ad set. Two to four ads per ad set.

**Naming** (carries the hypothesis and the format, and becomes the UTM values through `launch-campaign`):

- campaign: `<offer>_<goal>_<yymm>`, e.g. entsperrung_leads_2611
- ad set: `<audience>_<placements>`, e.g. amazonseller_alle
- ad: `<hypothesis>_<format>_<version>`, e.g. h1schmerz_vid916_v1, h1schmerz_img45_v1

Lowercase letters, digits and underscores only; the same spelling everywhere.

## 3. Build each creative

Rules (details in `reference.md`):

- **Formats:** feed 4:5 (1080×1350; 1:1 1080×1080 when the visual needs it); stories and reels 9:16 (1080×1920). Make a real version per ratio; never let Meta crop.
- **Safe zones in 9:16:** nothing important in the top 14 % or the bottom 35 % (the reels limit; it also covers stories), where name, buttons and caption sit.
- **No cropped faces, heads or text**, no element cut by the edge or a safe zone. Logos and badges never cover the subject or a call to action.
- **Legible on a phone:** few words on the image, large type, strong contrast; read it at phone size before showing it.
- **Sound only on purpose:** no music under a still image unless the owner chose it; under spoken video only quiet music that never competes with the voice, and only licensed music (Meta's sound collection or the owner's licence). Spoken video always with burned-in captions (most watch muted). Adding music needs a tool that can render audio; without one, the music choice goes into the cut list for the editor.
- **First three seconds** carry the hook: a face, a movement, the problem in words. No logo intro.
- **Claims:** only facts the owner can prove, in their wording. No invented results or numbers. Income or earning claims ("10.000 € im Monat mit Arbitrage") are not used without the owner's proof and wording, and even then Meta may reject them as business-opportunity claims. Never address personal attributes ("Bist du verschuldet?", "Hast du dein Konto verloren?" addressed as a fact about the viewer); write about the topic instead ("Amazon-Konto gesperrt? So geht es weiter.").
- Ad text: primary text with the hook in the first 125 characters, a headline up to about 40 characters, a call-to-action button that matches the page (Mehr dazu, Jetzt anmelden).

## 4. Raw video into ad cuts

1. Get the video (a file in this session or a link) and a transcript with timestamps (the owner's, YouTube's own transcript they copy for you, or one you make if you have a transcription tool). A link alone is not access to the video: say plainly when you cannot open or watch it, and ask for the transcript. Never write a timestamp you did not read in a transcript.
2. **Cut list**: per cut the hook (0–3 s), proof and call to action, each with start and end timestamps from the transcript, length 15–45 s, the caption text, the ratio, music if chosen. Show it as a table and ask which cuts to make.
3. **Cutting.** If this session has a shell with video tools (check, for example, whether ffmpeg runs), cut, reframe to each ratio with the subject centred, burn in captions, and show the results. If not (Claude Desktop without a shell, ChatGPT), say so plainly and hand the cut list to the owner or their editor. Never claim a cut exists that you did not render.

## 5. Preview, then create paused

1. **Preview for the owner**, per ad: the image or a frame of the cut (or, when the file does not exist yet, a description of the visual and who makes it), primary text, headline, button, landing page URL, placement, name. Wait for the thumbs up per ad. An ad whose image or video does not exist yet waits for the file; the round starts when every version of the matrix has its file, so image against video stays comparable.
2. Ask separately: "Soll ich diese <n> Anzeigen pausiert in eurem Werbekonto anlegen?" With that yes, through the ads connector: read the ad account first (existing campaigns, ad sets, the page and Instagram account, the dataset or pixel), upload the images and videos, create the creatives and ads **paused** in the agreed ad set, with the landing page URL and the URL parameters of `launch-campaign` (`utm_campaign={{campaign.name}}`, `utm_content={{ad.name}}`) so every lead is attributable. No campaign or ad set yet: `launch-campaign` creates them and agrees the budget.
3. Show what was created (names, ids, status paused) and ask whether to switch them on. Switching on is its own yes, unless the playbook's "ads-create" scope covers it.

## Never

- Creating anything in the ad account before the owner saw the preview.
- Creating an ad that is not paused, or switching one on without a yes or the playbook's scope.
- Music under a still image, cropped faces, text in the safe zones, a badge over a button.
- An invented number, testimonial or result; an income promise without proof.
- Pretending a video was cut when there is no tool for it.
