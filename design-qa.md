# Design QA

## Source of truth

- Selected direction: `C:\Users\ss\.codex\generated_images\01a01660-ceec-7fb3-b6e2-a70a92f17338\exec-244b52b9-3a82-405d-9bfa-3464a21946fd.png`
- Reference copy: `output/qa/selected-reference.png`
- Implementation capture: `output/qa/home-en-desktop-1440.png`
- Combined comparison: `output/qa/design-comparison-v3.png`

## Comparison setup

- Reference size: 864 × 1821 px
- Implementation state: `/en`, default home hero
- Browser viewport: 1440 × 1024 CSS px, device scale factor 1
- Comparison surface: `qa-compare.html`

## Findings and resolution

1. **P1 — header treatment:** the first implementation used an ivory header while the selected direction uses a transparent dark overlay. Fixed with the home-only overlay header and white navigation.
2. **P1 — headline scale:** the first Chinese hero crowded the navigation and image focal point. Fixed with locale-aware sizing and improved wrapping.
3. **P2 — small-screen overflow:** the GREENCANVAS title exceeded a 390 px viewport. Fixed with `min-width: 0`, safe wrapping and a mobile type cap.
4. **P3 — exact typeface:** the selected visual uses a specific editorial serif that was not supplied. The implementation uses a system serif stack to avoid an unlicensed or externally loaded substitute. This is acceptable for the local prototype and is documented for brand-font replacement.

## Surface checks

- Typography and hierarchy: passed
- Spacing and responsive reflow: passed
- Colour and dark/light section rhythm: passed
- Imagery, crops and concept labels: passed
- Navigation and CTA placement: passed
- Reference fidelity above the fold: passed

Final result: **passed**. No unresolved P0, P1 or P2 design defects.

## Brand and contact update — 2026-08-21

### Source and implementation evidence

- Source visual truth: `C:\Users\ss\Desktop\minijungle\品牌\hk minijungle logo.png`
- Installed asset: `public/images/hk-minijungle-logo.png` (32-bit transparent PNG, 1970 × 368 px)
- Recoverable source backup: `public/images/hk-minijungle-logo-white-bg.png`
- Full desktop implementation: `output/qa/brand-contact-home-desktop.png`
- Full mobile contact implementation: `output/qa/brand-contact-mobile.png`
- Focused mobile header implementation: `output/qa/logo-header-mobile.png`
- Source pixels: 2172 × 724.
- Desktop capture: 1254 × 7861 px at a 1254 px CSS viewport, device scale factor 1.
- Mobile contact capture: 390 × 3362 px at a 390 × 844 CSS viewport, device scale factor 1.
- Focused header capture: 390 × 69 px; rendered logo frame: 150 × 34 CSS px.
- States checked: Traditional Chinese homepage, Traditional Chinese contact page, English contact page, desktop and mobile navigation states.

### Full-view comparison

- The supplied wordmark remains legible and proportionally correct in both the header and footer.
- The supplied white/off-white background has been removed without redrawing the wordmark; the installed asset has genuine alpha transparency.
- Header, contact information and footer reflow without horizontal overflow at 390 px.
- Contact details display the approved email, WhatsApp identifier and 24h response time; the footer displays both telephone numbers and the locale-appropriate address.

### Focused comparison

- The source image and `output/qa/logo-header-mobile.png` were opened together in one comparison input.
- All letterforms, decorative flourishes, spacing and dark-green colour remain faithful to the supplied asset; the final mark is a deterministic background extraction rather than a redrawn logo.

### Required fidelity surfaces

- Fonts and typography: passed; the wordmark is the supplied raster artwork, while surrounding interface type remains unchanged.
- Spacing and layout rhythm: passed at desktop and 390 px mobile widths.
- Colours and visual tokens: passed; the supplied dark green remains unchanged and the background is transparent.
- Image quality and asset fidelity: passed; the 1970 × 368 installed asset reports `Format32bppArgb` and zero alpha at all four corners.
- Copy and content: passed for the newly supplied company facts in both locale routes.

### Findings and comparison history

- No P0, P1 or P2 differences were found in the first brand-asset comparison, so no corrective visual iteration was required.
- P3 follow-up: supply approved SVG, stacked and dedicated reversed brand variants. The current white rendering on dark surfaces is a CSS-filtered version of the official transparent PNG.
- Browser checks: meaningful content present, no Vite error overlay, no horizontal overflow, interactive elements discoverable, console error list empty.

