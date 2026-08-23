# QA Report

## Release verdict

Local prototype: **passed**. The Word revision is implemented and verified locally; the Vercel production alias was not changed in this turn.

## Coverage

- 52 bilingual routes checked across English and Traditional Chinese.
- Home, product index/detail, solution index/detail, technology/proof, journal/article, about, contact, legal and 404 templates checked.
- Viewports: 375, 390, 768, 1024 and 1440 px.
- Core interactions: desktop product menu, mobile menu, product filters, locale switch, contact validation and unconfigured submission.
- No horizontal overflow remained after the GREENCANVAS mobile-title fix.
- Browser console: no application errors in the checked flows.

## Visual and product evidence

- Design comparison: `output/qa/design-comparison-v3.png`
- Product audit: `AUDIT.md`
- Design QA: `design-qa.md`
- Homepage evidence: `output/audit/01-home.png`
- Filter evidence: `output/audit/02-products-filtered.png`
- Validation evidence: `output/audit/03-contact-validation.png`

## Build and tests

- `npm run build`: passed; Sites-ready client, worker and hosting manifest produced.
- `npm run test:sites`: 4 passed, 0 failed.
- Worker behavior confirmed for existing assets, SPA fallback, API/write misses and required packaging files.

## Vercel deployment verification

- User explicitly approved Vercel login and deployment.
- Authenticated Vercel account: `bambi2008`; linked project: `bambi2008s-projects/hk-minijungle-site`.
- Public alias: `https://hk-minijungle-site.vercel.app`.
- Immutable deployment URL: `https://hk-minijungle-site-quyqnbytl-bambi2008s-projects.vercel.app`.
- Deployment ID: `dpl_HV7Das8cuBJorTBpegmKS95FgWAm`; inspected status: `Ready`.
- Vercel CLI automatically assigned this first project deployment to the Production target although the deploy command did not include `--prod`.
- Unauthenticated request to `/zh-hk`: HTTP 200.
- Authenticated deployment checks: `/zh-hk` and `/en/products` returned the SPA document; `/images/hero-workspace-concept.png` returned HTTP 200 with `image/png` and the expected 5,414,126-byte payload.
- `vercel.json` pins `npm run build`, publishes `dist/client`, and supplies the SPA rewrite to `index.html`.
- No custom domain, Git commit, push, or repository connection was performed.

## Security

- Standard static scan completed with full declared coverage.
- Severity: 0 critical, 0 high, 0 medium, 4 low in the original scan snapshot.
- The report covers conditional contact URL forwarding, permissive SPA fallback semantics, loopback development-server exposure and deployment-header defense in depth. The first three are patched in the current working tree; baseline Vercel headers are now defined.
- No executable DOM sink, open redirect, committed secret, authentication bypass, database or command-execution surface was found.

## Production blockers

1. Configure and verify the contact service, spam protection, retention policy and error monitoring.
2. Review the four low findings recorded for the original security-scan snapshot; the contact URL, SPA fallback and Vite listener items are patched in the working tree, while hosting-header coverage depends on the worker host.
3. Run automated accessibility checks plus keyboard and screen-reader testing on the deployed origin.

## Brand and company-data update — 2026-08-21

