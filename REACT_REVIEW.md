# React Best-Practices Review

## Public-space galleries and technical editorial — 2026-10-25

Invoked vercel:react-best-practices for pages.jsx, OfficeSceneGallery.jsx, SystemTechnologyPage.jsx and shared scene data. Static scene arrays are imported by content/pages rather than recreated per render. One gallery component now serves the home and three application groups; useId binds each track, help text and pair of controls without duplicate IDs, preserving SSR hydration identity. ResizeObserver disconnects; pointer state uses a ref; mouse capture is released on completion/cancel/loss. Touch is left to native overflow scrolling; image dimensions and contain fit retain the full supplied artwork. Technical content remains pure localized JSX and semantic native details, with no raw HTML, remote content fetch or new dependency. Fixed link/source strings remain text/attributes. The current JSX review found no new component defect; true-device touch and screen-reader testing were not performed in this run.

Production browser QA caught a pre-existing preview routing mismatch, not a component hook issue: extensionless paths were served the home HTML. Fixed only the Vite preview middleware with exact sitemap membership and GET/HEAD gating; no frontend src changed after its sealed scan. Fresh production tab then had no error/warning; gallery click remained functional. That later config repair is manually reviewed/tested but its separate Standard scan could not start with a file scope; see QA_REPORT. Build warning515.02kB and legacy unused ArrowLeft remain disclosed.

## Hero continuity and progressive image motion — 2026-10-21

Invoked vercel:react-best-practices after shared ImageFrame, PageHero and SystemTechnologyPage changes. ImageFrame remains visible in static SSR/no-JS output; client-only useEffect observes only below-fold, non-eager images, uses primitive src/eager/motion dependencies, disconnects IntersectionObserver and removes the media-query listener on cleanup. Reduced-motion skips observation; changing to reduce reveals an already pending frame. Effects change fixed data attributes, not React-controlled text or dimensions. No scroll-per-frame state updates, network fetch, raw HTML or new dependency. Eager heroes opt out; GrassHero source unchanged. Gallery and full planting images retain contain sizing, with filter-only hover and no reveal transform on office figures. Existing matching-pointer capture, keyboard/ResizeObserver cleanup and native touch remain intact. Fixed seven-choice state, stable local paths and native disclosures preserved.

Browser evidence: hover none→brightness(1.06) saturate(1.06), scroll pending→visible; desktop 11×580px and phone 11×268.594px aligned, mouse drag0→450, touch0→181, keyboardEnd11/11, seven real clicks/details/quotation focus passed. Reduced-motion opacity1/transformnone/palette animationnone; global legacy duration override leaves0.00001s, effectively instant. No new hook/interaction regression found. Build main510.24kB warning and existing unused legacy ArrowLeft remain disclosed; no unrelated refactor.

## Expanded office gallery and Xponge explanation — 2026-10-15

Invoked vercel:react-best-practices after changing pages.jsx/SystemTechnologyPage.jsx. Eight static local scene records added to the existing constant; no per-render image fetching or new state/effect/listener. Technology content remains a pure locale-rendered component with fixed HTTPS references, React text, semantic sections/dl/ol and native details. No raw HTML, runtime external content fetch or new package. Existing gallery owns bounded index/scroll and ResizeObserver cleanup; all11 images retain fixed dimensions/aspect ratio and lazy ImageFrame loading. Existing tokens retained; no CSS-in-JS migration or unrelated refactor. Actual keyboard disclosure, mouse/native touch, mobile reflow and quotation focus were checked. No new hook/data-boundary defect identified. Build warns main chunk509.10kB >500kB and pre-existing unused ArrowLeft; recorded, not hidden or represented as build failure. No unrelated bundle architecture change authorized.

## 2026-10-15 — Public technology page/navigation

Invoked vercel:react-best-practices after Shell navigation, App route and SystemTechnologyPage changes. Reuses existing xponge route and locale handling; no new state/effect/listener/fetch/dependency in technical content. Fixed local concept image, fixed external references with noreferrer, semantic sections/nav/details and stable list keys. Existing navigation/mobile close behavior retained. Native intra-page anchors have header clearance; actual desktop/mobile route clicks, details disclosure and shared CTA→quote selection/focus passed. SSR43routes/15tests passed. No legacy brand reintroduction or source-derived raw HTML. Existing unused legacy ArrowLeft warning outside scope remains informational.

## 2026-10-15 — Seven PDF planting palettes and homepage removals