### Transparent-logo update — 2026-08-21

- The built-in image-editing attempt was rejected during alpha-channel QA because it produced a flattened 24-bit checkerboard image rather than transparency.
- The final asset was extracted directly from the user-supplied official PNG, with anti-aliased edges preserved and isolated export noise removed; no wordmark shapes were regenerated.
- Desktop evidence: `output/qa/logo-transparent-about-desktop.png`, `output/qa/logo-transparent-home-overlay.png`, `output/qa/logo-transparent-footer-desktop.png`.
- Mobile evidence: `output/qa/logo-transparent-about-mobile.png`, `output/qa/logo-transparent-home-mobile.png`.
- Light headers render the original dark green; the home overlay and footer render the same transparent asset through a white CSS filter for contrast.
- Real-browser checks passed at 1440 × 1024 and 390 × 844 with no error overlay, no blank page and no horizontal overflow.

final result: passed

## Homepage CUISVIVA interactive product feature — 2026-09-29

### Source and implementation evidence

- Source visual truth: existing product-detail rotation at `http://127.0.0.1:4173/zh-hk/products/cuisviva-kitchen` using `public/images/cuisviva-spin-concept-v1-00.webp` through `-07.webp`.
- Implementation: homepage product section at `http://127.0.0.1:4173/zh-hk`.
- Browser evidence: same-call Codex in-app Browser comparison shown in this task as `spinSourceShot3` and `spinHomeShot2`; the browser surface did not expose writable screenshot paths.
- Viewport: 390 × 844 CSS px, device scale factor 1; document client width 375 px because of browser chrome/scrollbar.
- State: Chinese, menu closed, 0° default frame; source and implementation captures use the same eight-frame asset set.

### Full-view and focused comparison

- The homepage version preserves the original square stage, ivory background, forest concept badge, drag hint, progress marks, angle count and direction buttons.
- The new editorial copy panel uses the existing homepage typography, borders and paper palette; it does not imitate a different visual system or alter the product imagery.
- A focused comparison was required because the product stage and compact controls are the fidelity-critical surfaces. At 390 px they remain fully visible with no horizontal overflow (`scrollWidth=clientWidth=375`).

### Required fidelity surfaces

- Fonts and typography: passed; the existing serif product name, uppercase eyebrow and compact control labels remain consistent.
- Spacing and layout rhythm: passed at 1440×900 and 390×844; desktop uses a two-column editorial feature and mobile stacks copy over the stage.
- Colors and visual tokens: passed; existing paper, forest, grey and border tokens are reused.
- Image quality and asset fidelity: passed; the exact eight optimized WebP frames are reused, with no screenshot replacement or generated substitute.
- Copy and content: passed in Chinese and English; the component retains `概念效果圖 / Concept visualisation` and does not imply a confirmed engineering product.

### Interaction and comparison history

- First visual comparison found no actionable P0/P1/P2 mismatch, so no corrective visual iteration was required.
- Direction control changed `01 / 08 · 0°` to `02 / 08 · 45°`; horizontal drag changed the slider to frame 5; keyboard Right changed it to frame 6.
- Desktop mouse movement is mapped to local frame position; touch drag, direction buttons and keyboard input remain available.
- Browser console error/warn list was empty; no mobile horizontal overflow was present.
- P3 follow-up: final 36–48 frame turntable photography would make rotation smoother than the current eight concept frames.

final result: passed

## Homepage CUISVIVA H3 Hero video — 2026-09-20

### Source and implementation evidence

- Source visual truth: `public/videos/cuisviva-kitchen-h3-turbo-concept-v1.mp4` (MiniMax H3 Max Turbo result approved by the user; 1344×768, 5.184 seconds).
- Static loading/reduced-motion fallback: `public/images/cuisviva-hero-kitchen-concept-frame-01.png`.
- Real-browser implementation evidence: `output/qa/h3-hero-mobile.png` (577×731, English homepage, video playing).
- Checked routes: `/zh-hk` and `/en`; menu closed.

### Full-view and focused comparison

- The approved kitchen clip fills the existing Hero without changing the brand's forest/ivory visual system, typography, copy hierarchy or two CTA pattern.
- Mobile cropping keeps the CUISVIVA frame, herbs and hand action legible behind the dark overlay; headline, subtitle, both CTA controls and the disclosure remain visible.
- The clip tells the intended sequence—fresh herbs harvested from the countertop garden and brought toward a meal—while the product remains identifiable.

