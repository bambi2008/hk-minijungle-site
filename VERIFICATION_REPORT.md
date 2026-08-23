# Full-Story Verification

**Story:** A visitor enters the bilingual website, discovers the product platform, filters to a relevant offer, and opens the contact route; the browser validates the enquiry and either posts JSON to an operator-configured endpoint or honestly reports that no endpoint is configured.

| Boundary | Status | Evidence |
|---|---|---|
| UI renders | Passed | `/en` and `/zh-hk` render meaningful headings and concept-labelled imagery; no error overlay or console error was observed. |
| Client navigation | Passed | All 52 documented bilingual routes returned the expected app state, including custom 404 paths. |
| Product interaction | Passed | Audience filter updates `aria-pressed` and the visible cards; locale switching preserves the route. |
| Form validation | Passed | Empty submission produces adjacent, programmatic errors for name, email and privacy consent. |
| Client → API | Expected unconfigured state | `.env.example` leaves `VITE_CONTACT_ENDPOINT` empty. The UI says nothing was sent and preserves values; it does not fake success. |
| API → data | Not in repository | No receiving service or database is included. Production delivery, validation, rate limiting and retention must be verified after an endpoint is selected. |
| Error response → UI | Passed in source and local state | Non-OK responses map to a retained-form error state; the unconfigured path was exercised in the browser. |
| Production build | Passed | `npm run build` produced `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json`. |
| Sites worker | Passed | `npm run test:sites`: 4 tests passed, 0 failed. |

The dev server emitted only expected Vite reload/HMR messages and no startup or runtime errors.

## Transparent-logo verification — 2026-08-21

**Story:** The same official transparent wordmark loads from a fixed same-origin asset path, stays dark green on light headers, and becomes a readable white mark on the dark home overlay and footer.

| Boundary | Status | Evidence |
|---|---|---|
| Source asset → alpha PNG | Passed | Installed asset is 1970 × 368, `Format32bppArgb`; all four corner alpha values are 0. |
| Component → asset | Passed | `BrandLogo` continues to use `/images/hk-minijungle-logo.png`; no dynamic or URL-controlled asset path was added. |
| Light header | Passed | `output/qa/logo-transparent-about-desktop.png` and `output/qa/logo-transparent-about-mobile.png` show the dark-green mark without a white rectangle. |
| Dark surfaces | Passed | `output/qa/logo-transparent-home-overlay.png`, `output/qa/logo-transparent-home-mobile.png` and `output/qa/logo-transparent-footer-desktop.png` show the filtered white mark with clear contrast. |
| Responsive layout | Passed | Browser-reported `scrollWidth` equals `clientWidth` at 1440 and 390 px; mobile logo frame remains 150 × 34 CSS px. |
| Runtime state | Passed | Meaningful content rendered, no Vite error overlay appeared, and both image instances loaded after scrolling. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |

No API, database or external data boundary is involved in this asset-only user story. Production was not redeployed in this turn.

## Homepage Hero concept image verification — 2026-08-22

**Story:** A visitor opens the bilingual homepage; the browser selects an efficient fixed same-origin Hero image candidate, renders the supplied concept visualisation with a responsive crop and preserves the concept disclosure, readable copy and primary navigation.

| Boundary | Status | Evidence |
|---|---|---|
| Supplied source → responsive assets | Passed | The 1672 × 941 source was encoded into 640/960/1280/1672 AVIF and WebP candidates plus a 174,729-byte JPEG fallback without generative alteration. |
| Component → browser source selection | Passed | `<picture>` rendered fixed same-origin candidates; Chromium selected the 1672 AVIF at 1440 px and the 640 AVIF at 390 px. |
| Desktop rendering | Passed | `output/qa/hero-user-concept-desktop.png`: no error overlay or horizontal overflow; crop `50% 50%`; concept badge and both CTAs visible. |
| Mobile rendering | Passed | `output/qa/hero-user-concept-mobile.png`: no error overlay or horizontal overflow; crop `62% 50%`; complete headline, both CTAs and concept badge visible. |
| Interaction | Passed | Interactive browser snapshot exposed both Hero CTAs and the mobile menu; semantic menu opening succeeded. |
| Accessibility | Passed for changed surface | Locale-aware alt text identifies a concept visualisation; intrinsic dimensions, responsive sizes and eager high-priority loading are present. |
| Build | Passed | `npm run build`: 4,573 modules transformed; Sites-ready client, worker and hosting manifest produced. |
| Worker tests | Passed | `npm run test:sites`: 4 passed, 0 failed. |
| Security boundary | Passed for Hero change | Fixed raster paths do not accept URL/form input and introduce no executable-content, SSRF, traversal or navigation path. Standard scan `6bd8dcde-1bc1-4b51-a367-7f6c4faf7493` found no Hero-related issue. |

