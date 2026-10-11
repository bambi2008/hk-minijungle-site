# Capability Log

## 2026-10-11 — 用户授权 GitHub 备份（不部署）

- 用户请求「存入GitHub」，授权官网仓库提交与推送；不扩展至其他项目、PR 合并或服务器发布。
- 仓库为独立私有 `bambi2008/hk-minijungle-site`，远端 main 与本地基准一致。GitHub Actions 工作流和部署记录为空；没有自定义 commit/push hook。
- 调用 `vercel:deployments-cicd`，核对官方 Git 部署规则并只读检查既有 Vercel 项目；`link:null`，无 Git 仓库连接。不修改 Vercel 项目设置、不调用部署。
- 保存至 `codex/geo-backup-20261011` 分支，main 保留。提交官网代码、必要素材、测试、工具和验收文档；排除 private env/账号配置、依赖、构建目录、采集缓存、录屏重复件、诊断日志和临时快照。既有本地排除文件不删除。
- 先核对 staged diff 与大小／敏感配置排除，再提交并核对远端 SHA；最终推送结果以 Git 命令响应和远端引用为准。
- 推送前复跑既有 GEO/Sites/plant 测试 28/28 通过；staged diff --check 通过，无敏感配置路径或超过 50 MB 文件。保留经审查的本地 QA helper 源码与本轮四张验收截图，不上传临时 browser state/log。

## 2026-10-11 — 正式 Standard 安全扫描完成

- 权限：用户明确允许唯一站点路径的用户级 Git `safe.directory` 设置。已成功添加该确切目录，无通配信任、无其他配置变更，解决 Git dubious ownership 导致的插件快照阻塞。
- 当前能力与技能：检查实际 Codex Security 工具及已安装技能；完整读取并调用 `codex-security:security-scan` 和适用参考，沿用权威 scanId `3468b0a0-5c74-42f9-a8ab-65656675792d`，未另建替代扫描。技能要求的独立基线、架构与定向 worker 均实际完成；预检 ready，三个可用 worker，六线程容量建议为非阻塞告警。Daybreak 未授予，未调用外部服务。
- 离线只读审查覆盖：395 个 Git inventory 路径中 107 个 authored code/config/docs/data 文本完整审查；100 个生成日志/YAML 已凭据筛查但不冒充完整代码审查；187 个非可执行媒体不审 codec；一个 ZIP manifest 与 HTML SHA256 同一性已核对。源码、工具、测试、配置与文档无未完成非排除路径。
- 发现处理：SSR 仅构建时运行，Worker 为静态 ASSETS 服务；JSON-LD 安全序列化、路由/文件路径、联系表单、照片原型、植物导入和源码凭据均审查。仅本地 QA helper 的百分号解码异常有健壮性风险，无生产/共享权限边界，保留为 rejected 信息项；0 可报告漏洞。
- 完成：接受 complete:true 语义草稿，核对三个 canonical JSON 存在，仅调用一次 completion 成功，工作台 status complete，reportAvailable true。报告：`C:/Users/ss/.codex/state/plugins/codex-security/scans/hk-minijungle-site/df0fba7c205df0604c02472b02066dd6e2a3e6f3_20261011T104114Z_0meurir9/report.md`。未手写或修改封存报告。
- 工作台计量：totalTokens 22,600,776 / inputTokens 22,542,290 / cachedInputTokens 21,121,792；coverage complete，codex_rollout，5 threads。累计元数据不等于本轮费用。
- 扫描封存后调用 `local-web-self-check` 和已授权 `playwright`：4175 首页/关键资源 200；About 标题正确，真实点击 CANVIVA FAQ 后展开答案；console error 0。此次只补验收文档与浏览器诊断文件，无 runtime/source/视觉改动。
- 已知 GEO 本地技术验收完成。策略 brief 仍缺失，Section 19 附加清单无法核对；表单接收端、产品/案例等获批资料仍待补。没有提交、推送、部署或发布。

## 2026-10-11 — 剩余安全门槛：定位 Git 所有权阻塞

- 按用户“继续完成未完成的”重读 `codex-security:security-scan` 0.1.32 及 desktop-scan；直接调用 prompt-only Standard 启动，持续未返回权威 `scanId`。没有替代扫描或手写安全结论。
- 只读诊断发现站点 `.git` 的所有者为 `CodexSandboxOffline`，插件进程运行用户为 `ss`。普通 `git -C <site> rev-parse` 明确返回 `detected dubious ownership`，这是此前无法识别站点 Git 仓库的实际原因。
- 插件 `scan_target_identity` 在 Git 识别失败后按 `unversioned` 路径处理，`directory_content_digest` 的 Git inventory 不可用时递归整个目录，包括忽略的依赖、构建和离线数据；当前 Python 启动进程 CPU 仍增长，因此属于启动快照缓慢，不能断言工作台已崩溃。
- 已验证一次性、只读恢复方式：`git -c safe.directory=<确切站点路径> -C <site> rev-parse/status/ls-files` 正常，Git 忽略规则下 inventory 为 395 个路径；没有写 Git 配置。
- 拟将唯一确切站点路径加入用户 `safe.directory`，但自动审批拒绝持久修改全局 Git 信任配置，理由为尚缺用户对该具体设置变更的明确授权。未绕过拒绝；需用户确认后才能恢复插件调用所需的长期 Git 识别。
- 本轮只更新诊断／验收记录，既有 build、浏览器和 GEO/Sites 验收不重复；没有源代码变更、提交、推送、部署或发布。正式安全验收仍未完成。

## 2026-10-10 — GEO 真实浏览器验收与设计修正

- 用户明确授权改用 Playwright CLI；已读取并遵循 `playwright` Skill，以真实 Chromium 检查最新本地构建，不访问外网、不部署。
- 真实交互通过：中英文 About 切换、FAQ 展开、390px 手机菜单、产品 SIGNATURE 筛选、带 `?intent=proposal` 的联系页预选均正确；最终生产 Worker 模拟路径 console 0 error／0 warning，桌面和手机均无横向溢出。
- 路由辨析：Vite preview 对无尾斜杠路径返回首页 SPA HTML，产生一次只属于错误预览服务器的 hydration mismatch。使用实际 `dist/server/index.js` 与 `dist/client` 启动本地 Worker 模拟后，同一无尾斜杠 Contact/About URL 返回正确预渲染文档，hydration 0 error。
- Product Design combined audit 发现 About 浅色 FAQ 区的「待补充材料」沿用了深色首页区块的浅文字；已在 `src/site.css` 增加浅色 section 的森林绿／炭灰覆盖。修复后计算颜色为 `rgb(18,55,47)` 与 `rgb(30,36,33)`，视觉复核通过。
- 重新构建后 `npm run test:geo` 6/6、`npm run test:sites` 5/5；截图证据位于 `output/playwright/geo-2026-10-10/`。React best-practices 与 full-story verification 已更新。
- 唯一未完成的强制门槛仍是 Codex Security 标准扫描：0.1.32 prompt-only 工作台未返回 `scanId`，不宣称完成或零风险。未 commit、push、deploy 或 publish。

## 2026-10-09 — GEO 优化实施包（本地实施）

- 用户输入：读取 `D:/program/wechat/xwechat_files/nobody2009nobody_58e1/msg/file/2026-10/官网GEO优化实施包-Codex-2026-10-09(1).md`，按其优化官网；缺失内容在网页保留位置并标记，遇到问题先确认。
- 已完整读取实施包、根目录与站点 `AGENTS.md`、`.openai/hosting.json`、现有路由/Schema/构建/Worker 配置及 `sites:sites`、`monid` 说明。指定策略文件 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍不存在，无法读取其 Section 19；继续以仓库 durable decisions 为约束。
- Sites 生命周期：`.openai/hosting.json` 无 `project_id`，本轮保持 local-only；不注册、不推送、不部署、不发布。
- 现状：根 `index.html` 已有 Organization JSON-LD，网站地址和公开电话 `+852 54787719` 一致；缺少 `/llms.txt`、路由级 WebSite/Product/FAQPage Schema 与静态可抓取页面。当前 Vite SPA/Assets Worker 对路由回退到同一空 `#root`，纯 HTML 抓取无法得到页面正文，预渲染是最高优先级技术项。
- 冲突：GEO 包仍把 CUISVIVA、家庭场景、园艺治疗、旧称 `CANVIVA · Living Wall / Art Wall` 作为公开业务；仓库已确认的现行架构则只公开商业空间 CANVIVA，并使用 SIGNATURE / WALL / PANEL 正式命名。直接照抄会恢复已下线内容并破坏 2026-10-07 命名决定，因此源代码修改暂停，等待用户选择“按现行架构适配 GEO”或“恢复实施包旧架构”。
- Part 5：按实施包要求，电话先沿用网站号码；圣诞树季节产品在 Jose 确认前不加入。不存在的规格、案例、认证、价格或可用性只能显示为“待补充材料”，不得进入结构化数据。
- 能力盘点：`monid 0.1.6` 发现可用的外部 SEO/渲染抓取端点，但本任务本地实现已有专用仓库与浏览器工具，不消费 Monid 余额；CLI 提示 0.1.7 更新，因用户未授权安装/升级而跳过。后续若获确认，将调用 Product Design audit、local-web-self-check、React best-practices（如多组件修改）、full verification 和 standard security scan。
- 用户确认：凡 GEO 包与已确认品牌架构有实质冲突，一律以现行架构为准。公开 Schema、`llms.txt`、页面文案与预渲染只包含 `CANVIVA SIGNATURE / WALL / PANEL` 和商业空间能力；没有恢复 CUISVIVA、家庭产品、园艺治疗、旧产品名或圣诞季节产品。
- GEO 实施：新增 `public/llms.txt`、路由级 Organization／WebSite／ItemList／ProductGroup／FAQPage JSON-LD、双语 About FAQ 与可见「待补充材料」区；生产构建加入 43 条路由静态预渲染，并让 Worker 优先返回对应的预渲染 HTML，浏览器端沿用现有 React 设计、动画和互动。
- 内容诚信：FAQ 和 Schema 只使用站内已确认信息；规格、价格、交期、SLA、客户案例／评价、性能数据及香港以外覆盖范围不写入结构化数据，网页明确标为待补材料。
- 自动验证：`npm run build` 通过（4,582 modules；43 routes prerendered）；`npm run test:geo` 6/6；`npm run test:sites` 5/5；About HTTP/local-web-self-check 通过。`/llms.txt` 返回预期 `text/plain`，其内容、正式产品名和退休词排除另行核对通过。
- React review：SSR 使用 `renderToPipeableStream` 等待 `onAllReady`，避免懒加载边界被降级为客户端渲染；服务端与客户端共用纯函数路由解析，Contact 查询参数延后到 mount 后同步，避免 hydration mismatch。未新增远程数据瀑布、unsafe HTML 或 URL 控制资源。
- 当前验证缺口：应用内浏览器内核因 `CreateProcessSecurityEnvironment` 错误退出，尚未取得本轮桌面／手机真实交互证据；切换 Playwright CLI 需用户明确同意。Codex Security 0.1.32 prompt-only 标准扫描连续等待约三分钟仍未返回 `scanId`，依技能要求终止等待且不启动替代扫描，不宣称扫描完成或零风险。
- 发布边界：未 commit、push、deploy 或 publish；正式服务器未改变。

