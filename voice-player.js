function formatTime(seconds) {
  const tenths = Math.floor(seconds * 10);
  const minutes = Math.floor(tenths / 600);
  const wholeSeconds = String(Math.floor(tenths / 10) % 60).padStart(2, "0");
  return `${minutes}:${wholeSeconds}.${tenths % 10}`;
}

export function createVoicePlayer(panel) {
  const audio = panel.querySelector("audio");
  const toggle = panel.querySelector("#voice-toggle");
  const timeline = panel.querySelector("#voice-progress");
  const elapsed = panel.querySelector("#voice-elapsed");
  const total = panel.querySelector("#voice-duration");
  const replay = panel.querySelector("#replay");
  const status = panel.querySelector("#voice-status");
  const transcript = panel.querySelector("#voice-transcript");
  const title = panel.querySelector("#voice-title");
  let clip = null;
  let playRequest = 0;

  function syncTimeline() {
    const duration = clip && !audio.error && Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = duration > 0 ? Math.min(audio.currentTime, duration) : 0;
    const seekable = audio.seekable;
    timeline.disabled = duration <= 0 || !seekable.length || seekable.end(seekable.length - 1) <= 0;
    timeline.max = duration || 1;
    timeline.value = current;
    timeline.style.setProperty("--seek-progress", `${duration > 0 ? current / duration * 100 : 0}%`);
    elapsed.textContent = formatTime(current);
    total.textContent = duration > 0 ? formatTime(duration) : "—";
    timeline.setAttribute("aria-valuetext", `已播放 ${current.toFixed(1)} 秒，共 ${duration.toFixed(1)} 秒`);
  }

  function syncToggle() {
    const playing = Boolean(clip) && !audio.paused && !audio.ended;
    toggle.dataset.playing = playing;
    const canResume = audio.currentTime > 0 && !audio.ended;
    toggle.setAttribute("aria-label", playing ? "暂停语音" : canResume ? "继续播放语音" : "播放语音");
  }

  async function play(restart = false) {
    if (!clip) return;
    const request = ++playRequest;
    status.textContent = "";
    if (audio.error) audio.load();
    if ((restart || audio.ended) && audio.readyState) audio.currentTime = 0;
    syncTimeline();

    try {
      await audio.play();
    } catch (error) {
      if (request !== playRequest) return;
      status.textContent = error.name === "NotAllowedError"
        ? "浏览器限制了自动播放，请点击进度条左侧的播放键。"
        : "语音加载失败，请点击播放重试。";
      syncToggle();
    }
  }

  function setClip(nextClip) {
    playRequest++;
    audio.pause();
    clip = nextClip;
    if (clip) {
      audio.src = clip.path;
    } else {
      audio.removeAttribute("src");
      audio.load();
    }

    title.textContent = clip ? `角色语音 · ${clip.title}` : "角色语音";
    transcript.textContent = clip ? `「${clip.transcript}」` : "";
    status.textContent = clip ? "" : "这位角色的原声还在补充中。";
    toggle.disabled = !clip;
    replay.disabled = !clip;
    syncTimeline();
    syncToggle();
  }

  toggle.addEventListener("click", () => {
    if (audio.paused || audio.ended) {
      void play();
    } else {
      playRequest++;
      audio.pause();
    }
  });
  replay.addEventListener("click", () => void play(true));
  timeline.addEventListener("input", () => {
    if (timeline.disabled) return;
    audio.currentTime = timeline.valueAsNumber;
    syncTimeline();
    syncToggle();
  });

  for (const event of ["loadedmetadata", "durationchange", "progress", "timeupdate", "seeked", "emptied"]) {
    audio.addEventListener(event, syncTimeline);
  }
  for (const event of ["play", "pause", "ended", "seeked"]) {
    audio.addEventListener(event, syncToggle);
  }
  audio.addEventListener("error", () => {
    if (!clip) return;
    syncTimeline();
    syncToggle();
    status.textContent = "语音加载失败，请点击播放重试。";
  });

  return { setClip, play };
}