The only scan finding is a pre-existing low-severity Vite development-listener configuration (`0.0.0.0`); it is unrelated to the Hero and does not affect the static production build. Production was not redeployed because this turn did not include deployment approval.

## Xponge material image replacement verification — 2026-08-22

**Story:** A visitor opens the homepage or Technology page; the browser selects a fixed same-origin responsive Xponge image, showing the user-supplied beige porous material while preserving the original leaf creative and concept disclosure.

| Boundary | Status | Evidence |
|---|---|---|
| Supplied material → composite | Passed | The supplied porous-material reference was composited into the existing 1536 × 1024 leaf composition; the previous dark source remains recoverable as `public/images/xponge-material-concept-original.png`. |
| Composite → responsive assets | Passed | JPEG fallback plus 640/960/1280/1536 AVIF and WebP derivatives were generated and installed under fixed `/images/xponge-material-concept-*` paths. |
| Component → browser source selection | Passed | Module-level `xpongeSources` flows through `ImageFrame` and optional `PageHero` sources; desktop selected 1536 AVIF and mobile selected 640 AVIF. |
| Homepage rendering | Passed | `output/qa/xponge-home-desktop.png` and `output/qa/xponge-home-mobile-focus.png` show the beige material and preserved leaf with the concept label. |
| Technology rendering | Passed | `output/qa/xponge-technology-desktop.png` shows the same composition in the page Hero without overlay or layout errors. |
| Responsive layout | Passed | Browser checks at 1440 px and 390 px reported meaningful content, no Vite error overlay and no horizontal overflow. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Security boundary | Passed for Xponge change | Standard scan `cc63f9f5-13a6-4d35-97d4-53813d7b5feb` found no Xponge-related issue; fixed raster paths do not accept URL/form input or create executable-content, SSRF or traversal flows. |

The only scan finding is a pre-existing low-severity Vite development-listener configuration (`0.0.0.0`); it is unrelated to the Xponge change and does not affect the static production build.

## Production deployment verification — 2026-08-22

**Story:** The approved Hero and Xponge image changes move from the verified local build to Vercel Production and remain reachable from the project alias.

| Boundary | Status | Evidence |
|---|---|---|
| Approved source → Vercel deployment | Passed | User approved deployment; `dpl_5VVRfsmhMXkrMfXEKwdrqStGyyHw` reached `READY` on the Production target. |
| Production HTML → compiled bundle | Passed | `https://hk-minijungle-site.vercel.app/zh-hk` returned HTTP 200 and served a bundle containing `hero-living-wall-hong-kong-concept-*` and `xponge-material-concept-*` references. |
| Production image assets | Passed | Hero 640 AVIF, Xponge 640 AVIF and Xponge JPEG all returned HTTP 200 from the project alias. |
| Production alias | Passed | `https://hk-minijungle-site.vercel.app/zh-hk` returned HTTP 200 after deployment. |
| Custom domain | Not re-verified | `hkminijungle.com` DNS status remains a separate registrar configuration item. |

No rollback was required. The pre-existing low Vite development-listener finding remains unrelated to this deployment.

## Product naming, scene imagery and full-screen Hero verification — 2026-08-22

**Story:** A visitor opens the bilingual homepage, sees a full-viewport Hero, explores the renamed product families, and follows the Xponge technology route; fixed local assets and content render without exposing product status or response-time copy.