- Confirmed public origin: `https://hkminijungle.com`.
- Installed the user-supplied official horizontal PNG logo in the header and footer without recreating or modifying the artwork.
- Confirmed and published the legal Chinese and English company names, bilingual address, enquiry email, two telephone numbers, WhatsApp identifier and 24h response time.
- Updated canonical, Open Graph and alternate-language metadata to use the confirmed public origin.
- Production build passed; Sites worker tests passed 4/4.
- Real-browser checks passed on the Chinese homepage and Chinese/English contact pages at desktop and 390 px mobile widths.
- Browser evidence: no blank page, no error overlay, no horizontal overflow and no recorded console errors.
- Remaining brand-asset gap: approved SVG, stacked and reversed logo variants have not yet been supplied.
- User approved deployment on 2026-08-21. Preview deployment `dpl_BJTPwn4UTx6gxwaaczsLR74FY8LT` reached `Ready`, passed route, asset and compiled-content checks, and was then promoted to production.
- Current production deployment: `dpl_4kWb5WLFuQgv6xsdB37MsGx6X71P`; status `Ready`; alias `https://hk-minijungle-site.vercel.app`.
- Post-promotion checks: public `/zh-hk` and `/en/contact` returned HTTP 200; the official logo returned HTTP 200; the production bundle contained the approved email, WhatsApp identifier, both telephone numbers, Chinese address and confirmed domain.
- Vercel returned no runtime logs for this static deployment. The installed CLI does not expose a `drains` subcommand, so external log-drain configuration could not be confirmed from the CLI.

## Xponge material image replacement — 2026-08-22

- Replaced the previous dark sponge in the Xponge concept composition with the user-supplied beige porous material while preserving the existing leaf, droplets, lighting and composition.
- Preserved the previous source as `public/images/xponge-material-concept-original.png`; the installed composite remains explicitly labeled as a concept visualisation and is not test evidence.
- Added responsive AVIF/WebP candidates at 640/960/1280/1536 widths plus an optimized JPEG fallback. Homepage and Technology page use fixed same-origin paths through the shared `ImageFrame`/`PageHero` pipeline.
- Real-browser evidence: `output/qa/xponge-home-desktop.png`, `output/qa/xponge-technology-desktop.png`, and `output/qa/xponge-home-mobile-focus.png`. Desktop selected the 1536 AVIF; mobile selected the 640 AVIF. No blank page, error overlay or horizontal overflow was observed.
- `npm run build` passed; `npm run test:sites` passed 4/4.
- Standard security scan `cc63f9f5-13a6-4d35-97d4-53813d7b5feb` completed with full coverage: 0 critical, 0 high, 0 medium and 1 low pre-existing Vite development-listener finding. The Xponge assets and PageHero plumbing introduced no reportable issue. TAC status was `not_granted`.

## Production deployment — 2026-08-22

- User explicitly approved deployment after confirming the local Hero and Xponge changes.
- Vercel deployment `dpl_5VVRfsmhMXkrMfXEKwdrqStGyyHw` reached `READY` on the Production target. Deployment URL: `https://hk-minijungle-site-uyooro25j-bambi2008s-projects.vercel.app`.
- The project alias `https://hk-minijungle-site.vercel.app/zh-hk` returned HTTP 200 after deployment. Its bundle contains the new Hero living-wall references and Xponge responsive/JPEG references.
- Post-deploy asset checks returned HTTP 200 for `/images/hero-living-wall-hong-kong-concept-640.avif`, `/images/xponge-material-concept-640.avif` and `/images/xponge-material-concept.jpg`.
- Vercel remote build completed with the existing `npm run build` pipeline. No rollback was required. Custom-domain DNS was not re-verified in this step.

## Custom-domain binding — 2026-08-21

- Added `hkminijungle.com` to Vercel project `bambi2008s-projects/hk-minijungle-site`.
- Vercel project verification: passed.
- DNS configuration: pending at the Namecheap registrar.
- Current apex record: `A @ 192.64.119.90` (Namecheap parking).
- Vercel-required apex records: `A @ 216.198.79.1` and `A @ 64.29.17.1`.
- Current nameservers remain `dns1.registrar-servers.com` and `dns2.registrar-servers.com`; no nameserver change was performed.
- The `www` record was not changed and still points to `parkingpage.namecheap.com`.
- Final HTTPS and routing verification must run after the registrar DNS records are updated and propagated.

## Transparent-logo update — 2026-08-21

