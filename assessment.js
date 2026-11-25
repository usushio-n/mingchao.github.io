export const dimensions = [
  { key: "E", name: "外向性", low: "偏好独处或小范围交流", high: "乐于在群体中交流" },
  { key: "A", name: "宜人性", low: "倾向独立判断，表达直接", high: "容易体察他人的感受" },
  { key: "C", name: "尽责性", low: "习惯灵活安排", high: "喜欢有条理地推进事务" },
  { key: "S", name: "情绪稳定性", low: "对情绪变化较敏锐", high: "平时较容易保持平静" },
  { key: "O", name: "开放性", low: "更关注具体、切身的事物", high: "对想象和抽象想法有兴趣" },
];

const ITEMS_PER_DIMENSION = 4;
export const QUIZ_LENGTH = dimensions.length * ITEMS_PER_DIMENSION;

// A negative key reverses a 1–5 response. The optional third field names a game setting.
export const questionBank = [
  // Mini-IPIP adaptations.
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

  ["E", "走进一个不熟悉的群体时，我常会主动打个招呼。"],
  ["E", "在多人聊天时，我喜欢把自己的经历说给大家听。"],
  ["-E", "即使话题很有趣，我在多人聊天时也更喜欢听别人说。"],
  ["-E", "和一群人待过一阵子后，我通常会想独处一会儿。"],
  ["A", "跟人意见不同时，我会先试着理解对方的处境。"],
  ["A", "有人在小事上出错时，我通常愿意体谅他的难处。"],
  ["-A", "别人因为一点小事难过时，我通常很难理解他们为什么在意。"],
  ["-A", "和别人争论时，我很少顾及自己的语气会让对方有什么感受。"],
  ["C", "开始一件事情前，我会先想清楚要做哪些步骤。"],
  ["C", "答应别人的事情，我通常会在约定时间前完成。"],
  ["-C", "手头有一件事还没做完，我经常转去做另一件。"],
  ["-C", "即使知道什么时候要交，我还是常把事情拖到最后。"],
  ["S", "事情临时出了岔子，我通常很快就能平静下来。"],
  ["S", "等一个不太确定的结果时，我还能安心做手头的事。"],
  ["-S", "一件小事没处理好，我也可能为此担心很久。"],
  ["-S", "遇到意外状况时，我常会因为紧张而一时不知道该做什么。"],
  ["O", "遇到平常事物，我有时会想象它完全不同的样子。"],
  ["O", "我喜欢琢磨一个表面简单的问题背后还有什么可能。"],
  ["O", "同一段故事，我喜欢想出几种不同的结局。"],
  ["-O", "如果一段作品需要自己想象很多内容，我通常很快就失去兴趣。"],

  // Original, spoiler-free scenarios set in Solaris-3.
  ["E", "在今州的露天集市遇到一群也在旅行的人，我会主动加入他们的话题。", "今州"],
  ["E", "在黎那汐塔看完一场街头演出，我会乐意跟旁边的陌生观众聊几句。", "黎那汐塔"],
  ["-E", "去黑海岸检查信标的小队第一次见面时，我通常会先听大家聊，少说自己的事。", "黑海岸"],
  ["-E", "在今州参加热闹的庆典时，我更愿意在安静一点的地方看表演。", "今州"],
  ["A", "勘察归途中，同伴因弄丢一件装备而自责，我会先听听他在担心什么。", "黑海岸"],
  ["A", "在黎那汐塔一起排练时，同伴突然忘了动作，我会试着体谅他的紧张。", "黎那汐塔"],
  ["-A", "在玄方城听到同行的人抱怨一路辛苦时，我通常不太关心他的感受。", "玄方城"],
  ["-A", "在今州和同伴讨论分工时，就算语气让人难受，我也很少会留意。", "今州"],
  ["C", "前往玄方城调查前，我会先检查路线、装备和约定的集合时间。", "玄方城"],
  ["C", "完成黑海岸的声波勘察以后，我习惯当天就把记录整理好。", "黑海岸"],
  ["-C", "离开今州准备远行时，我常常要到出门前才想起有东西没收拾。", "今州"],
  ["-C", "在黎那汐塔接了几项委托后，我往往没有想过先做哪一项。", "黎那汐塔"],
  ["S", "在罗伊冰原赶路时，如果天气忽然恶化，我通常能很快稳住情绪。", "罗伊冰原"],
  ["S", "在玄方城等同伴回信时，即使一时没有消息，我也能平静地做别的事。", "玄方城"],
  ["-S", "勘察途中记错一个读数，即使当场改正，我也会担心很久。", "黑海岸"],
  ["-S", "在黎那汐塔出门后发现计划得临时改变，我的心情通常会受很大影响。", "黎那汐塔"],
  ["O", "在玄方城看到一台没见过的机关，我会想象它还能被用来做什么。", "玄方城"],
  ["O", "在罗伊冰原看到一串来历不明的足迹，我会在脑海里想出几种故事。", "罗伊冰原"],
  ["-O", "在黑海岸听到关于陌生声波的几种推测时，我对琢磨这些可能性兴趣不大。", "黑海岸"],
  ["-O", "在黎那汐塔看完一场结局开放的演出，我通常很少想接下来还可能发生什么。", "黎那汐塔"],
];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function drawQuestions() {
  const questions = dimensions.flatMap(({ key }) => {
    const pool = questionBank.filter(([polarity]) => polarity === key || polarity === `-${key}`);
    const [scenario] = shuffle(pool.filter(([, , setting]) => setting));
    const daily = shuffle(pool.filter(([, , setting]) => !setting));
    const sameKey = daily.filter(([polarity]) => polarity === scenario[0]);
    const oppositeKey = daily.filter(([polarity]) => polarity !== scenario[0]);
    return [scenario, sameKey[0], ...oppositeKey.slice(0, 2)];
  });
  return shuffle(questions);
}

export function scoreAnswers(questions, answers) {
  if (questions.length !== QUIZ_LENGTH || answers.length !== questions.length || questions.some((_, index) => {
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
  return dimensions.map(({ key }) => totals[key] / ITEMS_PER_DIMENSION);
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
