# 官網發佈記錄 — 2026-10-25（10-26完成驗收記錄）

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
