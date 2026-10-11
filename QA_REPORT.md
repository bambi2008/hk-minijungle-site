# QA Report

## 2026-10-11 — GitHub 保存边界

用户授权将当前官网保存到独立私有 GitHub 仓库的 `codex/geo-backup-20261011` 分支。GitHub 无 Actions 工作流；只读 Vercel 项目检查确认没有 Git 集成连接。此次提交/推送不修改 main、不创建/合并 PR、不部署；私有配置、缓存和临时诊断文件不上传，保留本地。此前 build/GEO/Sites/浏览器及安全验收证据未变；本轮无 runtime source 变化。

推送前回归：GEO 6/6、Sites 5/5、plant 工具 17/17，共 28/28 通过；staged diff --check 通过，无敏感配置路径或超过 50 MB 文件。本地 QA helper 源码和本轮四张验收截图一并保存。

## 2026-10-11 — GEO 最后安全门槛完成与本地链接复核

- 用户授权确切 `safe.directory` 后，正式 Standard scan `3468b0a0-5c74-42f9-a8ab-65656675792d` 完成，canonical 文件封存，0 可报告漏洞。以下早期启动失败记录为历史状态，已由本节取代。
- 独立离线源码审查覆盖全部非排除 authored source：107 个文本完整审查；100 个生成诊断仅凭据筛查、187 媒体及一个 ZIP 的媒体内部排除明示。ZIP manifest 和 HTML 同一性检查通过。不包含线上部署、外部后台或依赖漏洞情报；不声明零风险。
- 报告：[标准安全报告](C:/Users/ss/.codex/state/plugins/codex-security/scans/hk-minijungle-site/df0fba7c205df0604c02472b02066dd6e2a3e6f3_20261011T104114Z_0meurir9/report.md)。本地 QA helper 异常 URL 解码作为非生产健壮性观察保留，无源码修补或线上变更。
- 扫描结束后交付复核：`http://127.0.0.1:4175/zh-hk` 与 logo 200；`/src/main.jsx` 200/text-javascript、`/src/site.css?direct` 200/text-css。真实 Chromium About 标题为「關於我們 | HK MINIJUNGLE」，FAQ 点击后「甚麼是 CANVIVA？」expanded，答案含三种正式命名；待補充材料可见，console error 0（仅 React DevTools info）。
- 证据：`output/playwright/geo-2026-10-10/.playwright-cli/page-2026-10-11T11-04-01-310Z.yml` 和 `page-2026-10-11T11-04-33-195Z.yml`。这是 dev 链接健康复核，不替代 2026-10-10 的生产 Worker/hydration 与移动端验收。
- 已完成本轮 GEO 本地技术验收。仍未收到指定策略 brief，无法核对 Section 19；生产表单接收端和获批案例/规格等材料待补，网页保留标注。未提交、推送、部署或发布。

## 2026-10-11 — 安全扫描启动诊断

- 正式 Standard 启动仍没有返回 `scanId`，因此不标记安全验收通过。
- 根因证据：站点 `.git` 由 `CodexSandboxOffline` 所有，当前用户 `ss` 下 Git 返回 `detected dubious ownership`；插件转用普通目录快照，纳入忽略的依赖／构建／离线数据。
- 一次性 `git -c safe.directory=<确切站点路径>` 的只读检查已验证仓库识别恢复，inventory 为 395 个路径。
- 自动审批拒绝持久添加该路径到用户级 Git 信任配置：需要用户明确授权这个具体设置。没有修改全局配置，也没有规避扫描流程。
- 网页源代码与已验证行为未改变；本轮没有提交、推送、部署或发布。

## GEO 真实浏览器续测 — 2026-10-10（仅本地）

