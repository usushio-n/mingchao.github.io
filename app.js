import { dimensions, drawQuestions, matchResonator, QUIZ_LENGTH, scoreAnswers, sharedTendency } from "./assessment.js";
import { drawRadar } from "./radar.js";
import { resonators } from "./resonators.js";
import { createVoicePlayer } from "./voice-player.js";

const element = (id) => document.getElementById(id);
const form = element("quiz-form");
const choices = Array.from(form.elements.namedItem("answer"));
const title = element("question-title");
const next = element("next");
const previous = element("previous");
const progress = element("progress");
const voicePlayer = createVoicePlayer(element("voice-panel"));
const portrait = element("portrait");
const portraitError = element("portrait-error");
const shareFallback = element("share-fallback");
const shareStatus = element("share-status");
const answers = Array(QUIZ_LENGTH).fill(null);
let questions = [];
let questionIndex = 0;
let currentResult = null;

element("character-count").textContent = resonators.length;
element("question-total").textContent = QUIZ_LENGTH;
progress.max = QUIZ_LENGTH;

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
  const [, prompt, setting] = questions[questionIndex];
  const isLast = questionIndex === questions.length - 1;
  element("question-number").textContent = String(questionIndex + 1).padStart(2, "0");
  title.textContent = prompt;
  const settingLabel = element("question-setting");
  settingLabel.textContent = setting ? `索拉里斯情境 · ${setting}` : "";
  settingLabel.hidden = !setting;
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
  const scaled = scores.map((score) => ((score - 1) / 4) * 100);
  const traits = dimensions.map(({ name }, index) => {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");

    term.textContent = name;
    value.textContent = Math.round(scaled[index]);
    group.append(term, value);
    return group;
  });
  element("traits").replaceChildren(...traits);
  drawRadar(element("radar-plot"), scaled);
}

function renderResult() {
  const scores = scoreAnswers(questions, answers);
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
  shareFallback.hidden = true;
  shareStatus.textContent = "";

  voicePlayer.setClip(profile.voice);
  showScreen("result", element("result-title"));
  // Call play in the final submit gesture, before yielding to any asynchronous work.
  void voicePlayer.play();
  renderTraits(scores);
}

element("start").addEventListener("click", () => {
  questions = drawQuestions();
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

element("retry").addEventListener("click", () => {
  currentResult = null;
  voicePlayer.setClip(null);
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
