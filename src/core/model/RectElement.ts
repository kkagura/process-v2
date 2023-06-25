import Element from "../base/Element";
import { paintRoundRect } from "../shape";
import { Rect } from "../types/attr";
import { Border } from "../types/style";
import { expandRect } from "../utils/math";

export interface RectElementStyle {
  border: Border | null;
  fill: boolean;
  fillColor: string;
}

export default class RectElement extends Element<RectElementStyle> {
  style: RectElementStyle = {
    border: null,
    fill: true,
    fillColor: "red",
  };
  getUIRect(): Rect {
    if (this.uiRect) {
      return this.uiRect;
    }
    const border = this.getStyle<Border>("border");
    const rect = this.getRect();
    if (!border) {
      return (this.uiRect = { ...rect });
    }
    return (this.uiRect = expandRect(rect, border.width));
  }
  render(ctx: CanvasRenderingContext2D) {
    paintRoundRect(this.getRect(), ctx, 0);
    if (this.getStyle("fill") === true) {
      const fillColor = this.getStyle("fillColor");
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    const border = this.getStyle<Border>("border");
    if (border) {
      ctx.strokeStyle = border.color;
      // todo border types
      ctx.lineWidth = border.width;
      ctx.stroke();
    }
  }
}