- 授权与工具：用户允许改用 Playwright；以真实 Chromium 检查 1440×900 与 390×844，最终路由证据来自使用 `dist/server/index.js` 的本地 Worker 模拟服务。
- 交互：FAQ 由第一题切换至「甚麼是 CANVIVA？」后 `aria-expanded=true` 且答案正确；手机菜单显示 CANVIVA／应用场景／项目与实践／关于／联系；产品 SIGNATURE 筛选只保留一张卡并 `aria-pressed=true`；英文切换保留 `/about` 路径。
- Schema／品牌：浏览器读取 About 为 Organization + FAQPage；产品目录 ItemList 的名称严格为 `CANVIVA SIGNATURE|CANVIVA WALL|CANVIVA PANEL`。没有公开退休品牌架构。
- Hydration：生产 Worker 模拟下，无尾斜杠 `/zh-hk/about` 与 `/zh-hk/contact?intent=proposal` 均返回正确预渲染 HTML，Contact 正确预选「索取项目建议」，console 0 error／0 warning。Vite preview 的 SPA 回退不作为生产路由证据。
- 响应式：桌面和 390px 手机 `scrollWidth <= clientWidth`；中英文 About、FAQ、待补材料和手机菜单没有截断或横向溢出。
- Product Design 修正：浅色 About FAQ 区的待补材料文字最初对比度过低；新增 contextual CSS 后，标签计算颜色为 `rgb(18,55,47)`，正文为 `rgb(30,36,33)`，截图复核清晰。
- 证据：`output/playwright/geo-2026-10-10/about-desktop-hero.png`、`about-desktop-faq-fixed.png`、`about-mobile-menu.png`、`about-mobile-faq-fixed.png`。
- 回归：最新 build 成功生成 43 个路由；GEO 6/6，Sites 5/5。未做正式 WCAG 合规声明；生产表单接收端仍未配置；标准安全扫描仍因无 `scanId` 阻塞。
- 发布状态：未 commit、push、deploy 或 publish；正式网站没有变化。

## GEO 抓取与结构化数据优化 — 2026-10-09（仅本地）

- 品牌一致性：公开内容只保留 CANVIVA SIGNATURE／WALL／PANEL 与商业空间定位；CUISVIVA、家居产品、园艺治疗、旧产品名和季节产品没有重新进入导航、Schema 或 `llms.txt`。
- 静态可抓取性：production build 预渲染根路由及 sitemap 的 42 条公开 URL，共 43 条；关键页面 HTML 在 JavaScript 执行前已包含正文、语言、canonical、hreflang、robots 和路由级 JSON-LD。
- 结构化数据：首页包含 Organization + WebSite；产品目录包含三个正式产品的 ItemList；共享 CANVIVA 详情包含 ProductGroup 及三个 variant；About 的 FAQPage 问答与页面可见问题逐项一致。
- 缺失材料：About 页面可见列出客户案例／评价、经验证性能、最终规格／饰面、价格／交期、SLA、香港以外服务覆盖等待补项；这些信息没有被虚构到 Schema。
- 自动验证：`npm run build` 通过（4,582 modules，43 routes prerendered）；`npm run test:geo` 6/6；`npm run test:sites` 5/5；About local-web-self-check HTTP 200、0 resource failures。`/llms.txt` 为 `text/plain`，首行为 `# HK MINIJUNGLE`，包含 SIGNATURE 且不含退休品牌词。
- React／hydration：SSR 改用 streaming + `onAllReady` 后，构建 HTML 未出现 `Switched to client rendering` 或 Suspense 降级标记；Contact 查询参数处理已避免服务端／客户端首屏状态不一致。
- 尚未完成：应用内浏览器内核报 `CreateProcessSecurityEnvironment failed (0x80070002)` 并退出，真实桌面／手机 FAQ 交互、hydration console 和视觉审查待用户授权改用 Playwright CLI。标准安全扫描工作台约三分钟未返回 `scanId`，没有宣称完成或零风险。
- 发布状态：未 commit、push、deploy 或 publish；正式网站没有变化。

## 2026-10-07 — 蔬菜资料离线批次

14/14 边界测试通过；1,513 导入分类唯一 ID/slug、0 schema invalid，旧 1,439 记录原字段及原数组前缀保留。75 当前蔬菜分类图片核对许可、作者、目录、字节数、hash 和图片签名通过；1,238 原文快照逐份 URL/revision/hash 核对及 0 网络缓存重跑通过。

资料覆盖不是完整度认证：113 crop／75 当前分类，中文介绍 73/75、图片 75/75；部分中文养护 22 crop／135 字段。芝麻菜／园艺食用大黄加入正确分类关联，野生近缘档案保留。总去重档案 1,515，导入有图 1,179、中文名 933、中文介绍 655；原文快照对应 1,203 去重页面。未专业审校、未发布。完整逐株缺项保留。

