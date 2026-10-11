# 全来源中文覆盖率修正与定向补查 — 2026-10-06

## 当前结果

现有批次为 1,439 个独立 GBIF 物种，**865 种已有中文名称（60.11%），574 种真正缺名**。531 种有繁简体中文导言，1,087 种有任一语言来源导言，图片仍为 1,105 张。

上一轮 664 是 Wikimedia 名称覆盖，不是全部来源覆盖。GBIF 原有名称覆盖 395 种，Wikimedia 覆盖 664 种，重合 194 种；395 + 664 − 194 = 865。201 种只有 GBIF 中文名，不属于真正缺名。原数据没有丢失，本轮纠正报告口径，不把这 201 种冒充新增采集。

| 地区样本 | 样本数 | 全来源已有中文名 | Wikimedia 中文名 |
|---|---:|---:|---:|
| 德国 | 100 | 97 | 97 |
| 美国 | 100 | 89 | 88 |
| 香港 | 100 | 94 | 94 |
| 中国大陆 | 100 | 100 | 100 |
| 英国 | 100 | 94 | 94 |
| 法国 | 100 | 94 | 94 |

跨地区物种重复，不能把各行直接相加为独立物种总量。发生记录也不代表原生或种植适应性。

## 质量检查

使用 `data-analytics:analyze-data-quality` 做覆盖率口径的 scoped companion check。以每条物种为粒度，计数中文语言标签且含汉字的 names；包含 GBIF 的 ISO `zho`，兼容 zh 变体、chi/cmn/yue，排除仅有拉丁字符或日文标签的名字。

1,439 个 ID 唯一、1,439 个 slug 唯一、0 schema invalid。全来源与各来源交集计数一致。问题级别 Medium、证据置信 High：旧统计只查 enrichment results 的新增来源，可能误导缺失率和补查范围；实际下载记录没有损坏。

检查代码：[analyze-coverage.mjs](analyze-coverage.mjs)。完整结果：[all-source-coverage-report.json](../../data/plant-import/chinese-enrichment/all-source-coverage-report.json)。原 NDJSON SHA-256 保持 aa7242f2886f57e2a57264f41f3a227a76af372bdac5ce112ffe0eab72d9bd17。

这是来源存在率，不是中文名称的植物学审校通过率。不推断趋势：这里只有一次静态采集批次，不能从两个不同口径的数字推断新增数量。

## 定向补查状态：未完成

新增离线 `supplement-chinese.mjs`，仅针对真正缺名的 574 个物种：已有实体者查询中文 label/alias，其余精确检索学名，再核对 P225 和中文文章实体。同名实体冲突继续拒绝；旧字段采用 append-only 合并，新批次单独保存，不替换旧文本或媒体。

四项测试通过：中文 ISO 标签、非中文/拉丁排除；旧文本不被覆盖；实体歧义拒绝与别名来源；完整夹具流程、输入变化拒绝、无网络续传。

**实际网络补查两次均在首批完成前收到 API maxlag，本轮新增 0 条。**一次只读诊断响应为 HTTP 200 且 error.code=maxlag、Retry-After=5，info 为 “Waiting for wdqs1012: 9.15 seconds lagged.” 请求包含 maxlag=5，因此不能把 HTTP 200 当作资料请求成功。

按 [官方 Maxlag 文档](https://www.mediawiki.org/wiki/Manual:Maxlag_parameter) 保留 maxlag=5、重试间隔、低并发和检查点，不提高保护阈值、不取消保护、不持续忙轮询。采集器状态为 failed，不伪装成 complete；检查点见 [chinese-supplement/manifest.json](../../data/plant-import/chinese-supplement/manifest.json)。服务器恢复后可对同一检查点 resume，当前没有自动定时任务或后台下载运行。

## 网站与安全边界

Desktop 策略简报 HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md 仍不存在，无法完成源码修改前置条件。本轮仅改离线 output 辅助脚本、报告及 data；未改网站 src、public、package 或 hosting。中文资料仍未接入页面。

`vercel:verification` 用于本轮离线故事：输入/覆盖率/夹具与续传通过；真实 API→补查边界返回 maxlag，按技能第一失败边界停止，没有继续声称新数据/页面链路通过。UI/React/视觉/构建未触发，不以旧截图代替本轮验收。

标准安全扫描仍受此前 desktop launcher 无 scanId 的故障阻塞。[codex-security:security-scan](C:/Users/ss/.codex/plugins/cache/openai-curated-remote/codex-security/0.1.31/skills/security-scan/SKILL.md) 的 desktop 参考要求 “Do not invent scan ownership, start a replacement scan, open setup, or switch to a terminal workflow.” 没有创建替代扫描，不声称整体完成。

未安装插件、连接账户、提交、推送、部署或发布。现有中文批次仍 machine-normalized、publicationEligible false，不是完整植物志或已审校养护知识库。
