# Miracle — Another Chance

這是一個全螢幕靜態作品網站。觀眾實際觀看廣告 30 秒後，左上角的 X 才會解鎖；按下後畫面漸暗、切換下一支影片，累積觀看次數加一。若觀眾不按 X，影片仍會持續播放。

## 發布網站

1. 在 GitHub Desktop 查看 `AnotherChance` 的變更。
2. 輸入摘要後按 **Commit to main**，再按 **Push origin**。
3. 第一次發布時，到 GitHub repository 的 **Settings → Pages**，確認 Source 設為 **GitHub Actions**。
4. 等待 repository 上方 **Actions** 分頁中的部署完成。
5. 網站網址：<https://zhenggdove-artist.github.io/AnotherChance/>

之後每次 commit 並 push，網站都會自動更新。瀏覽器可能保留舊影片；若看不到新版，可用 `Ctrl + Shift + R` 強制重新整理。

## 編輯作品

請用最新版 **Google Chrome** 或 **Microsoft Edge** 開啟已發布的網站。

1. 按 `Shift + T` 開啟「作品編輯模式」。
2. 可從 10 種「按下 X 的特效」中選擇一種，並設定低、標準或強烈三段強度。
3. 如要更換影片，可選一支或多支 MP4 / WebM。未選影片時，只更新特效設定。
4. 按「選擇資料夾」，選擇 GitHub Desktop 使用的 repository 根目錄，也就是同時含有 `.git`、`index.html` 和 `site-config.js` 的那一層。
5. 按「儲存到 Repository」。完成後切回 GitHub Desktop，commit 並 push。

影片會依序播放；清單播完後從第一支重新開始。每支影片建議使用 H.264 + AAC 的 MP4，而且單檔必須小於 95 MB，否則 GitHub 不能直接接受 push。

## 計數方式

全站 N 與奉獻榜由 Cloudflare Workers Free + D1 Free 的共同資料庫管理，初始值固定為 121，並預先放入 20 位示意觀看者（合計 121 次）。不同觀眾與不同裝置會共用同一個總數；多人同時按 X 時，資料庫會以原子更新避免互相覆蓋。

每個裝置會保存一個不含個資的隨機識別碼。觀眾可在右上角排行榜登記最多 20 個字的名字，登記前已累積的貢獻也會保留。後台會拒絕 27 秒內的重複貢獻，並以事件 ID 防止網路重送造成重複加分。

左上角的 `C/N` 按鈕可切換中英文介面與跑馬燈。中文使用專案內附的 Noto Serif TC；英文使用 saint 字型，語言選擇會保存在觀眾的瀏覽器中。

後台程式與資料庫 migration 位於 `backend/`。正式 API：<https://miracle-another-chance-api.zhenggdove-artist.workers.dev>
