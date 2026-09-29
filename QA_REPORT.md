# QA Report

## 产品说明体系补强 — 2026-09-18（仅本地）

- 完成页面：`/zh-hk/products/canviva`、`/zh-hk/products/cuisviva-kitchen`、`/zh-hk/technology/xponge`、`/zh-hk/technology/doctor-forest`，并同步英文内容结构。
- 每页新增：产品状态、产品定义、系统组成、工作流程、规格/条件、安装与养护、实证状态、当前包含/不代表包含，以及醒目的「待补充材料」清单。
- 内容边界：没有虚构尺寸、测试、认证、价格、供应期、客户项目或服务承诺；只有仓库内已有且可限定条件的资料标为「现有资料」，其余直接显示为「待补充材料」。
- Product Design audit：桌面截图发现双层 sticky 导航遮挡，已修正为桌面 76px / 移动 68px 顶部偏移，并同步 section scroll margin；复测 CANVIVA「规格与条件」锚点时，section top=144px，未被两层导航遮挡。
- React review：新组件和静态数据没有引入 effect/data waterfall、重复全局监听器、动态重型依赖或不稳定列表 key；构建无 React 错误。
- 真实浏览器：四个中文详情页及 CANVIVA 英文页均渲染完整说明层；FAQ 从 `aria-expanded=false` 切换到 `true`；键盘 Tab 首个焦点为可见的「跳至主要內容」链接；浏览器控制台没有应用 error。
- 窄屏证据：`output/qa/qa-mobile-canviva.png`、`output/qa/qa-mobile-canviva-2x.png`。产品章节在窄屏横向滚动，规格表转为两行信息结构，固定查询按钮保留。
- 无障碍限制：安装的 `a11y-audit` Skill 缺少其要求的 WCAG/ARIA 参考文件，无法运行完整技能协议；已完成语义树、键盘焦点、状态文字、非纯颜色标示与可点击目标检查，但不宣称完整 WCAG 2.2 合规。
- 本地资源：CANVIVA URL 返回 HTTP 200；`local-web-self-check` 为 0 failures。
- 构建与测试：`npm run build` 通过（Vite 6.4.2，4,573 modules transformed）；`npm run test:sites` 4 passed、0 failed；`git diff --check` 无 whitespace error（只有 Windows LF→CRLF 提示）。
- Full-story verification：此功能是模块级静态产品资料 → `ProductGuide` → 双语详情页渲染；没有新增 API、数据库或外部提交边界。UI、锚点、交互、构建产物及 Sites worker 测试均通过。
- 安全：标准扫描 `0b153a05-27d3-4055-b25d-3545aa82aeb1` 已完成，0 critical / 0 high / 0 medium / 1 low。低风险项位于既有 `vercel.json:16-20`：Vercel 全路径回退包含不存在的 `/api/*`；当前仓库没有 API，本次产品说明改动没有引入该项。扫描报告位于 Codex Security 工作区，Daybreak 状态为 `not_granted`。
- 发布状态：本轮没有 commit、push、Vercel/Sites deploy 或生产发布；用户指定的自动播放演示包未改动。

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

## Production publish — 2026-08-23

- Source control: pushed the validated website to the private GitHub repository `bambi2008/hk-minijungle-site` on `main`.
- Vercel: production deployment reached `READY` and is aliased to `hkminijungle.com` and `hk-minijungle-site.vercel.app`; deployment URL responded with the expected HTML shell.
- Observability: Vercel error-log query for the first hour returned no logs.
- DNS: public DNS now resolves `hkminijungle.com` to `76.76.21.21`; HTTPS returned `200 OK` with Vercel security headers. Vercel marks the project attached and verified, with an optional recommendation to adopt its newer dual-A values. `www.hkminijungle.com` remains on the Namecheap parking CNAME until separately added to Vercel.

## Compact-office product imagery — 2026-08-23