Invoked vercel:react-best-practices after HomePage and PlantDesignShowcase edits. Seven source-owned records are module constants; only selected index is state, chosen by bounded internal button indices. No network fetch/effect/global listener introduced. Stable palette keys and accurate extracted image dimensions preserve layout; only selected scene/detail mount, lazy images and native details avoid loading all fourteen images immediately. Keys reset old detail state on selection; picker buttons retain focus and expose aria-pressed/controls. Native quote anchors preserve existing query/ref navigation. Bilingual SSR/build14tests and actual selection/detail/keyboard/quote interactions pass. Catalogue and other homepage animation components unchanged; no speculative memoization or refactor.

## 2026-10-15 — OfficeSceneGallery

Invoked vercel:react-best-practices after the HomePage and new OfficeSceneGallery changes. Drag coordinates are stored in a ref, not React state on each pointer movement; only the nearest slide index is state. Three stable, source-owned image keys/dimensions/labels; no remote fetch, dependency or mutable request-global state added. Browser APIs are effect/event-only, compatible with SSR. ResizeObserver disconnects; mouse capture releases on up/cancel/lost capture, and pointerType guard leaves native touch scrolling intact. Explicit buttons, focusable track, Home/End/arrow keys, 44px controls and reduced-motion scroll behavior verified. No unrelated refactor; existing image/quotation/contact boundaries preserved. Tablet inherited min-height was found by actual QA and fixed with a scoped selector.

## 2026-10-14 — Office scene / quotation entry

Invoked vercel:react-best-practices after HomePage, ContactPage and ImageFrame/EvidenceBadge edits. Fixed source arrays use stable image paths as keys; images are lazy, async decoded and dimensioned. Optional label text is a React child, not HTML. Existing image labels and shared SiteLink navigation are preserved. Quote CTA is native navigation; ContactPage has SSR-safe state and browser-only effect with primitive locale dependency, a fixed ref/anchor and cancelled rAF cleanup. No new fetch, dependency, global listener or remote destination; form submission boundary unchanged. Build/SSR and browser quote focus tests passed. No unrelated component refactor.

## GEO real-browser confirmation — 2026-10-10

- Playwright on the packaged Worker route confirmed that prerendered About and Contact documents hydrate with 0 errors and 0 warnings; the query-driven Contact intent updates after hydration without changing the server/client first render.
- A mismatch observed on Vite preview was traced to that server returning the homepage HTML for an extensionless route without a trailing slash. It was not a React component mismatch; the actual Worker route-first fallback returned the correct document and required no React workaround.
- The only source correction from Product Design QA is contextual CSS for pending-material text on a light section. It adds no component state, effect, render branch, dependency or bundle work.
- FAQ state remains local and bounded, uses native buttons and `aria-expanded`, and produced the expected visible answer in desktop and mobile browser snapshots.
- Latest production build, 6/6 GEO tests and 5/5 Sites tests passed. No React correctness, hydration, hook, re-render or loading regression remains in the changed scope.

## GEO prerender and structured data — 2026-10-09

- `resolveRoute(pathname)` is a pure shared route resolver used by both browser rendering and the SSR entry; no second page hierarchy or duplicated fetch path was introduced.
- Route metadata and Schema are derived from module-scoped static content. `useStructuredData` has one primitive dependency (`pathname`), removes only its own tagged scripts, and does not attach listeners or create a network waterfall.
- `hydrateRoot` is used only when prerendered markup exists; development/client-only startup keeps `createRoot`. The SSR entry waits for `onAllReady`, so the lazy Grass Hero does not leave a client-render fallback marker in production HTML.
- Contact intent initialization is stable across SSR and hydration: the server and first client render use the same default, then a bounded effect reads the browser query string after mount. Submission still reads the live query value.
- JSON-LD is serialized by React or assigned through `textContent`; no `dangerouslySetInnerHTML`, executable URL or user-controlled schema property was added.
- The Worker probes fixed same-origin `/<route>/index.html` assets through the platform URL API before using the existing root fallback; it does not read the filesystem or execute route input.
- Production build, 6/6 GEO tests and 5/5 Sites tests passed. Static review found no React correctness, hook, hydration, render-performance or accessibility regression; the subsequent 2026-10-10 Playwright pass confirmed hydration in the packaged Worker path.

## CANVIVA formal naming update — 2026-10-07

