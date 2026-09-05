# Capability Log

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
