# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- 2026-09-04：手机版首页不强制在首屏一次展示完全部产品；首页 Hero 后的产品区按页面自然滚动呈现完整目录，并包含生命畫境（CANVIVA）的垂直綠牆与藝術款两种办公款式。
- 2026-09-18：产品说明必须帮助客户判断产品是什么、如何工作、适用条件、安装与维护责任、验证状态和下一步；无法确认的内容保留位置并明确标注「待补充材料」，不得用推测补齐。
- 2026-09-18：本轮产品说明改造仅保存在本地，未经用户后续明确授权不得推送、部署或发布。
- 2026-09-18：CUISVIVA KITCHEN 产品页采用可拖动、触摸及键盘操作的多角度产品视图；现阶段未确认角度必须标注为概念效果图，正式环拍素材到位后原位替换。
- 2026-09-20：首页 CUISVIVA KITCHEN Hero 使用用户确认的 MiniMax H3 Max Turbo 连续概念视频；继续显示「概念效果視頻 / Concept video」，减少动态偏好下回退至静态首帧。本轮只保存在本地，未经明确授权不得部署或发布。