本轮仅 output/data/docs；没有新增 UI、浏览器、视觉、React 或 Sites 验收结论。指定 brief 缺失；security-scan 0.1.32 desktop 规定不绕过既有无 scanId 的启动故障，标准扫描未完成。详见 output/plant-data-zh/VEGETABLE_KNOWLEDGE_REPORT.md；skill 记录在 CAPABILITY_LOG.md。

## CANVIVA 正式命名更新 — 2026-10-07（仅本地）

审查范围：产品目录 `/{locale}/products`、共享详情页 `/{locale}/products/canviva`，以及 SIGNATURE 类型筛选。用户目标是按正式名称识别三类 CANVIVA 产品并进入现有详情说明，同时不改变现有视觉、动画或互动架构。

1. 中文产品目录 — 健康：良好。真实浏览器确认左／中／右依次为 `CANVIVA SIGNATURE / 生命畫境・定制`、`CANVIVA WALL / 生命畫境・綠牆`、`CANVIVA PANEL / 生命畫境・植景屏`；图片依次为 `/images/canviva-art-wall.jpg`、`/images/canviva-office-wall.png`、`/images/canviva-art-lobby.png`，三张均保留「設計效果示意」。
2. 产品类型筛选 — 健康：良好。点击 `SIGNATURE` 后只显示 SIGNATURE，按钮 `aria-pressed=true`；切回「全部」恢复三张卡。
3. 英文产品目录与 SEO — 健康：良好。标题和 Open Graph 为 `CANVIVA SIGNATURE, WALL & PANEL | HK MINIJUNGLE`；描述列出三类正式名称；图片 alt 使用英文正式名称并保留 `design visualisation`。
4. 共享详情页 — 健康：良好。H1 已同步为三类正式名称，中文 title、description、canonical 正确；三个卡片继续进入成熟的共享路由，不人为增加空洞详情页。
5. 390px 手机列表 — 健康：良好。卡片按单栏排列，名称未截断，设计效果标签可见，`scrollWidth === clientWidth`，无横向溢出。

Product Design / accessibility notes：正式英文名称作为主标题、中文作为辅助名称，层级清楚；图片标签与 alt 不依赖纯视觉推断。真实浏览器 console 为 0 error／0 warning。当前审查没有执行全站屏幕阅读器、全键盘路径或仪器化对比度测试，因此不声明完整 WCAG 合规。应用内浏览器截图已在本轮逐张检查；浏览器能力没有提供可保存到仓库的截图路径，故报告保留 DOM、交互和运行证据，不伪造本地截图文件。

自动验证：production build 通过（4,581 modules）；Sites worker 4/4；local-web-self-check 为 HTTP 200、0 failures；`git diff --check` 没有 whitespace error，只有 Windows 行尾提示。Standard Security Scan 工作台未返回 `scanId`，所以安全门槛仍未完成。未 commit、push、deploy 或 publish。

## CANVIVA 商业空间品牌聚焦 — 2026-10-06（仅本地）

- 桌面首页：`output/qa/brand-focus-2026-10-06/01-home.png`；CANVIVA 商业定位、两项主 CTA、原互动草地与导航层级均正常。
- CANVIVA 详情：`output/qa/brand-focus-2026-10-06/02-canviva.png`；商业空间 Hero 与「设计效果示意」标签可见，主内容没有 DR FOREST 内部产品表述。
- 手机首页：`output/qa/brand-focus-2026-10-06/03-home-mobile.png`；390×844 下标题、文案、两个 CTA、移动菜单与互动草地无横向溢出。
- 互动：桌面 CANVIVA 下拉菜单成功展开；产品页「酒店会所」筛选把可见卡片收敛为核心系统和艺术款，`aria-pressed` 同步更新。
- 归档：`/zh-hk/products/cuisviva-kitchen` 显示存档说明与 CANVIVA 返回路径，并输出 `noindex,follow`；旧源码和资产未删除。
- 双语／SEO：`/en` 显示 `Living Art. Built for Space.`，主导航为 CANVIVA / Applications / Projects / About；中英文首页为 `index,follow` 且 canonical 正确。公开 sitemap 不包含 CUISVIVA、家居、DR FOREST、植物库或识别路线。
- 运行状态：production build 通过；Sites tests 4/4；local-web-self-check HTTP 200、0 failures；公开 sitemap 42 个 URL 本地逐一返回 200；最终浏览器 console 0 errors / 0 warnings。
- Product Design 审查限制：截图和 AX 快照只支持当前页面层级、响应式和明显可访问性风险判断，不构成完整 WCAG 合规证明。未发现因本轮内容变更产生的可见阻断问题。
- 安全限制：Codex Security desktop standard scan 工作台两次初始化失败，未返回 scan ID；本轮不宣称完成标准安全扫描。
- 发布边界：无 commit、push、deploy 或 production publish。