- `/zh-hk/journal/compact-hong-kong-workplaces` now renders the original Hong Kong density image plus two supplied product images: `canviva-office-living-wall.png` and `canviva-art-wall.png`.
- Desktop browser check: gallery contains 2 frames at 478px each, with `概念效果圖` labels and nonzero natural image widths.
- Mobile browser check at 390×844: gallery collapses to one 350px column; both frames remain 360px high and readable.
- `npm run build`: passed. `npm run test:sites`: 4 passed, 0 failed. Production was not deployed.

## Automatic showcase HTML — 2026-08-25

- New static entry: `/hk-minijungle-auto.html`; it is served from `public/` and copied into `dist/client/` by the normal Vite build.
- Content: seven full-screen scenes covering the HK MINIJUNGLE hero, living index, CANVIVA, CUISVIVA KITCHEN, Xponge, DR FOREST and contact information. Existing images and verified copy are reused; concept visuals retain the `概念效果圖 · Concept visualisation` label.
- Motion: automatic seven-second slide rotation, progress dots, keyboard navigation, pause/resume control and `prefers-reduced-motion` fallback.
- Audio: low-volume file-internal ambient WAV generated in the page with no third-party audio URL. The page attempts autoplay and exposes a clear user-activation fallback when the browser blocks sound.
- Local resource check: `http://127.0.0.1:4173/hk-minijungle-auto.html` returned 200; all 7 referenced image resources returned successfully with no failures.
- Real-browser QA: title and hero content rendered; automatic rotation moved from `01 / 07` to `02 / 07`; pause held the slide; progress-dot navigation reached `04 / 07`; the music control reached `音乐中` after activation.
- Build/tests: `npm run build` completed with required Sites artifacts; `npm run test:sites` passed 4/4. No React component was changed, so React best-practices review was not applicable.
- Security: Codex Security standard scan was attempted but could not start because the current TAC status is `not_granted`; local static review found no external script, `eval`, `document.write` or untrusted HTML insertion in the new file. `npm audit` was unavailable because the configured npm mirror returns `NOT_IMPLEMENTED` for the advisory endpoint.
- Deployment: not performed. The new file is local and ready for the next explicitly approved GitHub/Vercel publish.

## 手机端首页完整产品展示 — 2026-08-31

- 根因：首页产品平台区此前使用 `productFamilies`，只渲染 CANVIVA 与 CUISVIVA KITCHEN；Xponge 与 DR FOREST 属于技术层，因此在首页缺席。
- 修正：首页产品平台区改为渲染完整 `products` 目录，保留现有产品详情链接与共享 `productFamilies` 导航语义不变。
- 真实浏览器 QA：390×844 手机视口下，首页 `.product-grid` 显示 4 张卡片，名称为 `生命畫境`、`鮮香植園`、`Xponge`、`DR FOREST`；四张卡片均有非零尺寸并可连续纵向滚动查看。
- 本地资源自检：`http://127.0.0.1:4173/zh-hk` 返回 HTTP 200，无资源失败。
- 构建与测试：`npm run build` 通过（Vite 6.4.2，4,573 modules transformed）；`npm run test:sites` 4 passed、0 failed。
- 安全：Codex Security 标准扫描 `f8e12554-f05a-4f82-94c7-19111686bf08` 已完成，0 findings；TAC 状态为 `not_granted`，报告按受限账户路径生成。
- GitHub：提交 `9cd14b4`（首页完整产品展示）及 `13628d7`（排除本地自动播放 HTML 的部署范围）已推送至私有仓库 `bambi2008/hk-minijungle-site` 的 `main` 分支。
- Vercel：生产部署 `dpl_Gj6cJVW9kAR2CmorLxCw9stUMUk8` 状态为 `READY`，已绑定 `hkminijungle.com`、`www.hkminijungle.com` 与 Vercel 默认域名。
- 线上浏览器 QA：`https://hkminijungle.com/zh-hk?qa=mobile-products` 在 390×844 视口显示 4 张产品卡，名称与本地一致，未发现横向溢出。
- 部署后错误日志：过去 1 小时无 production error logs。

