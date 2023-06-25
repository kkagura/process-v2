import { Position, Rect } from "../types/attr";

let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d")!;
let textSizeCache: Record<string, { width: number; height: number }> = {};
export const getTextSize = (font: string, text: string) => {
  canvas.height = 1;
  canvas.width = 1;
  let size = textSizeCache[`${font}-${text}`];
  if (size) {
    return size;
  }
  ctx.font = font;
  const { width } = ctx.measureText(text);
  const height = ctx.measureText("e").width * 2 + 4;
  return (textSizeCache[`${font}-${text}`] = {
    width,
    height,
  });
};

export const pixelTest = (
  painter: (ctx: CanvasRenderingContext2D) => void,
  point: Position,
  rect: Rect
) => {
  const { x, y, width, height } = rect;
  canvas.width = width;
  canvas.height = height;
  ctx.save();
  ctx.translate(-x, -y);
  painter(ctx);
  ctx.restore();
  const { data } = ctx.getImageData(point.x - x, point.y - y, 1, 1);
  return data[3] !== 0;
};