### Required fidelity surfaces

- Fonts and typography: passed; existing bilingual hierarchy and responsive wrapping are unchanged.
- Spacing and layout rhythm: passed at 577×731; no clipped control or horizontal overflow.
- Colours and visual tokens: passed; the warm kitchen footage remains compatible with the existing forest overlay and ivory controls.
- Image/video quality and asset fidelity: passed for a labelled concept video; browser reports 1344×768, readyState 4 and active playback.
- Copy and content: passed; `概念效果視頻 / Concept video` remains visible, so generated footage is not presented as customer evidence or final product photography.

### Findings and comparison history

- No P0, P1 or P2 visual issue was found in the real-browser pass.
- P3 residual: the 5.184-second MP4 is 9,242,499 bytes and has a perceptible loop boundary. A later production pass should use an approved shorter encode/WebM companion or real shoot when local encoding tools are available.
- Reduced-motion behavior remains source-backed: the video is hidden under `prefers-reduced-motion: reduce` and the poster frame stays visible.

final result: passed

## Homepage Hero concept image — 2026-08-22

### Source and implementation evidence

- Source visual truth: `C:\Users\ss\Desktop\9222673b-688c-49c0-a160-6049dcc42a6a.png` (1672 × 941 px).
- Desktop implementation: `output/qa/hero-user-concept-desktop.png` (1440 × 1024 px; Hero region 1440 × 780 CSS px; device scale factor 1).
- Mobile implementation: `output/qa/hero-user-concept-mobile.png` (390 × 844 px; Hero region 390 × 700 CSS px; device scale factor 1).
- Combined source/implementation input: `output/qa/hero-design-comparison.png` (source on the left, rendered desktop Hero on the right).
- State: `/zh-hk`, default homepage, menu closed.

### Full-view and focused comparison

- The combined comparison preserves the supplied dark text-safe wall, vertical living-wall focal point and Hong Kong harbour view. The implemented overlay is an intentional content treatment rather than source-image drift.
- Desktop uses the supplied central crop at `50% 50%`; mobile uses `62% 50%` so the planting system remains visible behind the headline.
- A focused mobile comparison was needed because responsive crop and text wrapping are the material fidelity risks. The 390 px capture shows both CTAs, the complete headline, the living-wall focal area and the concept label without horizontal overflow.
- The browser selected the 1672 px AVIF at desktop and the 640 px AVIF at mobile; JPEG fallback and WebP candidates remain available.

### Required fidelity surfaces

- Fonts and typography: passed; the existing brand hierarchy and Chinese line wrapping remain intact.
- Spacing and layout rhythm: passed at 1440 × 1024 and 390 × 844; no clipped controls or horizontal overflow.
- Colours and visual tokens: passed; the existing forest overlay preserves readable contrast while retaining the supplied warm stone, greenery and skyline palette.
- Image quality and asset fidelity: passed; the implementation uses the supplied raster image without generative alteration, with responsive AVIF/WebP encodes and an optimized JPEG fallback.
- Copy and content: passed; bilingual alt text identifies the image as a concept visualisation, and the visible `概念效果圖 / Concept visualisation` badge remains present.

### Findings and comparison history

- First comparison found no actionable P0, P1 or P2 mismatch, so no corrective visual iteration was required.
- Browser checks found meaningful content, no Vite error overlay, no horizontal overflow and correct responsive source selection.
- Primary interaction checked: the mobile menu opened successfully; Hero CTA links were present and keyboard-discoverable in the interactive snapshot.
- P3 follow-up: replace the image only if an approved real installed-project photograph becomes available; until then the concept label must remain.

final result: passed

## Xponge material image replacement — 2026-08-22

### Source and implementation evidence

- User-supplied material reference: `C:\Users\ss\AppData\Local\Temp\codex-clipboard-eae0bac9-5c52-435e-b27c-ceebab37f39d.png` (1180 × 664 px; beige porous texture).
- Recoverable original: `public/images/xponge-material-concept-original.png` (the previous 1536 × 1024 dark sponge composition).
- Installed composite: `public/images/xponge-material-concept.png` and optimized `public/images/xponge-material-concept.jpg` (1536 × 1024 px).
- Desktop homepage evidence: `output/qa/xponge-home-desktop.png` (1440 × 1024 px; scrolled to the Xponge material section).
- Desktop technology evidence: `output/qa/xponge-technology-desktop.png` (1440 × 1024 px; default page state).
- Mobile focused evidence: `output/qa/xponge-home-mobile-focus.png` (390 × 844 px; scrolled to the Xponge material section).
- State: `/zh-hk`, menu closed; source and implementation inspected together.