## 首頁獲客優化 — 2026-10-03（僅本地）

- 已完成：雙語 Hero 定位與 CTA、三類場景判斷卡、價格／商業資料狀態、現有實證入口、明確待補材料、四步合作流程，以及低門檻「場地初步評估」表單路徑。
- 誠信邊界：沒有加入虛構價格、客戶 Logo、評價、項目成效、回覆時效或未核實產品參數；缺口仍顯示為「待補充材料／待確認」。
- 表单流程：`/zh-hk/contact?intent=site-assessment` 会预选「场地初步评估」，不要求公司和职位；改收集空間類型／地區。邮件与现有电话可点击，WhatsApp 仅保留已知 ID。
- Product Design source audit：保留既有森林綠、象牙白、襯線標題、互動草地與產品旋轉；新增區塊延續既有卡片、邊框、字級和響應式規則。桌面三欄／四步流程在 1100px 轉兩欄、800px 轉單欄。
- React best-practices：新增內容在模組層，列表 key 穩定，沒有新增 effect、資料瀑布、外部腳本、URL 控制資源或 unsafe HTML。production build 通過。
- 自動驗證：`npm run build` 通過（4,577 modules）；`npm run test:sites` 4/4；`git diff --check` 無 whitespace error；local-web-self-check HTTP 200、0 failures；場地初評 URL HTTP 200。
- 尚未完成：應用內瀏覽器連續超時；切換 Playwright 需要用戶明確同意，因此尚未取得本輪桌面／手機視覺、CTA 點擊、表單狀態及 console 的真實瀏覽器證據。Codex Security 工作台啟動沒有返回 `scanId`，本輪不聲稱標準安全掃描完成。
- 發布狀態：沒有 commit、push、deploy 或修改正式網站。

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

## 2026-10-06 — 全球植物知识库与 AI 识别架构

**用户故事：**访客可以在双语植物库中搜索德国、美国、香港、中国大陆、英国和法国植物，打开带来源的单株档案，并把照片上传到识别原型；网站不会假装 AI 模型已经连接。

| 边界 | 状态 | 证据 |
|---|---|---|
| 植物库路由 | Passed | `/zh-hk/plants` 与 `/en/plants` 标题、本地化和 6 条档案正常。 |
| 地区筛选 | Passed | 点击 `HK 香港` 后 pressed state 正确，结果从 6 变为 1，只保留洋紫荆。 |
| 高级筛选 | Passed | 桌面原生 select 正常；390×844 手机打开底部筛选抽屉，支持 Escape 及背景滚动清理。 |
| 单株详情 | Passed | 洋紫荆详情显示图片、学名、六项速览、养护/分类、机构来源和 Commons 授权。 |
| 图片上传 | Passed | 本地银杏 JPEG 成功上传预览，移除后可以重选相同文件。 |
| AI 状态 | Passed | “开始识别”明确返回 `model-not-configured`，0 个伪造候选，未发出外部请求。 |
| 响应式 | Passed | Playwright 检查 1440×1100、1280×800、390×844；桌面 `scrollWidth === clientWidth`，手机无横向溢出。 |
| Console | Passed | 补 favicon 后，新 Playwright 会话 0 error、0 warning。 |
| 本地自检 | Passed | 页面 HTTP 200；关键图片资源检查无失败。 |
| 构建与 Sites | Passed | `npm run build` exit 0；`npm run test:sites` 4/4；`git diff --check` 无 whitespace error。 |
| React review | Passed | 检查 state/effect 清理、稳定 key、本地化和 provider 边界；发现项已修复。 |
| Product Design audit | Passed | Gardify 与实现以相同 1280×800 同屏对照；保留信息关系并加入品牌视觉和来源层。 |
| Standard security scan | Blocked by tool | Codex Security `start-prompt-only-scan` 在返回 `scanId` 前失败；没有建立替代扫描，也不声称扫描成功。 |
| 发布 | Not run | 未获授权 commit、push、deploy 或 publish。 |