## 2026-10-07 — 常规蔬菜离线批次核验与分类纠正

- 实际检查工具及技能：完整读取 monid（既有 GBIF/Wikimedia 专用流程优先，无新安装／付费调用）、data-analytics:analyze-data-quality 及 shared/receipt 参考、vercel:verification 0.54.1、codex-security:security-scan 0.1.32 与 desktop-scan；bundled runtime 已查询。
- 数据质量检查发现普通芝麻菜／食用大黄关联需纠正，以 Kew／RHS 和实际 GBIF 精确结果补 2 档案，保留旧记录。1,513 导入 +2 未重合手工档案 =1,515；113 crop 对应 75 当前分类。
- 75/75 蔬菜分类图片、73/75 中文介绍；全库导入有图 1,179、中文名 933、中文介绍 655。新增 7 份有出处短摘要、部分中文养护扩至 22 crop／135 字段。均未专业审校／不可发布。
- 1,238 原文快照对应 1,203 去重页面；逐份 revision/hash 检查。14/14 测试及真实缓存续跑 0 网络、1,238 快照 hash 不变通过。两处核验器失败已修复：请求标题规范化与图片去重后证据定位；GBIF 杂交空格严格保留 ×。
- vercel:verification 离线链路通过，不认证 UI／专业资料完整性。标准安全扫描既有无 scanId 阻塞按 desktop 不建替代扫描，策略 brief 仍缺失。无 src/public/package/hosting 变更，Product Design／React／Sites／浏览器本轮不触发；公开归档保持。未提交／推送／部署／发布。详见 output/plant-data-zh/VEGETABLE_KNOWLEDGE_REPORT.md。

## 2026-10-07 — CANVIVA 产品正式命名更新（本地进行中）

- 用户输入：读取 `HKMJ_CANVIVA_Website_Naming_Update_20261006.zip` 并修改当前官网。已读取包内命名指令及三张参考图；压缩包内容先作为待核对资料，不直接覆盖仓库文件。
- 正式分类：`CANVIVA SIGNATURE / 生命畫境・定制`、`CANVIVA WALL / 生命畫境・綠牆`、`CANVIVA PANEL / 生命畫境・植景屏`；`CANVIVA DIVIDER / 生命畫境・綠植隔屏` 只在代码中预留，当前不公开、不生成图片、不使用替代图。
- 图片核对：包内 SIGNATURE、WALL、PANEL 参考图与站内现有 `/images/canviva-art-wall.jpg`、`/images/canviva-office-wall.png`、`/images/canviva-art-lobby.png` 一一对应；无需替换或移动图片，现有 `設計效果示意 / Design visualisation` 必须保留。
- 路由决定：当前成熟架构使用三个产品卡共同进入 `/{locale}/products/canviva`；按命名文件第 8 节不强行建立独立详情页。本轮同步产品卡、筛选、图片 alt、共享详情页 SEO 和内部链接语义。
- 能力检查：已读取两级 `AGENTS.md`、`sites:sites`、Product Design router/user-context/critical overrides/communication protocol；Product Design saved context preflight=`missing`，本轮以包内参考图和现有站点为视觉真值。
- Sites 生命周期：`.openai/hosting.json` 没有 `project_id`，本轮继续 local-only；不注册、不同步、不打包发布、不部署。
- 强制策略文件：`C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍不存在；沿用 2026-10-06 已确认的 CANVIVA × 商业空间 durable decisions 与本次更具体的正式命名指令。
- 修改边界：优先只改产品数据、卡片文本层级、产品页筛选与 SEO 文案；不改图片、不生成资产、不改现有动画和交互机制。
- 验证计划：production build、Sites tests、local-web-self-check、真实浏览器桌面/手机三卡顺序与筛选、console、React best-practices、Product Design audit、full verification 和 standard security scan；不 commit、不 push、不 deploy。
- 实施结果：产品目录按 SIGNATURE → WALL → PANEL 排列；中文名作为辅助行；三类卡片保留共享详情路由；共享详情页 H1、浏览器标题、description、Open Graph、canonical、图片 alt 与内部产品语义完成同步。DIVIDER 仅保存在 `futureCanvivaVariants` 且 `public: false`、`image: null`。
- Product Design audit：当前应用内浏览器完成 1280px 桌面与 390px 手机检查；三图映射、标签、层级和单栏重排正常，手机 `scrollWidth === clientWidth`。截图只能支持当前可见状态判断，不代表完整 WCAG 合规。
- React best-practices：本轮数据保持模块级，公开集合通过 `public !== false` 派生；没有新增 effect、listener、fetch、动态依赖、unsafe HTML 或 URL 控制资源。卡片继续复用 `ProductCard`，并为图片优先使用专用 alt。
- Full verification：SIGNATURE 类型筛选把可见卡片收敛为 1 张且 `aria-pressed=true`；中英文产品页及共享详情页均通过；浏览器 console 0 error／warn。production build 通过（4,581 modules），Sites tests 4/4，local-web-self-check HTTP 200／0 failures，`git diff --check` 无 whitespace error（仅 Windows LF→CRLF 提示）。
- Standard security scan：按 `codex-security:security-scan` desktop prompt-only 流程启动，但工作台在返回 `scanId` 前持续无输出并被终止；未生成替代报告，不声称扫描完成或 0 findings。此项仍是仓库能力门槛缺口。
- 发布状态：未 commit、push、deploy 或 publish；正式服务器未改变。

## 2026-10-06 — 品牌聚焦：CANVIVA × 商业空间（本地进行中）

- 用户授权：读取 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Brand_Focus_Codex_Instructions_V1.0_20261006.md` 并修改官网涵盖内容；明确禁止修改现有网页设计、动画与互动实现。
- 新品牌边界：HK MINIJUNGLE 公开官网收敛为面向商业及公共空间的 CANVIVA living plant systems；CUISVIVA、家庭种植、植物宠物、AI 植物识别与 DR FOREST 产品线从公开信息架构移出，但现有代码与资产不可恢复删除。
- DR FOREST 边界：不再描述为 HK MINIJUNGLE 内部产品线；在新公司注册及服务关系确认前，只使用 `AI-enabled operations`／持续养护等中性能力表达，不声明 subsidiary、partner、sister company 或已生效委托关系。
- 前置盘点：已扫描 Git 状态、非构建文件清单、全部指定旧关键词、路由、导航、Footer、SEO metadata、JSON-LD、sitemap、robots、图片及内容数据源。当前公开冲突包括首页 CUISVIVA、多产品目录、家居/餐厅 solution、DR FOREST 技术页、植物知识库和 AI 识别入口。
- 迁移原则：CANVIVA 为唯一公开核心产品；Xponge 作为 CANVIVA 系统材料层保留；GreenCanvas 仅在 HKPC/历史项目正式语境中保留；旧消费类 URL 使用 noindex archive，不粗暴跳转首页、不制造大量 404。
- 能力与生命周期：已读取仓库两级 `AGENTS.md`、Product Design router/user-context/critical overrides、Sites workflow 与 local preview。Product Design context preflight 因本机无可用 Python 解释器未能执行；本轮有明确现有代码与禁止视觉改动的约束，不建立新视觉方向。`.openai/hosting.json` 无 `project_id`，按现有 local-only 决策跳过 Sites 注册、同步与发布。
- 修改边界：计划只改 `src/content.js`、`src/pages.jsx`、`src/components.jsx`、`src/App.jsx`、`index.html`、`public/sitemap.xml`、内容/迁移/QA 文档；不改 `src/site.css`、`src/GrassHero.jsx`、既有旋转和植物知识功能源码。
- 验证计划：品牌词与公开入口复扫、build、Sites/plant tests、local-web-self-check、真实浏览器桌面/移动 QA、链接与 console、React review、full verification 与 standard security scan；不 commit、不 push、不 deploy。
- 实施结果：公开导航收拢为 CANVIVA、应用场景、项目与实践、关于我们、联络我们；首页和产品目录只展示 CANVIVA 及其现有配置，Xponge 只作为系统材料层，CUISVIVA、家居场景、DR FOREST、植物库／识别入口不再出现在公开导航和 sitemap。
- 路由与 SEO：旧 CUISVIVA、家居、DR FOREST、技术目录、植物库／识别路线保留源码和可访问归档状态，但输出 `noindex,follow`；canonical、hreflang、Open Graph、Twitter metadata、JSON-LD 与双语 sitemap 已同步到 CANVIVA／商业空间定位。
- 产品与获客内容：CANVIVA 页扩展到办公、物业大堂、酒店会所及高品质商业空间；首页加入商业场景、运作边界、待补材料与项目流程；查询表单改为公司／项目位置／空间需要／时间等 B2B 字段。公开联系区移除了 `Dr_forest2026` 标识，保留已确认电邮与电话。
- 视觉保护：未修改 `src/site.css`、`src/GrassHero.jsx` 或旋转／动画／交互实现；原草地 Hero、下拉导航、筛选、响应式和概念图标注机制均保留。
- Product Design audit：已检查并接受 `output/qa/brand-focus-2026-10-06/01-home.png`、`02-canviva.png`、`03-home-mobile.png`。内容层级清晰，CTA 与概念图标签可见；截图不能证明完整 WCAG 合规，但真实浏览器 AX 快照、桌面/手机布局和两项互动均通过。
- React best-practices：内容和静态映射保持模块级；没有新增 effect、监听器、网络瀑布、URL 控制资源或 unsafe HTML；移除了不用的 import。生产构建成功。
- 验证：`npm run build` 通过（4,581 modules）；`npm run test:sites` 4/4；local-web-self-check HTTP 200、0 failures；真实 Chromium 核对中英文首页、CANVIVA、产品筛选、联系表单和旧 CUISVIVA 归档路线，console 0 error／warn。
- 安全扫描：按 `codex-security:security-scan` 流程两次启动 desktop prompt-only standard scan，均在工作台初始化命令失败且未返回 `scanId`。因此不宣称安全扫描完成或 0 findings；这是当前唯一强制验证缺口。
- 发布状态：未 commit、push、deploy、publish，也未改动生产服务器。