| Boundary | Status | Evidence |
|---|---|---|
| Source content → product family list | Passed | `/zh-hk/products` rendered `生命畫境` and `鮮香植園`; only two `.product-card` items were present and `.status-badge` count was 0. |
| Product family → image asset | Passed | CANVIVA loaded `/images/canviva-hong-kong-office.png`; CUISVIVA KITCHEN loaded `/images/cuisviva-kitchen-european.png`; both returned HTTP 200 locally. |
| Hero layout → desktop viewport | Passed | Browser DOM measurement: Hero height `720`, viewport height `720`. |
| Hero layout → mobile viewport | Passed | Browser DOM measurement: Hero height `844`, viewport height `844` at 390×844. |
| Xponge route → technology content | Passed | `/zh-hk/technology/xponge` included the new micro-pore/root-zone explanation and rendered the Xponge material image; no response-time copy appeared. |
| Legacy route compatibility | Passed | `/products/greencanvas` and `/products/home-panel` aliases resolve to canonical product data; technology layers route to Technology detail rather than product-family cards. |
| Browser runtime | Passed | Real in-app browser snapshot and screenshot showed readable Hero copy, both CTAs, navigation and concept label; console returned no warning/error entries. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Security | Passed with warning | Standard scan `75d406dc-4428-4726-92b0-f6f15b58b421` completed with 0 reportable findings and complete declared coverage. Preflight continued with four active slots versus the suggested six; TAC status was `not_granted`. The scanner warned that documentation edits made while it ran were outside its original snapshot; source/assets were already present before the scan began. |

No API, database or external data boundary is involved in the image, naming or Hero changes. Production was not redeployed because no deployment approval was given in this turn.

## Production deployment verification — 2026-08-22 (Hero full-screen and product updates)

**Story:** The approved local build is promoted to Vercel Production and the public project alias serves the updated full-screen Hero, product family names and scene assets.

| Boundary | Status | Evidence |
|---|---|---|
| Local build → Vercel | Passed after retry | Normal Vercel remote build produced `dpl_29PS9jzVqLPFyvvajcybvbc31sFN` with target `production` and state `READY`. The first prebuilt attempt was discarded from verification after returning `NOT_FOUND` due to stale `.vercel/output` configuration. |
| Production homepage | Passed | `https://hk-minijungle-site.vercel.app/zh-hk` rendered the app in the real browser; Hero height equalled the 720px viewport and the Hero JPEG path was the new living-wall asset. |
| Production product index | Passed | `/zh-hk/products` rendered `生命畫境` and `鮮香植園`, loaded both new PNG scene assets, showed zero `.product-card .status-badge` elements and no `預計回覆` text. |
| Production runtime | Passed | Page title and compiled script loaded; browser console had no warning/error entries in the checked routes. |
| Production alias | Passed | Vercel deployment inspection listed `hk-minijungle-site.vercel.app` as an alias for the READY deployment. |
| Custom domain | Not re-verified | No DNS changes were made; the browser check of `hkminijungle.com` timed out, so custom-domain routing remains a separate DNS verification item. |

No rollback was required after the successful retry. The live browser tab was left on the published homepage.

## Word revision implementation — 2026-08-23

**Story:** The Word revision is reflected in the public route structure, bilingual content, supplied image set and local build without exposing the removed status/draft/placeholder language.

