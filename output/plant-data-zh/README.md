# 中文植物资料离线批次 — 2026-10-06

> **全来源口径修正：**下文 664/775 是 Wikimedia 补全结果的名称覆盖/缺失统计；合并文件还保留 GBIF 中文名。实际全来源为 865 种有中文名、574 种缺名，另有 201 种仅使用 GBIF 原有中文名称，并非新增采集。当前核验和补查状态见 [COVERAGE_REVIEW.md](COVERAGE_REVIEW.md)。中文导言和图片统计不变。

本轮处理 1,439 条已下载植物记录，取得 **664 种中文名称、531 种繁简体来源导言**。47 种原本没有英文导言的植物得到中文来源介绍；合并后 1,087 种有至少一种语言的来源导言。没有可靠来源的字段仍为空，不能把批次处理完成理解为植物知识或地区植物志已经完整。

## 六地区覆盖

下表为现有每区 100 种样本。跨区重复植物只在合并目录中保存一条，所以行数不能相加作独立植物总数。

| 地区 | 样本种数 | 有中文名称 | 有中文导言 |
|---|---:|---:|---:|
| 德国 | 100 | 97 | 88 |
| 美国 | 100 | 88 | 71 |
| 香港 | 100 | 94 | 84 |
| 中国大陆 | 100 | 100 | 93 |
| 英国 | 100 | 94 | 81 |
| 法国 | 100 | 94 | 85 |

六区去重为 445 种，其中 414 种有中文名称、362 种有中文导言。23 种地区植物的原记录没有英文导言，本轮中文来源补上了介绍。地区归属来自 GBIF 发生记录，不表示原生、适合种植或安全食用。

## 结果文件

- [合并资料 NDJSON](../../data/plant-import/chinese-enrichment/records-enriched.ndjson)：保留原有 taxonomy、地区证据、英文导言和图片元数据，添加中文 names、zh-hk/zh-cn descriptions、来源、文章版本和转换标记。
- [采集统计](../../data/plant-import/chinese-enrichment/manifest.json)：完整批次与来源许可，状态 complete，publicationEligible 为 false。
- [全量完整性核验](../../data/plant-import/chinese-enrichment/integrity-report.json)：1,439 个唯一 ID、1,064 个精确学名实体、2,622 个中文名称字段、1,062 个中文导言字段和 338 个原始 API 响应。
- [续传核验](../../data/plant-import/chinese-enrichment/resume-report.json)：真实完整批次 resume 为 0 网络请求，NDJSON SHA-256 保持不变。
- [中文缺失清单](../../data/plant-import/chinese-enrichment/missing-chinese.json)：775 种缺中文名称、908 种缺中文导言；没有猜测或机器编造补齐。
- [缺图再尝试报告](../../data/plant-import/chinese-enrichment/image-recovery-report.json)：十条地区缺图再次检查已核对中文条目的主图，0 条新增。八条没有主图，两条 Commons 许可仅写 NO RESTRICTIONS，未通过既有白名单；全库仍为 1,105 张图片，地区批次仍为 435 张。

## 身份与使用边界

中文名称来自 Wikidata 中文 label 或中文 Wikipedia 条目标题；导言由中文 Wikipedia 官方接口返回，分别保存 zh-hk 和 zh-cn 变体。不是 AI 自动撰写养护建议。

先确认 Wikidata P225 与 GBIF canonicalName 精确一致（保留 × 杂交标记），再确认中文文章 wikibase_item 为同一实体。22 种出现文章实体身份不一致，未接收这些文章的导言，保留待人工审校原因。Wikidata 结构化名称按 [CC0](https://www.wikidata.org/wiki/Wikidata:Licensing) 保存；Wikipedia 文本保存 [CC BY-SA 4.0 条款](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)、文章 URL、revision 和语言转换标记。

植物源介绍中可能包含用途、生态或保护状态描述，未经过本项目的植物学、养护、毒性或法律审校，不自动转换成行动建议。所有记录保持 machine-normalized、publicationEligible: false。

## 验证和未完成事项

离线名称/导言测试 5/5、图片边界测试 2/2；真实全量审计和无网络续传通过。原分类、地区证据、英文来源文本、图片与署名、review state 逐条保持不变。原始中文导言与实际 API 响应逐字核对，并验证文章实体及 revision。

**尚未接入网站页面。**仓库要求先完整读取 Desktop 上的 HK_MINIJUNGLE_Website_Strategy_and_Codex_Brief_v1.0.md，该文件再次检查不存在，所以本轮没有编辑网站 src、运行时工具、package、public 目录或 hosting。只增加离线 output 辅助脚本、data 文件和报告。不重新建立视觉系统，不把本轮离线检查冒充浏览器 QA。

必需的标准安全扫描仍受此前 desktop launcher 在取得 scanId 前失败的阻塞；[security-scan 桌面流程](C:/Users/ss/.codex/plugins/cache/openai-curated-remote/codex-security/0.1.31/skills/security-scan/references/desktop-scan.md)要求“Do not invent scan ownership, start a replacement scan, open setup, or switch to a terminal workflow.”本轮未创建替代扫描，不声明标准安全扫描已完成。

未安装插件、连接账户、提交、推送、部署或发布。AI 识别仍保持既有可替换 provider 原型，未接入大模型。