## 2026-10-03 — 首頁獲客結構優化（本地完成實作，瀏覽器 QA 待授權）

- 需求：讀取 `C:/Users/ss/Desktop/官网获客审计-2026-10-02.md`，按「認知 → 信任 → 行動」鏈路優化首頁；本輪只處理本地首頁，不提交、不推送、不部署。
- 審計輸入：公開頁面審計指出全站缺少公開價格錨點、獨立案例／客戶評價、具體流程文案、低門檻留資入口和可點擊聯絡方式；首頁本身因 JS 渲染未被原審計抓取，因此本輪會以本地真實頁面補做驗證。
- 事實邊界：不虛構價格、客戶 Logo、推薦語、項目效果、回覆時效或產品規格。缺少的典型預算、案例、推薦語及服務承諾只顯示為「待補充材料」。可使用的信任材料僅限現有網站已公開並可追溯的產品資料、HKPC 本地試驗記錄和技術／養護資料邊界。
- 規範與能力：已檢查當前 Skills/Plugins，讀取根目錄與站點 `AGENTS.md`、Product Design 路由／審查／user-context／critical overrides、Sites building、local-web-self-check、React best-practices、full verification、standard security scan、Playwright 及 Computer Use 規則。Product Design saved context preflight=`missing`。
- 已知阻礙：強制策略文件 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 不存在，且已在用戶目錄搜尋同名／相近文件無結果；沿用倉庫既有 durable decisions、現有視覺系統及本次用戶提供的獲客審計作替代基線，不建立新視覺系統。
- Sites 邊界：`.openai/hosting.json` 只有空的 D1/R2，沒有 `project_id`。依 Product Design critical override 與既有 local-only 決策，本輪不註冊、不同步、不發布 Sites。
- 實施方向：保留互動草地和 CUISVIVA 旋轉展示；改善首屏文案與主 CTA，在 Hero 後加入可自我判斷的適配／預算資料狀態、可信證據和具體四步流程，再提供低門檻場地簡報入口。
- 驗證計劃：完成後執行 Product Design audit、React best-practices、production build、Sites worker tests、local-web-self-check、桌面／手機真實瀏覽器 QA、full-story verification 與 standard security scan；結果寫入本檔及 `QA_REPORT.md`。
- 實作結果：重寫雙語 Hero 定位，主 CTA 改為「場地初步評估」；新增三類場景自我判斷、商業資料狀態、現有實證／待補材料、四步項目流程及低門檻場地簡報入口；保留互動草地、產品旋轉與既有產品平台。
- 表單與聯絡：新增 `site-assessment` 查詢類型，該路徑只要求姓名、電郵、選填電話、空間類型／地區、項目描述與私隱同意，不再先要求公司／職位；電郵及兩個現有電話號碼改為可點擊聯絡，WhatsApp ID 保持原資料，不推斷未確認的 WhatsApp 號碼。
- React review：新增資料均在模組層，列表使用穩定 key；沒有新增 effect、fetch、動態 import、URL 控制資源、unsafe HTML 或持久資料。聯絡意圖只影響既有受控表單分支。開發伺服器仍有既有的 Fast Refresh 混合 export 警告，不影響 production build。
- 已通過：`npm run build`（4,577 modules）、`npm run test:sites`（4/4）、`git diff --check`（只有 Windows LF→CRLF 提示）、local-web-self-check（HTTP 200、0 failures）、場地初評 URL HTTP 200；dev server 沒有編譯錯誤。
- 待完成：Computer Use 連續超時後，Product Design 規則要求先取得用戶同意，方可改用 Playwright 做桌面／手機真實交互 QA；用戶尚未回覆。Codex Security 工作台啟動呼叫長時間無回應並被中止，沒有返回 `scanId`，因此本輪不宣稱 standard security scan 完成或 0 findings。
- 發布狀態：本輪沒有 commit、push、Sites/Vercel deploy 或生產發布。

## 2026-09-29 — 首頁產品區恢復 CUISVIVA 旋轉展示（本地版本）

- 需求：首頁 Hero 繼續使用互動草地；把原本可左右查看機器角度的 CUISVIVA KITCHEN／鮮香植園產品旋轉展示放到首頁產品區，滑鼠移過機器即可切換角度，同時保留拖動、觸控、方向按鈕與鍵盤操作。
- 路徑邊界：本輪只修改 `C:/Users/ss/Documents/hk minijungle/hk-minijungle-site`，不讀寫 Purrl 源碼；旋轉幀沿用本站既有 `/images/cuisviva-spin-concept-v1-00.webp` 至 `-07.webp`。
- 視覺來源：現有 CUISVIVA 產品詳情頁的 8 幀旋轉組件是明確來源；不生成新素材、不改草地 Hero、不虛構工程結構，繼續顯示「概念效果圖 / Concept visualisation」。
- 能力與限制：已讀取 Product Design `image-to-code`／`design-qa`、React best-practices、local-web-self-check 與 browser 控制規則；Product Design saved context 不存在，策略 brief 仍缺失，因此以既有旋轉組件、當前首頁和用戶明確位置指示為基線。
- 驗證計劃：完成後執行桌面／手機真實瀏覽器互動 QA、中英文檢查、console、HTTP、自動構建、Sites worker 測試、Product Design QA、full verification 與標準安全掃描；不提交、不推送、不部署。
- 實現：沿用同一個 `ProductSpin`，新增首頁變體；桌面滑鼠在機器畫面內左右移動即可按位置切換角度，同時保留拖動、觸控、按鈕和鍵盤。非首幀改為展示接近視口時才預載，草地 Hero 與產品卡結構不變。
- Product Design / React：首頁以兩欄產品特寫承接草地 Hero，手機改為單欄；概念效果圖標籤、雙語內容和原生控制保留。高頻 hover／drag 暫態資料使用 ref，固定資源仍在模組層，observer 有完整清理。
- 驗證：1440×900 與 390×844 真實瀏覽器通過；按鈕、拖動、鍵盤均改變角度，中文／英文正常，無橫向溢出，console 0 error／warn。8 個 WebP 均 HTTP 200；`npm run build` 與 `npm run test:sites` 4/4 通過。
- 發布：本輪僅更新 HK MINIJUNGLE 本地項目，未提交、推送、部署或發布；Purrl 未修改。
- 安全：Codex Security standard scan `1b7de9c4-f105-471b-ae58-fe26c72569e7` 完成，coverage=`complete`，0 findings。掃描期間只追加 QA／review／capability 文檔，因此工作台提示目錄內容變化；`src/pages.jsx`、`src/site.css` 與旋轉素材在掃描啟動後未再修改。Daybreak 狀態為 `not_granted`，不影響本地掃描完成。

## 2026-09-29 — 互動草地首頁 Hero（本地版本）

