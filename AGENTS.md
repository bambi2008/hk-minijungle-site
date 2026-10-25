# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable prototype decisions

- 2026-10-25：用戶明確授權「存到GitHub並部署」。可提交／推送本次官網及必要資產至既有 GitHub 倉庫，發佈至既有 Vercel 項目及其正式域名；不另建站、改 DNS 或連接新帳號。此前僅本地的限制對本次發佈已解除；缺失簡報仍按用戶授權跳過。

- 2026-10-23：用戶重新授權跳過缺失策略簡報。首頁場景改「為公共空間而設」，辦公／SHOPPINGMALL／可持續理念品牌店各選一張；完整辦公圖集移到應用場景，商場及品牌店用用戶指定新圖，全部完整畫面、同高橫向拖動。技術第一段講家具化模組／接電使用／減少現場裝修及營運干擾；Xponge 排版精煉，不出現「原文」字樣。只做本地修改，不部署。

- 2026-10-18：用户指定现有首页草地Hero为整站美学参照，要求后续页面延续其气质，不另造风格；指出缺失的“图片互动”具体指悬停/滚动动效（选项3），不是左右拖动或产品旋转。后续修复需保留现有Hero、完整内容、11图同高拖动、七方案选择及已确认CANVIVA架构，动效尊重reduced-motion。

- 2026-10-15追加：办公图库接收多张用户供图，按原始文件哈希去重，保持完整画面、同高上下对齐与左右拖动；Xponge技术篇需详细解释材料/双通道/根区原理，突出用户确认的专利产品定位，专利编号、权利人、授权地区和状态须有资料，不编造，未提供明确待补。

- 2026-10-15：导航CANVIVA之后加入「技術」至现有technology/xponge。技术内容三部分：用户爆炸图/结构示意、据指定两篇MiniJungle文章解释Xponge聚氨酯多孔基质与双孔道原理、自动水循环/补光。用户给定参考值约15天补水及营养液、每12小时25–30秒循环、08–20补光；不得泛化所有植物或宣称绝不烂根/100%无菌/未验证存活率。夜间「睡觉」仅为暗期比喻，按物种及环境调整，保留缺失技术材料标注。
- 2026-10-15：首页原三款产品卡区改为用户PDF中的七款植物搭配（花鏡、綠霧、內格羅尼、青嵐、織錦、東京葉色、林間一線光），使用原嵌入图与真实拟配说明，保留概念与品种/配比/光水验证状态；不改变正式产品目录。移除首页home-proof与home-process整块展示，相关内页保留。
- 2026-10-15：办公场景区以图片为主；取消「同一套生命系統，按場景定義」大标题，精简文字。三张供图同高且保留完整画面，采用鼠标左右拖动/触控滑动的横向画廊，另有键盘和前后按钮；报价链接与概念标注保留，仅修改该区且不上线。
- 2026-10-14：用户明确允许本轮跳过缺失 Desktop 策略简报。截图指定首页场景区只保留办公，加入用户提供的三张办公单面款场景图，保持现有设计/动画；供图在未经真实项目证据确认前标注概念效果图。项目制报价链接直达联系页报价/需求表单并预选报价意向。本轮仅本地，不扩大为全站酒店/物业业务删除，不推送或部署。
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
