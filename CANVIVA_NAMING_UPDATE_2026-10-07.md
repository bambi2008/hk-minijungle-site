# CANVIVA Website Naming Update

## Public product mapping

| Position | Formal title | Chinese auxiliary name | Current image | Public route |
|---|---|---|---|---|
| Left | CANVIVA SIGNATURE | 生命畫境・定制 | `/images/canviva-art-wall.jpg` | `/{locale}/products/canviva` |
| Middle | CANVIVA WALL | 生命畫境・綠牆 | `/images/canviva-office-wall.png` | `/{locale}/products/canviva` |
| Right | CANVIVA PANEL | 生命畫境・植景屏 | `/images/canviva-art-lobby.png` | `/{locale}/products/canviva` |

All three images continue to display `設計效果示意 / Design visualisation`. The supplied reference images matched these existing assets, so no file replacement was necessary.

## Route decision

The established website treats the three entries as product formats within one CANVIVA system and routes all cards to the existing bilingual shared detail page. The naming brief explicitly permits retaining a mature route structure, so no empty standalone product pages were added.

## Reserved category

`CANVIVA DIVIDER / 生命畫境・綠植隔屏` is reserved in `futureCanvivaVariants` with `public: false` and `image: null`. It does not appear in the catalogue, filters, navigation, sitemap or SEO. No placeholder or generated image was created.

## SEO synchronization

- Product-index browser title, description, Open Graph and Twitter metadata list the three approved names.
- Shared CANVIVA detail title, description and H1 identify the current product family and three formats.
- Image alt text uses each formal product title and states that the image is a design visualisation.
- Internal product cards keep the existing bilingual shared URL.
- The route set did not change, so the existing sitemap requires no new entries.

## Files changed for this update

- `src/content.js`
- `src/components.jsx`
- `src/pages.jsx`
- `src/App.jsx`
- `index.html`
- `AGENTS.md`
- `CAPABILITY_LOG.md`
- `QA_REPORT.md`
- `REACT_REVIEW.md`
- `VERIFICATION_REPORT.md`

No CSS, animation, Three.js, product-spin, image, video or hosted-source implementation was changed.

## Verification

- `npm run build`: passed, 4,581 modules.
- `npm run test:sites`: passed, 4/4.
- Local HTTP self-check: 200, zero failures.
- Real-browser desktop/mobile, bilingual SEO, filter and console checks: passed.
- `git diff --check`: no whitespace errors; Windows line-ending warnings only.
- Standard security scan: blocked before a scan ID was returned; no security completion claim.
- Git commit, push, deployment and publication: not performed.