- 需求：把已確認的 Three.js 互動草地設為 HK MINIJUNGLE 首頁第一屏，保留現有首頁內容在其後，打開網站即可看到並以滑鼠或觸控撥動草地。
- 能力與規範：已檢查目前可用 Skills/Plugins，讀取根目錄與站點 `AGENTS.md`、`sites:sites-building`、`local-web-self-check`、`computer-use:computer-use` 與 Product Design 路由／審查規則。`.openai/hosting.json` 沒有 `project_id`，本輪按現有倉庫慣例只做本地修改，不註冊、不推送、不部署。
- 策略基線：倉庫要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍不存在；沿用現有源碼、`CONTENT_GUIDE.md`、`SITE_MAP.md`、既有 QA 記錄與用戶本輪確認的草地互動作為替代基線，不新增未驗證的產品、客戶或成效聲明。
- 視覺方向：保留現有森林綠、象牙白、品牌標誌、雙語首頁文案與 CTA；以高密度短草、柔性圓弧彎曲及局部風場取代原 Hero 背景媒體，使互動自然成為第一屏，不改動後續產品與內容結構。
- 驗證計劃：完成代表性首頁後執行 Product Design 審查、React best-practices、production build、Sites worker 測試、本地資源檢查、桌面與手機真實瀏覽器 QA、完整 verification 與標準 security scan；結果同步記錄在本檔及 `QA_REPORT.md`。
- 實現結果：新增獨立 `GrassHero` Three.js 組件，首頁首屏改為 132,000 株桌面／68,000 株手機的高密度短草；滑鼠與觸控會產生局部、有方向和回彈的風場，聲音保持用戶主動開啟。原有雙語標題、品牌導航與兩項 CTA 保留。
- React review：Three.js Hero 改為 `React.lazy` + `Suspense` 按首頁需求載入，主包由先前約 845 kB 拆為 360.75 kB，草地獨立 chunk 為 482.09 kB；高頻互動資料留在 WebGL uniform／ref，不觸發 React re-render，listener、audio、RAF、geometry、material 和 renderer 均有清理。
- Product Design audit：1440×900 與 390×844 真實瀏覽器均確認品牌層級、CTA 可讀性與草地尺度；修正了拖動時文字被選中的問題。手機初次進入會先顯示同色 fallback，約 2 秒內完成 68,000 株草地初始化；這是目前可接受但仍可進一步優化的首屏性能限制。
- 驗證：`/zh-hk`、`/en` 均正常；中文／英文聲音開關可達且默認關閉，拖動後無文字選取；控制台 0 error／warn。首頁與 Vite、主 JSX、`GrassHero.jsx`、CSS 均返回 HTTP 200；`npm run build` 通過（4,577 modules），`npm run test:sites` 4/4 通過。
- 安全與發布：Codex Security 工作台啟動命令失敗且未返回 `scanId`，因此不聲稱標準掃描完成或 0 findings；本輪沒有提交、推送、部署或改動正式站。

## 2026-09-18 — 产品说明体系补强（本地版本）

- 需求：在不发布、不部署的前提下，补强 HK MINIJUNGLE 四个核心产品的具体说明；无法确认的规格、安装、维护、验证与商业资料必须保留明确位置，并标为「待补充材料」。
- 参考与能力：已使用 Product Design `get-context` 延续现有视觉系统和 LARQ 互动审计结论；已读取 Sites building 生命周期、本项目 `AGENTS.md` 与 `local-web-self-check`。`.openai/hosting.json` 没有 `project_id`，用户明确要求仅本地修改，因此不注册、不发布 Sites，也不触发 Vercel 部署。
- 已知限制：仓库原要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 无法取得；用户已明确表示无法提供。此次以现有源码、`CONTENT_GUIDE.md`、`SITE_MAP.md`、既有能力/QA 记录和用户本轮确认的内容策略为替代基线。
- 内容原则：不虚构尺寸、材料、测试结果、认证、价格、供应状态、安装条件或客户案例；已知事实正常展示，未确认内容使用可见的待补充状态和材料清单。
- 实现计划：为通用产品页增加产品状态、组成、工作方式、适用边界、规格、安装、维护、验证、包含/不包含内容及资料缺口；为 CANVIVA 专页保留既有香港空间叙事，并在其前后增加可决策的产品说明层。
- 后续验证：完成首个代表性页面后进行本地预览；完整修改后运行 React best-practices review、构建、Sites worker 测试、真实浏览器桌面/移动端 QA、完整 verification 与标准 security scan，并把结果写入本日志及 `QA_REPORT.md`。
- Product Design：完成四个核心说明页后，以 CANVIVA 桌面流程和窄屏截图进行审查。发现产品章节导航原先会被 76px 主导航遮挡，已把桌面／移动端 sticky offset 和 section scroll margin 对齐；深色养护区的图标颜色也改为明确的浅色值。
- React best-practices：检查新加入的 `ProductGuide`、模块级静态产品资料、列表 key、ARIA 状态和渲染路径。没有新增 effect、数据瀑布、重复监听器、动态重型依赖或内联组件；静态资料保持在模块层，不需额外 memo 化。
- Sites / local-web-self-check：沿用现有 Vite/Sites 构建，不注册 Sites 项目、不部署。`http://127.0.0.1:4173/zh-hk/products/canviva` 返回 200；真实浏览器确认标题、产品说明、规格状态、材料缺口和 FAQ 展开状态，控制台只有 Vite 连接及 React DevTools 提示，没有应用错误。
- 浏览器与可访问性：四个中文产品/技术详情页及 CANVIVA 英文页均显示完整说明层；锚点点击后 section top=144px、主导航 bottom=77px、产品导航 bottom=146px，标题没有被固定导航遮挡。Tab 焦点可见并首先到达「跳至主要內容」。手机/窄屏证据保存为 `output/qa/qa-mobile-canviva.png` 和 `output/qa/qa-mobile-canviva-2x.png`。
- 无障碍 Skill 限制：`a11y-audit` 当前安装缺少其引用的 `accessibility/wcag-checklist.md`、`aria-patterns.md` 和 motion 参考文件，无法按该 Skill 完整运行；已改用 AX 树、键盘焦点、语义、目标尺寸、状态文字和响应式实测，不宣称完整 WCAG 合规。
- 构建与验证：`npm run build` 通过（4,573 modules）；`npm run test:sites` 4/4 通过；本地资源检查 HTTP 200、0 failures；完整 verification 确认流程为静态产品资料 → `ProductGuide` → 双语详情页，无新增 API 或数据存储边界。
- 安全：Codex Security standard scan `0b153a05-27d3-4055-b25d-3545aa82aeb1` 完成，覆盖状态 `complete`，0 critical / 0 high / 0 medium / 1 low。低风险项是既有 `vercel.json:16-20` 全路径 SPA rewrite 包含 `/api/*`，不是本次产品说明改动引入；用户要求本地修改，本轮未扩大范围修正部署路由。Daybreak 状态为 `not_granted`。扫描报告提示运行期间目录内容发生变化；变化来自本地构建/QA 产物，产品源文件在扫描启动后没有再改动。
- 发布状态：没有安装 Plugin、连接新账户、提交、推送、部署或发布；现有生产网站未变更。

## 2026-08-24 — 自动播放 HTML 演示页

- 需求：新增一个不改变正式 React 页面结构的、可自动播放的 HK MINIJUNGLE HTML 演示页，并提供轻音乐。
- 规范检查：已检查当前可用 Skills/Plugins，并读取 `control-in-app-browser`、`local-web-self-check`、`product-design` 与 `product-design:audit` 的相关说明。
- 参考简报：仓库要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 当前不存在，因此本次以现有网站 `src/`、`CONTENT_GUIDE.md`、`SITE_MAP.md` 和已上线内容为事实来源；未新增未经证实的客户、指标或项目。
- 设计处理：复用现有网站的森林绿、象牙白、衬线标题与概念效果图标注；未建立新的产品视觉系统，因此跳过 Product Design get-context。
- 实现范围：新增 `public/hk-minijungle-auto.html`，使用 Web Audio API 合成低音量、循环的轻音乐；自动播放失败时提供用户主动启用入口。
- QA 计划：执行 `npm run build`、`npm run test:sites`、静态资源检查与真实浏览器检查；不修改 React 组件，因此跳过 React best-practices review，并记录原因。
- 修正：首次浏览器测试发现自动切换没有在初始页调用调度器，已补上初始化 `schedule()`；Web Audio 在当前内置浏览器不可用，已增加内置 WAV `<audio>` 备用方案及用户启用入口。
- 安全：Codex Security 标准扫描尝试启动，但当前账户 TAC 状态为 `not_granted`，扫描工作台未能启动；已改用本地静态检查，并将控制按钮从 `innerHTML` 改为 DOM 节点构造，避免把动态文本插入 HTML。
- 验证结果：本地资源检查 200/7；`npm run test:sites` 4/4 通过；真实浏览器验证自动切换、暂停、跳页与轻音乐按钮状态。

## 2026-08-31 — 手机端首页完整产品展示

- 需求：手机端首页产品区需要直接显示完整产品清单，不要求用户先进入产品页。
- 规范与能力：已检查当前可用 Skills/Plugins，并读取 `sites-building`、`local-web-self-check` 与 `control-in-app-browser` 说明；沿用既有 Product Design 视觉系统，不新增视觉方向。
- 参考简报：仓库要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍不存在，因此继续以现有网站内容与已批准资产为事实来源。
- 实现计划：仅调整首页产品卡片数据源，让产品平台区展示 CANVIVA、CUISVIVA KITCHEN、Xponge、DR FOREST 四项；不改动共享 `productFamilies` 的既有导航语义。
- QA 计划：手机宽度 390px 真实浏览器检查产品卡数量与名称；运行本地资源自检、构建及站点测试。
- 验证结果：390×844 浏览器视口确认 4 张产品卡均渲染且可纵向滚动；本地资源自检 200；构建与站点测试通过。
- 安全：Codex Security 标准扫描 `f8e12554-f05a-4f82-94c7-19111686bf08` 已完成，0 findings；TAC 状态为 `not_granted`，扫描报告仍按受限账户路径生成，未发现本次改动相关问题。
- GitHub：`9cd14b4` 与 `13628d7` 已推送至私有仓库 `bambi2008/hk-minijungle-site` 的 `main` 分支。
- Vercel：通过已登录 CLI 发布生产部署 `dpl_Gj6cJVW9kAR2CmorLxCw9stUMUk8`，状态 `READY`；别名包含 `hkminijungle.com`、`www.hkminijungle.com` 与 Vercel 默认域名。
- 线上验证：390×844 视口下 4 张产品卡（生命畫境、鮮香植園、Xponge、DR FOREST）全部渲染且无横向溢出；生产错误日志查询无记录。

## 2026-09-04 — 手机版首页产品区前置

