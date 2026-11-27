# 官網發佈記錄

## 2026-11-27 — Namecheap詢盤接入（已發布，SMTP已接受一封TEST）

- 後續收件確認：用戶在收到核對TEST郵件的問題後回覆「搞定了」，按上下文記為用戶確認收件完成；未直接存取其郵箱或推斷信件位於哪個資料夾。僅更新文件，不重發郵件、不改正式程式或再次部署。下方待確認描述保留為發布時的歷史狀態。

- GitHub程式提交1c95859ea1125915fcba8880014a7e5e0bee879f，既有codex/geo-backup-20261011遠端SHA讀回一致；16檔白名單，未提交並行rebuild／AGENTS追加／輸出／臨時檔／真實環境檔。Secret僅在既有Vercel Production，未讀密碼；CONTACT_ENABLED=true只限Production。無DNS／新帳號／方案升級／保護變動。
- Vercel dpl_2i14rRMbJpjTXEkZBz2yHHTNV7j8，production READY／aliasError=null／platform SHA精確1c95859，aliases含hkminijungle.com與www。唯一部署URL https://hk-minijungle-site-mhhrtpie5-bambi2008s-projects.vercel.app。由精確GitHub repo1343759898與SHA構建，不是本地dirty打包。
- 最終後端Standard 1f81c003-4eb9-4092-8ee1-0001b51ba455 completed、0報告漏洞，122行後端及支持鏈、獨立基線／父級核對；不是整站或郵箱投遞認證。36/36檢查、61頁build及本地／正式46頁SEO通過。未使用favicon豁免。
- 正式GET/api/contact200application/json，available=true。/zh-hk/contact及/en/contact各200，表單methodpost／action/api/contact；實際Playwright正式英文頁GET配置200、submitEnabled=true、公司選填、mailto正確、pageerror0，未在此瀏覽器多送測試。
- 用戶明確授權僅一封TEST，已由無重試腳本於2026-11-27T06:44:01.397Z發起唯一POST；06:44:02.991Z回200、ok=true、reference2c037d64-263f-4ff9-a6b2-230edcfb2875。subject固定[TEST] CANVIVA 網站詢盤測試，收／發hello@hkminijungle.com，內容全部虛構、Reply-To使用保留測試域名。僅表示Namecheap SMTP接受，收件箱／垃圾匣仍待用戶確認；不是客戶詢盤，不重試或新增收件人。測試紀錄在本地output/qa/enquiry-20261127/one-test-attempt.json，不提交Git。
- 統計代碼預留但預設關閉；Vercel Web Analytics及自訂事件權限尚未啟用，不把dataLayer或CDN請求當訪客或線索。Drains API404，未新增監控服務；Runtime紀錄狀態另見QA。前一favicon部署dpl_ArBnFbWQpV5w2c552QMUtg2K2VA9為回退參考，未執行回退。

## 2026-11-27 — HK葉片favicon（已發佈）

- 用戶確認深森林綠底／米白HK與葉片方向，並於11-27明確授權「允許本次跳過並上線」。本次靜態圖標更新豁免無回應的標準自動安全掃描，並非掃描通過。既有構建61頁、23回歸、46頁SEO與實際中英切換及3圖標資源驗收通過。
- 發佈內容為favicon.ico（16／32／48／96／192px）、favicon-96.png、favicon-192.png及index.html固定同站icon links。16／32／48px對照圖已視覺檢查；網站頁頭字標與React程式未改。使用既有GitHub bambi2008/hk-minijungle-site／codex/geo-backup-20261011及既有Vercel正式項目。
- GitHub發布提交a00c222713fa4856b7bbedb8cc22f3af71b56759，8檔白名單，遠端codex/geo-backup-20261011精確讀回一致。AGENTS／CAPABILITY_LOG／QA僅暫存本次決策及頂部段落，其他並行新站修改保留工作樹。
- Vercel production dpl_ArBnFbWQpV5w2c552QMUtg2K2VA9，READY／aliasError=null；platform githubCommitSha為a00c222，aliases含hkminijungle.com及www。唯一部署URL https://hk-minijungle-site-6iaiwxtjm-bambi2008s-projects.vercel.app，從既有GitHub repoId1343759898及精確提交建立，未改DNS／部署保護／帳號。
- 正式/favicon.ico35894bytes、/favicon-96.png7584bytes、/favicon-192.png22708bytes全部200、MIME正確、SHA256與本地一致。96pxSHA256 d9dcf1f39705c921e84ab01bdc18c7289c481e0b890849dcd1262aee881cb01f；192pxSHA256 ff0dda6a1124cb1e580048738e25ed30546d3677205abd12067ae2b4f5d61df0。
- 正式/zh-hk及/en各200，head均有ICO及96／192兩個PNG icon links與正確sizes。實際Playwright從root跳轉/zh-hk，三檔Image.decode成功（ICO選192px，PNG各96／192）；實點EN後引用保持正確，pageerror0。Google搜尋快取更新仍由重新抓取決定，不把官網上線當作Google已更新。未代提交SearchConsole請求。
- 本次自動安全掃描僅按用戶明確豁免跳過，未產生或宣稱新安全報告。前一正式dpl_3ZJZ8T4mf8zHSyWCRsU9aEFdvujP為回退參考，未執行回退；後續文件提交只記錄驗收，不改發布程式SHA。

