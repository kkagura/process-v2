import { getTextSize } from "..";
import { Rect } from "../types/attr";
import { FontStyle } from "../types/style";

export const fillText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  fontStyle: FontStyle,
  rect: Rect,
  lineHeight: number = rect.height,
  wrap: string = "wrap"
) => {
  if (!text) return;
  const { fontFamily = "Arial", fontSize = 14 } = fontStyle;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontStyle.color || "#000";
  const y = rect.y + lineHeight / 2;
  const x = rect.x + rect.width / 2;
  ctx.textAlign = fontStyle.align || "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
};