- 需求：用户确认首页打开后看不到「艺术款」，要求把四个产品区移到首屏附近。
- 规范与能力：已检查当前可用 Skills/Plugins，并读取 `sites-building`、`local-web-self-check`、`control-in-app-browser` 与 Product Design `get-context` 说明；沿用既有森林绿、象牙白和衬线标题视觉系统，不新增视觉方向。
- 参考简报：仓库要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍不存在；本次以现有 `src/`、已上线页面和用户明确的布局反馈为事实来源。
- 实现计划：将首页产品平台区移动到 Hero 后第一内容区，保留四张产品卡、原有文案、链接和响应式样式；后续叙事区顺延，不删除内容。
- QA 计划：运行本地资源自检、构建与站点测试，并在 390×844 真实浏览器确认 Hero 后立即出现产品区且四卡可见。
- 实现结果：首页新增手机版 Hero 内产品快速入口，四项产品以缩略图、编号和完整名称呈现；完整产品卡区仍保留在 Hero 后第一内容区。
- 验证结果：390×844 真实浏览器确认入口位于首屏底部（y=672–828），名称完整显示为生命畫境、鮮香植園、Xponge、DR FOREST，无横向溢出；本地资源自检 HTTP 200；`npm run build` 与 `npm run test:sites` 4/4 通过。
- 安全：标准扫描已尝试启动，但扫描工作台启动命令未返回扫描结果；本次不声称安全扫描完成或 0 findings。

## 2026-09-04 — 首页艺术款产品图替换

- 需求：用户确认所提供的金色壁挂植物艺术装置为「艺术款」，要求它出现在首页。
- 规范与能力：沿用已检查的 `sites-building` 与 `local-web-self-check` 能力；网站策略简报 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍缺失，因此继续以仓库现有内容和用户明确提供的资产为事实来源。
- 素材处理：将用户提供的原图 `D:/MQ/MINIJUNGLE公司资料库/06公司产品/002酒店系列/微信图片_20260809114056_198_2 - 副本.jpg` 原尺寸复制到 `public/images/canviva-art-wall.jpg`，未覆盖已有素材。
- 实现：将 `CANVIVA / 生命畫境` 产品数据的主图改为该 JPG，使首页 Hero 底部四项快速入口、首页完整产品卡和 CANVIVA 详情页使用同一艺术款素材；紧凑办公室文章图集的对应艺术图也改用原图。产品名称与既有概念图标注规则保持不变。
- QA：390×844 真实浏览器确认首页四项入口和四张产品卡均加载 `/images/canviva-art-wall.jpg`，图片 `naturalWidth` 非零，无横向溢出，控制台错误为 0；本地自检返回 HTTP 200。
- 构建与测试：`npm run build` 通过；`npm run test:sites` 4/4 通过。
- 安全：本次未新增 API、外部脚本或数据边界；标准安全扫描此前未返回可审计结果，未将其标记为完成。
- 部署：本次仅更新本地源码与素材，未推送 GitHub 或发布 Vercel。

## 2026-09-18 — CUISVIVA KITCHEN 多角度产品视图（本地版本）

- 需求：参考 LARQ 的产品查看体验，为 CUISVIVA KITCHEN 增加可拖动旋转的产品展示，不上线。
- 已调用能力：`imagegen`、`product-design:image-to-code`、`product-design:design-qa`、`local-web-self-check`、`vercel:react-best-practices` 与 `vercel:verification`。Product Design 保存上下文未配置；本次以用户截图、现有产品视觉和已给出的 LARQ 交互方向为依据。
- ImageGen：以 `public/images/cuisviva-kitchen-european.png` 为严格参考，生成 0°、45°、90°、135°、180°、225°、270°、315° 八个概念视角。背面不添加接口、按钮或未确认结构；所有帧在界面内明确标注 `概念效果圖 / Concept visualisation`。
- 素材：八帧保存为 `public/images/cuisviva-spin-concept-v1-00.webp` 至 `-07.webp`；1536×1024，每帧 25–79 KB，总计 487,384 bytes。生成的 PNG 原件仍保留在 Codex 生成目录，站点仅保留优化 WebP。
- 交互：鼠标拖动、触摸横向滑动、前后按钮和键盘左右键均可切换视角；`role="slider"`、角度读值、可见焦点和 48px/52px 控件已实现。移动端 `touch-action: pan-y` 保留竖向滚动。
- 资料边界：正式 36–48 帧环拍、背面结构、接口位置及尺寸图继续以「待补充材料」显示；未把生成角度描述为工程图或量产外观。
- 验证：生产构建通过（4,573 modules）；Sites worker 测试 4/4；本地页面与八个 WebP 均返回 200。真实浏览器在 1440×1000 与 390×844 验证双栏/单栏布局、按钮、键盘、拖动、双语文本、0 横向溢出、图片 `naturalWidth=1536`、控制台 0 error。
- 安全扫描：按要求调用 Codex Security Standard Scan，但桌面工作台的 `start-prompt-only-scan` 启动命令失败且没有返回 `scanId`；依据 Security Skill 约束，没有重开替代扫描或伪造结果。本轮不声明安全扫描完成或 0 findings。
- 发布状态：没有提交、推送、部署或发布；生产站保持不变。

## 2026-09-18 — 首页厨房生活方式 Hero 概念视频（本地版本）

- 需求：参考 LARQ 的生活方式 Hero 动态，为首页制作欧美厨房场景，表达从 CUISVIVA KITCHEN 现摘香草并加入食物的日常体验；不部署。
- 策略简报：按仓库要求检查 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md`，文件当前不存在；本次继续以现有网站、用户明确方向和既有 CUISVIVA 概念外观为依据。
- 能力检查：检查了当前 Skills/Plugins；`faceless-video` 要求旁白、多场景叙事、字幕和非写实风格，不适用于静音单场景网站 Hero，因此在读取后没有调用其生成流水线。改用 `imagegen` 生成连续关键画面，并以本地浏览器录制合成为 WebM。
- 视频生成尝试：Higgsfield `seedance_2_5` 的 1080p 方案因账户要求 Plus 计划而未启动；`minimax_h3_max` 后备方案因免费计划无视频额度而未启动。两次均没有生成任务或扣费，未伪称为完整 AI 连续拍摄。
- 素材计划：三张 16:9 关键画面分别表现环境、现摘罗勒和撒入意面，产品外形以既有 CUISVIVA 概念图为参考。输出在界面标注 `概念效果視頻 / Concept video`，最终实拍素材仍待补充。
- 实现计划：首页 Hero 使用静音、自动播放、循环、`playsInline` 的 WebM；首帧 PNG 同时作为加载及减少动态偏好时的静态回退。保持现有文案和 CTA，不新增产品性能、销量或用户证明。
- QA 计划：真实浏览器检查 WebM 可播放、时长与中段画面；运行构建、Sites 测试和本地页面检查。仅修改 `HomePage` 内媒体标记与对应 CSS，不触发多组件 React 重构。
- 发布状态：本次只修改本地源码和素材；不推送 GitHub、不部署 Vercel 或其他服务器，等待用户确认。
- 实现结果：三张关键画面保存为 `public/images/cuisviva-hero-kitchen-concept-frame-01.png` 至 `-03.png`；浏览器原生录制生成 `public/videos/cuisviva-kitchen-lifestyle-concept-v1.webm`（1,729,705 bytes，浏览器报告 13.48 秒）。临时本地录制与 QA 脚本已在验证后移除，避免把机器专属运行时路径写入网站仓库。
- 页面接入：首页 Hero 使用首帧 PNG + WebM 覆盖层；开启自动播放、静音、循环与内嵌播放，保留既有标题、说明和两个 CTA，并显示 `概念效果視頻 / Concept video`。`prefers-reduced-motion: reduce` 时隐藏视频并保留静态首帧。
- QA 结果：本地首页、视频和首帧资源均返回 HTTP 200；桌面真实浏览器确认建立场景与撒入意面画面发生切换；390×844 自动化浏览器确认 `readyState=4`、`muted=true`、`loop=true`、`playsInline=true`、播放时间前进、无横向溢出、控制台 0 error；减少动态模式下 `videoDisplay=none`、首帧继续显示。
- 构建与测试：`npm run test:sites` 4/4 通过；首次构建被沙箱权限拦截，按工具指引在受控外部执行同一构建后通过（4,573 modules transformed，Sites 输出已准备）。
- 安全扫描：按仓库门槛调用 Codex Security Standard Scan；工作台 `start-prompt-only-scan` 命令失败且没有返回 `scanId`。依照 Security Skill 约束没有启动替代扫描，也不声明 0 findings。
- 最终发布状态：仍为本地概念版本；没有提交、推送、部署或发布。

## 2026-09-20 — 用户确认的 MiniMax H3 Hero 视频替换

- 需求：把 fal.ai 生成并由用户确认的 MiniMax H3 Max Turbo 连续视频接入首页厨房 Hero；保存到 GitHub，但不上传服务器。
- 策略简报：再次确认仓库要求的 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 不存在；继续以现有 durable decisions、用户确认视频和既有品牌系统为依据。
- 能力：检查当前 Plugins/Skills；调用 `plugin-management:plugin-management`、`app-6a3293e129088191abf0875820e839da:video-editing`、`product-design:image-to-code`、`product-design:design-qa`、`local-web-self-check`、`vercel:react-best-practices`、`vercel:verification` 与 `codex-security:security-scan`。Product Design 保存上下文仍未配置。
- 实现：Hero 固定源改为 `/videos/cuisviva-kitchen-h3-turbo-concept-v1.mp4`；保留静态 poster、自动播放、静音、循环、`playsInline`、双语概念标签与减少动态回退。未新增产品性能、客户或测试声明。
- 优化边界：视频为 1344×768、5.184 秒、9,242,499 bytes。本地未找到可用 ffmpeg/Higgsedit；云端压缩会把素材上传到第三方，超出本轮本地/GitHub授权，因此没有绕过权限使用。
- QA：构建通过（4,573 modules），Sites worker 4/4；本地页面和 MP4 均为 HTTP 200；中英文真实浏览器确认播放、解码、循环标记、概念标签、无横向溢出和无 error overlay。证据：`output/qa/h3-hero-mobile.png`。
- React/设计/全链路：静态同源媒体替换未新增 hook、effect、state、fetch、依赖或不安全 sink；设计 QA 和端到端静态媒体故事通过。P3 残余为 9.24 MB 体积与可察觉的循环边界。
- 安全：Standard Scan `fd3056b8-6a1e-4ef9-b6b5-d0eaa39725d4` 完成，声明的 17 个生产/构建源文件覆盖完整，报告 2 个低风险既有问题：查询参数未经白名单进入可选 analytics metadata，以及 Vercel catch-all 在特定同源 `/api` 配置下可能造成表单假成功。两项都不是本次视频替换引入；未在本轮扩展范围修复。扫描期间仅验收文档发生变化，报告保存的是启动时源码快照。
- 发布边界：本轮不得部署或发布到服务器；仅允许本地与 GitHub 源码保存。

## GitHub 推送与正式部署 — 2026-09-05

- 能力：读取并遵循 Vercel `deployments-cicd`、`vercel-cli` 与 Sites hosting 说明；`.openai/hosting.json` 仅包含空的 D1/R2 绑定且没有 `project_id`，Sites 账户中没有对应的 HK MINIJUNGLE Site，因此未新建重复的 Sites 项目；沿用已绑定的 Vercel 生产项目。
- GitHub：将已通过构建、站点测试和真实浏览器检查的改动提交为 `2ed6f51991faa667fdeed5b4e414128161ff987c`，成功推送至私有仓库 `bambi2008/hk-minijungle-site` 的 `main` 分支。
- Vercel：使用已登录的 Vercel CLI 59.11.7 发布生产部署 `dpl_FoHTYD1jC4aN1UixgD3RBoPS9jYU`；状态 `READY`，别名包含 `hkminijungle.com`、`www.hkminijungle.com` 与 Vercel 默认域名。
- 线上 HTTP：`https://hkminijungle.com/zh-hk` 与 `https://www.hkminijungle.com/zh-hk` 均返回 200；`canviva-office-wall.png`、`canviva-art-lobby.png`、`canviva-art-wall.jpg` 均返回 200。
- 线上浏览器：正式域名首页显示 6 张产品卡（4 个产品层 + 2 个办公款式）；「工作與空間」筛选显示 3 张 CANVIVA 办公卡片；新增图片 `naturalWidth` 非零，无横向溢出，控制台 error 日志为空。
- 安全：本次未新增 API 或外部数据边界；标准安全扫描未在本次重新执行，因此不声称本次扫描为 0 findings。
- 最终同步：文档状态提交 `bd84081` 已再次发布至生产部署 `dpl_8NUpKoJvGbHHrqvcrxGq8aqQupxR`，状态 `READY`；该部署为当前线上最终版本。

