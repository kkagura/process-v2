import { Rect } from "../types/attr";

export const paintRoundRect = (
  rect: Rect,
  ctx: CanvasRenderingContext2D,
  r: number
) => {
  const { x, y, width: w, height: h } = rect;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  if (r !== 0) {
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + r);
  }
  ctx.lineTo(x + w, y + h - r);
  if (r !== 0) {
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + w - r, y + h);
  }
  ctx.lineTo(x + r, y + h);
  if (r !== 0) {
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + h - r);
  }
  ctx.lineTo(x, y + r);
  if (r !== 0) {
    ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + r, y);
  }
};
