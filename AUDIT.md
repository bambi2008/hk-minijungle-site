# Product Experience Audit

## GEO page-set combined audit — 2026-10-10

### Audit scope

- Surfaces: current Chinese/English About, product catalogue and Contact routes from the prerendered Sites build.
- Viewports: 1440 × 900 and 390 × 844 CSS px.
- Evidence: `output/playwright/geo-2026-10-10/about-desktop-hero.png`, `about-desktop-faq-fixed.png`, `about-mobile-menu.png` and `about-mobile-faq-fixed.png`.

### User goal and accessibility target

A commercial-space visitor should understand the current CANVIVA offer, obtain verified answers, recognise missing project information and reach an appropriate enquiry path. The review is WCAG 2.2 AA-oriented but is not a formal conformance claim.

### Strengths

- The current commercial CANVIVA positioning remains visually dominant; no retired consumer or home-growing proposition reappears.
- FAQ questions use native buttons with `aria-expanded`; changing questions transfers the expanded state and reveals the matching answer.
- The pending-materials state is visible as a distinct information block rather than being hidden in source notes or structured data.
- Product filters use real button pressed states, and SIGNATURE filtering reduces the visible catalogue to the expected one card.
- Mobile navigation exposes the same current information architecture, reflows to one column and has no horizontal overflow.

### UX risks

- Fixed during audit: the new pending-materials block initially inherited pale text intended for the dark homepage proof section, making it difficult to read on the light About section. A contextual light-section override now uses the existing forest and charcoal tokens.
- Vite's generic preview server returns the SPA root HTML for extensionless routes without a trailing slash. This produced a false hydration error during QA; the packaged Worker path was therefore exercised through a local Worker-compatible server and returned the correct route document.

### Accessibility risks

- No blocking issue was observed in the changed FAQ and pending-materials surfaces after the contrast correction.
- Full keyboard traversal, screen-reader announcements, zoom at 200–400% and instrumented colour-contrast measurement were not completed, so WCAG conformance is not claimed.

### Opportunity areas

- When approved product dimensions, performance evidence, pricing/lead-time guidance and service coverage arrive, replace the current pending list item by item rather than rewriting the whole section.
- Consider a future dedicated automated accessibility pass once the remaining approved content is present, so the result reflects the final copy length and states.

### Evidence limits and verification gaps

- Screenshots prove the checked visual states only. Playwright accessibility snapshots, DOM states, overflow checks and console logs cover the inspected flows but do not replace assistive-technology testing.
- The production form receiver remains outside this repository and was not configured or tested.
- The mandatory Codex Security scan could not start because the desktop workbench returned no scan ID.

### Recommendations

Keep the current layout and corrected contrast. Supply the visibly listed materials, then run the final accessibility and production endpoint checks before publication.

## Scope

- Surface: bilingual HK MINIJUNGLE marketing website
- Primary journey: discover the proposition → filter products → submit a relevant enquiry
- Accessibility target: practical WCAG 2.2 AA-oriented implementation; this report does not claim formal conformance
- Browser viewport: 1440 × 1024 CSS px

## Evidence and steps

1. **Homepage entry — healthy**  
   Evidence: `output/audit/01-home.png`  
   The proposition, two audience routes and concept-image disclosure are immediately visible. The transparent header remains legible over the image. The large display headline is visually dominant without obscuring the CTA pair.

2. **Product discovery and filtering — healthy**  
   Evidence: `output/audit/02-products-filtered.png`  
   Audience and platform-layer filters are grouped and use real button states (`aria-pressed`). Selected state has colour, border and focus treatment. Product development status and concept imagery are disclosed instead of implying market availability.

3. **Contact and validation — healthy with production-content dependency**  
   Evidence: `output/audit/03-contact-validation.png`  
   The form asks only for fields relevant to the selected enquiry type. Required-field errors are adjacent to fields and use programmatic invalid states. In the local build, submission is deliberately blocked from implying delivery when no endpoint is configured. The remaining dependency is real contact/legal copy and a production form endpoint.

## Strengths

- Clear B2B and B2C routes without creating separate brand experiences.
- Honest product-status and concept-visual labels reduce trust risk.
- Skip link, semantic regions, visible focus styles, native controls and reduced-motion styles are present.
- Locale switching preserves the current route.
- Responsive reflow was verified at 375, 390, 768, 1024 and 1440 px.

## Risks and limits

- Screenshot inspection cannot prove screen-reader announcements, full keyboard order or colour contrast ratios; these still need automated and assistive-technology testing before a compliance claim.
- Historical note: earlier audit runs recorded `[CONTENT REQUIRED]` placeholders; the Word revision pass replaced the rendered placeholders on the checked routes. Internal legacy content objects remain non-rendered.
- The local form has no production endpoint, so end-to-end delivery and abuse protection cannot yet be verified.

## Priority recommendation

Supply verified contact/legal/product facts and a form endpoint before production launch; then run automated accessibility tests plus a keyboard and screen-reader pass on the deployed build.

## Word revision page-set audit — 2026-08-23

1. **ESG route and navigation — healthy**  
   Evidence: `output/qa/esg-zh-hk.png`; the ESG navigation link is visible, the Hero remains readable over the image, and the page hierarchy moves from wellbeing rationale to evidence pack and CTA.
2. **Product/technology trust language — healthy**  
   Evidence: real-browser snapshots for `/zh-hk/technology/xponge` and `/zh-hk/technology/doctor-forest`; Xponge uses the supplied DualFlow framing, Doctor Forest explains the service loop, and removed validation/development labels do not appear in rendered content.
3. **Four-solution discovery — healthy**  
   Evidence: `/zh-hk/solutions`; compact workplace, hotel/club, fine dining and healthy-home cards use the supplied image set and all lazy images load after scrolling.
