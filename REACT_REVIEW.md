# React Best-Practices Review

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