## 手机版首页产品入口前置 — 2026-09-04

- 首页 Hero 保持全屏；手机版在 Hero 底部新增四项产品快速入口，打开首屏即可看到生命畫境（CANVIVA）、鮮香植園（CUISVIVA KITCHEN）、Xponge 与 DR FOREST，并分别链接到对应详情页。
- 390×844 真实浏览器检查：入口区域位于首屏 y=672–828，四项均可见；DR FOREST 不再被省略号截断；页面宽度 375px、无横向溢出；首页下方完整产品卡区仍保留 4 张卡片。
- 浏览器控制台错误检查：未发现 error 日志。
- 本地资源自检：`http://127.0.0.1:4173/zh-hk` 返回 HTTP 200，无资源失败。
- 构建与测试：`npm run build` 通过（Vite 6.4.2，4,573 modules transformed）；`npm run test:sites` 4 passed、0 failed。
- 安全：标准安全扫描尝试启动失败，工作台未返回可审计结果；因此不将本次变更标记为已完成安全扫描。
- 部署：本次仅完成本地源码修改与验证，尚未推送 GitHub 或发布 Vercel，待用户确认后再部署。

## GitHub 推送与正式部署 — 2026-09-05

- GitHub：已将验证通过的源码和三张产品图推送到私有仓库 `bambi2008/hk-minijungle-site` 的 `main`，提交为 `2ed6f51991faa667fdeed5b4e414128161ff987c`。
- Vercel：生产部署 `dpl_FoHTYD1jC4aN1UixgD3RBoPS9jYU` 状态为 `READY`；正式别名为 `https://hkminijungle.com`、`https://www.hkminijungle.com` 及 `https://hk-minijungle-site.vercel.app`。
- 线上 HTTP 验证：`/zh-hk` 和 `www` 入口均返回 200；`/images/canviva-office-wall.png`、`/images/canviva-art-lobby.png`、`/images/canviva-art-wall.jpg` 均返回 200，类型和文件大小符合本地构建产物。
- 正式域名真实浏览器验证：首页渲染 6 张产品卡，包含「生命畫境 · 垂直綠牆」与「生命畫境 · 藝術款」；「工作與空間」筛选渲染 3 张 CANVIVA 卡片；无横向溢出，控制台错误为 0。
- 备注：`public/hk-minijungle-auto.html` 与 `output/` 仍按 `.vercelignore` 排除在正式站部署之外，自动播放演示页不影响 React 正式站。
- 安全：本次未重新运行标准安全扫描，不将本次标记为 0 findings。
- 最终同步：提交 `bd84081` 对应的生产部署为 `dpl_8NUpKoJvGbHHrqvcrxGq8aqQupxR`，状态 `READY`；上面的线上检查在部署完成后重新确认。

## 首页艺术款产品图替换 — 2026-09-04

- 用户提供的原图已保存为 `public/images/canviva-art-wall.jpg`，保留 1080×1440 原尺寸；该图为金色壁挂植物艺术装置，用作 `CANVIVA / 生命畫境` 的首页素材。
- 首页 Hero 底部产品快速入口与 Hero 后完整产品卡均显示该图片，首张产品卡和入口的图片 URL 均为 `/images/canviva-art-wall.jpg`。
- 390×844 真实浏览器检查：四项入口和四张产品卡均渲染，艺术款图片 `complete=true` 且 `naturalWidth>0`；页面无横向溢出，控制台 error 日志为空。
- 本地自检：`http://127.0.0.1:4173/zh-hk` 返回 HTTP 200，无资源失败。
- 构建与 Sites worker 测试：`npm run build` 通过；`npm run test:sites` 4/4 通过。
- 本次未推送 GitHub 或发布 Vercel；标准安全扫描此前未返回可审计结果，因此不标记为本次已完成。

