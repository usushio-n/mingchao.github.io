import { dimensions, matchResonator, questions, scoreAnswers, sharedTendency } from "./assessment.js";
import { resonators } from "./resonators.js";

const element = (id) => document.getElementById(id);
const form = element("quiz-form");
const choices = Array.from(form.elements.namedItem("answer"));
const title = element("question-title");
const next = element("next");
const previous = element("previous");
const progress = element("progress");
const audio = element("character-voice");
const voiceStatus = element("voice-status");
const replay = element("replay");
const pause = element("pause");
const portrait = element("portrait");
const portraitError = element("portrait-error");
const shareFallback = element("share-fallback");
const shareStatus = element("share-status");
const answers = Array(questions.length).fill(null);
let questionIndex = 0;
let currentResult = null;
let playRequest = 0;

element("character-count").textContent = resonators.length;
element("question-total").textContent = questions.length;
progress.max = questions.length;

function showScreen(id, heading) {
  document.querySelectorAll("main > section").forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
  document.querySelectorAll("[data-stage]").forEach((stage) => {
    if (stage.dataset.stage === id) stage.setAttribute("aria-current", "step");
    else stage.removeAttribute("aria-current");
  });
  heading.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function updateProgress() {
  const answered = answers.filter((answer) => answer !== null).length;
  progress.value = answered;
  element("answer-count").textContent = `已回答 ${answered} 题`;
  next.disabled = answers[questionIndex] === null;
}

function renderQuestion() {
  const isLast = questionIndex === questions.length - 1;
  element("question-number").textContent = String(questionIndex + 1).padStart(2, "0");
  title.textContent = questions[questionIndex][1];
  choices.forEach((choice) => {
    choice.checked = Number(choice.value) === answers[questionIndex];
  });
  previous.disabled = questionIndex === 0;
  element("next-label").textContent = isLast ? "查看结果" : "下一题";
  updateProgress();
}

function goToQuestion(index) {
  questionIndex = index;
  renderQuestion();
  title.focus({ preventScroll: true });
  title.scrollIntoView({ block: "nearest" });
}

function renderTraits(scores) {
  const traits = dimensions.map(({ name }, index) => {
    const score = ((scores[index] - 1) / 4) * 100;
    const group = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");
    const track = document.createElement("span");
    const fill = document.createElement("span");

    term.textContent = name;
    value.textContent = Math.round(score);
    track.className = "trait-track";
    track.setAttribute("aria-hidden", "true");
    fill.className = "trait-fill";
    fill.style.setProperty("--score", `${score}%`);
    track.append(fill);
    value.append(track);
    group.append(term, value);
    return group;
  });
  element("traits").replaceChildren(...traits);
}

function setReplayLabel(label) {
  element("replay-label").textContent = label;
}

async function playVoice() {
  if (!currentResult?.profile.voice) return;
  const request = ++playRequest;
  voiceStatus.textContent = "正在加载语音…";
  if (audio.error) audio.load();
  if (audio.readyState && audio.currentTime !== 0) audio.currentTime = 0;
  try {
    await audio.play();
  } catch (error) {
    if (request !== playRequest) return;
    voiceStatus.textContent = error.name === "NotAllowedError"
      ? "浏览器阻止了自动播放。点击「播放语音」即可收听。"
      : "语音加载失败，请点击播放重试。";
  }
}

function renderResult() {
  const scores = scoreAnswers(answers);
  const profile = matchResonator(scores, resonators);
  currentResult = { profile };
  const tendency = sharedTendency(scores, profile.vector);
  const details = tendency ? `你们的共鸣点是${tendency}。` : "你的五维答题结果整体与这份角色档案最接近。";

  element("result-title").textContent = profile.name;
  element("result-type").textContent = `${profile.attribute} · ${profile.tag}`;
  element("match-reason").textContent = `${details}${profile.description}`;
  portrait.hidden = true;
  portraitError.hidden = true;
  portrait.alt = `${profile.name}的角色立绘`;
  portrait.src = profile.portrait;
  renderTraits(scores);
  shareFallback.hidden = true;
  shareStatus.textContent = "";

  setReplayLabel("播放语音");
  pause.disabled = true;
  replay.disabled = !profile.voice;
  element("voice-transcript").textContent = profile.voice ? `「${profile.voice.transcript}」` : "";
  voiceStatus.textContent = profile.voice ? "" : "这位角色的原声还在补充中。";
  if (profile.voice) audio.src = profile.voice.path;
  showScreen("result", element("result-title"));
  // Call play in the final submit gesture, before yielding to any asynchronous work.
  void playVoice();
}

element("start").addEventListener("click", () => {
  renderQuestion();
  showScreen("quiz", title);
});

form.addEventListener("change", (event) => {
  if (event.target.name !== "answer") return;
  answers[questionIndex] = Number(event.target.value);
  updateProgress();
});

previous.addEventListener("click", () => goToQuestion(questionIndex - 1));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (answers[questionIndex] === null) return;
  if (questionIndex === questions.length - 1) renderResult();
  else goToQuestion(questionIndex + 1);
});

portrait.addEventListener("load", () => {
  if (currentResult) portrait.hidden = false;
});
portrait.addEventListener("error", () => {
  if (currentResult) portraitError.hidden = false;
});

replay.addEventListener("click", playVoice);
pause.addEventListener("click", () => {
  playRequest++;
  audio.pause();
  voiceStatus.textContent = "已暂停，可以重播。";
  replay.focus();
});

audio.addEventListener("playing", () => {
  if (audio.paused || !currentResult) return;
  voiceStatus.textContent = `正在播放 · ${currentResult.profile.voice.title}`;
  setReplayLabel("重播语音");
  pause.disabled = false;
});
audio.addEventListener("pause", () => {
  if (audio.paused) pause.disabled = true;
});
audio.addEventListener("ended", () => {
  if (!currentResult) return;
  pause.disabled = true;
  voiceStatus.textContent = "播放完毕，可以重播。";
});

element("retry").addEventListener("click", () => {
  currentResult = null;
  playRequest++;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  answers.fill(null);
  questionIndex = 0;
  showScreen("home", element("home-title"));
});

element("share").addEventListener("click", async () => {
  const result = currentResult;
  if (!result) return;
  const { profile } = result;
  const url = new URL("./", window.location.href).href;
  const text = `我的《鸣潮》共鸣角色是${profile.name} · ${profile.tag}。`;
  const content = `${text}\n${url}`;
  shareStatus.textContent = "";
  shareFallback.hidden = true;

  if (navigator.share) {
    try {
      await navigator.share({ title: "共鸣档案", text, url });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(content);
    if (currentResult === result) shareStatus.textContent = "已复制分享内容。";
  } catch {
    if (currentResult !== result) return;
    const shareText = element("share-text");
    shareText.value = content;
    shareFallback.hidden = false;
    shareText.select();
  }
});