## 2026-09-04 — 办公产品款式补齐与首页滚动目录

- 需求：补齐「工作與空間」分类中缺少的两款办公绿化视觉，并让首页通过自然滚动展示完整产品目录；不再要求首屏一次显示全部产品。
- 规范与能力：沿用已检查的 `sites-building`、`local-web-self-check` 与 `control-in-app-browser` 能力；策略简报 `C:/Users/ss/Desktop/HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md` 仍缺失，未据此臆造产品资料。
- 素材处理：将用户提供的两张图片保存为 `public/images/canviva-office-wall.png` 与 `public/images/canviva-art-lobby.png`，分别对应「生命畫境 · 垂直綠牆」和「生命畫境 · 藝術款」视觉款式。
- 实现：新增 `officeProductVariants` 款式目录；「工作與空間」筛选显示 CANVIVA 主产品及两款式，两个款式链接到共享 CANVIVA 详情页；首页 Hero 后的产品区显示 4 个产品层与两款办公款式，移除此前首屏底部四格快速入口以符合用户最新滚动浏览意图。
- QA：390×844 真实浏览器确认首页产品区位于 Hero 后（productTop=844），6 张卡片图片均加载完成，无横向溢出；「工作與空間」筛选显示 3 张 CANVIVA 办公卡片，两张新图 `naturalWidth` 非零；控制台 error 日志为空。
- 构建与测试：`npm run build` 通过；`npm run test:sites` 4/4 通过；两张新增图片经本地 HTTP 200 检查并复制到 `dist/client/images/`。
- 安全：本次未新增 API、外部脚本或数据边界；标准安全扫描此前未返回可审计结果，未将其标记为完成。
- 部署：本次仅更新本地源码与素材，未推送 GitHub 或发布 Vercel。
## 2026-10-05 — 全球植物知识库与识别架构（本地实施中）

- 范围：新增 HK MINIJUNGLE 植物知识库，沿用 Gardify 的搜索、过滤、列表、详情与照片识别信息架构，并加入德国、美国、香港、中国大陆、英国、法国区域入口。
- 数据边界：先实现规范化植物 schema、来源字段、区域标签、筛选器和可替换识别 provider；识别结果必须显示为演示状态，未接入 AI 模型前不得宣称真实识别。
- 参考采集：用户已授权 Playwright CLI；桌面和 390×844 手机的首页、导航、搜索、Monstera 结果、单株详情及扫描上传区均已在本轮采集并检查。公开页显示 8,494 个植物结果；不进行未经许可的整库复制。
- 来源策略：文字以权威植物数据库事实为基础并改写为本站摘要；图片使用 Wikimedia Commons 可授权素材，记录作者、许可证与来源页，不热链 Gardify 素材。
- 能力状态：`product-design:index`／`get-context`／`url-to-code`、`product-design:user-context`、`plugin-management:plugin-management`、`playwright` 与 `vercel:agent-browser` 已调用；完整页面后运行 Product Design audit/design QA、React best-practices、local-web-self-check、full verification 和 standard security scan。
- 限制：指定策略 brief 仍不存在；`.openai/hosting.json` 仅含空 D1/R2 绑定。遵守 Product Design lifecycle，不重新初始化 Sites，不提交、不推送、不部署、不发布。
- 实现：新增 `plantData.js`、`plantKnowledge.jsx`、`plantRecognition.js`，以及双语植物库、六地区筛选、单株档案、图片/来源授权和 provider-neutral 识别接口；新增六张本地 Commons 授权图片。
- `vercel:react-best-practices`：通过；修复动态 SEO、移动筛选 Escape/滚动清理、上传同文件重选与本地化按钮标签。
- Product Design audit/design QA：通过；Gardify 参考与本地实现以相同 1280×800 尺寸同屏比较，证据保存在 `output/qa/plant-library/`。
- `local-web-self-check`：页面 200，资源检查无失败。Playwright 检查中英文、地区筛选、详情跳转、手机筛选抽屉、图片上传和未接模型状态；最终新会话 0 error／0 warning。
- `vercel:verification`：构建通过；Sites worker 4/4；`git diff --check` 无 whitespace error。
- `codex-security:security-scan`：按桌面 Standard Scan 流程调用，但 `start-prompt-only-scan` 在返回 `scanId` 前失败；没有创建替代扫描，也不声称标准安全扫描完成。此项仍是最终能力门槛阻塞。
- `imagegen`：已检查但有理由跳过；用户要求网上替换图片，且六张 Wikimedia Commons 实拍素材已有明确许可与来源，不需要生成概念场景。
- 发布状态：未提交、推送、部署或发布。

## 2026-10-06 — 植物数据批量导入层（本地实施中）

- 继续范围：在现有六个示例档案之后建立可测试的离线导入工具；不连接生产数据库、不下载整库、不抓取 Gardify。
- 能力复核：当前可用的 browser、Product Design、React、verification 与 Codex Security 能力已重新检查；本阶段只改数据工具与测试，不建立新视觉系统，因此不重复 Product Design 视觉流程。
- 来源策略：首个自动 adapter 以 GBIF Species API 的标准 JSON 形状为基线；Wikimedia Commons 仅导入明确的作者、许可、来源页字段；USDA 文字数据可用但图片须逐项检查许可。地区机构网页先标为 `manual/review-required`，不在未审条款下自动爬取。
- 安全状态：按用户“继续”再次调用 Codex Security Standard Scan；工作台仍在返回 `scanId` 前失败。本阶段不会把本地 schema 测试冒充正式安全扫描。
- 实现结果：新增来源清单、`1.0.0` 规范化 schema、GBIF adapter、离线 CLI、去重/冲突标记、Commons 许可 allowlist、发布严格模式、fixture 与测试；没有新增依赖或网络型运行时。
- 官方核对：通过 GBIF Species API 只读核对 *Echinacea purpurea*，当前接受名 key 为 `3150935`；已修正夹具和测试断言。
- 验证：`test:plants` 6/6；正常 dry-run 为 1 条有效记录且不写文件；`--publish` 对机器记录按预期 exit 1；Vite build、Sites 4/4 与 `git diff --check` 通过。
- 跳过说明：本阶段未改 React 组件或视觉界面，因此不重复 React best-practices、Product Design audit 与浏览器视觉 QA；继续沿用上一阶段已通过的页面证据。
- 发布状态：未生成生产数据文件，未连接数据库，未提交、推送、部署或发布。

## 2026-10-06 — GBIF 植物分类数据批量下载（本地实施中）

