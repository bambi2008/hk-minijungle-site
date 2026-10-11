# HK MINIJUNGLE Brand Migration — 2026-10-06

## Scope

Content, public information architecture, SEO and route status only. Existing layout, CSS, animation and interaction implementations remain unchanged.

## Route migration plan

| Old URL | Old content | Action | New URL / status | SEO reason |
|---|---|---|---|---|
| `/{locale}/products` | Multi-product catalogue | Refocus | Same URL; CANVIVA configurations only | Keep established catalogue URL while making CANVIVA the sole public family |
| `/{locale}/products/canviva` | CANVIVA / GreenCanvas detail | Keep and strengthen | Same URL | Canonical CANVIVA product route |
| `/{locale}/products/greencanvas` | Legacy CANVIVA alias | Keep alias | Canonical content at `/products/canviva` | Preserve legacy external references without rewriting historical names |
| `/{locale}/products/cuisviva-kitchen` | Consumer kitchen grower | Remove from public architecture | `noindex` archive notice | Preserve history/code without presenting it as a current HK MINIJUNGLE product |
| `/{locale}/products/home-panel` and `/homepadel` | Legacy kitchen aliases | Remove from public architecture | `noindex` archive notice | Avoid 404s and avoid irrelevant redirect to CANVIVA |
| `/{locale}/solutions` | Work, hospitality, restaurant and home mix | Refocus | Same URL; commercial applications only | Align search and visitor intent with B2B commercial-space work |
| `/{locale}/solutions/home` | Consumer home application | Remove from public architecture | `noindex` archive notice | Preserve old inbound references without continuing home-product positioning |
| `/{locale}/solutions/property-fm` | Fine-dining CUISVIVA concept | Repurpose | Property & Lobby application | The stable route is more semantically aligned with property/FM intent than the previous content |
| `/{locale}/technology/doctor-forest` | Internal technology product page | Remove from public architecture | `noindex` archive notice | Avoid describing DR FOREST as an HK MINIJUNGLE internal product line |
| `/{locale}/technology` | Technology catalogue | Remove from navigation and sitemap | `noindex` legacy route | Technology now supports CANVIVA rather than acting as a separate catalogue |
| `/{locale}/technology/xponge` | Material platform | Keep as supporting system page | Same URL | Xponge remains a CANVIVA system material layer, not a separate top-level business |
| `/{locale}/plants*` | Global plant library | Remove from HK MINIJUNGLE public architecture | Direct route retained with `noindex` | Preserve current prototype work for future independent use |
| `/{locale}/plant-scan` | AI recognition prototype | Remove from HK MINIJUNGLE public architecture | Direct route retained with `noindex` | Future-facing AI consumer capability is outside the current company website scope |

## Naming policy

- Use `CANVIVA` / `生命畫境` as the public product brand.
- Keep `GreenCanvas` only inside verified historical HKPC/project wording or legacy route aliases.
- Do not use `GREENCAVAS` as a public product name.
- Use `AI-enabled operations` or neutral operations language where currently accurate.
- Do not publish a DR FOREST legal entity or company relationship before confirmation.

## Content confirmation required

- Approved real project names, photography and publication permissions.
- Verified project outcomes and maintenance records suitable for public use.
- Final CANVIVA configuration names, drawings, finish schedule, lead time, warranty and commercial range.
- Confirmed future DR FOREST legal name and service relationship, when available.

## Implementation report (A–G)

### A. Changed public content

- Repositioned the bilingual homepage around CANVIVA living plant systems for offices, property, hospitality, clubhouses, lobbies and premium commercial interiors.
- Reworked the public navigation to CANVIVA, Applications, Projects, About and Contact.
- Reframed the product catalogue as one CANVIVA platform with core, living-wall and art-wall configurations.
- Reworked Contact into a B2B project enquiry with company, project location, approximate space/requirement and target timeline.

### B. Removed from public discovery

- CUISVIVA KITCHEN, home products, home applications, DR FOREST product catalogue, plant library and plant recognition are absent from navigation and sitemap.
- Their code and assets remain in the repository; relevant old routes display an archive state and `noindex,follow` instead of being deleted or redirected to the homepage.

### C. CANVIVA coverage

- Homepage, product listing, CANVIVA detail, commercial applications and project CTAs now use one consistent commercial-space proposition.
- Existing renders are labelled `設計效果示意 / Design visualisation`.
- Missing commercial ranges, final specifications, approved case studies, warranties and lead times remain visibly marked as missing/subject to project confirmation rather than invented.

### D. DR FOREST handling

- DR FOREST is not presented in the public navigation, sitemap, CANVIVA product page or contact surface as an internal HK MINIJUNGLE product line.
- The old technology route is retained as a noindex archive. Public operational language is neutral and conditional on actual project configuration.
- No subsidiary, partner, sister-company or formal service relationship is claimed.

### E. SEO and route migration

- Updated bilingual titles, descriptions, Open Graph, Twitter metadata, canonical URLs, hreflang links, JSON-LD focus and sitemap entries.
- Current public pages are indexable; legacy consumer, home, DR FOREST, technology-catalogue and plant-tool routes are noindex.
- Legacy CANVIVA/GreenCanvas aliases canonicalise to `/products/canviva`.

### F. TODO materials

- Approved project photography, project names, publication permissions, client logos and attributed testimonials.
- Verifiable before/after records and measurable project outcomes.
- CANVIVA drawings, dimensions, finish schedule, installation conditions, lead time, warranty, service scope and budget guidance.
- Formal DR FOREST legal and commercial relationship documentation before any public relationship wording changes.

### G. Verification and release state

- Production build: passed (4,581 modules).
- Sites worker tests: 4/4 passed.
- Local HTTP/resource check: HTTP 200, zero failures.
- Real-browser QA: desktop/mobile, Chinese/English, navigation dropdown, product filtering, legacy archive/noindex and console checked; zero console errors/warnings.
- Standard security scan: not completed because the Codex Security desktop workbench failed twice before returning a scan ID.
- No commit, push, deploy or publication was performed.
