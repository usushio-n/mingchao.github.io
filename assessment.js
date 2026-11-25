export const dimensions = [
  { key: "E", name: "外向性", low: "偏好独处或小范围交流", high: "乐于在群体中交流" },
  { key: "A", name: "宜人性", low: "倾向独立判断，表达直接", high: "容易体察他人的感受" },
  { key: "C", name: "尽责性", low: "习惯灵活安排", high: "喜欢有条理地推进事务" },
  { key: "S", name: "情绪稳定性", low: "对情绪变化较敏锐", high: "平时较容易保持平静" },
  { key: "O", name: "开放性", low: "更关注具体、切身的事物", high: "对想象和抽象想法有兴趣" },
];

// A negative key reverses a 1–5 response. S uses the emotional-stability direction.
export const questions = [
  ["E", "在聚会上，我经常能带动现场的气氛。"],
  ["A", "我容易体会他人的感受。"],
  ["C", "有日常杂事要做时，我通常会马上处理。"],
  ["-S", "我的心情经常起伏。"],
  ["O", "我能在脑海里想象出很鲜活的画面。"],
  ["-E", "和人相处时，我通常话不多。"],
  ["-A", "我很少对他人的近况感兴趣。"],
  ["-C", "我常常忘了把用过的东西放回原处。"],
  ["S", "大多数时候，我感觉放松。"],
  ["-O", "我觉得抽象概念很难理解。"],
  ["E", "参加聚会时，我会主动和许多不同的人聊天。"],
  ["A", "别人情绪有变化时，我常会感同身受。"],
  ["C", "我喜欢让周围的东西井井有条。"],
  ["-S", "我很容易感到心烦。"],
  ["-O", "我对抽象的想法不太感兴趣。"],
  ["-E", "在人群中，我通常愿意待在不显眼的位置。"],
  ["-A", "我很少关心别人正面临的困难。"],
  ["-C", "我常把手头的东西弄得乱糟糟。"],
  ["S", "我很少感到情绪低落。"],
  ["-O", "我觉得自己的想象力有限。"],
];

export function scoreAnswers(answers) {
  if (answers.length !== questions.length || questions.some((_, index) => {
    const answer = answers[index];
    return !Number.isInteger(answer) || answer < 1 || answer > 5;
  })) {
    throw new RangeError("每道题都需要一项 1–5 的回答。");
  }

  const totals = Object.fromEntries(dimensions.map(({ key }) => [key, 0]));
  questions.forEach(([key], index) => {
    const answer = answers[index];
    if (key.startsWith("-")) {
      totals[key.slice(1)] += 6 - answer;
    } else {
      totals[key] += answer;
    }
  });
  return dimensions.map(({ key }) => totals[key] / 4);
}

export function matchResonator(scores, profiles) {
  let closest;
  let bestDistance = Infinity;

  for (const profile of profiles) {
    const distance = scores.reduce((sum, score, index) => sum + (score - profile.vector[index]) ** 2, 0);
    if (distance < bestDistance) {
      closest = profile;
      bestDistance = distance;
    }
  }

  return closest;
}

export function sharedTendency(scores, vector) {
  const strengths = scores.map((score, index) => {
    const user = score - 3;
    const character = vector[index] - 3;
    return user * character > 0 ? Math.min(Math.abs(user), Math.abs(character)) : 0;
  });
  const strongest = Math.max(...strengths);
  if (strongest < .5) return "";

  const index = strengths.indexOf(strongest);
  return scores[index] > 3 ? dimensions[index].high : dimensions[index].low;
}