4. **Content cleanup — healthy**  
   Evidence: `/zh-hk/about`, `/zh-hk/privacy` and journal cards; no visible `CONTENT REQUIRED`, draft or formal-publication placeholder strings remain.

## Remaining limits

- This is a practical product/design audit, not a formal WCAG conformance claim. Screen-reader, keyboard-only and contrast tooling still require a dedicated pass.
- The form receiver remains optional and external to this repository; server-side validation, rate limiting, CORS/CSRF and retention require the selected endpoint.

## 网站修改意见new.docx page-set audit — 2026-08-23

1. **Editorial route hierarchy — healthy**  
   Journal index and article routes now expose the requested office-density, ESG, 固高, HKPC and co-creation stories with clear titles, excerpts and article bodies.
2. **Documentary image treatment — healthy**  
   Supplied office, group, wall, restaurant and home images use fixed assets and opt out of the concept badge where they represent supplied documentary imagery; generated concept imagery remains disclosed elsewhere.
3. **Solution discovery — healthy**  
   The four solution rows use the requested descriptions and the supplied image families. Lazy-loaded images were verified after a real browser scroll.
4. **Trust language — healthy**  
   Xponge has no rendered evidence/status badge on its detail route, and the checked pages contain no `待驗證`, `驗證中`, `開發中`, `內容待提供`, `CONTENT REQUIRED` or `編輯草稿` strings.

## Remaining limits

- The supplied Word file could be text/media-extracted but not rasterised page-by-page because Poppler is unavailable in the environment; visual document-layout comparison was not claimed.
- This remains a practical product/design audit rather than a formal WCAG conformance claim. Screen-reader, keyboard-only and contrast tooling still require a dedicated pass.

## Global plant library page-set audit — 2026-10-06

1. **Gardify information hierarchy — preserved**
   The implementation retains search, quick regional filters, result count, advanced sidebar filters, image-led cards, source-rich plant profiles and a photo-identification entry point. It deliberately does not copy Gardify branding, proprietary text or imagery.
2. **International collection model — healthy**
   Germany, the United States, Hong Kong, Mainland China, the United Kingdom and France are first-class filter values rather than footnotes. Region labels, local names, scientific names and source institutions remain visible.
3. **Trust and provenance — healthy**
   Every record exposes botanical sources plus photographer and licence attribution. The six-record release is labelled as a first-stage dataset and never presented as a complete global catalogue.
4. **Recognition state — accurate**
   Upload, preview, validation and result contracts are interactive, but the model state is prominently “not connected.” The browser sends no uploaded image to an external service.
5. **Responsive composition — healthy**
   Desktop uses a sticky search rail, two-column result grid and left filter column. Mobile keeps horizontal region chips, a bottom filter sheet and single-column cards with no horizontal overflow at 390×844.

Residual product limit: the architecture is ready for bulk import, but only six representative records are populated. Content licensing, deduplication, taxonomic reconciliation and editorial review remain required before claiming broad catalogue coverage.

## 香港公司的办公室室内绿化和ESG.docx page-set audit — 2026-08-23

1. **HKEX evidence hierarchy — healthy**  
   The ESG page separates disclosure mapping, research references, project evidence and certification routes rather than presenting planting as a standalone carbon or IAQ solution.
2. **Quantification and qualification — healthy**  
   Six supplied research-reference metrics are shown with named source labels and an explicit note that real projects need their own baseline, method and verification.
3. **Responsive and accessible table — healthy**  
   The three-column HKEX table remains readable in a focusable horizontal scroll region on mobile; cards and action/path layouts collapse to one column. The accessibility smoke check returned zero violations.

## Remaining limits

- The source DOCX was extracted successfully, but its page rasterisation could not run because the packaged LibreOffice/PDF dependency was unavailable; document visual-layout QA was not claimed.
- This remains a practical product/design audit rather than a formal WCAG conformance claim. Screen-reader and keyboard-only testing beyond the automated smoke check still require a dedicated pass.

## Interactive grass homepage Hero audit — 2026-09-29

1. **Brand hierarchy — healthy**
   At 1440×900 and 390×844, the logo, title, bilingual navigation and two decision CTAs remain legible over the darker grass/sky gradient. The interaction supports the proposition without replacing the brand message.
2. **Interaction scale — healthy**
   The field uses dense short blades and a bounded local gust, so pointer movement affects a small area rather than the whole frame. Text selection during drag was found in QA and removed.
3. **Responsive composition — healthy**
   Desktop retains open horizon space and depth; mobile stacks the CTAs while keeping the grass, sound control and interaction label within the first viewport without horizontal overflow.
4. **Progressive loading — acceptable with a limit**
   A color-matched fallback prevents a blank Hero while the lazy Three.js chunk initializes. The 68,000-blade mobile field becomes visible after roughly two seconds in the checked local environment, so future production performance work should target worker/off-thread generation or a lighter first-frame field.

This is a focused visual and interaction audit, not a formal WCAG conformance claim.

## 调整意见.docx page-set audit — 2026-08-23

1. **Founding story replacement — healthy**  
   The Journal card and article now share the supplied title, four-paragraph Chinese narrative and office image.
2. **ESG image composition — healthy**  
   The supplied office and meeting images are aligned in a two-column desktop row and collapse to one column on narrow screens; the DOM check confirmed equal top alignment.
3. **Trust and disclosure — healthy**  
   No prohibited validation, development or placeholder wording was visible on the checked ESG route. Existing concept labels remain governed by the shared image component.

## Remaining limits

- The DOCX could be extracted but not rasterised page-by-page because Poppler is unavailable; visual document-layout comparison was not claimed.
- This remains a practical product/design audit rather than a formal WCAG conformance claim. Screen-reader, keyboard-only and contrast tooling still require a dedicated pass.