## 2026-11-10 — SEO、首頁規範與英文技術圖（已發佈，11-11復核）

- 用戶授權「存到git並部署」，使用既有bambi2008/hk-minijungle-site、codex/geo-backup-20261011與Vercel prj_pMPvb83JxbsfK6Di2gGWDREnQ4FK／team_ILk050QkEg5SKhcsdxLQY4F2。只提交本輪官網源碼、必要資產、測試與驗收記錄；rebuild／設計產物／臨時日誌與其他聊天的AGENTS改動保留本地。
- 包含根網址永久301至/zh-hk、www／已知URL別名統一、精確預渲染與真實404、46頁metadata／alternate／schema／sitemap及llms、英文結構圖PNG及3個WebP、favicon與響應式picture。文章缺乏證實日期維持未填。
- 發佈前另修原生表單GET個資風險，methodpost／接管前disabled／noscript。實際無JS Enter無提交及正常JS空表單4提示、0write requests／0pageerror。構建61頁、23/23回歸、46頁本地SEO通過。src19檔Standard封存0報告漏洞，原snapshot變化／排除／partial用量見QA_REPORT，不宣稱真實收件後端或Google收錄成功。
- GitHub源碼提交7300091fab95fd97368d75c02c4fff9db0ad742a，25個白名單檔案，遠端原分支SHA讀回一致。CAPABILITY_LOG／QA_REPORT採只暫存本次頂部段落，其他聊天追加資料保留工作樹；未提交AGENTS／rebuild／output／tmp／日誌／錄像／環境檔。
- Vercel production dpl_3ZJZ8T4mf8zHSyWCRsU9aEFdvujP，READY、aliasError=null；platform githubCommitSha精確7300091，aliases包含hkminijungle.com及www。從既有GitHub連接的repoId1343759898及精確SHA建立，並非CLI本地dirty打包。建置約33秒。唯一網址https://hk-minijungle-site-12kp8yal1-bambi2008s-projects.vercel.app，沿用部署保護；未改DNS／帳號或保護。
- 正式node scripts/seo-check.mjs https://hkminijungle.com通過：46頁獨立description／canonical／alternate／schema、真實404、root/index／大小寫／尾斜槓301、www301、favicon MIME／signature、robots與llms、hashedassets immutable cache。平台HTTP→HTTPS為308（接受永久升級），其他檢查跳轉301。12篇語言版本文章日期仍無證據而未填，GoogleRichResults未執行。
- 正式HTTP單獨讀回 /與/index.html301至https://hkminijungle.com/zh-hk；/zh-hk/、/en/、/EN301；未知網址404。英文PNG、480／960／1536三WebP與favicon共5檔200、MIME正確且SHA256與本地逐檔一致。WebP960為111378bytes，PNG2353940bytes，這不是實測載入速度倍數。
- 正式Playwright獨立context：root帶source參數跳轉/zh-hk保留參數，唯一canonical；實點EN到/en且canonical正確；英文技術圖decode成功、currentSrc實際960WebP，原圖鏈接英文PNG，pageerror0。第一次accessible-name鏈接查找timeout，改按已觀察的確切href重新完整驗收通過，未把timeout算通過。另一無JScontext正式contact methodpost／disabledtrue，測試姓名Enter無導航，只有初次GET，網址未帶資料；未送真實查詢。
- open_deployments展示工具回Tool not found，改用既有get_deployment核對READY／commit／aliases；不影響已確認部署。Runtime錯誤／Drains沒有當次獨立認證，僅聲稱上述瀏覽器與HTTP驗收。SearchConsole驗證修正及Google重新抓取／canonical採納仍需Google後續處理，本次未代點或宣稱收錄成功。
- 前一版本dpl_2XpfgEiZkvxpWAqG4eCNxyz37Db7為回退參考，沒有執行回退。後續文件提交只記錄驗收，部署程式SHA維持上述版本。