| Boundary | Status | Evidence |
|---|---|---|
| DOCX → source content | Passed | `网站修改意见.docx` was extracted with the Documents skill; Doctor Forest, Xponge, CANVIVA, ESG, four solutions and cleanup requests were mapped into `src/content.js` and `src/pages.jsx`. |
| DOCX images → assets | Passed | Embedded image2/image5/image7–image12 were copied to fixed `public/images` paths and used by CANVIVA/solution/ESG surfaces. |
| Navigation → ESG route | Passed | `/zh-hk/esg` and `/en/esg` rendered with headings, WELL v2 M02 and BEAM Plus references; no overlay errors. |
| Technology pages | Passed | `/zh-hk/technology/xponge` rendered DualFlow metrics and `/zh-hk/technology/doctor-forest` rendered the smart-care service loop; prohibited validation/development strings were absent. |
| Solutions and lazy media | Passed | `/zh-hk/solutions` rendered compact workplace, hotel/club, fine dining and healthy home copy; all solution images loaded after scroll. |
| About/Journal/Legal cleanup | Passed | `/zh-hk/about`, `/zh-hk/privacy` and journal cards rendered neutral copy without `CONTENT REQUIRED`, `編輯草稿` or `正式發佈前`. |
| Home interaction | Passed | Real-browser snapshot confirmed the Products menu toggles to `aria-expanded=true` and exposes CANVIVA/CUISVIVA links. |
| Production build | Passed | `npm run build` generated Sites output; `npm run test:sites` passed 4/4; self-check returned HTTP 200 at `http://127.0.0.1:4175/zh-hk`. |
| Security | Passed with low findings | Standard scan `359653b0-599e-4107-8818-6c517153106e` completed with four low findings against the original snapshot; contact URL forwarding, worker fallback and Vite host were patched in the working tree, and Vercel headers were added. |
| Deployment | Not performed | No deployment approval was provided for this turn; production alias remains unchanged. |

## 网站修改意见new.docx verification — 2026-08-23

**Story:** A visitor opens the bilingual local site, reads the revised office-density, ESG, smart-planting and partnership stories, and explores four solution contexts with the supplied images; all content is static and rendered through the existing client router.

| Boundary | Status | Evidence |
|---|---|---|
| DOCX text → content catalogue | Passed | New Journal bodies, ESG copy, CANVIVA detail copy and solution descriptions are present in `src/content.js`/`src/pages.jsx`. |
| DOCX media → public assets | Passed | Thirteen supplied media files were copied to fixed `/images/docx-*` paths and loaded with nonzero natural widths in the browser. |
| Route → page render | Passed | Journal index, compact-office, CANVIVA, smart-planting, HKPC, co-creation, ESG, Xponge and solution routes rendered with expected headings. |
| Lazy image loading | Passed | Solution images reported complete/nonzero dimensions after a real browser scroll to the page end. |
| Public-language cleanup | Passed | Checked bodies contained none of `待驗證`, `驗證中`, `開發中`, `內容待提供`, `CONTENT REQUIRED` or `編輯草稿`. |
| Build → Sites output | Passed | `npm run build` completed and prepared `dist/server/index.js` plus `dist/.openai/hosting.json`. |
| Static worker behavior | Passed | `npm run test:sites` passed 4/4, including API/write fallback exclusions. |
| Security boundary | Passed | Standard scan `1c06baf2-24db-4f98-8058-0aba3199293f` completed with 0 reportable findings and complete coverage; no new API/auth/data boundary was introduced. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## Compact-office image alignment — 2026-08-23

| Boundary | Status | Evidence |
|---|---|---|
| Lead image → product gallery edges | Passed | Desktop browser measured matching `x=64`, `width=1126` bounds for both containers. |
| Product gallery columns | Passed | Two equal 551px frames with a 24px gap; both remain aligned on the same top edge. |
| Responsive layout | Passed | Mobile browser measured matching `x=20`, `width=350` bounds and one stacked column. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## Remove concept image labels — 2026-08-23

| Boundary | Status | Evidence |
|---|---|---|
| Shared image badge behavior | Passed | `EvidenceBadge` suppresses only `concept`; other evidence types remain available. |
| Chinese compact-office article | Passed | Browser found 3 images and 0 `.evidence-badge--concept` elements. |
| Chinese home page | Passed | Browser found 8 images and 0 `.evidence-badge--concept` elements. |
| Mobile layout | Passed | At 390×844, compact-office article retained 3 images and 0 concept badges. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## Production publish — 2026-08-23

| Boundary | Status | Evidence |
|---|---|---|
| GitHub source archive | Passed | Private repository `bambi2008/hk-minijungle-site`, branch `main`, contains the validated source. |
| Vercel production build | Passed | Deployment `dpl_Y625YTQhGXbiDVyLdudJs3vPjP7D` reached `READY`; default deployment URL returned the expected HTML shell. |
| Production alias | Passed | Vercel lists `hkminijungle.com` and `hk-minijungle-site.vercel.app` as aliases for the READY deployment. |
| Production error scan | Passed | `vercel logs --level error --since 1h` returned no logs. |
| Public DNS / HTTPS | Passed | `hkminijungle.com` resolves to `76.76.21.21` and returned `HTTP/1.1 200 OK` over HTTPS; Vercel reports the domain attached and verified. |