## 办公产品款式补齐与首页滚动目录 — 2026-09-04

- 新增两张用户提供的办公产品图：`public/images/canviva-office-wall.png`（生命畫境 · 垂直綠牆）与 `public/images/canviva-art-lobby.png`（生命畫境 · 藝術款）。
- 「工作與空間」筛选现显示 3 张 CANVIVA 办公卡片：生命畫境、生命畫境 · 垂直綠牆、生命畫境 · 藝術款；两款式均链接至共享 CANVIVA 详情页。
- 首页产品区现位于 Hero 后，向下滚动即可看到 6 张产品卡（4 个产品层 + 2 个办公款式）；已移除此前首屏底部四格快速入口，避免把「首屏全量展示」误当成需求。
- 390×844 真实浏览器检查：6 张首页卡片与 3 张办公筛选卡片均加载完成，新增图片 `naturalWidth>0`，无横向溢出，控制台 error 日志为空。
- 1440×1024 桌面浏览器检查：办公筛选的 3 张卡片等宽（307px），两张新增图片加载完成且无横向溢出。
- 本地资源检查：两张新增图片均返回 HTTP 200；`http://127.0.0.1:4173/zh-hk` 返回 HTTP 200，无资源失败。
- 构建与 Sites worker 测试：`npm run build` 通过；`npm run test:sites` 4/4 通过。
- 本次未推送 GitHub 或发布 Vercel；标准安全扫描此前未返回可审计结果，因此不标记为本次已完成。

## 2026-09-18 — CUISVIVA KITCHEN 多角度产品视图

**Story:** 访客在 CUISVIVA KITCHEN 产品页拖动产品、点击前后按钮或使用键盘方向键，以多角度理解产品外观，同时不会把生成的背面视角误认作正式工程设计。

| Boundary | Status | Evidence |
|---|---|---|
| 页面 → 旋转素材 | Passed | 当前帧使用 `/images/cuisviva-spin-concept-v1-00.webp`，`complete=true`、`naturalWidth=1536`；八个资源均返回 HTTP 200。 |
| 鼠标/触摸拖动 → 视角 | Passed | 390×844 实际拖动后 slider 从 1 更新到 6，计数显示 `06 / 08 · 225°`，画面同步切换。 |
| 按钮 → 视角 | Passed | 「下一個視角」把 `aria-valuenow` 从 1 更新到 2，计数更新为 `02 / 08 · 45°`。 |
| 键盘 → 视角 | Passed | slider 获取焦点后按右方向键，值从 2 更新到 3，计数为 `03 / 08 · 90°`。 |
| 桌面响应式 | Passed | 1440×1000 下 viewer 宽 773px、双栏排版、无横向溢出、移动 CTA 隐藏。 |
| 手机响应式 | Passed | 390×844 下单栏宽 335px，`touch-action: pan-y`，无横向溢出；竖向页面滚动与横向旋转可并存。 |
| 双语与可访问性 | Passed | 中英文标题、说明、按钮名称、slider 标签及视角文字均本地化；焦点环可见，按钮为原生控件。 |
| 图片真实性边界 | Passed | 查看器持续显示 `概念效果圖 / Concept visualisation`；正式环拍、背面结构、接口与尺寸明确列为待补充材料。 |
| 浏览器运行 | Passed | 中英文路由正常，控制台 error 列表为空。 |
| 构建与 worker | Passed | `npm run build` 通过；`npm run test:sites` 4/4 通过。 |
| 标准安全扫描 | Blocked | Codex Security 工作台启动命令失败且未返回扫描 ID；未重试替代扫描，也不声明 0 findings。 |
| 生产 | Not run | 用户要求先不上线；没有提交、推送、部署或发布。 |

Residual limitation: 八个视角是概念原型，角度之间存在生成式细节差异。正式发布质量应换成同一实体的 36–48 帧环拍或确认后的 3D 模型。