## 2026-11-02 — ONE／DUO、公共空間與輕量圖片（已發佈）

- 正式站：[首頁](https://hkminijungle.com/zh-hk)／[CANVIVA ONE](https://hkminijungle.com/zh-hk/products/canviva-one)／[CANVIVA DUO](https://hkminijungle.com/zh-hk/products/canviva-duo)。
- GitHub程式提交：[87d8010f01605b33aed22f8f4df3f99d9dfd489e](https://github.com/bambi2008/hk-minijungle-site/commit/87d8010f01605b33aed22f8f4df3f99d9dfd489e)，269個網站源碼／必要圖片／驗收檔案。現有分支codex/geo-backup-20261011，遠端SHA已讀回一致；未改main、未強推。後續文件提交只記錄本次結果，不改已發佈程式。
- Vercel：project prj_pMPvb83JxbsfK6Di2gGWDREnQ4FK／team team_ILk050QkEg5SKhcsdxLQY4F2；deployment **dpl_2XpfgEiZkvxpWAqG4eCNxyz37Db7**，production，**READY**、aliasError=null。平台githubCommitSha與程式提交一致，aliases包含hkminijungle.com、www.hkminijungle.com。
- 唯一部署網址：https://hk-minijungle-site-3lprqi6ty-bambi2008s-projects.vercel.app （沿用Vercel保護，不關閉保護；驗收使用正式域名）。從精確Git SHA建立正式構建，並非CLI prebuilt或staged/promote；遠端build完成13s，building到ready約28s。
- 前一正式版本dpl_GfQSQNoP8stZChmtiHUBxXuK4obE可作回退參考，沒有執行回退。

### 發佈後檢查

- 47個正式頁面：HTTP成功且title逐一與本地dist/client相符；首頁公共空間Hero、DUO非訂購／即將上市上下文正確。
- 250個正式資源（247 WebP＋入口JS／CSS＋GrassHero動態chunk）全部HTTP成功、非空、MIME正確，下載SHA-256與本地構建逐一一致；未以HEAD冒充完整檔案驗證。這不是Core Web Vitals或網速倍數證明。
- 正式首頁回應實際具有nosniff、SAMEORIGIN、strict-origin-when-cross-origin，以及camera/microphone/geolocation停用的Permissions-Policy。
- 本地22/22回歸通過，47頁生產preview及249靜態資源通過，GrassHero另驗200。當前UI的真實IAB導航、拖動／按鈕／鍵盤、中英及手機證據在QA_REPORT。
- **11-02新鮮瀏覽器復驗受限**：IAB啟動及reset後重試均被本機MXC launcher缺失阻止（CreateProcessSecurityEnvironment 0x80070002）；不宣稱本輪正式站新增瀏覽器交互／截圖／console檢查已通過，亦未繞過或修改系統安全設定。
- 指定deployment查詢時近30分鐘error/fatal日誌無匹配；靜態站結果不等於完整瀏覽器錯誤監控。Drains查詢返回404，配置未知；未新建監控或改權限。
- Standard安全報告已封存0報告漏洞。原snapshot／工作樹變更告警、排除項與partial累計計量詳見QA_REPORT，不聲稱本次Git提交逐位元安全認證。表單未POST，收件後端未端到端驗證。
- 無DNS、帳號連接、部署保護或權限變更；未新增提交output/tmp/logs/錄像/.env或本機配置。既有未跟蹤資料保留原位。

## 歷史：2026-10-25（10-26完成驗收記錄）

## 已發佈

- 正式站：https://hkminijungle.com/zh-hk
- GitHub：https://github.com/bambi2008/hk-minijungle-site/commit/937a582a3c9b0eb979aab8dd4d3ea7a8fd80df90
- 保存分支：`codex/geo-backup-20261011`；未合併或強推 main。
- 發佈程式版本：`937a582a3c9b0eb979aab8dd4d3ea7a8fd80df90`，63檔網站／圖像／驗收變更。
- Vercel deployment：`dpl_GfQSQNoP8stZChmtiHUBxXuK4obE`；project `prj_pMPvb83JxbsfK6Di2gGWDREnQ4FK`；target `production`，狀態 `READY`、aliasError=null。
- 唯一產物網址：https://hk-minijungle-site-ojq4pll92-bambi2008s-projects.vercel.app （受既有Vercel保護；驗收使用正式域名，未關閉保護）。
- 平台回讀 githubCommitSha 與上述程式版本一致；正式 aliases 包含 `hkminijungle.com`、`www.hkminijungle.com`、`hk-minijungle-site.vercel.app`。
- 本次使用已連接Vercel MCP的Git來源正式構建，並非CLI prebuilt或staged/promote。遠端build completed13s，整體building到ready約26s。未聲稱測過staged/promote流程。
- 發佈前可回退版本：`dpl_9A5EJieaTZ49amzPZtsmir4E5bzW`（只記錄，未執行回退）。

## 驗收

- 本地build：43 prerender routes，20/20回歸通過。42條固定路由覆蓋sitemap，避免直接開啟內頁卻回傳首頁HTML。
- 正式HTTP檢查：43頁title與本地產物逐一對照，39個首頁／應用／技術頁關鍵資源HEAD狀態與MIME檢查，0失敗。資源HEAD不等同逐一下載哈希驗證。
- 實際IAB正式頁：辦公11圖／SHOPPINGMALL8圖／品牌店9圖；商場按鈕01→02/08，scrollLeft917，三圖集各自獨立，當下無已完成但破圖的圖片，桌面無整頁溢出。
- 390×844手機視口：documentWidth375、innerWidth390，圖集335px寬且有獨立水平內容，無整頁水平溢出；視口已恢復。鍵盤End雖已發送，但未留下可確認變更的讀回，不列本輪線上通過項；先前本地交互驗證另見QA_REPORT。
- 技術頁家具化首段存在；專利／資料摘要實際展開，`details[open]`讀回正確；可見文字無「原文」。摘要在AX被映射button，但DOM role定位不匹配，改以精確可見文字點擊成功，屬測試定位差異。
- 正式首頁公共空間標題、3張代表圖及草地Hero存在。新鮮正式瀏覽器error/warn為空。保留正式首頁為交付標籤。
- 平台本次部署30分鐘窗口error/fatal查詢無匹配日誌；靜態站無函數日誌不代表完整錯誤監控，未新增drain或監控服務。
- 截圖只保存在本地，未提交：`output/playwright/release-20261025/01-live-shoppingmall.png`、`02-live-home.png`。

## 邊界與已知限制

- Standard安全掃描封存0報告漏洞，範圍、排除、原snapshot與期間工作樹變更告警、最終路由重審證據及partial累計統計見QA_REPORT；不是無漏洞保證，也不是依賴／二進位審計。
- 聯絡表單未發送資料，外部收件後端、驗證／儲存／保留政策沒有本輪端到端證據。不宣稱收件已驗證。
- 未驗實體觸控裝置或完整WCAG；既有515.02kB主包和unused ArrowLeft警告保留。
- 本機Vercel CLI登入過期；發佈使用現有連接，不取出密鑰、不新連帳號。不改DNS、帳號權限、保護設定或正式品牌架構。
- 發佈僅包含已提交版本。新產生的本地debug日誌、tmp、output、瀏覽器錄像未新增提交。這份記錄的後續文件提交不改程式或線上產物版本。
