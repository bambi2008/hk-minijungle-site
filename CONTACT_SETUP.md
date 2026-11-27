# 官網詢盤接入（2026-11-27）

狀態：已發布到原正式站，GitHub程式提交1c95859，Vercel production dpl_2i14rRMbJpjTXEkZBz2yHHTNV7j8 READY。Production Secret僅核對metadata，未讀密碼；CONTACT_ENABLED已配置。最終Standard掃描完成。已按用戶授權唯一一次TEST，正式API回200且SMTP接受，reference2c037d64-263f-4ff9-a6b2-230edcfb2875；收件箱／垃圾匣是否到達仍待用戶確認，不當作客戶詢盤。

## 已確認的方案

- 正式站 https://hkminijungle.com，既有 Vercel 專案 hk-minijungle-site。
- 收件／發件地址均固定 hello@hkminijungle.com，Namecheap Private Email；客戶電郵只作 Reply-To。沒有自動回信、CC、BCC、附件或訪客控制的收件人。
- `POST /api/contact` 驗證後以 Nodemailer 經 mail.privateemail.com:465（TLS）傳送；等待 SMTP 接收確認後才回成功。SMTP 接收並不保證進入收件匣，需最後實測收件及垃圾郵件匣。
- `GET /api/contact` 僅公開是否已配置。未啟用、缺少 Secret 或 Preview 環境均不可發信。前端會明示暫不可用及電郵／電話入口，不讓訪客填完才得知未接通。
- 只必填姓名、有效電郵、需求說明與同意。失敗保留內容；成功清空。無 JavaScript 時提交按鈕停用，提供直接電郵／電話。

## 使用者最後操作：應用專用密碼

1. 登入 https://privateemail.com/ 的 hello@hkminijungle.com。
2. Settings → Launch Security Center → App passwords → Create new password，名稱可填 HKMINIJUNGLE website。依提示以自己的郵箱密碼確認。
3. 到既有 Vercel 專案 Settings → Environment Variables，新增 `CONTACT_SMTP_PASSWORD`，選 Secret 類型，**只勾 Production**，由使用者直接貼入剛產生的 App password。不要傳到聊天、前端、Git 或截圖；不需提供 Namecheap 帳號密碼。
4. 配置 `CONTACT_ENABLED=true`，同樣只限 Production。由 Codex 檢查是否存在，不讀出密碼。缺少任一設定會停用送信。
5. 完成必要安全／驗收後，由 Codex 從精確 Git SHA 部署既有專案。變數變動後須重新部署，不能只在平台填變數便宣稱已接通。
6. 使用者明確授權後，僅發送一封標明「TEST／測試」且使用虛構資料的郵件到自己的信箱；確認收件匣或垃圾匣、Reply-To、內容與失敗處理。未收到前不宣稱成功。不向客戶或其他收件人測試。

Namecheap 官方操作：https://www.namecheap.com/support/knowledgebase/article.aspx/10816/2178/how-to-use-app-passwords-for-private-email/

## 統計

- 已預留 `@vercel/analytics`；網址只收白名單路徑，去除 query/hash，不傳表單資料。
- 先在原專案 Dashboard → Analytics 啟用 Web Analytics，確認方案／用量；未同意不升級或新增付費服務。然後 Production 設 `VITE_ANALYTICS_ENABLED=true` 並重建；應實際確認 script／view 請求及平台讀回，不能只看 dataLayer。
- `VITE_ANALYTICS_EVENTS_ENABLED=true` 僅於已確認 Pro／Enterprise 自訂事件權限後啟用。固定事件為 enquiry_attempt、enquiry_success、enquiry_error、contact_email_click、contact_phone_click，屬性只有語言。
- 原 dataLayer 不等同已接通的分析工具。此版本未啟用統計時無法追溯之前流量，亦不補寫零訪客數。

## 驗收及限制

- 本地 36/36 檢查（原23＋11收件＋2統計私隱）、61 頁構建、46 頁 SEO 通過。真實瀏覽器經 loopback QA 後端與虛構 mail transport 測試 502／429／200 回應、失敗保留／成功清空及無 JS 防護，沒有發真實郵件。測試旗標僅選擇固定TEST主旨，不改收件人、認證或防護。
- TLS、正式平台 API 部署、Namecheap 實際認證、收件匣到達與正式統計尚待驗證。
- 防刷含同站來源、JSON-only、16KiB上限、欄位長度及枚舉、蜜罐、重複提交鎖、實例內每來源3次/10分鐘及全實例60次/10分鐘。實例記憶體限流不跨區／跨實例／跨重新部署，不能冒稱全局配額；有濫用時需在平台配置經確認方案可用的防火牆全局限流／驗證碼。未新增資料庫或存放訪客內容。
- Runtime log 僅記錄失敗事件及隨機參考號，不記錄原始錯誤、密碼或表單內容；信件按郵箱既有保留政策處理。
- 新 API 僅適用既有 Vercel Node.js 託管；未把 SMTP 移植到靜態 Sites Worker。保持 hosting／worker 打包檔完整。
- Standard原目標啟動曾兩次300秒超時；改直接以實際server目錄為target後成功。最終後端掃描1f81c003-4eb9-4092-8ee1-0001b51ba455已封存，0報告漏洞，包含獨立基線及父級核對。僅後端目錄及支持呼叫鏈，不冒稱整站認證；前端為既有驗收及支持檢查。未沿用favicon掃描豁免。報告位於C:/Users/ss/.codex/state/plugins/codex-security/scans/server/unversioned_20261127T055614Z_78c54110/report.md。