- Formal product variants remain module-scoped data in `src/content.js`; the public catalogue is derived once with `public !== false`, so reserved DIVIDER data cannot render accidentally.
- `ProductCard` reuses the existing component and routing path. It now prefers a dedicated localized alt string and renders the English formal name with the Chinese auxiliary name without introducing local state, effects or nested component definitions.
- Filters continue to derive their visible list during render from primitive state. No fetch waterfall, listener, storage, third-party runtime, dynamic import or effect-driven derived state was added.
- Fixed same-origin image paths remain data-controlled, and no `dangerouslySetInnerHTML`, executable URL, or user-controlled asset source was introduced.
- Shared detail-page H1 and route metadata are static localized copy; existing canonical/Open Graph helpers remain the single source for SEO updates.
- Production build passed with 4,581 modules. No new React correctness, hook, re-render, bundle-loading or accessibility regression was identified in the changed components.

## CANVIVA brand-focus content migration — 2026-10-06

- Public product and application filtering remains declarative over module-scoped data; no new data fetching, effect, listener, storage, waterfall or third-party runtime was introduced.
- `LegacyArchivePage` reuses existing `PageHero`, section and CTA components; route metadata is derived in `App.jsx` without adding component-local definitions or render-time network work.
- B2B contact fields reuse the existing controlled intent state and form validation path. Native inputs, radio semantics, labels, alert/status roles and fixed `mailto:` / `tel:` links remain intact.
- Concept labels now render through the existing `EvidenceBadge`; no CSS or animation component changed. Fixed same-origin images remain data-driven and are not URL-controlled.
- Removed unused `TechnologyPage` and `officeProductVariants` imports. Production build transformed 4,581 modules with no compile error.
- Result: no new React correctness, hook, re-render, bundle-loading or accessibility regression identified in the changed components.

## Homepage lead-generation update — 2026-10-03

- Homepage entry, proof and process content is module-scoped static data; render paths stay declarative and use stable number keys.
- The new `site-assessment` intent reuses the existing controlled state and form; it introduces no effect, fetch waterfall, persistence or extra runtime dependency.
- Existing shared `ArrowLink`, `SectionHeading` and form components are reused; native links, buttons and radio semantics remain intact.
- Contact links use fixed `mailto:` / `tel:` destinations from already-approved contact data. No URL-controlled asset or executable HTML sink was introduced.
- Production build passed. The existing Vite Fast Refresh warning for a mixed component/helper export in `components.jsx` remains a development-only accepted trade-off and was not introduced by this homepage change.

## Outcome

Passed for the current static marketing-site scope.

- Components are split by shared site chrome, reusable content patterns and route-level pages.
- Effects have bounded dependencies and clean up global listeners.
- Navigation and interaction state are derived directly; no effect-driven derived state or client data waterfall exists.
- Lists use stable content keys, controls are native buttons/inputs, and icons are marked decorative where appropriate.
- Static content is centralized in `src/content.js`; no duplicated network reads or third-party scripts are loaded.
- Analytics is deferred until interaction and strips the named contact fields before writing to `dataLayer`.
- The unused `useMemo` import was removed during review.
- The official logo is isolated in a reusable module-level `BrandLogo` component, avoiding duplicated markup and inline component creation.
- The header logo link retains an accessible name while the decorative image is hidden from assistive technology to prevent duplicate announcements.
- Canonical, Open Graph and alternate-language URLs now use the confirmed public origin from centralized settings rather than the current preview origin.
- The 2026-08-21 company-data and brand update introduced no new effects, data waterfalls, unnecessary state or large runtime dependency.
- The 2026-08-22 Hero update uses a reusable `<picture>` path with fixed, module-level AVIF/WebP source descriptors, intrinsic dimensions, high fetch priority only for eager images, and no new effect, state, dependency or client data waterfall.
- The 2026-08-22 Xponge update keeps the responsive source descriptors module-scoped, passes optional sources through the shared `ImageFrame`/`PageHero` components, and adds no URL-derived asset path, hook, state or runtime dependency.

## Accepted trade-offs

- Phosphor icons are imported from the package entry point; Vite tree-shakes the selected icons in this small bundle.
- Route rendering is a deliberately small client-side router. If the site grows into account, CMS or server-rendered flows, adopt a framework router rather than extending this switch indefinitely.

## Product naming, scene imagery and full-screen Hero — 2026-08-22

- `productFamilies` is derived once at module scope from the central product catalogue, so Technology layers do not leak into product-family navigation or repeated render filters.
- Canonical and legacy product slugs resolve through a small static alias map; no URL-controlled asset path or dynamic import was introduced.
- The two generated product images use fixed same-origin paths and the existing reusable `ImageFrame`; no new component-local hooks, effects or data waterfalls were added.
- The full-screen Hero uses CSS viewport units only (`100svh`/`100dvh`) and preserves the existing component structure and responsive image pipeline.
- Accessibility checks passed for the changed surfaces: native links/buttons remain semantic, generated scenes retain concept labels, and the Hero image has locale-aware alt text.

