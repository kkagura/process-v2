import ShapeElement from "../base/ShapeElement";
import { fillText, paintRoundRect } from "../shape";
import { Position, Rect } from "../types/attr";
import { Border, FontStyle } from "../types/style";
import { expandRect } from "../utils/math";

export interface CricleElementStyle {
  border?: Border;
  fill: boolean;
  fillColor: string;
  fontStyle?: FontStyle;
}

export default class CircleElement extends ShapeElement<CricleElementStyle> {
  width: number = 70;
  height: number = 70;
  style: CricleElementStyle = {
    border: {
      color: "#FFC069",
      width: 1,
      type: "solid",
    },
    fill: true,
    fillColor: "rgba(255,242,232,0.9)",
    fontStyle: {
      color: "#000",
      fontSize: 14,
      align: "center",
    },
  };

  getUIRect(): Rect {
    if (this.uiRect) {
      return this.uiRect;
    }
    const border = this.getStyle<Border>("border");
    let rect = this.getRect();
    if (border) {
      // 加上border的宽度
      rect = expandRect(rect, border.width);
    }
    // 阴影、端口的大小
    rect = expandRect(rect, 3);
    return (this.uiRect = rect);
  }
  render(ctx: CanvasRenderingContext2D) {
    const rect = this.getRect();
    const width = this.getWidth();
    ctx.beginPath();
    if (this.getSelected()) {
      //  加一个蒙层效果
      // paintRoundRect(expandRect(rect, 3), ctx, 4);
      ctx.arc(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2,
        width / 2 + 3,
        0,
        2 * Math.PI
      );

      if (this.getStyle("fill") === true) {
        const fillColor = this.getStyle("fillColor");
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }
    ctx.beginPath();
    ctx.arc(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
      width / 2,
      0,
      2 * Math.PI
    );
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
    const label = this.getLabel();
    if (label) {
      fillText(ctx, label, this.style.fontStyle || {}, this.getRect());
    }
    if (this.getSelected() || this.getHover()) {
      this.ports.forEach((port) => {
        port.render(ctx);
      });
    }
  }

  hitOnAttachment(position: Position) {
    return this.ports.some((p) => p.hit(position));
  }

  serialize() {}

  static deserialize() {}
}