浏览器证据位于 `output/qa/plant-library/`。实现与浏览器验证已通过，但在 Codex Security launcher 能成功建立扫描前，仓库最终安全门槛仍未完成。

## 2026-10-06 — 植物批量导入 staging layer

**用户故事：**编辑人员先取得并审核本地来源导出，再通过来源 adapter 归一化、验证、去重和 dry-run；未经人工复核或图片许可不合格的记录不能进入发布状态。

| 边界 | 状态 | 证据 |
|---|---|---|
| GBIF JSON → schema | Passed | 当前接受名 fixture 归一化为稳定 ID、slug、分类、俗名、地区和 provenance。 |
| Schema validation | Passed | 缺来源、未知地区、缺图片作者/许可/来源页均会失败。 |
| Commons licence gate | Passed | `All rights reserved` fixture 被 allowlist 明确拒绝。 |
| Deduplication | Passed | 同 canonical name + rank 合并，保留多语言名称和两个来源；冲突单独记录。 |
| Publication gate | Passed | `machine-normalized` 记录以 `--publish` 运行时 exit 1，错误为需要 editor review。 |
| Offline dry-run | Passed | 1 input → 1 normalized、0 invalid、0 conflicts，且不产生输出文件。 |
| Automated tests | Passed | `npm run test:plants` 6/6。 |
| Regression | Passed | Vite build exit 0；Sites worker 4/4；`git diff --check` 无 whitespace error。 |
| Network boundary | Passed | CLI 禁止 HTTP(S) input；仅人工执行过一次 GBIF 官方只读 key 核对。 |
| Security scan | Blocked by tool | 第二次桌面 Standard Scan 启动仍在返回 `scanId` 前失败。 |

本阶段只新增离线数据工具，没有改变现有 React 页面或视觉，因此无需重复浏览器视觉 QA。

## 2026-10-06 — GBIF 批量下载与恢复 QA

**用户故事：**编辑人员可以分批下载 GBIF 接受的维管植物分类记录，保留原始响应和来源；网络失败后从检查点续传，并且机器记录不会被误当作已发布内容。

| 边界 | 状态 | 证据 |
|---|---|---|
| 官方分类范围 | Passed | GBIF match API 返回 Tracheophyta accepted phylum key `7707728`；推荐默认范围不再混入广义 Plantae 下的藻类。 |
| 分页下载 | Passed | 1,000 条真实批次按 200 条/页保存 5 个原始 JSON 页面。 |
| 数据完整性 | Passed | 1,000 条规范化记录、1,000 个唯一 GBIF ID、0 invalid、0 conflict、0 缺失 family，全部 phylum 为 Tracheophyta。 |
| 断点续传 | Passed | 离线故障注入测试确认已保存第一页不会重取；真实完成批次使用 `--resume` 保持 1,000 条并不访问新页面。 |
| 范围和写入限制 | Passed | 单次上限 10,000；拒绝项目目录外输出；已有页面要求显式 `--resume`。 |
| 发布门槛 | Passed | manifest 标记 `rightsReviewRequired: true`、`publicationEligible: false`；记录维持 `machine-normalized`。 |
| 自动测试 | Passed | `npm run test:plants` 10/10。 |
| 回归 | Passed | Sites worker 4/4；Vite/Sites production build exit 0（4,580 modules）。 |
| UI QA | Not triggered | 本阶段未改 React、CSS 或页面交互。 |
| 发布 | Not run | 数据目录被 Git 忽略；未 commit、push、deploy 或 publish。 |

推荐数据位于 `data/plant-import/gbif-tracheophyta/`；广义 `gbif-plantae/` 试批次仅供分类范围比较。

## 2026-10-06 — 1,000 条植物图片与资料批量补全 QA

**用户故事：**当前 1,000 条维管植物在一次可续传流程中取得可审计的英文简介与许可合格图片；没有可靠匹配的植物明确留空，而不是被相似图片替代。