- 用户授权：按“批量下载植物”请求，仅从允许自动化访问的 GBIF Species API 下载分类学 JSON；不批量抓取 Gardify、RHS、地区植物志网页或许可未核实图片。
- 官方参数核对：GBIF `species/search` 的 `highertaxon_key=6`、`rank=SPECIES`、`status=ACCEPTED` 当前返回约 446,842 条记录；首条样本符合接受种阶元。
- 安全边界：下载器将采用分页、重试、检查点、断点续传、单次 10,000 条硬上限和本地目录限制；原始响应与规范化记录均保留来源，所有记录保持 `machine-normalized`，不得直接发布。
- 首批计划：下载 1,000 条、每页 200 条，写入被 Git 忽略的 `data/plant-import/gbif-plantae/`，随后用离线测试、计数和抽样验证完整性。
- 能力说明：本阶段只增加 Node 数据采集工具和测试，不修改 React 组件或视觉系统，因此 Product Design、React review 与浏览器交互 QA 不在本次触发范围；沿用既有页面验证结果。
- 发布状态：不会提交、推送、部署或发布这些机器下载记录。
- 范围修正：广义 `Plantae` 抽样包含藻类，因此通过 GBIF 官方 match API 核对并将推荐默认范围改为 `Tracheophyta`（key `7707728`）；`--scope plantae` 仍保留作显式广义植物选项。
- 实现结果：新增网络下载器、指数退避重试、每页原始 JSON、原子检查点、断点续传、NDJSON 规范化输出、无效记录报告、项目内目录约束与 10,000 条单次硬上限；下载数据目录默认被 Git 忽略。
- 真实批次：推荐的 `data/plant-import/gbif-tracheophyta/` 已取得 5 页、1,000 条；1,000 个 ID 唯一，全部 phylum 为 Tracheophyta，0 invalid、0 conflict、0 缺失 family。另保留 `gbif-plantae/` 试批次并明确其可能含藻类。
- 验证结果：植物工具测试 10/10；真实完成批次的 `--resume` 不产生额外网络页；Sites 4/4；生产构建在沙箱内因 Windows 目录读取权限失败，随后同一命令在受控外部环境 exit 0（4,580 modules）。
- QA/能力跳过：没有修改 React、视觉或浏览器交互，因此不重复 Product Design、React best-practices 或页面浏览器 QA。此前 Standard Security Scan 启动器未返回 `scanId`，本轮不再启动替代扫描，也不声称安全扫描完成。

## 2026-10-06 — 1,000 条植物图片与资料一次性补全（本地实施中）

- 用户授权：对当前 1,000 条 Tracheophyta 批次一次执行资料与图片补全；不逐条等待确认。
- 官方接口核对：Wikipedia Action API 可按科学名批量返回导言、文章 URL 和主图文件名；Wikimedia Commons `imageinfo` 可返回 1200px 图、作者、来源页和 `extmetadata` 许可。
- 许可边界：Wikipedia 文字按 CC BY-SA 4.0 保存文章链接和许可；Commons 图片仅接受既有 allowlist 中的 CC0、CC BY、CC BY-SA 或 Public domain，拒绝 fair use、NC、ND、未知许可和非位图资源。
- 匹配边界：只按 GBIF canonical scientific name 查询并跟随 Wikimedia 的正式 redirect；没有精确文章、没有合格主图或许可不合格时记录缺失，不以相似搜索结果替代。
- 实施计划：批量请求元数据、保存原始 API 响应、限并发下载图片、校验 MIME/大小并计算 SHA-256；支持检查点与续传，最终生成 enriched NDJSON、图片目录、缺失清单和统计 manifest。
- 能力说明：本阶段只增加数据采集工具与本地数据，不修改 React/CSS/页面交互，因此 Product Design、React review 和真实浏览器 UI QA 不触发；标准安全扫描仍沿用此前无法取得 `scanId` 的阻塞状态，不启动替代扫描。
- 实现结果：新增批量 Wikipedia／Commons enrich 工具、精确 redirect 解析、Commons 主图元数据、许可 allowlist、1200px 图片下载、8 MiB 上限、MIME 与文件签名校验、SHA-256、检查点、续传、精确科学名 fallback 搜索、缺失报告和 enriched NDJSON。
- 真实批次：1,000/1,000 条已处理；629 条保存英文 Wikipedia 导言，676 条保存本地图片，324 条在主图与精确 Commons 搜索后仍无可靠图片。676 张图共 369,005,840 bytes，全部有作者、许可、来源页、本地路径和哈希。
- 修复：首次运行发现 Wikimedia 新缩略图主机 `thumb.wikimedia.org` 被过严主机校验拒绝；核对为官方接口返回后加入精确域名白名单，并用断点结果仅重试受影响图片，覆盖从 133 提升到 455。随后精确 Commons 学名搜索把最终覆盖提升到 676。
- 许可结果：接受 CC0、Public domain、CC BY 与 CC BY-SA 的记录版本；拒绝 `COPYRIGHTED FREE USE`、归属字段不完整和 SVG。Wikipedia 文字保留文章 URL 与 CC BY-SA 4.0 标记；整个批次仍为 `publicationEligible: false`。
- 完整性验证：1,000 条 enriched NDJSON、676 个唯一图片路径、676 个本地文件、0 缺失文件；676/676 SHA-256 匹配，676/676 MIME 文件签名匹配。植物测试 12/12、Sites 4/4、生产构建 exit 0（4,580 modules）。
- 发布状态：数据目录继续被 Git 忽略；未提交、推送、部署或发布。最终 Standard Security Scan 门槛仍因既有启动器故障未完成。

## 2026-10-06 — 1,000 条植物目录接入网站（本地实施中）

- 用户指令：在批量数据与图片完成后继续，将其接入现有植物知识库。
- 前置检查：仓库指定策略简报仍不存在；`.openai/hosting.json` 只有空的 D1/R2 绑定。本轮不创建云资源、不部署，采用可复现的本地静态目录生成流程。
- 能力调用：已读取并将使用 `playwright`、`local-web-self-check`、`vercel:react-best-practices`、`vercel:verification` 与 `codex-security:security-scan`；没有建立新视觉系统，因此不重复 Product Design 建系流程，完成页沿用此前已审视觉系统。
- 内容边界：保留 6 条人工策展的地区/养护档案；1,000 条机器资料作为来源型分类目录，明确显示 GBIF／Wikipedia／Commons 资料、缺图状态和许可，不补写未知养护、毒性、原生地区或中文名称。
- 性能计划：生成前端 JSON 与本地静态图片目录，目录数据异步加载、结果分页渲染、图片懒加载；不把 369 MB 图片并入首屏 JavaScript。
- QA 计划：生成器测试、React 审查、真实浏览器搜索/分页/详情/缺图/手机检查、HTTP 资源检查、完整构建、Sites 测试和标准安全扫描；未完成这些门槛前不声明完成。

## 2026-10-06 — 六地区植物目录扩充（实施中）

- 用户授权：继续批量下载植物图片和资料，落实美国、香港、中国大陆、英国、法国以及既有德国的地区品类。
- 前置检查：指定 Desktop 策略简报仍不存在；继续沿用已有植物库架构和已审核视觉。检查了当前 Skills 与可调用工具；网站目录保持独立，hosting 配置没有 project_id 或有效 D1/R2 绑定。
- 来源核对：读取 GBIF 官方 Occurrence OpenAPI，实际试请求验证 country、taxonKey、speciesKey facet 与 facetLimit。GBIF country 表示发生记录所在地区，不能直接转换为原生或园艺适应性。
- 批次：每地区 100 个高频维管植物种的 occurrence 聚合，保存原始 facet、物种分类、发生记录数、来源链接与检查点；合并跨地区同名物种，再调用既有 Wikipedia/Commons 补全流程。
- 能力：现有 GBIF/Wikimedia 专用下载工作流优先；`monid` 的既有工具优先规则适用，因此无需新安装或付费端点。后续使用 `vercel:react-best-practices`、`playwright`、`local-web-self-check`、`vercel:verification` 与 `codex-security:security-scan`；有页面变化时补充 Product Design audit。
- 发布边界：仅本地数据与页面；不提交、推送、部署或发布。导入记录继续保留未审校状态。

- 真实采集结果：六区各 100 种，共 600 个地区归属、445 个独立 GBIF 物种；417 条英文资料、435 张授权图片，178,954,089 bytes。445 个 ID 唯一；435/435 文件哈希与 MIME 签名通过，0 缺失。28 条缺导言、10 条缺图保持显式空缺。
- 合并结果：原批次与地区批次有 6 条重合，导入目录最终 1,439 条、1,040 条英文导言、1,105 张图片。保留六条人工档案并去重后，UI 为 1,441 条，1,441 个唯一 slug。六区 UI 数量为 DE 100、US 101、HK 100、CN 101、GB 100、FR 101；额外条目来自人工档案。
- 修复：香港洋紫荆的 GBIF canonicalName 省略杂交符号，已用实际物种 ID `gbif-species:2953373` 与人工档案合并。地区证据由多值 regionIds 表示，不覆盖原生状态字段。页面统计从生成数据动态计算。
- `vercel:react-best-practices`：检查 memo 化筛选、模块级请求缓存、slug 绑定详情状态、稳定 key 和 effect 清理；发现移动弹窗焦点没有限制，已补初始焦点、Tab/Shift+Tab 循环及关闭后回到触发按钮，并通过真实键盘测试。
- `product-design:audit`：当前地区列表、来源证据、英文手机筛选与手机详情四步均通过；四张截图实际保存并逐张打开检查，位于 `output/playwright/plant-regions/`，报告在 QA_REPORT。
- `playwright`：六区按钮均验证实际结果；首批 48 卡；手机 Load more 到 96；科学名搜索 1 条；进入真实记录详情，显示香港 2,261 笔来源证据。390px 页宽无溢出；最终 console 0 errors/0 warnings。
- `local-web-self-check` 与 `vercel:verification`：最终页面 200，logo/JS/CSS 三资源 0 failures；目录 JSON 200/application-json/1,439 条，植物 JPEG 200。全部 1,105 张公开目录图片 SHA-256 匹配，共 544,062,016 bytes。植物测试 17/17、Sites 4/4、最终 build 4,581 modules 通过。
- `codex-security:security-scan`：本轮再次按桌面流程调用唯一 Standard launcher；`workbench_db.py start-prompt-only-scan` 失败，未返回 scanId。按技能要求未另建替代扫描，安全能力门槛仍未完成。指定策略简报仍缺失，无法核对 Section 19 的额外清单。
- 发布结果：本轮未提交、推送、部署或发布；本地预览仍运行。