- Replaced the locally installed white-backed wordmark with a 1970 × 368 transparent PNG derived directly from the supplied official artwork.
- Preserved the original installed asset as `public/images/hk-minijungle-logo-white-bg.png`; the reproducible extraction script is `scripts/make-logo-transparent.ps1`.
- Alpha verification passed: `Format32bppArgb`, with alpha 0 at all four corners. A flattened checkerboard result from the built-in image editor was rejected and never installed.
- Removed the CSS white plate and crop transform. Light headers use the original dark green; the home overlay and footer use a CSS-filtered white rendering of the same transparent asset.
- Production build passed and Sites worker tests passed 4/4.
- Real-browser QA passed on the Chinese About and Home routes at 1440 × 1024 and 390 × 844. No blank page, Vite error overlay or horizontal overflow was observed.
- Evidence: `output/qa/logo-transparent-about-desktop.png`, `logo-transparent-home-overlay.png`, `logo-transparent-footer-desktop.png`, `logo-transparent-about-mobile.png`, and `logo-transparent-home-mobile.png`.
- Full-story verification passed for the asset-to-component-to-responsive-render flow; no API or data boundary is involved.
- Standard security scan `e129f9cf-7ccc-4d8c-b985-7b093564ee21` completed with 0 critical, 0 high, 0 medium and 1 low finding. The low finding is the pre-existing Vite development listener on `0.0.0.0`; it was not introduced by the logo change and does not affect the static production build.
- Production was not redeployed because this turn did not include new deployment approval.

## Product naming, scene imagery and full-screen Hero — 2026-08-22

- Product-family index now shows only `生命畫境 / CANVIVA` and `鮮香植園 / CUISVIVA KITCHEN`; status badges are absent from product cards and detail Hero. Xponge and DR FOREST remain discoverable under Technology.
- Contact fallback now shows the approved email and WhatsApp handle only; the `预计回覆 / Expected response` row is absent.
- New generated scenes are installed at `public/images/canviva-hong-kong-office.png` and `public/images/cuisviva-kitchen-european.png` and are labelled as concept visualisations.
- Desktop browser measurement: Hero `720px` high at a `720px` viewport. Mobile browser measurement: Hero `844px` high at an `844px` viewport. The Hero image, overlay, headline and both CTAs remained visible; no horizontal overflow or console errors were observed.
- Xponge Technology detail rendered the new material-layer explanation including interconnected micro-pores and root-zone air/moisture framing; no product status badge or response-time line appeared on the product detail surface.
- `npm run build`: passed (4,573 modules transformed). `npm run test:sites`: 4 passed, 0 failed. Local resource checks returned HTTP 200 for the homepage, Hero JPEG and both generated PNG assets.
- Browser console: no warning or error entries in the checked flows.
- Security: standard scan `75d406dc-4428-4726-92b0-f6f15b58b421` completed with 0 reportable findings and complete declared coverage. Preflight carried a reduced-capacity warning (4 active slots versus the suggested 6); TAC status was `not_granted`. The scanner warned that documentation edits made while it ran were outside its original snapshot; source/assets were already present before the scan began.

## Production deployment — 2026-08-22 (Hero full-screen and product updates)

- User approved deployment.
- The initial prebuilt attempt returned `NOT_FOUND` on the public alias because `.vercel/output` was an older Sites artifact and did not match the repository's Vercel output configuration. It was not left as the final state.
- A normal Vercel remote build using the linked `vercel.json` completed successfully: `dpl_29PS9jzVqLPFyvvajcybvbc31sFN`, target `production`, state `READY`.
- Real-browser production check at `https://hk-minijungle-site.vercel.app/zh-hk`: Hero measured `720px` at a `720px` viewport, used the new Hero JPEG, and loaded without console warnings/errors.
- Real-browser production check at `/zh-hk/products`: names `生命畫境` and `鮮香植園`; assets `/images/canviva-hong-kong-office.png` and `/images/cuisviva-kitchen-european.png`; 0 product-card status badges; no `預計回覆` copy.
- The live browser tab was left on the published homepage. No DNS records were changed.

## Homepage Hero concept image — 2026-08-22

