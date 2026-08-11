(() => {
  "use strict";

  const DEFAULT_CONFIG = {
    revision: "default",
    startingCount: null,
    videoFiles: ["assets/ads/ad-01.mp4"],
    skipDelaySeconds: 30
  };

  const MAX_GITHUB_FILE_SIZE = 95 * 1024 * 1024;
  const config = { ...DEFAULT_CONFIG, ...(window.MIRACLE_CONFIG || {}) };

  const elements = {
    video: document.querySelector("#adVideo"),
    skipButton: document.querySelector("#skipButton"),
    timerValue: document.querySelector("#timerValue"),
    progressTrack: document.querySelector("#progressTrack"),
    progressFill: document.querySelector("#progressFill"),
    startPrompt: document.querySelector("#startPrompt"),
    playbackError: document.querySelector("#playbackError"),
    fadeCurtain: document.querySelector("#fadeCurtain"),
    tickerLive: document.querySelector("#tickerLive"),
    tickerCopyA: document.querySelector("#tickerCopyA"),
    tickerCopyB: document.querySelector("#tickerCopyB"),
    editorDialog: document.querySelector("#editorDialog"),
    editorForm: document.querySelector("#editorForm"),
    editorClose: document.querySelector("#editorClose"),
    editorCancel: document.querySelector("#editorCancel"),
    startingCount: document.querySelector("#startingCount"),
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
  let toastTimer = null;
  let objectUrls = [];

  const randomStart = () => Math.floor(Math.random() * 201) + 600;
  const validConfiguredStart = activeConfig.startingCount !== null
    && activeConfig.startingCount !== ""
    && Number.isInteger(Number(activeConfig.startingCount))
    ? Math.max(0, Number(activeConfig.startingCount))
    : null;

  let countStorageKey = `miracle-another-chance:${activeConfig.revision}`;
  let accumulatedCount = readStoredCount(countStorageKey) ?? validConfiguredStart ?? randomStart();

  function readStoredCount(key) {
    try {
      const value = Number.parseInt(localStorage.getItem(key), 10);
      return Number.isInteger(value) && value >= 0 ? value : null;
    } catch {
      return null;
    }
  }

  function storeCount() {
    try {
      localStorage.setItem(countStorageKey, String(accumulatedCount));
    } catch {
      // The artwork remains functional when browser storage is unavailable.
    }
  }

  function tickerMessage() {
    return `神目前已累積觀看廣告${accumulatedCount.toLocaleString("zh-TW")}次，感謝您的參與，您的貢獻讓祂距離復活又跨進了一大步`;
  }

  function renderTicker({ announce = false } = {}) {
    const message = tickerMessage();
    elements.tickerCopyA.textContent = message;
    elements.tickerCopyB.textContent = message;
    if (announce) elements.tickerLive.textContent = message;
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

  function renderTimer() {
    const delay = Math.max(1, Number(activeConfig.skipDelaySeconds) || 30);
    const remaining = Math.max(0, delay - watchedSeconds);
    const displaySeconds = Math.ceil(remaining);
    const progress = Math.min(1, watchedSeconds / delay);

    elements.timerValue.textContent = displaySeconds > 0
      ? `00:${String(displaySeconds).padStart(2, "0")}`
      : "可關閉";
    elements.progressFill.style.width = `${progress * 100}%`;
    elements.progressTrack.setAttribute("aria-valuemax", String(delay));
    elements.progressTrack.setAttribute("aria-valuenow", String(Math.min(delay, watchedSeconds).toFixed(1)));

    if (remaining <= 0 && !skipAvailable) {
      skipAvailable = true;
      elements.skipButton.disabled = false;
      elements.skipButton.hidden = false;
      elements.skipButton.setAttribute("aria-disabled", "false");
      elements.skipButton.setAttribute("aria-label", "關閉這則廣告並繼續下一則");
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
    elements.skipButton.setAttribute("aria-label", "觀看三十秒後關閉這則廣告");
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
    accumulatedCount += 1;
    storeCount();
    renderTicker({ announce: true });

    elements.fadeCurtain.style.transition = "opacity 900ms cubic-bezier(0.55, 0, 1, 0.45)";
    elements.fadeCurtain.classList.add("is-dark");
    await wait(900);
    await advanceVideo();
    resetWatchTimer();

    elements.fadeCurtain.style.transition = "none";
    elements.fadeCurtain.classList.remove("is-dark");
    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    elements.fadeCurtain.style.transition = "opacity 900ms cubic-bezier(0.55, 0, 1, 0.45)";
    isTransitioning = false;
  }

  function setEditorStatus(message, state = "neutral") {
    elements.editorStatus.textContent = message;
    elements.editorStatus.classList.toggle("is-success", state === "success");
    elements.editorStatus.classList.toggle("is-error", state === "error");
  }

  function openEditor() {
    if (elements.editorDialog.open) return;
    resumeAfterEditor = !elements.video.paused;
    elements.video.pause();
    elements.startingCount.value = activeConfig.startingCount !== null
      && activeConfig.startingCount !== ""
      && Number.isInteger(Number(activeConfig.startingCount))
      ? String(activeConfig.startingCount)
      : "";
    selectedFiles = [];
    elements.videoFiles.value = "";
    elements.filePickerSubtitle.textContent = "未選擇時會保留目前影片";
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
      setEditorStatus("此瀏覽器無法直接寫入資料夾。請改用最新版 Chrome 或 Edge 開啟網站。", "error");
      return false;
    }

    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      await verifyRepoHandle(handle);
      repoHandle = handle;
      setEditorStatus(`已連接：${handle.name}`, "success");
      return true;
    } catch (error) {
      if (error?.name === "AbortError") return false;
      setEditorStatus("這不是正確的網站資料夾；請選擇內含 index.html 的 AnotherChance repository。", "error");
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
    activeConfig = { ...nextConfig };
    countStorageKey = `miracle-another-chance:${activeConfig.revision}`;
    accumulatedCount = activeConfig.startingCount ?? randomStart();
    storeCount();
    renderTicker({ announce: true });
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

    const rawStart = elements.startingCount.value.trim();
    const parsedStart = rawStart === "" ? null : Number(rawStart);
    if (parsedStart !== null && (!Number.isInteger(parsedStart) || parsedStart < 0)) {
      setEditorStatus("N 必須是 0 或更大的整數，也可以留白使用 600–800 的隨機值。", "error");
      elements.startingCount.focus();
      return;
    }

    const oversized = selectedFiles.find((file) => file.size > MAX_GITHUB_FILE_SIZE);
    if (oversized) {
      setEditorStatus(`${oversized.name} 超過 95 MB，請先壓縮後再選取。`, "error");
      return;
    }

    if (!repoHandle && !(await chooseRepository())) return;
    if (!(await ensureWritePermission(repoHandle))) {
      setEditorStatus("沒有取得資料夾寫入權限，尚未儲存任何變更。", "error");
      return;
    }

    elements.saveButton.disabled = true;
    elements.chooseRepoButton.disabled = true;
    setEditorStatus("正在寫入設定與影片，請不要關閉視窗…");

    try {
      let nextVideoFiles = [...activeConfig.videoFiles];

      if (selectedFiles.length > 0) {
        const assetsHandle = await repoHandle.getDirectoryHandle("assets", { create: true });
        const adsHandle = await assetsHandle.getDirectoryHandle("ads", { create: true });
        nextVideoFiles = [];

        for (let index = 0; index < selectedFiles.length; index += 1) {
          const file = selectedFiles[index];
          const filename = `ad-${String(index + 1).padStart(2, "0")}.${extensionFor(file)}`;
          setEditorStatus(`正在寫入影片 ${index + 1} / ${selectedFiles.length}：${filename}`);
          await writeFile(adsHandle, filename, file);
          nextVideoFiles.push(`assets/ads/${filename}`);
        }
      }

      const nextConfig = {
        revision: new Date().toISOString(),
        startingCount: parsedStart,
        videoFiles: nextVideoFiles,
        skipDelaySeconds: 30
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
      setEditorStatus("儲存完成。GitHub Desktop 現在會顯示可 commit 的變更。", "success");
      showSavedToast();
      await wait(650);
      closeEditor();
    } catch (error) {
      console.error(error);
      setEditorStatus("儲存失敗；請確認選取的是正確資料夾，而且檔案沒有被其他程式鎖定。", "error");
    } finally {
      elements.saveButton.disabled = false;
      elements.chooseRepoButton.disabled = false;
    }
  }

  function handleSelectedFiles() {
    selectedFiles = Array.from(elements.videoFiles.files || []);
    if (selectedFiles.length === 0) {
      elements.filePickerSubtitle.textContent = "未選擇時會保留目前影片";
      return;
    }

    const totalMegabytes = selectedFiles.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
    elements.filePickerSubtitle.textContent = `${selectedFiles.length} 支影片・共 ${totalMegabytes.toFixed(1)} MB`;
  }

  elements.skipButton.addEventListener("click", handleSkip);
  elements.startPrompt.addEventListener("click", activateExperience);
  elements.editorClose.addEventListener("click", closeEditor);
  elements.editorCancel.addEventListener("click", closeEditor);
  elements.chooseRepoButton.addEventListener("click", chooseRepository);
  elements.videoFiles.addEventListener("change", handleSelectedFiles);
  elements.editorForm.addEventListener("submit", saveEditorChanges);

  elements.editorDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeEditor();
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
  });

  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
  }, { passive: false });

  document.addEventListener("selectstart", (event) => {
    const insideEditor = event.target instanceof Element && event.target.closest(".editor");
    if (!insideEditor) event.preventDefault();
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

  renderTicker();
  renderTimer();
  loadVideo(0, { preservePlayback: false });
  window.requestAnimationFrame(tick);
})();