### Full-view and focused comparison

- Only the porous sponge material changed: the supplied beige texture replaces the previous dark texture while the leaf, droplets, lighting, perspective and overall composition remain intact.
- Desktop technology selected the 1536 px AVIF; the focused 390 px homepage selected the 640 px AVIF. WebP and JPEG fallbacks remain available.
- The generated scene continues to carry the visible `概念效果圖 / Concept visualisation` disclosure and is not represented as test evidence.

### Required fidelity surfaces

- Fonts and typography: passed; existing page hierarchy and overlay copy remain unchanged.
- Spacing and layout rhythm: passed at 1440 × 1024 and 390 × 844; no clipped content or horizontal overflow.
- Colours and visual tokens: passed; the warm beige material integrates with the existing leaf palette and overlay treatment.
- Image quality and asset fidelity: passed; the supplied material reference is composited into the existing leaf creative and delivered as responsive AVIF/WebP/JPEG derivatives.
- Copy and content: passed; alt text and concept disclosure remain accurate.

### Findings and comparison history

- No P0, P1 or P2 visual mismatches were found; no corrective visual iteration was required.
- Browser checks found meaningful content, no Vite error overlay, no horizontal overflow and correct responsive source selection on desktop and mobile.
- P3 follow-up: replace this concept visualisation only if an approved real installed-project photograph becomes available; keep the concept label until then.

final result: passed

## CUISVIVA KITCHEN product rotation — 2026-09-18

### Source and implementation evidence

- Source visual truth: `C:\Users\ss\AppData\Local\Temp\codex-clipboard-1f659e45-1923-4b90-a77c-e898731268f5.png` (the user's current CUISVIVA product-page screenshot) plus the supplied interaction reference `https://www.livelarq.com/purification/larq-bottle-purevis-2-obsidian-black?size=23oz`.
- Product-form reference: `public/images/cuisviva-kitchen-european.png` (1536×1024).
- Implementation route: `http://127.0.0.1:4173/zh-hk/products/cuisviva-kitchen`.
- Implementation evidence: Codex in-app browser captures displayed in this task at 1440×1000 and 390×844. The browser surface does not expose a writable screenshot path; the rendered frames themselves are saved as `public/images/cuisviva-spin-concept-v1-00.webp` through `-07.webp`.
- State: Chinese desktop default 0°; Chinese mobile drag state 225°; English mobile default 0°.

### Full-view and focused comparison

- The new section preserves the site's existing ivory paper, forest green, serif headline, square controls and editorial spacing rather than cloning LARQ's visual brand.
- The interaction pattern follows the selected reference: a large isolated product stage, direct horizontal manipulation, compact previous/next controls, progress and angle feedback.
- Focused browser checks covered the active frame, concept label, drag hint, progress row and mobile controls. The 390px capture confirms all controls fit without horizontal overflow; the 1440px capture confirms the intended text/product split.

### Required fidelity surfaces

- Fonts and typography: passed; existing brand hierarchy, optical weight and Chinese wrapping are preserved.
- Spacing and layout rhythm: passed at 1440×1000 and 390×844; the component uses the existing page shell and section rhythm.
- Colors and visual tokens: passed; forest, paper, clay warning and border tokens match the current site system.
- Image quality and asset fidelity: passed for a concept prototype; all frames are real raster assets generated from the existing product reference, 1536×1024 and optimized as WebP. They are not substitutes for final engineering views.
- Copy and content: passed; interaction guidance, concept disclosure and the exact missing-material list are visible in both locales.

### Findings and comparison history

- First browser comparison found no actionable P0/P1/P2 visual mismatch.
- React review identified a performance issue before handoff: the initial eight PNGs totaled about 13.6 MB. They were converted to eight WebP frames totaling 487 KB, the component was updated, and browser/build checks were repeated.
- Primary interactions tested: next/previous control, keyboard right arrow and horizontal drag. Console error list was empty.
- P3 follow-up: replace generated concept frames with a 36–48 frame same-object turntable shoot or approved 3D render to achieve genuinely continuous motion and remove angle-to-angle generative detail drift.

final result: passed