## 2026-09-18 — 首页 CUISVIVA 厨房生活方式 Hero 概念视频

**Story:** 访客打开首页后，看到 CUISVIVA KITCHEN 在欧美家居厨房中的生活方式画面：从设备现摘罗勒并加入意面；媒体静音自动播放、循环，在减少动态偏好下回退为静态首帧。

| Boundary | Status | Evidence |
|---|---|---|
| 概念素材边界 | Passed | 三张生成画面及首页可见标签均使用 `概念效果視頻 / Concept video`；没有把画面描述为真实客户、正式量产外观或实拍项目。 |
| 首页 → 视频资源 | Passed | `/zh-hk`、WebM 与首帧 PNG 均返回 HTTP 200；视频类型为 `video/webm`、文件大小 1,729,705 bytes。 |
| 浏览器解码 | Passed | 390×844 浏览器中 `readyState=4`，时长 13.48 秒。 |
| 自动播放行为 | Passed | `autoplay=true`、`muted=true`、`loop=true`、`playsInline=true`、`paused=false`，两次读数确认 `currentTime` 前进。 |
| 场景表达 | Passed | 桌面真实浏览器先看到现摘罗勒，再看到叶片撒入意面的画面，产品持续可识别。 |
| 响应式 | Passed | 390×844 无横向溢出；Hero 媒体按竖屏裁切，标题、两项 CTA 与概念标签仍可见。 |
| 减少动态 | Passed | `prefers-reduced-motion: reduce` 时视频 `display:none`，静态首帧为 `display:block`。 |
| 运行错误 | Passed | 浏览器控制台 error 列表为空。 |
| 构建与 worker | Passed | `npm run build` 通过（4,573 modules）；`npm run test:sites` 4/4 通过。 |
| API / 数据边界 | Not applicable | 首页只读取同源静态 PNG/WebM，不发送 API 请求或保存用户数据。 |
| 标准安全扫描 | Blocked | Codex Security 工作台启动命令失败且未返回 `scanId`；未重试替代扫描，也不声明 0 findings。 |
| 生产 | Not run | 没有提交、推送、部署或发布。 |

Residual limitation: 当前是三张连续生成关键画面经本地浏览器合成的概念动态，不是摄制或生成模型输出的真实连续动作。正式上线前应换成获批实拍或具备产品一致性的连续视频素材，并补充 MP4 兼容源。

## 2026-09-20 — MiniMax H3 首页厨房 Hero 视频替换

**Story:** 访客打开中英文首页后，浏览器加载用户确认的 MiniMax H3 Max Turbo 厨房视频，静音自动播放并循环；生成素材持续显示概念视频标签，减少动态偏好时保留静态首帧。

| Boundary | Status | Evidence |
|---|---|---|
| 概念素材边界 | Passed | 首页显示 `概念效果視頻 / Concept video`；未把生成场景描述为客户实拍、量产产品或验证数据。 |
| 首页 → 视频资源 | Passed | `/zh-hk`、`/en` 与 `/videos/cuisviva-kitchen-h3-turbo-concept-v1.mp4` 均返回 HTTP 200；MP4 为 9,242,499 bytes。 |
| 浏览器解码与播放 | Passed | 真实浏览器报告 1344×768、5.184 秒、`readyState=4`、`autoplay=true`、`muted=true`、`loop=true`、`paused=false`，播放时间持续前进。 |
| 双语与响应式 | Passed | 中文标签为 `概念效果視頻`，英文标签为 `Concept video`；577×731 无横向溢出，标题、说明、两项 CTA 与标签均可见。 |
| 减少动态 | Passed | 既有 `prefers-reduced-motion: reduce` 规则继续隐藏视频并保留首帧。 |
| 运行错误 | Passed | 两个语言路由均无 Vite error overlay；资源加载和视频播放正常。 |
| 构建与 worker | Passed | `npm run build` 通过（4,573 modules）；`npm run test:sites` 4/4 通过。 |
| React review | Passed | 仅替换固定同源媒体源；无新 hook、state、effect、fetch、依赖或不安全 HTML。 |
| 标准安全扫描 | Passed with findings | Scan `fd3056b8-6a1e-4ef9-b6b5-d0eaa39725d4` 完成，声明源文件覆盖完整；发现 2 个与视频无关的既有低风险项（analytics 查询值未白名单、Vercel `/api` fallback 条件问题）。 |
| 生产 | Not run | 未部署或发布到任何服务器。 |