| 边界 | 状态 | 证据 |
|---|---|---|
| 全批处理 | Passed | 1,000/1,000 条完成，manifest 状态 `complete`。 |
| 文字资料 | Passed | 629 条精确科学名或 Wikimedia 正式 redirect 命中的 Wikipedia 导言，保存文章 URL 和 CC BY-SA 4.0。 |
| 图片覆盖 | Passed | 676 条拥有本地 Commons 图片；主图不足时仅使用元数据明确包含完整科学名的精确搜索结果。 |
| 许可过滤 | Passed | 逐图保存作者、许可 URL 与来源页；拒绝 `COPYRIGHTED FREE USE`、缺归属、非 allowlist 与 SVG。 |
| 文件安全 | Passed | 8 MiB 单图上限、JPEG/PNG/WebP MIME 白名单与 magic signature；676/676 文件签名通过。 |
| 文件完整性 | Passed | 676 个唯一路径、676 个文件、0 缺失；676/676 SHA-256 与 manifest 记录一致。 |
| 缺失透明度 | Passed | 324 条无可靠图片、371 条无 Wikipedia 导言，均写入 `missing-and-rejected.json`。 |
| 自动测试 | Passed | `npm run test:plants` 12/12。 |
| 回归 | Passed | Sites worker 4/4；生产构建 exit 0（4,580 modules）。 |
| UI QA | Not triggered | 未修改 React、CSS 或页面交互，下载结果尚未接入公开植物列表。 |
| 发布 | Not run | enriched 数据和约 369 MB 图片均在 Git 忽略目录；未 commit、push、deploy 或 publish。 |

本地结果位于 `data/plant-import/gbif-tracheophyta/wikimedia-enrichment/`。文字改编或公开发布时仍须满足 CC BY-SA 署名与相同方式共享要求。

## 2026-10-06 — 全球植物目录接入与交互审查

**范围：**将本地 1,000 条 GBIF/Wikimedia 来源记录接入植物知识库，保留六条人工策展记录，并验证搜索、详情来源披露、缺图处理与手机布局。导入条目仍是机器暂存的分类来源资料，不代表已审核的养护建议。

**审查步骤与截图：**

1. 植物库入口：页面介绍 1,000 条导入分类记录，并保留六条人工记录；总数显示为 1,006。健康：良好。截图：[01-library-overview.png](output/playwright/plant-library-catalog/01-library-overview.png)。
2. 搜索 `Abies nephrolepis`：结果收敛为一条，可见真实植物图片、科学名、科名与来源型标记。健康：良好。截图：[02-search-result.png](output/playwright/plant-library-catalog/02-search-result.png)。
3. 打开植物档案：展示 GBIF 与 English Wikipedia 来源、Commons 图片作者/许可链接、机器审校状态及“未推测养护/毒性/分布”的说明。健康：良好。浏览器标题现在包含具体学名。截图：[03-sourced-detail.png](output/playwright/plant-library-catalog/03-sourced-detail.png)。
4. 缺图档案 `Cheiroglossa palmata`：明确展示“图片待补”，分类来源与记录内容仍可读，没有破图。桌面健康：良好。截图：[04-no-image-desktop.png](output/playwright/plant-library-catalog/04-no-image-desktop.png)。
5. 同一缺图页，390px 手机视口：占位图片框已缩短，标题提前进入首屏；视口和文档宽度均为 390px，无横向溢出。健康：良好。截图：[05-no-image-mobile.png](output/playwright/plant-library-catalog/05-no-image-mobile.png)。

**发现与处理：**首次手机检查发现无图占位区沿用了真实照片的高度，在小屏首屏占比过大；已为小屏无图状态单独缩短占位高度，未改变实际照片尺寸。导入档案原先共用泛化浏览器标题，现改为学名 + 当前站点语言的植物库名称。路由切换的异步详情状态也按 slug 绑定，防止上一个档案短暂闪现。

**自动与运行验证：**`npm run test:plants` 13/13；`npm run test:sites` 4/4；production build 通过（4,581 modules）；`git diff --check` 通过。真实 Playwright CLI 交互确认搜索、结果打开与缺图状态；最终当前页控制台 0 errors / 0 warnings。首批仅渲染 48 张卡，随后按需加载。`local-web-self-check` bundled checker 请求 `/zh-hk/plants` 返回 HTTP 200，logo/JS/CSS 三项资源均通过（0 failures）。

**可访问性和证据限制：**搜索框带可见标签，档案使用标题层级、面包屑导航和文字缺图状态；手机没有横向溢出。但本轮不是完整 WCAG 审计：未完成全站键盘路径、屏幕阅读器朗读和仪器化对比度测量，因此不声明 WCAG 合规。

