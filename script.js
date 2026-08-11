(() => {
  "use strict";

  const DEFAULT_CONFIG = {
    revision: "default",
    apiBaseUrl: "https://miracle-another-chance-api.zhenggdove-artist.workers.dev",
    videoFiles: ["assets/ads/ad-01.mp4"],
    skipDelaySeconds: 30,
    effectType: "hearts",
    effectIntensity: 2
  };

  const MAX_GITHUB_FILE_SIZE = 95 * 1024 * 1024;
  const config = { ...DEFAULT_CONFIG, ...(window.MIRACLE_CONFIG || {}) };

  const LANGUAGE_STORAGE_KEY = "miracle-another-chance:language";
  const TRANSLATIONS = {
    zh: {
      videoStageLabel: "垃圾廣告播放器",
      skipLockedLabel: "觀看三十秒後關閉這則廣告",
      progressLabel: "可關閉廣告前的觀看進度",
      leaderboardOpenLabel: "開啟奉獻榜",
      startPromptLabel: "點一下螢幕開始有聲播放",
      startTitle: "點一下螢幕開始",
      startSubtitle: "聲音將自動開啟",
      playbackErrorTitle: "廣告載入失敗",
      playbackErrorBody: "請重新整理頁面，或按 Shift + T 更換影片。",
      tickerLabel: "累積觀看次數",
      leaderboardTitle: "奉獻榜",
      leaderboardCloseLabel: "關閉奉獻榜",
      leaderboardTotalLabel: "神目前已累積觀看",
      viewsSuffix: " 次",
      profileLabel: "登記你的名字",
      profilePlaceholder: "最多 20 個字",
      profileRegister: "登記",
      profileUpdate: "更新",
      profileHelp: "這個裝置會記住你的貢獻；排行榜名字不可重複。",
      profileContributionPrefix: "你目前已貢獻 ",
      leaderboardEmpty: "尚未有人登記名字。成為第一位貢獻者。",
      editorTitle: "作品編輯模式",
      editorCloseLabel: "關閉編輯模式",
      databaseEnabled: "共同資料庫已啟用",
      databaseShared: "N 由所有參與者共同累積",
      databaseInitial: "N 直接等於榜單觀看次數總和；不使用額外起始值。",
      effectLabel: "按下 X 的特效",
      effectHearts: "01・愛心上升",
      effectStars: "02・金色星芒",
      effectHalos: "03・神聖光環",
      effectPetals: "04・玫瑰花瓣",
      effectFeathers: "05・天使羽毛",
      effectBubbles: "06・奇蹟光球",
      effectRays: "07・復活光束",
      effectConfetti: "08・慶典彩紙",
      effectBlessings: "09・祝福文字",
      effectPixels: "10・像素閃光",
      intensityLabel: "特效強度",
      intensityHelp: "可選低、標準或強烈；設定會在下一次按 X 時套用。",
      replaceVideos: "替換廣告影片",
      chooseVideos: "選擇一支或多支影片",
      keepCurrentVideos: "未選擇時會保留目前影片",
      videoHelp: "建議使用 H.264 MP4；每個檔案需小於 95 MB，才能直接 push 到 GitHub。",
      connectRepo: "連接本機 Repository",
      repoHelp: "選擇 GitHub Desktop 裡真正含有 .git 與 index.html 的 AnotherChance 資料夾。",
      chooseFolder: "選擇資料夾",
      folderNotConnected: "尚未連接資料夾",
      cancel: "取消",
      saveToRepo: "儲存到 Repository",
      saved: "已儲存",
      savedHelp: "現在可以到 GitHub Desktop commit 並 push。",
      databaseConnecting: "正在連接共同資料庫…",
      databaseUnavailable: "共同資料庫暫時無法連線，請稍後重新整理",
      tickerMessage: "神目前已累積觀看廣告{count}次，感謝您的參與，您的貢獻讓祂距離復活又跨進了一大步",
      leaderboardScore: "{count} 次",
      leaderboardUnavailable: "排行榜暫時無法連線，請稍後再試。",
      contributionWriteFailed: "此次貢獻尚未寫入資料庫，請確認網路後再試。",
      timerReady: "可關閉",
      skipReadyLabel: "關閉這則廣告並繼續下一則",
      leaderboardLoading: "正在讀取共同資料庫…",
      nameValidation: "名字需為 1–20 個字。",
      profileSaving: "正在登記…",
      profileSaved: "名字已登記，之前在這個裝置累積的次數也已保留。",
      nameTaken: "這個名字已被使用，請換一個名字。",
      profileSaveFailed: "登記失敗，請確認網路後再試。",
      browserUnsupported: "此瀏覽器無法直接寫入資料夾。請改用最新版 Chrome 或 Edge 開啟網站。",
      repoConnected: "已連接：{name}",
      wrongRepo: "這不是正確的網站資料夾；請選擇內含 index.html 的 AnotherChance repository。",
      fileTooLarge: "{name} 超過 95 MB，請先壓縮後再選取。",
      permissionDenied: "沒有取得資料夾寫入權限，尚未儲存任何變更。",
      editorWriting: "正在寫入設定與影片，請不要關閉視窗…",
      writingVideo: "正在寫入影片 {current} / {total}：{name}",
      editorSaved: "儲存完成。GitHub Desktop 現在會顯示可 commit 的變更。",
      editorSaveFailed: "儲存失敗；請確認選取的是正確資料夾，而且檔案沒有被其他程式鎖定。",
      videosSelected: "{count} 支影片・共 {size} MB",
      intensityLow: "低",
      intensityStandard: "標準",
      intensityStrong: "強烈",
      languageSwitchLabel: "切換成英文"
    },
    en: {
      videoStageLabel: "Junk advertisement player",
      skipLockedLabel: "Watch for thirty seconds before closing this advertisement",
      progressLabel: "Viewing progress before this advertisement can be closed",
      leaderboardOpenLabel: "Open the Offering Board",
      startPromptLabel: "Tap the screen to begin with sound",
      startTitle: "TAP TO BEGIN",
      startSubtitle: "SOUND WILL TURN ON",
      playbackErrorTitle: "ADVERTISEMENT FAILED TO LOAD",
      playbackErrorBody: "Refresh this page, or press Shift + T to replace the video.",
      tickerLabel: "Accumulated advertisement views",
      leaderboardTitle: "OFFERING BOARD",
      leaderboardCloseLabel: "Close the Offering Board",
      leaderboardTotalLabel: "GOD HAS ACCUMULATED",
      viewsSuffix: " VIEWS",
      profileLabel: "REGISTER YOUR NAME",
      profilePlaceholder: "UP TO 20 CHARACTERS",
      profileRegister: "REGISTER",
      profileUpdate: "UPDATE",
      profileHelp: "This device remembers your offerings. Names on the board must be unique.",
      profileContributionPrefix: "YOU HAVE OFFERED ",
      leaderboardEmpty: "No one has registered a name yet. Become the first contributor.",
      editorTitle: "WORK EDITOR",
      editorCloseLabel: "Close the work editor",
      databaseEnabled: "SHARED DATABASE ENABLED",
      databaseShared: "N IS ACCUMULATED BY ALL PARTICIPANTS",
      databaseInitial: "N equals the sum of all views on the board. No extra starting value is used.",
      effectLabel: "EFFECT AFTER PRESSING X",
      effectHearts: "01・RISING HEARTS",
      effectStars: "02・GOLDEN STARS",
      effectHalos: "03・HOLY HALOS",
      effectPetals: "04・ROSE PETALS",
      effectFeathers: "05・ANGEL FEATHERS",
      effectBubbles: "06・MIRACLE ORBS",
      effectRays: "07・RESURRECTION RAYS",
      effectConfetti: "08・CELEBRATION CONFETTI",
      effectBlessings: "09・WORDS OF BLESSING",
      effectPixels: "10・PIXEL FLASH",
      intensityLabel: "EFFECT INTENSITY",
      intensityHelp: "Choose low, standard, or strong. The setting applies the next time X is pressed.",
      replaceVideos: "REPLACE ADVERTISEMENT VIDEOS",
      chooseVideos: "CHOOSE ONE OR MORE VIDEOS",
      keepCurrentVideos: "CURRENT VIDEOS REMAIN IF NOTHING IS SELECTED",
      videoHelp: "H.264 MP4 is recommended. Each file must be under 95 MB for a direct GitHub push.",
      connectRepo: "CONNECT LOCAL REPOSITORY",
      repoHelp: "Choose the AnotherChance folder used by GitHub Desktop that contains .git and index.html.",
      chooseFolder: "CHOOSE FOLDER",
      folderNotConnected: "NO FOLDER CONNECTED",
      cancel: "CANCEL",
      saveToRepo: "SAVE TO REPOSITORY",
      saved: "SAVED",
      savedHelp: "You can now commit and push in GitHub Desktop.",
      databaseConnecting: "CONNECTING TO THE SHARED DATABASE…",
      databaseUnavailable: "THE SHARED DATABASE IS TEMPORARILY UNAVAILABLE. REFRESH LATER.",
      tickerMessage: "God has now accumulated {count} advertisement views. Thank you for participating. Your contribution brings Him one step closer to resurrection.",
      leaderboardScore: "{count} VIEWS",
      leaderboardUnavailable: "The Offering Board is temporarily unavailable. Please try again later.",
      contributionWriteFailed: "This offering was not recorded. Check the network and try again.",
      timerReady: "CLOSE",
      skipReadyLabel: "Close this advertisement and continue to the next one",
      leaderboardLoading: "READING THE SHARED DATABASE…",
      nameValidation: "The name must contain 1–20 characters.",
      profileSaving: "REGISTERING…",
      profileSaved: "Name registered. Offerings previously accumulated on this device were preserved.",
      nameTaken: "This name is already in use. Choose another name.",
      profileSaveFailed: "Registration failed. Check the network and try again.",
      browserUnsupported: "This browser cannot write directly to a folder. Open the site in the latest Chrome or Edge.",
      repoConnected: "CONNECTED: {name}",
      wrongRepo: "This is not the correct site folder. Choose the AnotherChance repository containing index.html.",
      fileTooLarge: "{name} exceeds 95 MB. Compress it before selecting it.",
      permissionDenied: "Folder write permission was not granted. No changes were saved.",
      editorWriting: "WRITING SETTINGS AND VIDEOS. DO NOT CLOSE THIS WINDOW…",
      writingVideo: "WRITING VIDEO {current} / {total}: {name}",
      editorSaved: "SAVED. GitHub Desktop now shows changes ready to commit.",
      editorSaveFailed: "Save failed. Confirm the correct folder was selected and no other program has locked the files.",
      videosSelected: "{count} VIDEOS・{size} MB TOTAL",
      intensityLow: "LOW",
      intensityStandard: "STANDARD",
      intensityStrong: "STRONG",
      languageSwitchLabel: "切換成中文"
    }
  };

  function savedLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  }

  let currentLanguage = savedLanguage();

  function t(key, replacements = {}) {
    const source = TRANSLATIONS[currentLanguage]?.[key] ?? TRANSLATIONS.zh[key] ?? key;
    return Object.entries(replacements).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      source
    );
  }

  function formatNumber(value) {
    return Number(value).toLocaleString(currentLanguage === "en" ? "en-US" : "zh-TW");
  }

  const elements = {
    video: document.querySelector("#adVideo"),
    skipButton: document.querySelector("#skipButton"),
    timerValue: document.querySelector("#timerValue"),
    progressTrack: document.querySelector("#progressTrack"),
    progressFill: document.querySelector("#progressFill"),
    startPrompt: document.querySelector("#startPrompt"),
    playbackError: document.querySelector("#playbackError"),
    fadeCurtain: document.querySelector("#fadeCurtain"),
    effectLayer: document.querySelector("#effectLayer"),
    tickerLive: document.querySelector("#tickerLive"),
    tickerTrack: document.querySelector("#tickerTrack"),
    tickerGroupA: document.querySelector("#tickerGroupA"),
    tickerCopyA: document.querySelector("#tickerCopyA"),
    tickerCopyB: document.querySelector("#tickerCopyB"),
    languageButton: document.querySelector("#languageButton"),
    leaderboardButton: document.querySelector("#leaderboardButton"),
    leaderboardDialog: document.querySelector("#leaderboardDialog"),
    leaderboardClose: document.querySelector("#leaderboardClose"),
    leaderboardTotal: document.querySelector("#leaderboardTotal"),
    leaderboardList: document.querySelector("#leaderboardList"),
    leaderboardEmpty: document.querySelector("#leaderboardEmpty"),
    profileForm: document.querySelector("#profileForm"),
    profileName: document.querySelector("#profileName"),
    profileSave: document.querySelector("#profileSave"),
    profileContribution: document.querySelector("#profileContribution"),
    profileStatus: document.querySelector("#profileStatus"),
    editorDialog: document.querySelector("#editorDialog"),
    editorForm: document.querySelector("#editorForm"),
    editorClose: document.querySelector("#editorClose"),
    editorCancel: document.querySelector("#editorCancel"),
    effectType: document.querySelector("#effectType"),
    effectIntensity: document.querySelector("#effectIntensity"),
    effectIntensityValue: document.querySelector("#effectIntensityValue"),
    videoFiles: document.querySelector("#videoFiles"),
    filePickerSubtitle: document.querySelector("#filePickerSubtitle"),
    chooseRepoButton: document.querySelector("#chooseRepoButton"),
    saveButton: document.querySelector("#saveButton"),
    editorStatus: document.querySelector("#editorStatus"),
    saveToast: document.querySelector("#saveToast")
  };

  let activeConfig = { ...config };
  let videoSources = [...activeConfig.videoFiles];
  let selectedFiles = [];
  let currentVideoIndex = 0;
  let watchedSeconds = 0;
  let lastVideoTime = 0;
  let skipAvailable = false;
  let isTransitioning = false;
  let experienceActivated = false;
  let repoHandle = null;
  let resumeAfterEditor = false;
  let resumeAfterLeaderboard = false;
  let toastTimer = null;
  let objectUrls = [];
  let effectCleanupTimer = null;
  let lastRandomSegmentKey = null;

  let accumulatedCount = null;
  let sharedProfile = { name: null, contributions: 0 };
  let leaderboardRows = [];
  let databaseMessageKey = "databaseConnecting";

  function createUuid() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }

  function getDeviceId() {
    const storageKey = "miracle-another-chance:device-id";
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) return existing;
      const created = createUuid();
      localStorage.setItem(storageKey, created);
      return created;
    } catch {
      return createUuid();
    }
  }

  const deviceId = getDeviceId();

  function tickerMessage() {
    if (!Number.isInteger(accumulatedCount)) return t(databaseMessageKey);
    return t("tickerMessage", { count: formatNumber(accumulatedCount) });
  }

  function updateTickerLoopMetrics() {
    const distance = elements.tickerGroupA.getBoundingClientRect().width;
    const pixelsPerSecond = 68;
    const loopDuration = Math.max(8, distance / pixelsPerSecond);
    elements.tickerTrack.style.setProperty("--ticker-distance", `${distance.toFixed(2)}px`);
    elements.tickerTrack.style.setProperty("--ticker-end", `${(-distance).toFixed(2)}px`);
    elements.tickerTrack.style.setProperty("--ticker-duration", `${loopDuration.toFixed(2)}s`);
  }

  function restartTicker() {
    const viewportWidth = elements.tickerTrack.parentElement.clientWidth;
    const enterDuration = Math.max(0.1, viewportWidth / 68);

    updateTickerLoopMetrics();
    elements.tickerTrack.classList.remove("is-entering", "is-running");
    elements.tickerTrack.style.setProperty("--ticker-start", `${viewportWidth}px`);
    elements.tickerTrack.style.setProperty("--ticker-enter-duration", `${enterDuration.toFixed(2)}s`);
    void elements.tickerTrack.offsetWidth;
    elements.tickerTrack.classList.add("is-entering");
  }

  function renderTicker({ announce = false, restart = false } = {}) {
    const message = tickerMessage();
    elements.tickerCopyA.textContent = message;
    elements.tickerCopyB.textContent = message;
    if (announce) elements.tickerLive.textContent = message;
    const shouldRestart = (
      restart
      || (!elements.tickerTrack.classList.contains("is-entering")
        && !elements.tickerTrack.classList.contains("is-running"))
    );
    if (shouldRestart) restartTicker();
    else updateTickerLoopMetrics();
  }

  function renderStoredStatus(element) {
    const key = element.dataset.messageKey;
    if (!key) return;
    let replacements = {};
    try {
      replacements = JSON.parse(element.dataset.messageParams || "{}");
    } catch {
      replacements = {};
    }
    element.textContent = t(key, replacements);
  }

  function applyLanguage(nextLanguage, { persist = true, restartTickerNow = true } = {}) {
    currentLanguage = nextLanguage === "en" ? "en" : "zh";
    document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-Hant";
    document.documentElement.dataset.language = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });

    elements.languageButton.setAttribute("aria-label", t("languageSwitchLabel"));
    renderStoredStatus(elements.profileStatus);
    renderStoredStatus(elements.editorStatus);
    elements.leaderboardTotal.textContent = Number.isInteger(accumulatedCount)
      ? formatNumber(accumulatedCount)
      : "—";
    renderProfile();
    renderLeaderboard(leaderboardRows);
    renderIntensityLabel();
    if (elements.editorDialog.open) handleSelectedFiles();
    renderTimer();
    elements.skipButton.setAttribute(
      "aria-label",
      skipAvailable ? t("skipReadyLabel") : t("skipLockedLabel")
    );
    renderTicker({ restart: restartTickerNow });

    if (persist) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
      } catch {
        // The language still changes for this visit if storage is unavailable.
      }
    }
  }

  function toggleLanguage() {
    applyLanguage(currentLanguage === "zh" ? "en" : "zh");
  }

  function apiEndpoint(path) {
    return `${String(activeConfig.apiBaseUrl || DEFAULT_CONFIG.apiBaseUrl).replace(/\/$/, "")}${path}`;
  }

  async function apiRequest(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(apiEndpoint(path), {
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers
        },
        cache: "no-store",
        credentials: "omit",
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(data.error || "api_error");
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function setProfileStatus(messageKey, state = "neutral", replacements = {}) {
    elements.profileStatus.dataset.messageKey = messageKey;
    elements.profileStatus.dataset.messageParams = JSON.stringify(replacements);
    elements.profileStatus.textContent = messageKey ? t(messageKey, replacements) : "";
    elements.profileStatus.classList.toggle("is-error", state === "error");
    elements.profileStatus.classList.toggle("is-success", state === "success");
  }

  function renderProfile() {
    elements.profileContribution.textContent = formatNumber(Number(sharedProfile.contributions || 0));
    if (sharedProfile.name && document.activeElement !== elements.profileName) {
      elements.profileName.value = sharedProfile.name;
      elements.profileSave.textContent = t("profileUpdate");
    } else if (!sharedProfile.name) {
      elements.profileSave.textContent = t("profileRegister");
    }
  }

  function applySharedState(data, { announce = false, restartTickerNow = false } = {}) {
    if (Number.isInteger(Number(data?.totalViews)) && Number(data.totalViews) >= 0) {
      accumulatedCount = Number(data.totalViews);
      databaseMessageKey = "databaseConnecting";
    }
    if (data?.profile) {
      sharedProfile = {
        name: data.profile.name || null,
        contributions: Math.max(0, Number(data.profile.contributions) || 0)
      };
    }
    elements.leaderboardTotal.textContent = Number.isInteger(accumulatedCount)
      ? formatNumber(accumulatedCount)
      : "—";
    renderProfile();
    renderTicker({ announce, restart: restartTickerNow });
  }

  async function syncSharedState({ announce = false } = {}) {
    try {
      const data = await apiRequest(`/api/state?deviceId=${encodeURIComponent(deviceId)}`);
      applySharedState(data, { announce });
      return true;
    } catch (error) {
      console.error("Shared database sync failed", error);
      if (!Number.isInteger(accumulatedCount)) {
        databaseMessageKey = "databaseUnavailable";
        renderTicker({ announce: true });
      }
      return false;
    }
  }

  function renderLeaderboard(rows = leaderboardRows) {
    leaderboardRows = Array.isArray(rows) ? rows : [];
    const fragment = document.createDocumentFragment();
    elements.leaderboardList.replaceChildren();

    leaderboardRows.forEach((row) => {
      const item = document.createElement("li");
      const rank = document.createElement("span");
      const name = document.createElement("span");
      const score = document.createElement("span");
      rank.className = "leaderboard-rank";
      name.className = "leaderboard-name";
      score.className = "leaderboard-score";
      rank.textContent = String(row.rank);
      name.textContent = row.name;
      score.textContent = t("leaderboardScore", { count: formatNumber(row.contributions) });
      if (sharedProfile.name && row.name === sharedProfile.name) item.classList.add("is-me");
      item.append(rank, name, score);
      fragment.appendChild(item);
    });

    elements.leaderboardList.appendChild(fragment);
    elements.leaderboardEmpty.hidden = leaderboardRows.length > 0;
  }

  async function refreshLeaderboard() {
    try {
      const data = await apiRequest("/api/leaderboard");
      applySharedState(data);
      renderLeaderboard(data.leaderboard || []);
      return true;
    } catch (error) {
      console.error("Leaderboard load failed", error);
      setProfileStatus("leaderboardUnavailable", "error");
      return false;
    }
  }

  async function recordContribution() {
    const eventId = createUuid();

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const data = await apiRequest("/api/contribute", {
          method: "POST",
          body: JSON.stringify({ deviceId, eventId })
        });
        applySharedState(data, { announce: true });
        if (elements.leaderboardDialog.open) await refreshLeaderboard();
        return true;
      } catch (error) {
        if (error.status === 429 || attempt === 1) {
          console.error("Contribution was not recorded", error);
          setProfileStatus("contributionWriteFailed", "error");
          return false;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 700));
      }
    }

    return false;
  }

  const EFFECT_PROFILES = {
    hearts: { count: 32, symbols: ["♥"], colors: ["#ff174f", "#ff5c8a", "#ffd0dc", "#ffffff"], min: 32, max: 64, startMin: 0, startMax: 24, delayMax: 0.14 },
    stars: { count: 26, symbols: ["✦", "✧", "★"], colors: ["#ffd400", "#fff4a3", "#ffffff"], min: 18, max: 42 },
    halos: { count: 6, symbols: [""], colors: ["#ffd400"], min: 58, max: 118 },
    petals: { count: 28, symbols: ["●", "❀"], colors: ["#ff315f", "#ff789b", "#ffd0dc"], min: 12, max: 26 },
    feathers: { count: 20, symbols: ["❯", "⌇"], colors: ["#ffffff", "#fff7d1"], min: 22, max: 42 },
    bubbles: { count: 20, symbols: [""], colors: ["#fff4a3"], min: 18, max: 54 },
    rays: { count: 12, symbols: [""], colors: ["#ffd400"], min: 3, max: 8 },
    confetti: { count: 38, symbols: [""], colors: ["#ffd400", "#ff315f", "#00e7ff", "#ffffff"], min: 7, max: 14 },
    blessings: { count: 16, symbols: ["+1", "AMEN", "奇蹟", "復活"], colors: ["#ffd400", "#fff4a3"], min: 14, max: 22 },
    pixels: { count: 34, symbols: [""], colors: ["#ffd400", "#ffffff", "#ff315f"], min: 6, max: 14 }
  };

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function triggerEffect(type = "hearts", intensity = 2) {
    const safeType = EFFECT_PROFILES[type] ? type : "hearts";
    const profile = EFFECT_PROFILES[safeType];
    const symbols = safeType === "blessings" && currentLanguage === "en"
      ? ["+1", "AMEN", "MIRACLE", "REVIVE"]
      : profile.symbols;
    const strength = Math.min(3, Math.max(1, Number(intensity) || 2));
    const multiplier = [0, 0.72, 1, 1.38][strength];
    const count = Math.round(profile.count * multiplier);
    const fragment = document.createDocumentFragment();

    window.clearTimeout(effectCleanupTimer);
    elements.effectLayer.dataset.effect = safeType;
    elements.effectLayer.replaceChildren();

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      const size = profile.min + Math.random() * (profile.max - profile.min);
      particle.className = `effect-particle effect-${safeType}`;
      particle.textContent = randomItem(symbols);
      particle.style.setProperty("--x", `${4 + Math.random() * 92}%`);
      particle.style.setProperty("--start-bottom", `${(profile.startMin ?? -12) + Math.random() * ((profile.startMax ?? -12) - (profile.startMin ?? -12))}%`);
      particle.style.setProperty("--size", `${size.toFixed(1)}px`);
      particle.style.setProperty("--drift", `${-110 + Math.random() * 220}px`);
      particle.style.setProperty("--rotate", `${-45 + Math.random() * 90}deg`);
      particle.style.setProperty("--angle", `${index * (360 / count)}deg`);
      particle.style.setProperty("--delay", `${Math.random() * (profile.delayMax ?? 0.28)}s`);
      particle.style.setProperty("--duration", `${2.8 + Math.random() * 1.4}s`);
      particle.style.setProperty("--particle-color", randomItem(profile.colors));
      fragment.appendChild(particle);
    }

    elements.effectLayer.appendChild(fragment);
    effectCleanupTimer = window.setTimeout(() => elements.effectLayer.replaceChildren(), 5200);
  }

  function videoPathAt(index) {
    return videoSources[index] || DEFAULT_CONFIG.videoFiles[0];
  }

  async function loadVideo(index, { preservePlayback = true } = {}) {
    const wasPaused = elements.video.paused;
    currentVideoIndex = ((index % videoSources.length) + videoSources.length) % videoSources.length;
    elements.playbackError.hidden = true;
    elements.video.src = videoPathAt(currentVideoIndex);
    elements.video.load();

    if (preservePlayback && !wasPaused) {
      await tryPlay();
    }
  }

  async function tryPlay() {
    if (!experienceActivated) {
      elements.startPrompt.hidden = false;
      return false;
    }

    try {
      elements.video.muted = false;
      elements.video.volume = 1;
      await elements.video.play();
      elements.startPrompt.hidden = true;
      return true;
    } catch {
      elements.startPrompt.hidden = false;
      return false;
    }
  }

  async function activateExperience() {
    experienceActivated = true;
    elements.video.muted = false;
    elements.video.volume = 1;
    await tryPlay();
  }

  function advanceVideo() {
    if (videoSources.length > 1) {
      return loadVideo(currentVideoIndex + 1);
    }

    if (elements.video.ended || elements.video.currentTime >= elements.video.duration - 0.2) {
      elements.video.currentTime = 0;
    }
    return tryPlay();
  }

  function waitForVideoEvent(eventName, timeoutMilliseconds = 1800) {
    return new Promise((resolve) => {
      let timeoutId = null;
      const finish = () => {
        elements.video.removeEventListener(eventName, finish);
        window.clearTimeout(timeoutId);
        resolve();
      };

      elements.video.addEventListener(eventName, finish, { once: true });
      timeoutId = window.setTimeout(finish, timeoutMilliseconds);
    });
  }

  async function ensureVideoMetadata() {
    if (elements.video.readyState >= 1 && Number.isFinite(elements.video.duration)) return;
    await waitForVideoEvent("loadedmetadata");
  }

  async function jumpToRandomAdSegment() {
    let sourceChanged = false;

    if (videoSources.length > 1) {
      const otherVideos = videoSources
        .map((_, index) => index)
        .filter((index) => index !== currentVideoIndex);
      const nextVideoIndex = randomItem(otherVideos);
      await loadVideo(nextVideoIndex, { preservePlayback: false });
      sourceChanged = true;
    }

    await ensureVideoMetadata();
    const duration = elements.video.duration;
    if (!Number.isFinite(duration) || duration <= 1) return advanceVideo();

    const segmentLength = 30;
    const requiredPlayback = Math.max(1, Number(activeConfig.skipDelaySeconds) || 30) + 2;
    const latestSafeTarget = Math.max(0, duration - requiredPlayback);
    const segmentCount = Math.max(1, Math.floor(latestSafeTarget / segmentLength) + 1);
    const currentSegment = Math.min(segmentCount - 1, Math.floor(elements.video.currentTime / segmentLength));
    const sourceKey = videoPathAt(currentVideoIndex);
    const allSegments = Array.from({ length: segmentCount }, (_, index) => index);

    let candidates = sourceChanged
      ? allSegments
      : allSegments.filter((index) => Math.abs(index - currentSegment) >= 2);
    if (candidates.length === 0) {
      candidates = allSegments.filter((index) => index !== currentSegment);
    }

    const unusedCandidates = candidates.filter((index) => `${sourceKey}:${index}` !== lastRandomSegmentKey);
    if (unusedCandidates.length > 0) candidates = unusedCandidates;

    let targetTime;
    if (candidates.length > 0) {
      const targetSegment = randomItem(candidates);
      const segmentStart = targetSegment * segmentLength;
      const safeStart = Math.min(latestSafeTarget, segmentStart + 1);
      const safeEnd = Math.max(safeStart, Math.min(latestSafeTarget, segmentStart + segmentLength - 1));
      targetTime = safeStart + Math.random() * (safeEnd - safeStart);
      lastRandomSegmentKey = `${sourceKey}:${targetSegment}`;
    } else {
      const available = Math.max(0.5, duration - 1);
      targetTime = Math.random() * available;
      if (Math.abs(targetTime - elements.video.currentTime) < Math.min(8, duration / 3)) {
        targetTime = (targetTime + duration / 2) % available;
      }
      lastRandomSegmentKey = `${sourceKey}:${Math.floor(targetTime / segmentLength)}`;
    }

    const seekCompleted = waitForVideoEvent("seeked", 1600);
    elements.video.currentTime = targetTime;
    await seekCompleted;
    return tryPlay();
  }

  function renderTimer() {
    const delay = Math.max(1, Number(activeConfig.skipDelaySeconds) || 30);
    const remaining = Math.max(0, delay - watchedSeconds);
    const displaySeconds = Math.ceil(remaining);
    const progress = Math.min(1, watchedSeconds / delay);

    elements.timerValue.textContent = displaySeconds > 0
      ? `00:${String(displaySeconds).padStart(2, "0")}`
      : t("timerReady");
    elements.progressFill.style.width = `${progress * 100}%`;
    elements.progressTrack.setAttribute("aria-valuemax", String(delay));
    elements.progressTrack.setAttribute("aria-valuenow", String(Math.min(delay, watchedSeconds).toFixed(1)));

    if (remaining <= 0 && !skipAvailable) {
      skipAvailable = true;
      elements.skipButton.disabled = false;
      elements.skipButton.hidden = false;
      elements.skipButton.setAttribute("aria-disabled", "false");
      elements.skipButton.setAttribute("aria-label", t("skipReadyLabel"));
      elements.skipButton.classList.add("is-ready");
    }
  }

  function resetWatchTimer() {
    watchedSeconds = 0;
    lastVideoTime = Number.isFinite(elements.video.currentTime) ? elements.video.currentTime : 0;
    skipAvailable = false;
    elements.skipButton.disabled = true;
    elements.skipButton.hidden = true;
    elements.skipButton.setAttribute("aria-disabled", "true");
    elements.skipButton.setAttribute("aria-label", t("skipLockedLabel"));
    elements.skipButton.classList.remove("is-ready");
    renderTimer();
  }

  function tick() {
    const currentVideoTime = Number.isFinite(elements.video.currentTime) ? elements.video.currentTime : 0;
    const playedDelta = currentVideoTime - lastVideoTime;
    lastVideoTime = currentVideoTime;

    if (
      !elements.video.paused
      && !elements.video.ended
      && !document.hidden
      && !skipAvailable
      && playedDelta > 0
    ) {
      watchedSeconds += playedDelta;
      renderTimer();
    }

    window.requestAnimationFrame(tick);
  }

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  async function handleSkip() {
    if (!skipAvailable || isTransitioning) return;

    isTransitioning = true;
    elements.skipButton.disabled = true;
    elements.skipButton.hidden = true;
    elements.skipButton.classList.remove("is-ready");
    renderTicker({ restart: true });
    void recordContribution();
    triggerEffect(activeConfig.effectType, activeConfig.effectIntensity);

    elements.fadeCurtain.style.transition = "opacity 900ms cubic-bezier(0.55, 0, 1, 0.45)";
    elements.fadeCurtain.classList.add("is-dark");
    await wait(900);
    await jumpToRandomAdSegment();
    resetWatchTimer();

    elements.fadeCurtain.style.transition = "none";
    elements.fadeCurtain.classList.remove("is-dark");
    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    elements.fadeCurtain.style.transition = "opacity 900ms cubic-bezier(0.55, 0, 1, 0.45)";
    isTransitioning = false;
  }

  async function openLeaderboard() {
    if (elements.leaderboardDialog.open || elements.editorDialog.open) return;
    resumeAfterLeaderboard = !elements.video.paused;
    elements.video.pause();
    setProfileStatus("leaderboardLoading");
    elements.leaderboardDialog.showModal();
    await syncSharedState();
    await refreshLeaderboard();
    if (elements.profileStatus.dataset.messageKey === "leaderboardLoading") setProfileStatus("");
  }

  function closeLeaderboard() {
    if (!elements.leaderboardDialog.open) return;
    elements.leaderboardDialog.close();
    if (resumeAfterLeaderboard) tryPlay();
  }

  async function saveProfile(event) {
    event.preventDefault();
    const name = elements.profileName.value.normalize("NFKC").replace(/\s+/g, " ").trim();
    if (Array.from(name).length < 1 || Array.from(name).length > 20) {
      setProfileStatus("nameValidation", "error");
      elements.profileName.focus();
      return;
    }

    elements.profileSave.disabled = true;
    setProfileStatus("profileSaving");
    try {
      const data = await apiRequest("/api/profile", {
        method: "POST",
        body: JSON.stringify({ deviceId, name })
      });
      applySharedState(data);
      setProfileStatus("profileSaved", "success");
      await refreshLeaderboard();
    } catch (error) {
      if (error.status === 409) {
        setProfileStatus("nameTaken", "error");
      } else {
        setProfileStatus("profileSaveFailed", "error");
      }
    } finally {
      elements.profileSave.disabled = false;
    }
  }

  function setEditorStatus(messageKey, state = "neutral", replacements = {}) {
    elements.editorStatus.dataset.messageKey = messageKey;
    elements.editorStatus.dataset.messageParams = JSON.stringify(replacements);
    elements.editorStatus.textContent = messageKey ? t(messageKey, replacements) : "";
    elements.editorStatus.classList.toggle("is-success", state === "success");
    elements.editorStatus.classList.toggle("is-error", state === "error");
  }

  function openEditor() {
    if (elements.editorDialog.open || elements.leaderboardDialog.open) return;
    resumeAfterEditor = !elements.video.paused;
    elements.video.pause();
    elements.effectType.value = EFFECT_PROFILES[activeConfig.effectType] ? activeConfig.effectType : "hearts";
    elements.effectIntensity.value = String(Math.min(3, Math.max(1, Number(activeConfig.effectIntensity) || 2)));
    renderIntensityLabel();
    selectedFiles = [];
    elements.videoFiles.value = "";
    elements.filePickerSubtitle.textContent = t("keepCurrentVideos");
    document.body.classList.add("editor-open");
    elements.editorDialog.showModal();
  }

  function closeEditor() {
    if (!elements.editorDialog.open) return;
    elements.editorDialog.close();
    document.body.classList.remove("editor-open");
    if (resumeAfterEditor) tryPlay();
  }

  async function verifyRepoHandle(handle) {
    await handle.getFileHandle("index.html");
    await handle.getFileHandle("site-config.js");
    return true;
  }

  async function chooseRepository() {
    if (!("showDirectoryPicker" in window)) {
      setEditorStatus("browserUnsupported", "error");
      return false;
    }

    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      await verifyRepoHandle(handle);
      repoHandle = handle;
      setEditorStatus("repoConnected", "success", { name: handle.name });
      return true;
    } catch (error) {
      if (error?.name === "AbortError") return false;
      setEditorStatus("wrongRepo", "error");
      return false;
    }
  }

  async function ensureWritePermission(handle) {
    if (!handle) return false;
    const options = { mode: "readwrite" };
    if ((await handle.queryPermission(options)) === "granted") return true;
    return (await handle.requestPermission(options)) === "granted";
  }

  async function writeFile(directoryHandle, filename, contents) {
    const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  function extensionFor(file) {
    const match = file.name.toLowerCase().match(/\.(mp4|webm)$/);
    if (match) return match[1];
    return file.type === "video/webm" ? "webm" : "mp4";
  }

  function makeConfigSource(nextConfig) {
    return `window.MIRACLE_CONFIG = ${JSON.stringify(nextConfig, null, 2)};\n`;
  }

  function clearObjectUrls() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls = [];
  }

  function applySavedSettings(nextConfig, files) {
    activeConfig = { ...activeConfig, ...nextConfig };
    void syncSharedState({ announce: true });
    resetWatchTimer();

    if (files.length > 0) {
      clearObjectUrls();
      objectUrls = files.map((file) => URL.createObjectURL(file));
      videoSources = [...objectUrls];
      loadVideo(0, { preservePlayback: false });
    }
  }

  function showSavedToast() {
    window.clearTimeout(toastTimer);
    elements.saveToast.hidden = false;
    toastTimer = window.setTimeout(() => {
      elements.saveToast.hidden = true;
    }, 5200);
  }

  async function saveEditorChanges(event) {
    event.preventDefault();

    const selectedEffectType = EFFECT_PROFILES[elements.effectType.value] ? elements.effectType.value : "hearts";
    const selectedEffectIntensity = Math.min(3, Math.max(1, Number(elements.effectIntensity.value) || 2));

    const oversized = selectedFiles.find((file) => file.size > MAX_GITHUB_FILE_SIZE);
    if (oversized) {
      setEditorStatus("fileTooLarge", "error", { name: oversized.name });
      return;
    }

    if (!repoHandle && !(await chooseRepository())) return;
    if (!(await ensureWritePermission(repoHandle))) {
      setEditorStatus("permissionDenied", "error");
      return;
    }

    elements.saveButton.disabled = true;
    elements.chooseRepoButton.disabled = true;
    setEditorStatus("editorWriting");

    try {
      let nextVideoFiles = [...activeConfig.videoFiles];

      if (selectedFiles.length > 0) {
        const assetsHandle = await repoHandle.getDirectoryHandle("assets", { create: true });
        const adsHandle = await assetsHandle.getDirectoryHandle("ads", { create: true });
        nextVideoFiles = [];

        for (let index = 0; index < selectedFiles.length; index += 1) {
          const file = selectedFiles[index];
          const filename = `ad-${String(index + 1).padStart(2, "0")}.${extensionFor(file)}`;
          setEditorStatus("writingVideo", "neutral", {
            current: index + 1,
            total: selectedFiles.length,
            name: filename
          });
          await writeFile(adsHandle, filename, file);
          nextVideoFiles.push(`assets/ads/${filename}`);
        }
      }

      const nextConfig = {
        revision: new Date().toISOString(),
        apiBaseUrl: activeConfig.apiBaseUrl || DEFAULT_CONFIG.apiBaseUrl,
        videoFiles: nextVideoFiles,
        skipDelaySeconds: 30,
        effectType: selectedEffectType,
        effectIntensity: selectedEffectIntensity
      };

      await writeFile(repoHandle, "site-config.js", makeConfigSource(nextConfig));

      if (selectedFiles.length > 0) {
        const obsoleteFiles = activeConfig.videoFiles.filter((path) => {
          return !nextVideoFiles.includes(path) && /^assets\/ads\/ad-\d+\.(mp4|webm)$/i.test(path);
        });

        const assetsHandle = await repoHandle.getDirectoryHandle("assets", { create: true });
        const adsHandle = await assetsHandle.getDirectoryHandle("ads", { create: true });
        for (const path of obsoleteFiles) {
          const filename = path.split("/").pop();
          try {
            await adsHandle.removeEntry(filename);
          } catch {
            // An obsolete file can remain unreferenced without breaking the site.
          }
        }
      }

      applySavedSettings(nextConfig, selectedFiles);
      setEditorStatus("editorSaved", "success");
      showSavedToast();
      await wait(650);
      closeEditor();
    } catch (error) {
      console.error(error);
      setEditorStatus("editorSaveFailed", "error");
    } finally {
      elements.saveButton.disabled = false;
      elements.chooseRepoButton.disabled = false;
    }
  }

  function handleSelectedFiles() {
    selectedFiles = Array.from(elements.videoFiles.files || []);
    if (selectedFiles.length === 0) {
      elements.filePickerSubtitle.textContent = t("keepCurrentVideos");
      return;
    }

    const totalMegabytes = selectedFiles.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
    elements.filePickerSubtitle.textContent = t("videosSelected", {
      count: selectedFiles.length,
      size: totalMegabytes.toFixed(1)
    });
  }

  function renderIntensityLabel() {
    const labels = { 1: "intensityLow", 2: "intensityStandard", 3: "intensityStrong" };
    elements.effectIntensityValue.textContent = t(labels[elements.effectIntensity.value] || "intensityStandard");
  }

  elements.skipButton.addEventListener("click", handleSkip);
  elements.languageButton.addEventListener("click", toggleLanguage);
  elements.startPrompt.addEventListener("click", activateExperience);
  elements.leaderboardButton.addEventListener("click", openLeaderboard);
  elements.leaderboardClose.addEventListener("click", closeLeaderboard);
  elements.profileForm.addEventListener("submit", saveProfile);
  elements.editorClose.addEventListener("click", closeEditor);
  elements.editorCancel.addEventListener("click", closeEditor);
  elements.chooseRepoButton.addEventListener("click", chooseRepository);
  elements.videoFiles.addEventListener("change", handleSelectedFiles);
  elements.effectIntensity.addEventListener("input", renderIntensityLabel);
  elements.editorForm.addEventListener("submit", saveEditorChanges);

  elements.tickerTrack.addEventListener("animationend", (event) => {
    if (event.animationName !== "ticker-enter" || !elements.tickerTrack.classList.contains("is-entering")) return;
    elements.tickerTrack.classList.remove("is-entering");
    elements.tickerTrack.classList.add("is-running");
  });

  elements.editorDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeEditor();
  });

  elements.leaderboardDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLeaderboard();
  });

  elements.video.addEventListener("ended", () => {
    advanceVideo();
  });

  elements.video.addEventListener("error", () => {
    elements.playbackError.hidden = false;
  });

  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      openEditor();
    }
  });

  document.addEventListener("visibilitychange", () => {
    lastVideoTime = Number.isFinite(elements.video.currentTime) ? elements.video.currentTime : 0;
    if (!document.hidden) void syncSharedState();
  });

  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  }, { passive: false });

  document.addEventListener("selectstart", (event) => {
    const insideInteractiveDialog = event.target instanceof Element
      && event.target.closest(".editor, .leaderboard");
    if (!insideInteractiveDialog) event.preventDefault();
  });

  document.addEventListener("gesturestart", (event) => {
    event.preventDefault();
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener("touchend", (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 350) event.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  applyLanguage(currentLanguage, { persist: false, restartTickerNow: true });
  loadVideo(0, { preservePlayback: false });
  void syncSharedState();
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => renderTicker({ restart: true }));
  }
  window.setInterval(() => {
    if (!document.hidden && !elements.leaderboardDialog.open) void syncSharedState();
  }, 60000);
  window.requestAnimationFrame(tick);
})();