## 2026-10-06 — 中文名称与导言离线补全

- 前置：指定策略简报仍缺失；本轮不修改网站 src、运行时工具、package、公开目录或 hosting。只增加 output 下离线采集辅助脚本及 data 下下载结果。
- 能力检查：检查实际可用工具与当前 Skill 名称；`monid` 已完整读取，按其既有专用工作流优先条款跳过安装、discover 和付费服务。
- 来源核对：官方 MediaWiki Langlinks／TextExtracts；实际测试繁体 zh-hk 导言、Wikidata P225、中文 label 与 sitelink。中文资料独立保存，不机器杜撰中文名称或养护知识。
- 验证计划：离线夹具测试、真实采集清点、身份/来源/许可校验、断点续传无网络校验；网站无变更，不将数据检查当作 UI 或标准安全扫描通过。
- 未提交、推送、部署或发布；此前 Security Standard launcher 无 scanId 的故障仍未解决。

- 完成离线采集：1,439 条全部处理，664 种中文名称、531 种繁简体导言。六区 445 种中覆盖 414 个中文名称、362 个中文导言；新增 47 个此前无英文导言的植物介绍，其中地区记录 23 个。
- 全量验证：1,439 个唯一 ID、1,064 个精确学名实体、2,622 个中文名称字段、1,062 个导言字段，338 个原始响应。中文导言与对应源响应逐字一致；文章 QID/revision、名称许可和原始分类/地区/英文/媒体/审校状态均校验。
- 图片补全再尝试：现有 Commons fallback 与中文同实体主图均已尝试。10 条缺图没有新增；中文渠道中 8 条无主图、2 条许可 NO RESTRICTIONS 未通过白名单。仍为 1,105 张合并图片、435 张地区图片。
- 离线测试 5/5 + 图片边界测试 2/2；真实续传 0 网络请求，NDJSON SHA-256 不变。全量审计及 git diff --check 通过，data 结果 Git 忽略。
- `vercel:verification` 已完整读取并执行离线故事边界核验；`codex-security:security-scan` 与 desktop 参考重新读取，按禁止 replacement scan 的规则保持既有无 scanId 阻塞，不宣称标准扫描通过。
- 明确跳过：未改 React/CSS/路由或公开目录，故不重复 Product Design、React review、Playwright、local-web-self-check、Sites/build；没有把过去 UI 证据当成本轮中文页面验收。页面接入仍需补齐指定 brief。
- 报告：output/plant-data-zh/README.md；无生产变更。

## 2026-10-06 — 全来源中文覆盖率复核与定向补查

- 策略 brief 再次检查不存在；网站源码、运行时工具、public/hosting 不改，仅处理 output 辅助脚本和 data。
- `data-analytics:analyze-data-quality` 已完整读取，连同 shared instructions 与 inline-sources receipt；作为中文覆盖率口径的 scoped companion check 使用，记录数/唯一 ID/语言标签/来源交集为本次检查范围，不启动无关 BI 或安装流程。
- 初始真实核对：1,439 个独立物种中，865 个有中文语言标签且含汉字的名称；GBIF 覆盖 395 个，Wikimedia 覆盖 664 个，交集 194 个。上一轮 664/775 是 Wikimedia 补全结果的口径，不是合并文件的全来源 865/574；保留原报告历史并补上解释。
- 既有 GBIF/Wikimedia 工作流按 `monid` dedicated-workflow 优先规则使用；不安装、连接账户或付费。官方 Wikidata Data access 已核对。
- 本轮针对真正缺名的 574 个物种，精确 P225 实体搜索及中文 label/alias/sitelink 补查；保留前一批数据，新增版本不得覆盖旧导言或媒体。
- UI/React/视觉技能未触发，标准安全扫描仍受既有 desktop 启动失败阻塞，不另建替代扫描，不声明完整完成。

- 全来源复核通过：865/1,439 命名率 60.11%，GBIF 395/Wikimedia 664/交集 194；574 真正缺名。1,439 ID/slug 唯一、0 schema invalid，原 NDJSON SHA-256 不变。
- 新增 output 离线定向 supplement 工具，保留 ISO 中文标签、精确 P225、歧义拒绝、中文 alias 来源、append-only 合并、输入 hash、API 缓存与续传；夹具测试 4/4。
- 真实补查：首次与同一检查点的一次重试均 maxlag，processedTargets 为 0，新增资料 0，状态 failed。只读诊断 HTTP 200 内为 API error，lag=9.15/Retry-After=5。按官方推荐保留 maxlag=5，不忙轮询、不以 fixtures 充当真实采集。
- `vercel:verification` 和 `codex-security:security-scan` 主技能及 desktop 参考重新完整读取；离线输入/工具测试通过，实际 API 边界失败后停止；标准扫描仍因既有无 scanId 故障未完成，不替代扫描。
- 数据 Sources receipt 使用 bundled Node 和私有输出目录；首次沙箱 EPERM realpath，受控重试仅本地读取 renderer，不安装或联网。具体交付状态以 renderer 结果为准。
- 当前报告 output/plant-data-zh/COVERAGE_REVIEW.md；旧 README 补明统计口径，既有数据未覆盖。未修改 UI/React/CSS/公开目录，故不新增浏览器或构建通过声明。未提交、推送、部署或发布。

## 2026-10-06 — 美英法中文译编草稿（离线）

- 继续范围：只补 US/GB/FR 首批样本中的中文可读介绍，不扩大地区采样、不恢复公开植物库入口、不修改网站源码、public 或 hosting。最新站内 AGENTS 已将植物库归档；保留该决定。指定策略 brief 仍缺失。
- 检查实际工具，并完整读取 `monid`、`vercel:verification`、`codex-security:security-scan` 与 desktop 参考。既有专用 Wikimedia 数据工作流优先，不安装/调用付费 Monid。标准扫描既有无 scanId 故障不通过替代扫描规避。
- 源接口诊断仍 maxlag=8.2167、Retry-After=5；不继续高频补查。改为基于已下载 CC BY-SA 4.0 英文导言整理中文译编草稿，逐株保留来源及 source hash，明确 derived/adapted、未专业审校，与中文 Wikipedia 原文分列。
- 当前需求：53 个独立物种缺中文导言，涵盖 US 29/GB 19/FR 15 个地区归属。先核对学名与文章实体；不能确认的仍不填。不杜撰中文俗名或新增养护/毒性/药用结论。
- 本轮仅 output 离线工具、译编文本和 data/报告；不改 UI，故不触发 React、视觉或浏览器 QA。离线验证链路为已下载 source → 身份/文本 → 带出处译编 → append-only staging。

### 2026-10-07 — 译编批次最终离线验证

- 实际暂存 53 个独立物种、106 繁简文字字段，保留原始中文来源 531 种，合并中文可读导言 584 种。US 原文 71+草稿 29、GB 81+19、FR 85+15，各首批 100 种；原有图片每区 100，不是新增下载。全库名称 865/图片 1,105 未变。
- 新 output staging helper 与边界测试 3/3；独立读取全部 1,439 ID/slug 唯一、0 invalid、原字段和既有原文逐条保持。53 段英文 extract 的实际 revision/hash 和实体来源核对；50 exact P225、1 explicit hybrid、2 accepted synonyms。仅改变 append-only 描述和新增草稿 review flag。
- 核验器首次不接受 ×hispanica/× hispanica 的空白差异，修复为保留杂交符号的空白规范化、完整学名边界；未放宽身份为模糊匹配。最终通过。真实缓存重跑网络 0，NDJSON hash 不变，详细 integrity-report 已保存。
- `vercel:verification` 离线来源至暂存链路通过，不认证译文语义、植物学或安全性；professionalReviewCompleted/publicationEligible 为 false。
- `monid` 专用既有工作流优先、无新安装/付费调用；未改 src/public/package/hosting，不新增浏览器/React/视觉/构建/Sites 结论。已核对数据 Git ignore。
- `codex-security:security-scan` 标准扫描沿用已有无 scanId 阻塞，desktop 禁止替代扫描；指定 brief 仍缺失、Section 19 不可验证。植物库公开归档决定保持，未提交/推送/部署/发布。报告 output/plant-data-zh/US_GB_FR_DRAFT_REPORT.md。

## 2026-10-07 — 常规蔬菜优先、全库资料完整性

- 用户新优先级：先保证欧美及中国常规蔬菜，再逐株补资料。只做离线 output/data/文档，官网归档入口保持，src/public/package/hosting 不变；指定 brief 再查仍缺失。
- 实际检查现有公共 web、GBIF/Wikimedia 专用流程、文件工具及 Security launcher；已完整读取 monid、data-analytics:analyze-data-quality 及 shared/inline-sources receipt、当前 vercel:verification 0.54.1、codex-security:security-scan 及 desktop 参考。
- data-analytics:analyze-data-quality 使用 scoped companion 检查物种/栽培类型混合粒度、缺失字段与 taxonomy join；不以同种覆盖替代西兰花/菜花/甘蓝等独立 crop 类型。monid 按既有专用 API 工作流优先跳过新安装和付费调用。
- vercel:verification 故事为显式蔬菜清单 → 实际 GBIF 身份 → 可追溯来源资料 → 离线追加/全库逐株缺项队列；不认证专业养护语义或 UI 接入。标准扫描既有无 scanId 故障按 desktop 不创建替代扫描。