**产品/数据限制：**629 条导入记录有英文来源导言；本地数据明确标记中文编辑摘要尚待校订。676 条有许可署名的本地 Commons 图片，其他记录展示缺图状态。机器暂存记录不会伪装成地区推荐、植物养护或安全结论。

**能力门槛：**产品设计审查、React 最佳实践复核与当前浏览器检查已记录于根目录 `CAPABILITY_LOG.md`。必需的策略简报仍不可读取，因而无法检查其 Section 19 的技能清单。Codex Security Standard Scan launcher 在生成 `scanId` 前失败；没有运行替代扫描，安全门槛仍未完成。

**发布：**仅更新本地项目；本轮未提交、推送、部署或发布。

## 2026-10-06 — 六地区目录扩充与当前浏览器审查

用户故事：编辑人员从 GBIF 六地区发生记录中采集植物，取得许可图片与来源导言；访客按地区筛选、分页、搜索并查看每株证据。地区记录表示观察地点，不等同原生分布或园艺推荐。

真实批次：每区 100 种，跨区合并为 445 种；417 条英文导言、435 张图片（178,954,089 bytes），全部图片哈希/签名/署名通过。28 条导言和 10 张图片没有可靠来源，保留缺失报告。全库合并后为 1,439 条导入记录、1,040 条导言、1,105 张图片；与人工档案合并后显示 1,441 个唯一档案。

1. 地区筛选 — 良好。真实点击六个按钮得到 DE 100、US 101、HK 100、CN 101、GB 100、FR 101，每次首批 48 卡。三个额外条目来自独立人工档案。

![地区列表](output/playwright/plant-regions/01-region-results.png)

2. 来源详情 — 良好。从列表进入 Sphagneticola trilobata，显示香港 2,261 笔 GBIF 记录、统计日期、来源链接、图片作者及 CC BY-SA 4.0。观察记录的解释与数值相邻，降低原生/种植适应性误读。

![详情中的地区证据](output/playwright/plant-regions/02-region-evidence.png)

3. 英文手机筛选 — 良好。390×844 无横向溢出；背景滚动锁定，关闭后恢复。React 复核发现的焦点问题已修复：初始聚焦关闭按钮，Tab/Shift+Tab 循环，Escape 关闭并恢复触发按钮焦点。

![手机筛选抽屉与可见焦点](output/playwright/plant-regions/03-mobile-filter.png)

4. 英文手机档案 — 良好。Load more 从 48 到 96，完整科学名搜索得到 1 条，真实点击进入档案。标题包含学名，地区证据与许可一致，页面宽度 390px。

![手机植物档案](output/playwright/plant-regions/04-mobile-detail.png)

自动与完整故事验证：植物测试 17/17；Sites 4/4；最终构建 4,581 modules；最终页面与三个入口资源 200/0 failures。静态目录 200/application-json/1,439 records，示例植物图 200/image-jpeg。公开目录全部 1,105 张图片哈希一致，共 544,062,016 bytes；最终浏览器 console 0 errors/0 warnings。

修复与范围：以 GBIF ID 2953373 合并 canonicalName 中遗漏 × 的香港洋紫荆，确保 1,441 个唯一详情路由。统计改为从数据计算。此次地区目录是高频地理定位 PRESENT 记录的首批样本，未宣称完整地区植物志。中文译名/摘要与专业养护尚待编辑。测试了弹窗键盘路径，但未作全站屏幕阅读器/对比度审计，因此不声明 WCAG 合规。

安全/发布：桌面 Standard Scan launcher 再次失败于 `workbench_db.py start-prompt-only-scan`，没有 scanId；没有替代扫描或完整安全结论。策略 brief 仍缺失。图片与数据生成结果保持本地、Git 忽略；本轮未提交、推送、部署或发布。

## 2026-10-06 — 中文资料离线批次 QA

范围：官方 Wikipedia/Wikidata → 身份核对 → 中文资料 NDJSON 暂存；不修改网站 UI 或公开目录。指定策略 brief 不存在，未满足网站源码修改前置条件，中文页面接入未实施。

真实批次处理 1,439/1,439；664 种中文名称、531 种导言（zh-hk/zh-cn 共 1,062 个文字字段）。六区 445 个独立物种中为 414 名称/362 导言。47 个此前无英文导言的条目获得中文介绍，合并后 1,087 种有至少一种语言的来源导言。

