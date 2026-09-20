# Capability Log

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