## 香港公司的办公室室内绿化和ESG.docx verification — 2026-08-23

**Story:** A Hong Kong office visitor can understand how indoor planting may support ESG evidence without mistaking research references or certification routes for guaranteed outcomes.

| Boundary | Status | Evidence |
|---|---|---|
| DOCX tables → ESG content | Passed | Extracted HKEX disclosure, metric and certification tables are represented in page data and rendered at `/zh-hk/esg` and `/en/esg`. |
| ESG page structure | Passed | Browser counts: 5 HKEX rows, 6 metric cards, 3 certification cards, 5 path steps and 4 key actions in each locale. |
| Responsive behavior | Passed | At 390×844, cards and path/action layouts use one column; the wider disclosure table is intentionally focusable and horizontally scrollable. |
| Accessibility smoke check | Passed | `agent-browser a11y` reported 0 violations after the new table keyboard-scroll affordance and contrast adjustments; one image-overlay contrast check remained incomplete. |
| Build → Sites output | Passed | `npm run build` completed and prepared Sites packaging files. |
| Static worker behavior | Passed | `npm run test:sites` passed 4/4. |
| Security boundary | Passed | Static content/layout only; no new API, auth, data or URL-controlled asset boundary. Prior standard scan `1c06baf2-24db-4f98-8058-0aba3199293f` remains applicable. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## ESG article media correction — 2026-08-23

| Boundary | Status | Evidence |
|---|---|---|
| ESG article → media | Passed | `/zh-hk/journal/low-interruption-care` has one ESG office image and no gallery row. |
| ESG article → public copy | Passed | Browser body contains no `HKPC`, `香港生產力促進局` or `GreenCanvas` string. |
| HKPC article isolation | Passed | `/zh-hk/journal/prototype-to-place` still contains its dedicated HKPC copy and two supplied HKPC images. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## Compact-office product imagery — 2026-08-23

| Boundary | Status | Evidence |
|---|---|---|
| User images → fixed assets | Passed | Two supplied PNGs are installed at fixed `/images/canviva-*` paths and load with nonzero browser widths. |
| Article → product gallery | Passed | Compact-office article renders both new images in a dedicated two-column gallery below the lead image. |
| Responsive layout | Passed | Desktop measured 478px + 478px columns; mobile measured one 350px column for each gallery frame. |
| Concept disclosure | Passed | Both supplied product scenes render the localized `概念效果圖` label. |
| Build and worker | Passed | `npm run build` passed; `npm run test:sites` passed 4/4. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |

## 调整意见.docx verification — 2026-08-23

**Story:** A visitor opens the Journal in Chinese, reads the revised founding story, and views the ESG article with the two supplied images aligned as requested.

| Boundary | Status | Evidence |
|---|---|---|
| DOCX copy → Journal content | Passed | `/zh-hk/journal/why-hk-minijungle` rendered the supplied title and four Chinese body paragraphs. |
| DOCX media → public assets | Passed | The founding and ESG image files were copied to fixed `/images/docx-*` paths and returned nonzero browser dimensions. |
| ESG article → two-image layout | Passed | Desktop browser measured a 980px media row with two 478px image frames at the same top coordinate; mobile fallback is defined as one column. |
| Build → Sites output | Passed | `npm run build` completed; Sites packaging files were prepared. |
| Static worker behavior | Passed | `npm run test:sites` passed 4/4. |
| Public-language cleanup | Passed | Checked ESG body contained none of the prohibited validation/development/placeholder strings. |
| Security boundary | Passed | No API, auth, URL-derived asset path or data boundary was added; the prior standard scan `1c06baf2-24db-4f98-8058-0aba3199293f` remains applicable to this static-only change. |
| Production | Not run | No deployment approval was provided; online alias remains unchanged. |
