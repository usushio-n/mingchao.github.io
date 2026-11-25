export function drawRadar(canvas, scores) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const size = 360;
  const center = size / 2;
  const radius = 164;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = canvas.height = Math.round(size * pixelRatio);
  context.scale(canvas.width / size, canvas.height / size);

  const colors = getComputedStyle(canvas);
  const axes = scores.map((_, index) => {
    const angle = index * 2 * Math.PI / scores.length - Math.PI / 2;
    return [Math.cos(angle), Math.sin(angle)];
  });
  const pointsAt = (ratios) => axes.map(([x, y], index) => {
    const distance = radius * ratios[index];
    return [center + x * distance, center + y * distance];
  });

  function tracePolygon(points) {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.closePath();
  }

  context.lineWidth = 1.25;
  context.strokeStyle = colors.getPropertyValue("--radar-grid");
  for (const level of [.25, .5, .75, 1]) {
    tracePolygon(pointsAt(scores.map(() => level)));
    context.stroke();
  }

  context.beginPath();
  for (const [x, y] of pointsAt(scores.map(() => 1))) {
    context.moveTo(center, center);
    context.lineTo(x, y);
  }
  context.stroke();

  const scorePoints = pointsAt(scores.map((score) => score / 100));
  tracePolygon(scorePoints);
  context.fillStyle = colors.getPropertyValue("--radar-fill");
  context.fill();
  context.lineWidth = 2.5;
  context.strokeStyle = colors.getPropertyValue("--radar-line");
  context.stroke();
  context.fillStyle = context.strokeStyle;
  for (const [x, y] of scorePoints) {
    context.beginPath();
    context.arc(x, y, 4.25, 0, 2 * Math.PI);
    context.fill();
  }
}