- Replaced only the homepage Hero with the user-supplied 1672 × 941 Hong Kong living-wall concept visualisation; other pages and existing image usages were left unchanged.
- Added responsive 640/960/1280/1672 AVIF and WebP candidates plus an optimized 174,729-byte JPEG fallback. Desktop selected the 1672 AVIF; 390 px mobile selected the 640 AVIF.
- Desktop crop passed at `50% 50%`; mobile crop passed at `62% 50%`. The headline, both CTAs, planting focal point, Hong Kong skyline and concept badge remain visible as intended.
- Accessibility passed for the changed surface: locale-aware alt text explicitly identifies a concept visualisation; intrinsic image dimensions and high eager-image fetch priority are present.
- Real-browser QA passed at 1440 × 1024 and 390 × 844: meaningful content, no Vite error overlay, no horizontal overflow and working mobile-menu opening.
- Design comparison evidence: `output/qa/hero-design-comparison.png`; desktop and mobile evidence: `output/qa/hero-user-concept-desktop.png` and `output/qa/hero-user-concept-mobile.png`.
- Production build passed; Sites worker tests passed 4/4. React best-practices review found no new issue after source descriptors were hoisted to module scope.
- Full-story verification passed for fixed asset source → responsive `<picture>` selection → browser render. No API, database or external data boundary is involved in this change.
- Standard security scan `6bd8dcde-1bc1-4b51-a367-7f6c4faf7493` completed with no Hero-related finding. One pre-existing low finding remains: the Vite development server defaults to `0.0.0.0`; static production output is unaffected.
- Production was not redeployed because this turn did not include new deployment approval.

## Word revision implementation — 2026-08-23

- Scope: Word document copy and structure changes across Doctor Forest, Xponge, CANVIVA, ESG support, four solutions, About, Journal and baseline Legal pages.
- Browser routes checked locally with `npx --yes agent-browser`: `/zh-hk`, `/en/esg`, `/zh-hk/esg`, `/en/technology/xponge`, `/zh-hk/technology/xponge`, `/zh-hk/technology/doctor-forest`, `/zh-hk/solutions`, `/zh-hk/about` and `/zh-hk/privacy`. No error overlay appeared and no prohibited placeholder/status strings were found in rendered bodies.
- Interaction: homepage Products menu opened with `aria-expanded=true` and exposed CANVIVA / CUISVIVA product links.
- Image loading: solution images reported `complete=true` and nonzero natural widths after scrolling; CANVIVA co-creation lazy image loaded after scroll.
- Visual evidence: `output/qa/esg-zh-hk.png` shows the new ESG Hero and navigation in the local browser.
- Build: `npm run build` passed; `npm run test:sites` passed 4/4; local self-check returned pageStatus 200 at `http://127.0.0.1:4175/zh-hk`.
- Security: standard scan `359653b0-599e-4107-8818-6c517153106e` completed with four low findings against the original scan snapshot; three code/config findings are patched in the working tree and Vercel baseline headers are now present. The scan warns that the worktree changed while it ran.
- Deployment: not performed; production alias remains unchanged until explicit approval.

## 网站修改意见new.docx implementation — 2026-08-23

- Build: passed. `npm run build` completed with Vite 6.4.2 and Sites packaging.
- Worker tests: passed. `npm run test:sites` returned 4 passed, 0 failed.
- Journal and articles: `/zh-hk/journal` shows the new cover and six updated titles; compact-office has eight body paragraphs and the supplied skyline; 固高 and HKPC articles each load both supplied images; co-creation loads the supplied pilot image.
- CANVIVA: `/zh-hk/products/canviva` uses the supplied skyline, six metric cards and the expanded Hong Kong office-density narrative.
- ESG: `/zh-hk/esg` title is `ESG 在香港的應用`; WELL v2 M02, BEAM Plus, IAQ and evidence-pack guidance render without prohibited status/placeholder wording.
- Xponge: `/zh-hk/technology/xponge` shows the DualFlow metrics and no evidence/status badge; the checked body contains none of `待驗證`, `驗證中`, `開發中`, `內容待提供`, `CONTENT REQUIRED` or `編輯草稿`.
- Solutions: `/zh-hk/solutions` shows the four supplied solution image families and the exact fine-dining/healthy-home descriptions; lazy assets loaded after scroll.
- Browser runtime: real-browser checks reported no error overlay and nonzero natural widths for the new images. Standard security scan `1c06baf2-24db-4f98-8058-0aba3199293f` completed with 0 reportable findings and complete coverage.
- Deployment: not performed. Local preview remains at `http://127.0.0.1:4173/zh-hk`; production is unchanged pending explicit approval.