## Word revision implementation — 2026-08-23

- Added ESG route content and solution galleries through existing route-level components and centralized content data; no new network data waterfall or component-local fetch was introduced.
- Replaced public Article/About/Legal placeholder surfaces with static locale-aware copy; no new hooks or derived-state effects were added.
- Updated Doctor Forest and Xponge technology detail branches with explicit static content and metrics; existing shared `PageHero`, `FeatureList` and `FinalCta` components remain reused.
- Added route-only contact source tracking and worker/hosting hardening; no new client-side sink, dynamic import or URL-controlled asset path was introduced.
- Browser interaction and build checks passed after the changes; no React best-practice regression was observed.

## 网站修改意见new.docx implementation — 2026-08-23

- `ArticlePage` keeps gallery rendering declarative and uses stable image-path keys; supplied documentary images opt out of the concept evidence badge explicitly.
- `JournalCard`, `PageHero` and `EvidenceBadge` reuse existing shared components; the optional label path is derived during render without new effects or state.
- Static article/ESG/solution content remains centralized in `src/content.js`; no network fetch, client data waterfall, URL-derived asset path or dynamic import was introduced.
- The expanded copy does not change the router or the existing semantic links/buttons. Real-browser checks passed for the changed routes and the four solution images loaded after scroll.
- Outcome: no new React hook, component-structure, render-performance or accessibility regression identified.

## 调整意见.docx implementation — 2026-08-23

- `ArticlePage` now derives a stable `[post.image, ...post.gallery]` list and renders it declaratively through the existing `ImageFrame` component; image paths remain fixed static content.
- Gallery keys use the image path, labels are preserved only for the primary image, and the responsive row adds no hooks, effects, network fetches or dynamic imports.
- The change introduces no new component-local state, client data waterfall or URL-controlled asset path. Build and real-browser checks passed with no new React issue identified.

## 香港公司的办公室室内绿化和ESG.docx implementation — 2026-08-23

- Added `EsgDisclosureTable`, `EsgMetrics` and `EsgCertifications` as stateless presentational components using stable content keys; no effects, fetches or client data waterfalls were introduced.
- The new ESG path/action lists and table are rendered from centralized locale data in `src/content.js`; no URL-controlled content or dynamic imports were added.
- The table uses a semantic `<table>` with a focusable mobile scroll region and localized accessible label. `agent-browser a11y`, build and route tests passed.

## ESG article media correction — 2026-08-23

- The ESG article now uses the existing single-image branch because its gallery data is empty; the independent HKPC article continues to use the shared media-row branch. No new state, effect or component path was introduced.

## Compact-office product imagery — 2026-08-23

- Added a data-driven `galleryLayout` variant for the compact-office post so its lead image remains separate while the two supplied product images reuse the existing `ImageFrame` media row.
- Gallery images use stable path keys, fixed asset paths and the existing concept-label mechanism; no hooks, effects, network reads or URL-derived asset paths were introduced.

## Compact-office image alignment — 2026-08-23

- The fix is CSS-only: the existing `article__media-row--gallery` modifier now fills the article shell, preserving the declarative `ArticlePage` structure and fixed asset paths.
- No hooks, effects, fetches, dynamic imports or new component state were introduced. Desktop and mobile browser checks passed.

## Remove concept image labels — 2026-08-23

- `EvidenceBadge` now short-circuits only the `concept` type; the change is localized, has no new state/effects/fetches, and preserves other evidence labels.
- Real-browser checks on home, compact-office and mobile routes passed with zero concept badge nodes and all expected images present.

## CUISVIVA KITCHEN product rotation — 2026-09-18

- `ProductSpin` is a module-level component; the eight fixed same-origin asset paths are hoisted outside render.
- Pointer start state is kept in `useRef`, avoiding re-renders for transient drag origin data. Render state is limited to current frame and visible dragging state.
- The preload effect has an empty dependency list and only warms seven fixed image resources; it adds no listener, fetch waterfall, cleanup obligation or URL-controlled path.
- Native buttons, a keyboard-operable slider, localized accessible labels and visible focus styles cover non-pointer input.
- The initial 13.6 MB PNG set was converted to eight WebP frames totaling 487 KB; only the current frame is rendered while the remaining fixed frames are preloaded.
- No new dependency, API call, dynamic import, unsafe HTML sink or component-local definition was introduced. Outcome: passed.

