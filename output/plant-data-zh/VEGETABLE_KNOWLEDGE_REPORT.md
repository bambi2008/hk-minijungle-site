# 常规蔬菜及全库资料进度 — 2026-10-07

本次交付为离线资料批次，不是已上线官网或已完成的专业植物志。常规蔬菜清单为可扩展的编辑基线，不穷尽地方品种；蘑菇不作为植物计入。欧美、中国大陆及香港是采集优先范围，不等于每种植物在这些地区都适种。

## 当前规模与统计口径

| 内容 | 实际数量 | 限制 |
|---|---:|---|
| 去重植物档案 | 1,515 | 1,513 条导入分类 + 2 条未重合的手工归档；含亚种，不是全部都是独立种 |
| 相对旧 1,439 条导入记录新增 | 74 | 首批 72 + 芝麻菜／食用大黄纠正所需 2 条 |
| 常规蔬菜栽培类型 | 113 | 对应 75 条当前分类；同种不同 crop 不合并 |
| 当前蔬菜分类有图片 | 75/75 | 分类层级示例图，不认证每个栽培品种的形态 |
| 当前蔬菜分类有中文介绍 | 73/75 | 含原文与未专业审校的译编草稿 |
| 当前蔬菜分类有来源中文名称 | 70/75 | 编辑清单的 113 个中文标签独立保存，不伪装成权威俗名 |
| 导入档案有图片 | 1,179/1,513 | 334 条仍缺图片 |
| 导入档案有来源中文名 | 933/1,513 | 580 条仍缺来源中文名 |
| 导入档案有中文介绍 | 655/1,513 | 858 条仍缺中文介绍；包含此前 53 个译编草稿和此次 7 个短摘要 |
| 完整原文快照 | 1,238 | 对应 1,203 个不同来源页面；不能把重复请求计成不同文章 |
| 有完整来源的档案 | 1,163/1,515 | 1,108 条有 exact P225 来源，其他候选关联仍待审校 |
| 有部分中文养护草稿的栽培类型 | 22/113 | 共 135 个字段，不代表完整档案 |
| 专业审校完成 | 0 | 尚无专业审校认证，publicationEligible=false |

## 分类与资料质量修复

- 普通芝麻菜从 Eruca vesicaria 纠正到 Eruca sativa；Kew 接受后者，GBIF 返回精确接受分类 7474861。原近缘种档案保留，不覆盖或删除。
- 园艺食用大黄关联 Rheum × hybridum（GBIF 4037896），不与 Rheum rhabarbarum 野生种混用。GBIF canonicalName 省略 ×，但 scientificName 和证据保留杂交符号。
- 豌豆保存 Pisum sativum 到接受分类 Lathyrus oleraceus 的正式异名关系；黑婆罗门参保存原名到接受亚种的对应关系，不伪造新物种。
- 佛手瓜及黑婆罗门参仍缺可确证的中文介绍，未以身份不匹配的页面强填。中文原文里的药用、毒性和食用结论都不因此得到认可。
- 西兰花、菜花、甘蓝、大白菜、菜心等保留独立 crop ID，养护字段只关联指定 crop，不按同科／同种批量继承。
- 最新养护草稿包括生菜、罗马／结球生菜、苦苣、红菊苣、比利时菊苣、菠菜、叶用甜菜、茄子、甘蓝及园艺食用大黄。美国、英国、香港来源的适用地区单独注明，种植月份不直接套用于其他地区。

## 验证证据

- 14/14 边界测试通过：精确身份、杂交符号、文章分节、固定接口、中文实体一致性、追加保留、独立 crop、纠正关联及养护字段隔离。
- 全量合并检查：1,513 个唯一 ID、唯一 slug，0 schema invalid；旧记录非扩展字段保持，名称／描述／图片／来源原数组前缀逐条一致。
- 原始输入 SHA-256：32a315d7f2e962330af956f78d88fd6bd56d3232d178348e363ce11db294553b，未修改。
- 1,238 份完整来源快照逐份核对实际缓存中的文章 URL、revision、原文 SHA-256。修复了核验器用已规范化标题推测原请求缓存键的问题；改为核对原缓存真实证据，没有放宽身份认证。
- 75 条当前蔬菜分类图片逐份检查作者、许可、归属目录、字节数、SHA-256 及 JPEG/PNG 签名，共 31,122,028 字节。既有照片对象不覆盖；新批下载证据独立核验。
- 真实缓存续跑：0 网络请求，1,238 份原文快照 hash 不变，原输入 hash 不变，中文批次 75 条维持完成。

## 文件与下一步

合并数据：data/plant-import/vegetables-priority/records-knowledge-enriched.ndjson。

逐株缺项：data/plant-import/vegetables-priority/knowledge-coverage.json。

独立蔬菜资料：data/plant-import/vegetables-priority/crop-knowledge.json。

统计和证据：同目录 knowledge-completeness-manifest.json、image-integrity.json、cache-resume-integrity.json；原始 API 缓存及许可保留。

下一批优先补其余 91 个栽培类型的专属养护字段，并解决 2 条蔬菜中文介绍和 5 条来源中文名称缺项，再补全库其他档案。继续按形态、分布／生境、光温、水土、繁殖、维护、病虫及安全字段逐株查证，不用通用文字填满。

## 尚未完成的验收

data-analytics:analyze-data-quality 的粒度与缺失性检查促成了上述两处纠正及页面去重统计；vercel:verification 仅验证离线来源到合并数据链路，不认证植物学、译文及食用安全。

指定策略 brief 仍不存在，网站源码未修改。植物库公开归档决定保持，未恢复导航、未接入本次数据、未进行新 UI／React／视觉／Sites／浏览器验收，也未提交、推送、部署或发布。

codex-security:security-scan 0.1.32 与 desktop 参考已读取。既有启动器在返回 scanId 前失败，按技能规定不能另建替代扫描或转终端规避；标准安全扫描和整体验收仍未完成。

主要原始参考：[Kew 芝麻菜](https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:1110374-2)、[RHS 食用大黄](https://www.rhs.org.uk/plants/113552/rheum-%C3%97-hybridum/details)、[UMN 生菜与菊苣](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-lettuce-endive-and-radicchio)、[UMN 菠菜与叶用甜菜](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-spinach-and-swiss-chard)、[UMN 茄子](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-eggplant)、[UMN 甘蓝](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-cabbage)。
