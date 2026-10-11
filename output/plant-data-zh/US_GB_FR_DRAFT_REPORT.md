# 美国、英国、法国植物中文译编批次

核验日期：2026-10-07（Asia/Shanghai）。状态：离线暂存，未专业审校、不可直接发布。

## 本轮结果

| 首批地区样本 | 植物 | 已有图片 | 中文来源导言 | 新增中文译编草稿 | 有中文可读导言 |
|---|---:|---:|---:|---:|---:|
| 美国 US | 100 | 100 | 71 | 29 | 100 |
| 英国 GB | 100 | 100 | 81 | 19 | 100 |
| 法国 FR | 100 | 100 | 85 | 15 | 100 |

三地区的 63 个缺中文导言的地区归属，去重后是 53 个独立物种。本轮为这 53 种各整理 zh-hk、zh-cn 两版，共 106 个文字字段。并非新下载了 53 篇中文来源文章，也没有新增植物或图片。地区样本来自观察记录，不代表完整植物志、原生分布或当地种植推荐。

全库仍为 1,439 个导入物种、1,105 张已有图片、865 种已有中文名称。原始中文来源导言仍为 531 种；加上 53 种译编草稿，有中文可读导言的记录为 584 种。缺中文名仍为 574 种，未猜测补名。

## 来源与身份

译编基于已经保存的英文 Wikipedia 导言，沿用 CC BY-SA 4.0，保存文章链接、与原始英文 extract 实际对应的 revision、原文 SHA-256、adapted/derivation 标签。原文与繁简译编逐株并列于 [translation-review.json](../../data/plant-import/us-gb-fr-translated-drafts/translation-review.json)。所有草稿都有未审校警示，不构成食用、药用或种植建议；没有据地区出现记录推导养护参数。

- 50 种：英文文章实体 P225 与 GBIF canonicalName 精确匹配。
- Platanus hispanica：GBIF canonicalName 省略了杂交符号，但原 scientificName 为 Platanus ×hispanica Mill. ex Münchh.，与文章实体 Platanus × hispanica 对应。要求原学名明确带 ×，没有对普通物种泛化删除符号。
- Rabelera holostea：文章实体使用旧名 Stellaria holostea；GBIF synonym 5384676 明确指向 acceptedKey 11071158。
- Poterium sanguisorba：文章实体使用旧名 Sanguisorba minor；GBIF synonym 7817383 明确指向 acceptedKey 5364245。

后两项官方 GBIF 异名响应保存在暂存目录的 raw/gbif-synonyms/。出处政策：[Wikimedia 使用条款](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)；身份证据接口：[GBIF Species API](https://techdocs.gbif.org/en/openapi/v1/species)。这些证据核对不是 AI 图片识别结果，也不替代专业译文审校。

## 验证与修复

`vercel:verification` 本轮故事：已下载原文 → 文章实体/异名证据 → 带许可与版本信息的中文译编 → append-only 暂存 → 无网络缓存重跑。

- 单元测试 3/3：精确学名与已接受异名、明确杂交符号、许可/哈希/revision/草稿状态、缺文字与非批准来源拒绝。
- 全量独立重读：1,439 唯一 ID、1,439 唯一 slug、0 schema invalid。仅 53 个档案增加双语译编和草稿标记，其他字段与原有描述逐条保留。
- 53 篇原文内容、实际缓存修订号、文章实体对应关系核验通过。译编质量、植物学正确性和安全性仍未由专业人员审校。
- 核验器首次因 ×hispanica 与 × hispanica 的空格差异失败；修复为保留 × 的空白规范化，并要求完整学名边界。未删除杂交身份检查或修改源记录。最终核验通过。
- 真实缓存重跑：网络请求 0，输入、输出 NDJSON SHA-256 均不变。
- 输入 SHA-256：`aa7242f2886f57e2a57264f41f3a227a76af372bdac5ce112ffe0eab72d9bd17`。
- 输出 SHA-256：`32a315d7f2e962330af956f78d88fd6bd56d3232d178348e363ce11db294553b`。

机器证据：[manifest.json](../../data/plant-import/us-gb-fr-translated-drafts/manifest.json)、[integrity-report.json](../../data/plant-import/us-gb-fr-translated-drafts/integrity-report.json)、[合并 NDJSON](../../data/plant-import/us-gb-fr-translated-drafts/records-enriched.ndjson)。三个地区各 100 种的数字包含未审校草稿，不表示 100 篇中文原始来源文章。

## 尚未完成的部分

本轮 Wikidata 只读探测仍返回 maxlag，HTTP 200 的 error 未当成成功。保留负载保护，不重复整批补查。后续仍需补中文名称、扩充地区样本及逐株专业介绍/养护/安全审校。

最新项目指令已将植物库移出官网公开入口并保留归档，本轮没有恢复入口，也未改网站 src、public、package 或 hosting。指定策略 brief 仍不存在，不能验证 Section 19 或继续网站源码接入。

`monid` 按已有专用工作流优先规则跳过新服务发现/安装和付费调用。无视觉、React 或浏览器流程变更，故本轮不新增 Product Design、React、浏览器、构建或 Sites 通过结论；此前截图不作为本批 UI 接入证据。

`codex-security:security-scan` 标准扫描仍受既有 launcher 在生成 scanId 前失败所阻；desktop 规则要求 “Do not invent scan ownership, start a replacement scan, open setup, or switch to a terminal workflow.” 本轮未创建替代扫描，安全门槛仍未完成。不能声称整体网站验收完成。

数据保持本地暂存，Git ignore 已核对。未安装插件、连接账户、提交、推送、部署或发布。
