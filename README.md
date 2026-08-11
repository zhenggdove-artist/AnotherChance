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
2. N 留白時，下一版會隨機從 600–800 開始；輸入整數時則固定從該數字開始。
3. 可從 10 種「按下 X 的特效」中選擇一種，並設定低、標準或強烈三段強度。
4. 如要更換影片，可選一支或多支 MP4 / WebM。未選影片時，只更新 N 與特效設定。
5. 按「選擇資料夾」，選擇 GitHub Desktop 使用的 repository 根目錄，也就是同時含有 `.git`、`index.html` 和 `site-config.js` 的那一層。
6. 按「儲存到 Repository」。完成後切回 GitHub Desktop，commit 並 push。

影片會依序播放；清單播完後從第一支重新開始。每支影片建議使用 H.264 + AAC 的 MP4，而且單檔必須小於 95 MB，否則 GitHub 不能直接接受 push。

## 計數方式

這是純靜態網站，因此累積次數保存在每一台裝置自己的瀏覽器中。相同裝置重新整理後會保留數字；不同觀眾或不同裝置之間不會共用同一個全球計數。每次透過編輯模式儲存新設定後，會從新設定的 N（或新的 600–800 隨機值）重新開始。

若作品未來需要所有觀眾共用同一個即時數字，需要再接一個線上資料庫與 API。