## 调整意见.docx implementation — 2026-08-23

- `/zh-hk/journal` rendered the updated first card title `讓自然、藝術與科技，共同生長於城市` and `/images/docx-why-hk-minijungle.png`.
- `/zh-hk/journal/why-hk-minijungle` rendered four Chinese body paragraphs and the supplied founding image without a runtime error.
- `/zh-hk/journal/low-interruption-care` rendered the revised `ESG 在香港的應用` article with `/images/docx-esg-office.png` and `/images/docx-esg-meeting.png` in a two-column row. Browser DOM measurement at the desktop viewport reported two 478px-wide images aligned at the same top coordinate inside a 980px row.
- The checked ESG page contained none of `待驗證`, `待验证`, `驗證中`, `验证中`, `開發中`, `开发中`, `內容待提供`, `内容待提供`, `CONTENT REQUIRED`, `Editorial draft` or `編輯草稿`.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed; the local preview remains the verification target.

## 香港公司的办公室室内绿化和ESG.docx implementation — 2026-08-23

- `/zh-hk/esg` rendered the document-aligned HKEX disclosure table (5 rows), research metrics (6 cards), certification routes (3 cards), implementation path (5 steps) and key actions (4 items).
- `/en/esg` rendered the same structure with English copy; both routes retained the existing evidence-pack and IAQ limitation language.
- Mobile browser check at 390×844 confirmed the metrics, certifications, path and actions collapse to one column; the HKEX table remains keyboard-focusable and horizontally scrollable at 760px internal width.
- `agent-browser a11y` returned 0 violations after the table focus and contrast-token fixes. The tool reported one incomplete image-overlay contrast check on the concept Hero, not a violation.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed; local preview remains at `http://127.0.0.1:4173/zh-hk`.

## ESG article media correction — 2026-08-23

- `/zh-hk/journal/low-interruption-care` now renders only `/images/docx-esg-office.png`; its gallery count is 0 and its body contains no `HKPC`, `香港生產力促進局` or `GreenCanvas` text.
- `/zh-hk/journal/prototype-to-place` still renders the separate HKPC partnership article with `/images/docx-hkpc-team.png` and `/images/docx-hkpc-green-wall.png`.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed.

## Compact-office image alignment — 2026-08-23

- Desktop browser check: lead image and product gallery share the same `x=64` and `width=1126` bounds; two gallery frames are equal-width (`551px`) with a consistent `24px` gap.
- Mobile browser check at 390×844: lead image and gallery share `x=20` and `width=350`; product frames remain one column at 360px height.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed.

## Remove concept image labels — 2026-08-23

- `/zh-hk/journal/compact-hong-kong-workplaces`: 3 image frames, 0 concept badges.
- `/zh-hk`: 8 image frames, 0 concept badges.
- Mobile check at 390×844 on the compact-office article: 3 images, 0 concept badges; images remain present.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed.

## Compact-office product imagery — 2026-08-23

- `/zh-hk/journal/compact-hong-kong-workplaces` now renders the original Hong Kong density image plus two supplied product images: `canviva-office-living-wall.png` and `canviva-art-wall.png`.
- Desktop browser check: gallery contains 2 frames at 478px each, with `概念效果圖` labels and nonzero natural image widths.
- Mobile browser check at 390×844: gallery collapses to one 350px column; both frames remain 360px high and readable.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed.