全量审计通过：1,439 唯一 ID、1,064 个精确 P225 实体、2,622 个名称字段、338 个原始响应。中文条目 QID 与物种一致、原文与缓存逐字一致、revision 和许可保存。原 taxonomy、regions、英文 descriptions、media 和 review state 逐条不变。

离线测试 5/5；图像边界测试 2/2；真实断点续传 0 网络请求，NDJSON SHA-256 未变。775 种尚无中文名称、908 种尚无中文导言；22 种中文条目实体身份不一致被排除，未猜测填充。

缺图再次尝试：英文/Commons fallback 重试和身份核对的中文主图均未取得新合格图片。中文渠道十条中八条无主图、两条 NO RESTRICTIONS 许可拒绝。图片数量仍为 1,105，地区缺图仍为 10，缺图没有伪装成已补完。

本轮未改浏览器流程，所以没有新增截图或浏览器通过结论，也未重复 React/视觉审查与构建。`vercel:verification` 记录离线链路；标准安全扫描仍无 scanId，按 `codex-security:security-scan` desktop 规则不得创建 replacement scan。未提交、推送、部署或发布。详细数据和许可边界见 [批次报告](output/plant-data-zh/README.md)。

## 2026-10-06 — 全来源覆盖率复核与补查未完成状态

`data-analytics:analyze-data-quality` scoped 检查纠正名称统计：此前 664 为 Wikimedia-only，合并记录实际有 865 个中文名（60.11%），缺名 574 而非 775；201 个 GBIF-only 名称原已存在，并非本轮新增。GBIF 395/Wikimedia 664/交集 194；ID 与 slug 各 1,439 唯一、0 schema invalid，旧 NDJSON hash 不变。531 中文导言、1,105 图片未变化。

定向 supplement 工具的 ISO 标签、append-only 合并、实体歧义、别名来源、输入 fingerprint 和无网络续传夹具 4/4 通过。**真实采集未完成**：首次及同一检查点重试均 API maxlag，首批未完成，新增 0。诊断 HTTP 200 的正文为 error.code=maxlag，不当作成功。保留 maxlag=5 与重试间隔，不取消负载保护或持续轮询。

网站源码/公开目录未变，未新增浏览器 UI、React、视觉、build/Sites 通过声明。`vercel:verification` 真实 API 边界失败后停止；标准安全扫描仍无 scanId，不创建替代扫描。brief 仍缺失、中文未接入页面；未提交/推送/部署/发布。[当前完整报告](output/plant-data-zh/COVERAGE_REVIEW.md)。

## 2026-10-07 — 美英法译编草稿离线 QA

本轮新增 53 个独立物种、106 繁简译编字段，不是新增中文来源文章；原始中文来源 531 种保持，中文可读导言增至 584 种。US 71 原文+29 草稿、GB 81+19、FR 85+15，各首批 100 种已有图片/中文可读导言。名称 865、图片 1,105、物种 1,439 均不变；地区样本不是完整植物志。

单元测试 3/3；独立全量审计 1,439 唯一 ID/slug、0 schema invalid，原始字段、许可、名称和图片不变；实际英文 extract revision/hash 验证，身份为 50 精确 P225 +1 GBIF 明确杂交学名 +2 GBIF accepted synonyms。核验器初次因杂交符号空格失败，已修复保留 × 的空白规范化及完整学名边界，最终通过。缓存重跑网络 0、输入/输出 NDJSON hash 均不变。

来源和草稿分列、CC BY-SA 4.0 与 adapted 标记保存，全量 integrity 通过不代表专业译文/养护/食用安全审校。`vercel:verification` 只验离线数据链路。没有新增浏览器截图、React/视觉/构建/Sites 通过声明；未修改官网源码/公开目录/hosting，也未恢复植物库公开入口。策略 brief 缺失，标准安全扫描既有无 scanId 阻塞按 `codex-security:security-scan` 禁止替代扫描；网站整体验收仍未完成。

证据：[本批报告](output/plant-data-zh/US_GB_FR_DRAFT_REPORT.md)、data/plant-import/us-gb-fr-translated-drafts/integrity-report.json。未安装/连接账户、提交、推送、部署或发布。
