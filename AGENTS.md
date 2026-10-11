# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- 2026-10-07：植物资料的离线工作优先保证欧美及中国常规蔬菜覆盖，再逐株补齐资料。按栽培／食用类型保留西兰花、菜花、甘蓝、菜心、大白菜等独立档案，并链接其接受分类；不得把同物种覆盖等同所有蔬菜类型齐全，不凭观察地点推导原生或种植适应性，不以通用模板填补缺乏来源的养护、安全字段。官网公开归档决定不因此改变。

- 2026-10-07：CANVIVA 对外正式产品分类固定为 `CANVIVA SIGNATURE / 生命畫境・定制`、`CANVIVA WALL / 生命畫境・綠牆`、`CANVIVA PANEL / 生命畫境・植景屏`；英文为正式产品标题，中文为辅助名称。`CANVIVA DIVIDER / 生命畫境・綠植隔屏` 只在资料模型预留，在正式图片与文案确认前不得公开、生成概念图或使用替代图。
- 2026-10-06：HK MINIJUNGLE 官网公开品牌架构收敛为 CANVIVA 与商业／公共空间 living plant systems；CUISVIVA、家庭种植、植物宠物、植物知识库／AI 识别与未来 DR FOREST 消费产品从主导航、首页、公开产品入口和 sitemap 移出，但保留代码与资产，并为旧 URL 使用清晰的 noindex archive 策略。
- 2026-10-06：DR FOREST 不再作为 HK MINIJUNGLE 内部产品线公开展示；在新公司注册及服务关系正式确认前，只可使用 `AI-enabled operations`、持续养护和植物资产记录等中性能力表达，不声明法律实体或公司间关系。
- 2026-10-06：本轮品牌聚焦只改内容、导航语义、公开入口、SEO 与迁移状态；现有网页视觉设计、CSS、互动草地、动画和交互组件源码保持不变。

- 2026-09-04：手机版首页不强制在首屏一次展示完全部产品；首页 Hero 后的产品区按页面自然滚动呈现完整目录，并包含生命畫境（CANVIVA）的垂直綠牆与藝術款两种办公款式。
- 2026-09-18：产品说明必须帮助客户判断产品是什么、如何工作、适用条件、安装与维护责任、验证状态和下一步；无法确认的内容保留位置并明确标注「待补充材料」，不得用推测补齐。
- 2026-09-18：本轮产品说明改造仅保存在本地，未经用户后续明确授权不得推送、部署或发布。
- 2026-09-18：CUISVIVA KITCHEN 产品页采用可拖动、触摸及键盘操作的多角度产品视图；现阶段未确认角度必须标注为概念效果图，正式环拍素材到位后原位替换。
- 2026-09-20：首页 CUISVIVA KITCHEN Hero 使用用户确认的 MiniMax H3 Max Turbo 连续概念视频；继续显示「概念效果視頻 / Concept video」，减少动态偏好下回退至静态首帧。本轮只保存在本地，未经明确授权不得部署或发布。
- 2026-09-29：首页 Hero 保持互动草地；CUISVIVA KITCHEN／鲜香植园的 8 帧旋转展示放入首页产品区。桌面鼠标移动或拖动、触控拖动、方向按钮与键盘方向键都应可切换角度，并持续标注为概念效果图。
- 2026-10-05：植物知识库沿用 Gardify 的搜索、筛选、植物卡、单株详情与照片识别架构，但使用新的授权图片与权威来源摘要；区域维度至少覆盖德国、美国、香港、中国大陆、英国和法国。识别模块先完成可替换 provider 架构，未接入 AI 模型时必须明确标注演示状态。
