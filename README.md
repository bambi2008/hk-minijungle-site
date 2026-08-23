# HK MINIJUNGLE official website — phase one

A responsive bilingual brand website for HK MINIJUNGLE, implemented from the selected Product Design visual direction. It separates B2B space journeys from B2C home journeys while presenting products, technology and development evidence with explicit maturity labels.

## Run locally

```bash
npm install
npm run dev
```

The local Vite server serves both locale routes and all SPA detail routes.

## Build and verify

```bash
npm run build
npm run test:sites
```

The build creates the static client in `dist/client`, the worker in `dist/server`, and Sites metadata in `dist/.openai/hosting.json`.

## Content updates

- Global strings, legal name and contact placeholders: `src/content.js`
- Products, solutions, proof notes and journal drafts: `src/content.js`
- Shared layout and UI: `src/components.jsx`
- Page templates: `src/pages.jsx`
- Route map and dynamic metadata: `src/App.jsx`
- Visual system and responsive rules: `src/site.css`
- Generated concept imagery: `public/images/`

Every generated scene is labelled in the interface as `概念效果圖 / Concept visualisation`. Replace an image only after updating its evidence type and public-use approval metadata.

## Contact form

Set `VITE_CONTACT_ENDPOINT` to a JSON-accepting endpoint. Without it, the form does not pretend to succeed: it keeps the entered values and shows a clear unconfigured state. Do not place secrets in any `VITE_` variable because Vite exposes those values to the browser.

## Deployment

No public deployment has been performed or authorized. Confirm all items in `CONTENT_TODO.md` and `QA_REPORT.md` before publishing.