浏览器证据：`output/qa/h3-hero-mobile.png`。Residual limitation：视频为 5.184 秒、9.24 MB 的概念素材，循环边界仍可察觉；本地缺少可用编码器，未经授权也未上传第三方压缩服务，后续正式发布前宜补做体积与循环优化。

## 2026-09-29 — 互动草地首页 Hero

- 首页入口：`/zh-hk` 与 `/en` 打开即显示 Three.js 互动草地，保留现有品牌导航、双语文案与两项 CTA。
- 交互：桌面与移动真机视口均渲染局部柔性草地；拖动不会再选中文字。风声音频默认为关闭，开关的中英文可访问名称与按压状态正常。
- 响应式：1440×900 与 390×844 真实浏览器截图确认无横向溢出，标题、正文、CTA 和交互标签均在首屏内可读。
- 运行：中文、英文路由控制台均无 error／warn；HTTP 自检返回 200，关键 Vite／JSX／CSS 资源均返回 200。
- 性能：Three.js Hero 使用 lazy chunk；生产主包 360.75 kB（gzip 117.99 kB），草地 chunk 482.09 kB（gzip 122.86 kB）。手机 68,000 株草地初始化约需 2 秒，同色 fallback 避免白屏。
- 构建：`npm run build` 通过（4,577 modules），`npm run test:sites` 4 passed、0 failed。
- 安全：标准安全扫描尝试启动，但 Codex Security 工作台命令失败且没有返回 `scanId`；不将本次标记为扫描完成或 0 findings。
- 生产：未提交、推送、部署或发布；正式域名内容没有改变。

## 2026-09-29 — 首页产品区恢复 CUISVIVA 旋转展示

- 首页结构：互动草地继续作为 Hero；原有 CUISVIVA KITCHEN／鲜香植园 8 帧机器旋转展示复用到 Hero 后的产品平台区，未移入 Purrl。
- 桌面交互：鼠标在机器画面内左右移动会按局部横向位置切换 8 个角度；拖动、上一角度／下一角度按钮及键盘左右键均保留。实测按钮从 01→02、拖动到 05、键盘到 06。
- 手机布局：390×844 下说明与查看器为单栏，内容宽 335px，页面 `scrollWidth=375` 与 `clientWidth=375`，无横向溢出。
- 桌面布局：1440×900 下展示为说明／机器双栏，完整查看器和后续产品卡均正常显示。
- 双语与可访问性：`/zh-hk` 与 `/en` 的标题、提示、按钮、slider 名称和角度文字正确；概念效果图标签持续可见。
- 资源与性能：8 个 WebP 均返回 200；非首帧在查看器接近视口后才预载，避免首页首屏立即拉取整组旋转素材。
- 运行：真实浏览器 console error／warn 均为 0；本地自检与首页、英文路由 HTTP 检查通过。
- 构建与测试：`npm run build` 通过（4,577 modules）；`npm run test:sites` 4/4 通过；`git diff --check` 通过。
- 安全：standard scan `1b7de9c4-f105-471b-ae58-fe26c72569e7` 完成，完整覆盖、0 findings。扫描报告保留了外部联系接口及未来 analytics 接收方不在仓库内的部署边界；目录变化提示来自扫描期间追加的验证文档，产品旋转源码未在扫描启动后更改。
- 发布：未提交、推送、部署或发布；正式站未改变。