## Homepage CUISVIVA H3 Hero video — 2026-09-20

- The final change replaces one fixed same-origin `<source>` with the user-approved MP4; it adds no hook, effect, component state, fetch, dynamic import or URL-controlled asset path.
- The video remains muted, inline, looping and metadata-preloaded, with a fixed poster image and a CSS reduced-motion fallback.
- The source keeps intrinsic poster dimensions and an accessible off-screen description while the decorative media is hidden from assistive technology.
- Real-browser checks confirmed decoding and autoplay without an error overlay or horizontal overflow. Outcome: passed.

## Interactive grass homepage Hero — 2026-09-29

- `GrassHero` is module-level and owns one bounded effect; all global pointer listeners, the `ResizeObserver`, RAF loop, audio graph and Three.js resources are released in cleanup.
- Pointer position, gust history and audio energy are transient refs/closures and update WebGL uniforms directly, avoiding React state churn on each frame.
- Heavy Three.js code is loaded through `React.lazy` and a color-matched `Suspense` fallback, reducing the shared production entry chunk from roughly 845 kB to 360.75 kB.
- The sound action remains a native button with localized naming and `aria-pressed`; the decorative canvas is hidden from assistive technology and has no tab stop.
- No fetch waterfall, URL-controlled dynamic import, unsafe HTML sink or persistent user data was added. Outcome: passed with the accepted mobile initialization cost documented in QA.

## Homepage CUISVIVA product rotation — 2026-09-29

- The existing module-level `ProductSpin` component is reused through a `variant="home"` prop; no inline component definition or duplicate interaction implementation was introduced.
- The fixed eight-frame same-origin asset list remains at module scope. The homepage variant maps the pointer's local horizontal position to one of those frames and retains the existing drag, touch, button and keyboard controls.
- Hover-frame and drag-origin values are transient refs. Only the visible frame and dragging state use React state, avoiding pointer-frequency component churn.
- The seven non-initial frames now preload only when the viewer approaches the viewport through one `IntersectionObserver`, with deterministic disconnect cleanup and a direct fallback for browsers without the API.
- No URL-controlled asset path, dynamic import, external request, unsafe HTML sink or persistent user data was added. Production build and browser interaction checks passed. Outcome: passed.

## Global plant library and recognition architecture — 2026-10-06

- `PlantLibraryPage`, `PlantDetailPage` and `PlantScanPage` are module-level components; plant records and region metadata are hoisted into `plantData.js` with stable slug keys.
- Search and filter results are derived with `useMemo`; no effect mirrors derived UI state and no client data waterfall was introduced.
- Saved-card state is a bounded in-memory `Set`. It does not persist personal data or trigger network work.
- The image-preview effect creates one object URL and reliably revokes it on replacement or unmount. Removing a preview resets the file input so the same image can be selected again.
- The mobile filter dialog restores the prior body overflow value and removes its Escape listener during cleanup.
- AI identification is provider-neutral and intentionally returns `model-not-configured`; the current UI never fabricates candidate results or calls a remote endpoint.
- Accessibility fixes include localized save/remove labels, native search/select/file controls, pressed/expanded states, Escape-to-close, visible focus styles and descriptive plant-image alt text.
- Named Phosphor imports remain tree-shakeable. No unsafe HTML sink, inline component factory, unstable list key or URL-controlled dynamic import was added.
- Production build, Sites tests and real-browser interactions passed. Outcome: passed.

## Regional source catalogue — 2026-10-06

- Module-level catalogue Promise deduplicates reads. Catalogue/region counts and search results are memoized; `useDeferredValue` keeps typing responsive and only 48 cards initially mount.
- Curated records merge by canonical name or verified source ID; the Bauhinia hybrid discrepancy now resolves by GBIF ID. The final 1,441 rendered profile slugs are unique.
- Async detail results remain keyed by the active slug, and effect cleanup ignores obsolete responses. All detail components are declared at module scope.
- Regional evidence uses native links, labelled counts and source dates; it never derives native status or care from occurrence alone.
- Finding fixed: mobile dialog did not constrain keyboard focus. Added first-control focus, forward/backward Tab loop, connected-opener restoration and deterministic overflow/listener cleanup. Real Playwright keyboard checks pass.
- Named icon imports and lazy images remain unchanged. Final build and browser source/count/pagination/search/detail checks passed; this is not a complete screen-reader or WCAG audit.
